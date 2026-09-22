import { SourceAdapter, SourceConfig, RawJob, NormalizedJob } from "./base.adapter";
import { SourceType, WorkMode, EmploymentType } from "@prisma/client";
import { NormalizationService } from "../normalization.service";
import { ExtractionService } from "../extraction.service";
import { DeduplicationService } from "../deduplication.service";

export class SmartRecruitersSourceAdapter implements SourceAdapter {
  sourceType: SourceType = SourceType.SMART_RECRUITERS;

  validateConfig(config: SourceConfig): boolean {
    return !!(config.boardToken || config.apiUrl || config.baseUrl || config.extraConfig?.companyId || config.name);
  }

  async fetchJobs(config: SourceConfig): Promise<RawJob[]> {
    const companyId =
      config.boardToken ||
      config.extraConfig?.companyId ||
      (config.apiUrl ? this.extractCompanyFromUrl(config.apiUrl) : null) ||
      config.name.toLowerCase().replace(/[^\w]/g, "");

    const url = config.apiUrl || `https://api.smartrecruiters.com/v1/companies/${companyId}/postings?limit=100`;

    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "OffCampusJobAggregator/2.0 (Compliant Educational Job Aggregator)",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`SmartRecruiters API returned HTTP ${response.status} (${response.statusText}) for company "${companyId}"`);
      }

      const data = await response.json();
      const rawJobs: RawJob[] = [];

      if (data.content && Array.isArray(data.content)) {
        for (const item of data.content) {
          const loc = item.location
            ? `${item.location.city || ""}, ${item.location.country || ""}`.replace(/^, |, $/g, "") || "Pan India"
            : "Pan India";

          const applyUrl = `https://jobs.smartrecruiters.com/${companyId}/${item.id}`;

          rawJobs.push({
            externalId: `sr-${item.id}`,
            title: item.name?.trim() || "Software Engineer",
            company: config.name,
            location: loc,
            applyUrl,
            description: item.name,
            postedAt: item.releasedDate ? new Date(item.releasedDate) : new Date(),
            rawPayload: item,
          });
        }
      }

      return rawJobs;
    } catch (err: any) {
      console.error(`[SmartRecruitersAdapter] Error fetching from ${url}:`, err.message || err);
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

  private extractCompanyFromUrl(url: string): string | null {
    const match = url.match(/companies\/([^/?]+)/i);
    return match ? match[1] : null;
  }
}
