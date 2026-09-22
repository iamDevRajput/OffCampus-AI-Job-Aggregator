import { SourceAdapter, SourceConfig, RawJob, NormalizedJob } from "./base.adapter";
import { SourceType, WorkMode, EmploymentType } from "@prisma/client";
import { NormalizationService } from "../normalization.service";
import { ExtractionService } from "../extraction.service";
import { DeduplicationService } from "../deduplication.service";
import { fetchWithRetry } from "@/lib/fetch-utils";

export class WorkableSourceAdapter implements SourceAdapter {
  sourceType: SourceType = SourceType.WORKABLE;

  validateConfig(config: SourceConfig): boolean {
    return !!(config.boardToken || config.apiUrl || config.baseUrl || config.extraConfig?.slug || config.name);
  }

  async fetchJobs(config: SourceConfig): Promise<RawJob[]> {
    const slug =
      config.boardToken ||
      config.extraConfig?.slug ||
      (config.apiUrl ? this.extractSlugFromUrl(config.apiUrl) : null) ||
      config.name.toLowerCase().replace(/[^\w]/g, "");

    const url = `https://apply.workable.com/api/v3/accounts/${slug}/jobs`;

    try {
      const response = await fetchWithRetry(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ limit: 100 }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`[WorkableAdapter] Account "${slug}" not found (404)`);
          return [];
        }
        throw new Error(`Workable API HTTP ${response.status} (${response.statusText}) for account "${slug}"`);
      }

      const data = await response.json();
      const rawJobs: RawJob[] = [];
      const results = data.results || (Array.isArray(data) ? data : []);

      for (const item of results) {
        const cleanDesc = (item.description || item.title || "")
          .replace(/<[^>]*>/g, " ")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/\s+/g, " ")
          .trim();

        const loc = item.location
          ? `${item.location.city || ""}, ${item.location.region || ""}, ${item.location.country || ""}`
              .replace(/^, |, $/g, "")
              .trim() || "Pan India"
          : "Pan India";

        let workMode: WorkMode = WorkMode.NOT_SPECIFIED;
        if (item.telecommuting || item.workplace === "remote") workMode = WorkMode.REMOTE;
        else if (item.workplace === "hybrid") workMode = WorkMode.HYBRID;
        else if (item.workplace === "on_site") workMode = WorkMode.ONSITE;

        let empType: EmploymentType = EmploymentType.FULL_TIME;
        if (item.employment_type) {
          const emp = item.employment_type.toLowerCase();
          if (emp.includes("intern")) empType = EmploymentType.INTERNSHIP;
          else if (emp.includes("contract") || emp.includes("temporary")) empType = EmploymentType.CONTRACT;
        }

        const applyUrl = item.url || `https://apply.workable.com/${slug}/j/${item.shortcode || item.id}`;

        rawJobs.push({
          externalId: `workable-${item.id || item.shortcode}`,
          title: item.title?.trim() || "Software Engineer",
          company: config.name,
          location: loc,
          workMode,
          employmentType: empType,
          applyUrl,
          description: cleanDesc,
          postedAt: item.published ? new Date(item.published) : new Date(),
          rawPayload: item,
        });
      }

      return rawJobs;
    } catch (err: any) {
      console.error(`[WorkableAdapter] Error fetching from ${url}:`, err.message || err);
      throw err;
    }
  }

  normalizeJob(raw: RawJob): NormalizedJob {
    const normalizedCompany = NormalizationService.normalizeCompany(raw.company);
    const normalizedLocation = NormalizationService.normalizeLocation(raw.location);
    const normalizedWorkMode =
      raw.workMode && raw.workMode !== WorkMode.NOT_SPECIFIED
        ? raw.workMode
        : NormalizationService.normalizeWorkMode(undefined, `${raw.location} ${raw.description}`);
    const normalizedEmployment =
      raw.employmentType || NormalizationService.normalizeEmploymentType(undefined, raw.title);

    const extractedSkills = ExtractionService.extractSkills(raw.title, raw.description);
    const salaryInfo = ExtractionService.extractSalary(raw.rawSalary, raw.description);
    const expInfo = ExtractionService.extractExperience(`${raw.title} ${raw.description}`);

    const contentHash = DeduplicationService.generateContentHash(
      raw.company,
      raw.title,
      raw.applyUrl,
      raw.location
    );

    return {
      externalId: raw.externalId,
      title: raw.title.trim(),
      company: raw.company.trim(),
      normalizedCompany,
      description: raw.description,
      applyUrl: raw.applyUrl,
      location: normalizedLocation,
      workMode: normalizedWorkMode,
      employmentType: normalizedEmployment,
      minSalary: salaryInfo.minSalary,
      maxSalary: salaryInfo.maxSalary,
      currency: salaryInfo.currency,
      salaryDisclosed: salaryInfo.salaryDisclosed,
      salaryRaw: salaryInfo.salaryRaw,
      experienceMin: expInfo.experienceMin,
      experienceMax: expInfo.experienceMax,
      deadline: raw.deadline ? new Date(raw.deadline) : null,
      postedAt: raw.postedAt ? new Date(raw.postedAt) : new Date(),
      extractedSkills,
      contentHash,
      rawData: JSON.stringify(raw),
    };
  }

  private extractSlugFromUrl(url: string): string | null {
    const match = url.match(/accounts\/([^/?]+)/i) || url.match(/workable\.com\/([^/?]+)/i);
    return match ? match[1] : null;
  }
}
