import { SourceAdapter, SourceConfig, RawJob, NormalizedJob } from "./base.adapter";
import { SourceType, WorkMode, EmploymentType } from "@prisma/client";
import { NormalizationService } from "../normalization.service";
import { ExtractionService } from "../extraction.service";
import { DeduplicationService } from "../deduplication.service";
import { fetchWithRetry } from "@/lib/fetch-utils";

export class PublicFeedSourceAdapter implements SourceAdapter {
  sourceType: SourceType = SourceType.PUBLIC_FEED;

  validateConfig(config: SourceConfig): boolean {
    return !!(config.apiUrl || config.baseUrl || config.boardToken || config.name);
  }

  async fetchJobs(config: SourceConfig): Promise<RawJob[]> {
    const token = (config.boardToken || "").toLowerCase();
    const url = config.apiUrl || "";

    if (token.includes("arbeitnow") || url.includes("arbeitnow.com")) {
      return this.fetchArbeitnowJobs(config);
    } else if (token.includes("weworkremotely") || url.includes("weworkremotely.com")) {
      return this.fetchWeWorkRemotelyJobs(config);
    } else if (token.includes("remoteok") || url.includes("remoteok.com")) {
      return this.fetchRemoteOKJobs(config);
    } else if (token.includes("jobicy") || url.includes("jobicy.com")) {
      return this.fetchJobicyJobs(config);
    }

    // Default fallback: Try Arbeitnow as standard public feed
    return this.fetchArbeitnowJobs(config);
  }

  /**
   * Fetch paginated jobs from Arbeitnow public API
   */
  private async fetchArbeitnowJobs(config: SourceConfig): Promise<RawJob[]> {
    const rawJobs: RawJob[] = [];
    const MAX_PAGES = 10; // Ingest up to 10 pages (~2500 jobs per run)
    let page = 1;
    let hasNext = true;

    while (page <= MAX_PAGES && hasNext) {
      const pageUrl = `https://www.arbeitnow.com/api/job-board-api?page=${page}`;

      try {
        const res = await fetchWithRetry(pageUrl);
        if (!res.ok) break;

        const data = await res.json();
        const items = data.data || [];

        if (!Array.isArray(items) || items.length === 0) {
          break;
        }

        for (const item of items) {
          const cleanDesc = (item.description || item.title || "")
            .replace(/<[^>]*>/g, " ")
            .replace(/&nbsp;/g, " ")
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/\s+/g, " ")
            .trim();

          const tagsText = Array.isArray(item.tags) ? item.tags.join(" ") : "";
          const fullText = `${cleanDesc} ${tagsText}`;

          rawJobs.push({
            externalId: `arbeitnow-${item.slug || Math.abs(this.hashCode(item.url || item.title))}`,
            title: item.title?.trim() || "Software Engineer",
            company: item.company_name?.trim() || "Tech Company",
            location: item.location || (item.remote ? "Remote" : "Pan India"),
            workMode: item.remote ? WorkMode.REMOTE : WorkMode.NOT_SPECIFIED,
            employmentType:
              Array.isArray(item.job_types) && item.job_types.some((t: string) => /intern/i.test(t))
                ? EmploymentType.INTERNSHIP
                : EmploymentType.FULL_TIME,
            applyUrl: item.url,
            description: fullText,
            postedAt: item.created_at ? new Date(item.created_at * 1000) : new Date(),
            rawPayload: item,
          });
        }

        if (!data.links?.next) {
          hasNext = false;
        } else {
          page++;
          // Gentle pacing between pages
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      } catch (err: any) {
        console.error(`[PublicFeedAdapter] Arbeitnow page ${page} error:`, err.message);
        break;
      }
    }

    return rawJobs;
  }

  /**
   * Parse XML RSS 2.0 feed from WeWorkRemotely
   */
  private async fetchWeWorkRemotelyJobs(config: SourceConfig): Promise<RawJob[]> {
    const rawJobs: RawJob[] = [];
    const url = config.apiUrl || "https://weworkremotely.com/categories/remote-programming-jobs.rss";

    try {
      const res = await fetchWithRetry(url);
      if (!res.ok) return [];

      const xmlText = await res.text();
      // Match all <item> ... </item> blocks
      const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
      let match;

      while ((match = itemRegex.exec(xmlText)) !== null) {
        const itemXml = match[1];

        const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/i) || itemXml.match(/<title>(.*?)<\/title>/i);
        const linkMatch = itemXml.match(/<link>(.*?)<\/link>/i);
        const descMatch = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i) || itemXml.match(/<description>([\s\S]*?)<\/description>/i);
        const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/i);
        const regionMatch = itemXml.match(/<region>(.*?)<\/region>/i);

