import { SourceAdapter, SourceConfig, RawJob, NormalizedJob } from "./base.adapter";
import { SourceType, WorkMode, EmploymentType } from "@prisma/client";
import { NormalizationService } from "../normalization.service";
import { ExtractionService } from "../extraction.service";
import { DeduplicationService } from "../deduplication.service";
import { fetchWithRetry } from "@/lib/fetch-utils";

export class GreenhouseSourceAdapter implements SourceAdapter {
  sourceType: SourceType = SourceType.GREENHOUSE;

  validateConfig(config: SourceConfig): boolean {
    return !!(config.boardToken || config.apiUrl || config.baseUrl || config.extraConfig?.boardToken || config.name);
  }

  async fetchJobs(config: SourceConfig): Promise<RawJob[]> {
    const boardToken =
      config.boardToken ||
      config.extraConfig?.boardToken ||
      (config.apiUrl ? this.extractTokenFromUrl(config.apiUrl) : null) ||
      config.name.toLowerCase().replace(/[^\w]/g, "");

    const url = config.apiUrl || `https://boards-api.greenhouse.io/v1/boards/${boardToken}/jobs?content=true`;

    try {
      const response = await fetchWithRetry(url);

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`[GreenhouseAdapter] Board "${boardToken}" not found (404)`);
          return [];
        }
        throw new Error(`Greenhouse API HTTP ${response.status} (${response.statusText}) for board "${boardToken}"`);
      }

      const data = await response.json();
      const rawJobs: RawJob[] = [];

      if (data.jobs && Array.isArray(data.jobs)) {
        for (const item of data.jobs) {
          // Clean HTML tags from content
          const cleanDesc = item.content
            ? item.content
                .replace(/<[^>]*>/g, " ")
                .replace(/&nbsp;/g, " ")
                .replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/\s+/g, " ")
                .trim()
            : item.title;

          const locationName = item.location?.name || (item.offices && item.offices[0]?.name) || "Pan India";

          rawJobs.push({
            externalId: `gh-${item.id}`,
            title: item.title?.trim() || "Software Engineer",
            company: config.name,
            location: locationName,
            applyUrl: item.absolute_url,
            description: cleanDesc,
            postedAt: item.updated_at ? new Date(item.updated_at) : new Date(),
            rawPayload: item,
          });
        }
      }

      return rawJobs;
    } catch (err: any) {
      console.error(`[GreenhouseAdapter] Error fetching from ${url}:`, err.message || err);
      throw err;
    }
  }

  normalizeJob(raw: RawJob): NormalizedJob {
    const normalizedCompany = NormalizationService.normalizeCompany(raw.company);
    const normalizedLocation = NormalizationService.normalizeLocation(raw.location);
    const normalizedWorkMode =
      raw.workMode || NormalizationService.normalizeWorkMode(undefined, `${raw.location} ${raw.description}`);
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

  private extractTokenFromUrl(url: string): string | null {
    const match = url.match(/boards\/([^/?]+)/i) || url.match(/greenhouse\.io\/([^/?]+)/i);
    return match ? match[1] : null;
  }
}
