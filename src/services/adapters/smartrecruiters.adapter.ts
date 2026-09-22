import { SourceAdapter, SourceConfig, RawJob, NormalizedJob } from "./base.adapter";
import { SourceType, WorkMode, EmploymentType } from "@prisma/client";
import { NormalizationService } from "../normalization.service";
import { ExtractionService } from "../extraction.service";
import { DeduplicationService } from "../deduplication.service";
import { fetchWithRetry } from "@/lib/fetch-utils";

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

    const rawJobs: RawJob[] = [];
    const PAGE_LIMIT = 100;
    let offset = 0;
    let totalFound = Infinity;
    const MAX_PAGES = 30; // Safety guard up to 3000 postings

    for (let page = 0; page < MAX_PAGES && offset < totalFound; page++) {
      const url = `https://api.smartrecruiters.com/v1/companies/${companyId}/postings?limit=${PAGE_LIMIT}&offset=${offset}`;

      try {
        const response = await fetchWithRetry(url);

        if (!response.ok) {
          if (response.status === 404) {
            console.warn(`[SmartRecruitersAdapter] Company "${companyId}" not found (404)`);
            break;
          }
          throw new Error(`SmartRecruiters API HTTP ${response.status} (${response.statusText}) for company "${companyId}"`);
        }

        const data = await response.json();

        if (typeof data.totalFound === "number") {
          totalFound = data.totalFound;
        }

        if (!data.content || !Array.isArray(data.content) || data.content.length === 0) {
          break;
        }

        for (const item of data.content) {
          const loc = item.location
            ? `${item.location.city || ""}, ${item.location.region || ""}, ${item.location.country || ""}`
                .replace(/^, |, $/g, "")
                .replace(/,\s*,/g, ",")
                .trim() || "Pan India"
            : "Pan India";

          let workMode: WorkMode = WorkMode.NOT_SPECIFIED;
          if (item.location?.remote) workMode = WorkMode.REMOTE;
          else if (item.location?.hybrid) workMode = WorkMode.HYBRID;

          let empType: EmploymentType = EmploymentType.FULL_TIME;
          if (item.typeOfEmployment?.id === "intern" || item.experienceLevel?.id === "internship") {
            empType = EmploymentType.INTERNSHIP;
          } else if (item.typeOfEmployment?.id === "contract" || item.typeOfEmployment?.id === "temporary") {
            empType = EmploymentType.CONTRACT;
          }

          const applyUrl = `https://jobs.smartrecruiters.com/${companyId}/${item.id}`;

          // Format description from title, department, function, and industry
          const departmentName = item.department?.label || "";
          const functionName = item.function?.label || "";
          const desc = `${item.name}. Function: ${functionName}. Department: ${departmentName}. ${loc}`;

          rawJobs.push({
            externalId: `sr-${item.id}`,
            title: item.name?.trim() || "Software Engineer",
            company: item.company?.name || config.name,
            location: loc,
            workMode,
            employmentType: empType,
            applyUrl,
            description: desc,
            postedAt: item.releasedDate ? new Date(item.releasedDate) : new Date(),
            rawPayload: item,
          });
        }

        offset += PAGE_LIMIT;
        if (offset >= totalFound || data.content.length < PAGE_LIMIT) {
          break;
        }

        // Gentle spacing between page fetches
        await new Promise((resolve) => setTimeout(resolve, 150));
      } catch (err: any) {
        console.error(`[SmartRecruitersAdapter] Error fetching offset ${offset} from ${companyId}:`, err.message || err);
        if (rawJobs.length > 0) {
          break;
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

  private extractCompanyFromUrl(url: string): string | null {
    const match = url.match(/companies\/([^/?]+)/i) || url.match(/smartrecruiters\.com\/([^/?]+)/i);
    return match ? match[1] : null;
  }
}
