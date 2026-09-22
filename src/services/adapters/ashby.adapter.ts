import { SourceAdapter, SourceConfig, RawJob, NormalizedJob } from "./base.adapter";
import { SourceType, WorkMode, EmploymentType } from "@prisma/client";
import { NormalizationService } from "../normalization.service";
import { ExtractionService } from "../extraction.service";
import { DeduplicationService } from "../deduplication.service";

export class AshbySourceAdapter implements SourceAdapter {
  sourceType: SourceType = SourceType.ASHBY;

  validateConfig(config: SourceConfig): boolean {
    return !!(config.boardToken || config.apiUrl || config.baseUrl || config.extraConfig?.boardName || config.name);
  }

  async fetchJobs(config: SourceConfig): Promise<RawJob[]> {
    const boardName =
      config.boardToken ||
      config.extraConfig?.boardName ||
      (config.apiUrl ? this.extractBoardFromUrl(config.apiUrl) : null) ||
      config.name.toLowerCase().replace(/[^\w]/g, "");

    const url = config.apiUrl || `https://api.ashbyhq.com/posting-api/job-board/${boardName}`;

    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "OffCampusJobAggregator/2.0 (Compliant Educational Job Aggregator)",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Ashby API returned HTTP ${response.status} (${response.statusText}) for board "${boardName}"`);
      }

      const data = await response.json();
      const rawJobs: RawJob[] = [];

      if (data.jobs && Array.isArray(data.jobs)) {
        for (const item of data.jobs) {
          const loc = item.location || (item.secondaryLocations && item.secondaryLocations[0]?.location) || "Pan India";
          const desc = item.descriptionPlain || item.description || item.title;
          const applyUrl = item.jobUrl || `https://jobs.ashbyhq.com/${boardName}/${item.id}`;

          rawJobs.push({
            externalId: `ashby-${item.id}`,
            title: item.title?.trim() || "Software Engineer",
            company: config.name,
            location: loc,
            applyUrl,
            description: desc,
            postedAt: item.publishedAt ? new Date(item.publishedAt) : new Date(),
            rawPayload: item,
          });
        }
      }

      return rawJobs;
    } catch (err: any) {
      console.error(`[AshbyAdapter] Error fetching from ${url}:`, err.message || err);
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

  private extractBoardFromUrl(url: string): string | null {
    const match = url.match(/job-board\/([^/?]+)/i);
    return match ? match[1] : null;
  }
}
