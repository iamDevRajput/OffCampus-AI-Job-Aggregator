import { SourceAdapter, SourceConfig, RawJob, NormalizedJob } from "./base.adapter";
import { SourceType, WorkMode, EmploymentType } from "@prisma/client";
import { NormalizationService } from "../normalization.service";
import { ExtractionService } from "../extraction.service";
import { DeduplicationService } from "../deduplication.service";

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

    const url = config.apiUrl || `https://api.lever.co/v0/postings/${site}?mode=json`;

    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "OffCampusJobAggregator/2.0 (Compliant Educational Job Aggregator)",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Lever API returned HTTP ${response.status} (${response.statusText}) for site "${site}"`);
      }

      const data = await response.json();
      const rawJobs: RawJob[] = [];

      if (Array.isArray(data)) {
        for (const item of data) {
          const loc =
            item.categories?.location ||
            (item.categories?.allLocations && item.categories?.allLocations[0]) ||
            "Pan India";

          const desc = item.descriptionPlain || item.description || item.text;

          rawJobs.push({
            externalId: `lever-${item.id}`,
            title: item.text?.trim() || "Software Engineer",
            company: config.name,
            location: loc,
            applyUrl: item.applyUrl || item.hostedUrl,
            description: desc,
            postedAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            rawPayload: item,
          });
        }
      }

      return rawJobs;
    } catch (err: any) {
      console.error(`[LeverAdapter] Error fetching from ${url}:`, err.message || err);
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

  private extractSiteFromUrl(url: string): string | null {
    const match = url.match(/postings\/([^/?]+)/i);
    return match ? match[1] : null;
  }
}