        const rawTitle = titleMatch ? titleMatch[1].trim() : "Software Engineer";
        const link = linkMatch ? linkMatch[1].trim() : "https://weworkremotely.com";
        const rawDesc = descMatch ? descMatch[1] : "";
        const pubDate = pubDateMatch ? new Date(pubDateMatch[1]) : new Date();
        const region = regionMatch ? regionMatch[1].trim() : "Remote";

        // Often titles are formatted as "Company: Role" e.g., "Wonderdog: Full-Stack Product Engineer"
        let company = config.name;
        let jobTitle = rawTitle;
        if (rawTitle.includes(":")) {
          const parts = rawTitle.split(":");
          company = parts[0].trim();
          jobTitle = parts.slice(1).join(":").trim();
        }

        const cleanDesc = rawDesc
          .replace(/<[^>]*>/g, " ")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/\s+/g, " ")
          .trim();

        rawJobs.push({
          externalId: `wwr-${Math.abs(this.hashCode(link))}`,
          title: jobTitle,
          company,
          location: region || "Remote",
          workMode: WorkMode.REMOTE,
          employmentType: /intern/i.test(jobTitle) ? EmploymentType.INTERNSHIP : EmploymentType.FULL_TIME,
          applyUrl: link,
          description: cleanDesc || jobTitle,
          postedAt: isNaN(pubDate.getTime()) ? new Date() : pubDate,
          rawPayload: { rawTitle, link, region },
        });
      }
    } catch (err: any) {
      console.error("[PublicFeedAdapter] WeWorkRemotely RSS error:", err.message);
    }

    return rawJobs;
  }

  /**
   * Fetch jobs from RemoteOK public developer API
   */
  private async fetchRemoteOKJobs(config: SourceConfig): Promise<RawJob[]> {
    const rawJobs: RawJob[] = [];
    const url = "https://remoteok.com/api";

    try {
      const res = await fetchWithRetry(url);
      if (!res.ok) return [];

      const data = await res.json();
      if (!Array.isArray(data)) return [];

      // First item is often legal disclaimer
      const items = data.filter((item: any) => item.position && item.company);

      for (const item of items) {
        const cleanDesc = (item.description || item.position || "")
          .replace(/<[^>]*>/g, " ")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/\s+/g, " ")
          .trim();

        const tags = Array.isArray(item.tags) ? item.tags.join(", ") : "";
        const fullDesc = `${cleanDesc} Skills & Keywords: ${tags}`;

        const applyUrl = item.apply_url || item.url || `https://remoteok.com/remote-jobs/${item.id}`;

        rawJobs.push({
          externalId: `remoteok-${item.id || item.slug}`,
          title: item.position?.trim() || "Software Engineer",
          company: item.company?.trim() || config.name,
          location: item.location || "Remote",
          workMode: WorkMode.REMOTE,
          employmentType: Array.isArray(item.tags) && item.tags.includes("internship")
            ? EmploymentType.INTERNSHIP
            : EmploymentType.FULL_TIME,
          applyUrl,
          description: fullDesc,
          postedAt: item.date ? new Date(item.date) : new Date(),
          rawPayload: item,
        });
      }
    } catch (err: any) {
      console.error("[PublicFeedAdapter] RemoteOK API error:", err.message);
    }

    return rawJobs;
  }

  /**
   * Fetch jobs from Jobicy public API
   */
  private async fetchJobicyJobs(config: SourceConfig): Promise<RawJob[]> {
    const rawJobs: RawJob[] = [];
    const url = "https://jobicy.com/api/v2/remote-jobs?count=50";

    try {
      const res = await fetchWithRetry(url);
      if (!res.ok) return [];

      const data = await res.json();
      const jobs = data.jobs || [];

      for (const item of jobs) {
        const cleanDesc = (item.jobDescription || item.jobExcerpt || item.jobTitle || "")
          .replace(/<[^>]*>/g, " ")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/\s+/g, " ")
          .trim();

        rawJobs.push({
          externalId: `jobicy-${item.id}`,
          title: item.jobTitle?.trim() || "Software Engineer",
          company: item.companyName?.trim() || config.name,
          location: item.jobGeo || "Remote",
          workMode: WorkMode.REMOTE,
          employmentType: item.jobType?.includes("intern") ? EmploymentType.INTERNSHIP : EmploymentType.FULL_TIME,
          applyUrl: item.url,
          description: cleanDesc,
          postedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
          rawPayload: item,
        });
      }
    } catch (err: any) {
      console.error("[PublicFeedAdapter] Jobicy API error:", err.message);
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

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }
}
