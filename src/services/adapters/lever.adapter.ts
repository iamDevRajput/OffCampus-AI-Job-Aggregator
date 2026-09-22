import { SourceAdapter, SourceConfig, RawJob, NormalizedJob } from "./base.adapter";
import { SourceType, WorkMode, EmploymentType } from "@prisma/client";
import { NormalizationService } from "../normalization.service";
import { ExtractionService } from "../extraction.service";
import { DeduplicationService } from "../deduplication.service";
import { fetchWithRetry } from "@/lib/fetch-utils";

export class LeverSourceAdapter implements SourceAdapter {
  sourceType: SourceType = SourceType.LEVER;

  validateConfig(config: SourceConfig): boolean {
    return !!(config.boardToken || config.apiUrl || config.baseUrl || config.extraConfig?.site || config.name);
  }

  async fetchJobs(config: SourceConfig): Promise<RawJob[]> {
    const site =
      config.boardToken ||
      config.extraConfig?.site ||
      (config.apiUrl ? this.extractSiteFromUrl(config.apiUrl) : null) ||
      config.name.toLowerCase().replace(/[^\w]/g, "");

    const rawJobs: RawJob[] = [];
    const PAGE_LIMIT = 100;
    let skip = 0;
    let hasMore = true;
    const MAX_PAGES = 30; // Safety guard up to 3000 jobs per company

    for (let page = 0; page < MAX_PAGES && hasMore; page++) {
      const url = `https://api.lever.co/v0/postings/${site}?mode=json&limit=${PAGE_LIMIT}&skip=${skip}`;

      try {
        const response = await fetchWithRetry(url);

        if (!response.ok) {
          if (response.status === 404) {
            console.warn(`[LeverAdapter] Site "${site}" not found (404)`);
            break;
          }
          throw new Error(`Lever API HTTP ${response.status} (${response.statusText}) for site "${site}"`);
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
          hasMore = false;
          break;
        }

        for (const item of data) {
          const loc =
            item.categories?.location ||
            (item.categories?.allLocations && item.categories?.allLocations[0]) ||
            item.country ||
            "Pan India";

          const desc = item.descriptionPlain || item.description || item.text || "";

          let workMode: WorkMode = WorkMode.NOT_SPECIFIED;
          if (item.workplaceType === "remote") workMode = WorkMode.REMOTE;
          else if (item.workplaceType === "hybrid") workMode = WorkMode.HYBRID;
          else if (item.workplaceType === "onsite" || item.workplaceType === "on-site") workMode = WorkMode.ONSITE;

          let empType: EmploymentType = EmploymentType.FULL_TIME;
          if (item.categories?.commitment) {
            const commit = item.categories.commitment.toLowerCase();
            if (commit.includes("intern")) empType = EmploymentType.INTERNSHIP;
            else if (commit.includes("contract") || commit.includes("part-time")) empType = EmploymentType.CONTRACT;
          }

          rawJobs.push({
            externalId: `lever-${item.id}`,
            title: item.text?.trim() || "Software Engineer",
            company: config.name,
            location: loc,
            workMode,
            employmentType: empType,
            applyUrl: item.applyUrl || item.hostedUrl || `https://jobs.lever.co/${site}/${item.id}`,
            description: desc,
            postedAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            rawPayload: item,
          });
        }

        if (data.length < PAGE_LIMIT) {
          hasMore = false;
        } else {
          skip += PAGE_LIMIT;
          // Gentle rate spacing between pages
          await new Promise((resolve) => setTimeout(resolve, 150));
        }
      } catch (err: any) {
        console.error(`[LeverAdapter] Error fetching page (skip=${skip}) from ${site}:`, err.message || err);
        if (rawJobs.length > 0) {
          break; // Return partially fetched jobs
        }
        throw err;
      }
    }

    return rawJobs;
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

  private extractSiteFromUrl(url: string): string | null {
    const match = url.match(/postings\/([^/?]+)/i) || url.match(/lever\.co\/([^/?]+)/i);
    return match ? match[1] : null;
  }
}
