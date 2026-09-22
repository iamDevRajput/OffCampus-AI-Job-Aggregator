import { SourceAdapter, SourceConfig, RawJob, NormalizedJob } from "./base.adapter";
import { SourceType, WorkMode, EmploymentType } from "@prisma/client";
import { NormalizationService } from "../normalization.service";
import { ExtractionService } from "../extraction.service";
import { DeduplicationService } from "../deduplication.service";
import { fetchWithRetry } from "@/lib/fetch-utils";

export class RecruiteeSourceAdapter implements SourceAdapter {
  sourceType: SourceType = SourceType.RECRUITEE;

  validateConfig(config: SourceConfig): boolean {
    return !!(config.boardToken || config.apiUrl || config.baseUrl || config.extraConfig?.subdomain || config.name);
  }

  async fetchJobs(config: SourceConfig): Promise<RawJob[]> {
    const subdomain =
      config.boardToken ||
      config.extraConfig?.subdomain ||
      (config.apiUrl ? this.extractSubdomainFromUrl(config.apiUrl) : null) ||
      config.name.toLowerCase().replace(/[^\w]/g, "");

    const url = config.apiUrl || `https://${subdomain}.recruitee.com/api/offers/`;

    try {
      const response = await fetchWithRetry(url);

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`[RecruiteeAdapter] Subdomain "${subdomain}" not found (404)`);
          return [];
        }
        throw new Error(`Recruitee API HTTP ${response.status} (${response.statusText}) for subdomain "${subdomain}"`);
      }

      const data = await response.json();
      const rawJobs: RawJob[] = [];
      const offers = data.offers || (Array.isArray(data) ? data : []);

      for (const item of offers) {
        // Only ingest published offers
        if (item.status && item.status !== "published") continue;

        const cleanDesc = `${item.description || ""} \n ${item.requirements || ""}`
          .replace(/<[^>]*>/g, " ")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/\s+/g, " ")
          .trim();

        let loc = "Pan India";
        if (item.locations && Array.isArray(item.locations) && item.locations.length > 0) {
          const firstLoc = item.locations[0];
          loc = `${firstLoc.city || ""}, ${firstLoc.country || ""}`.replace(/^, |, $/g, "") || "Pan India";
        } else if (item.location) {
          loc = item.location;
        }

        let workMode: WorkMode = WorkMode.NOT_SPECIFIED;
        if (item.remote) workMode = WorkMode.REMOTE;
        else if (item.hybrid) workMode = WorkMode.HYBRID;

        let empType: EmploymentType = EmploymentType.FULL_TIME;
        if (item.employment_type_code) {
          const emp = item.employment_type_code.toLowerCase();
          if (emp.includes("intern")) empType = EmploymentType.INTERNSHIP;
          else if (emp.includes("contract") || emp.includes("parttime")) empType = EmploymentType.CONTRACT;
        }

        const applyUrl = item.careers_apply_url || item.careers_url || `https://${subdomain}.recruitee.com/o/${item.slug || item.id}`;

        rawJobs.push({
          externalId: `recruitee-${item.id}`,
          title: item.title?.trim() || "Software Engineer",
          company: config.name,
          location: loc,
          workMode,
          employmentType: empType,
          applyUrl,
          description: cleanDesc || item.title,
          postedAt: item.published_at ? new Date(item.published_at) : new Date(),
          rawPayload: item,
        });
      }

      return rawJobs;
    } catch (err: any) {
      console.error(`[RecruiteeAdapter] Error fetching from ${url}:`, err.message || err);
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

  private extractSubdomainFromUrl(url: string): string | null {
    const match = url.match(/https?:\/\/([^.]+)\.recruitee\.com/i);
    return match ? match[1] : null;
  }
}
