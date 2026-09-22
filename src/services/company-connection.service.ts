import { prisma } from "@/lib/prisma";
import { ConnectionStatus, SourceType, JobStatus } from "@prisma/client";
import { IngestionService, IngestionSummary } from "./ingestion.service";
import { fetchWithRetry } from "@/lib/fetch-utils";

export interface AtsDetectionResult {
  status: ConnectionStatus;
  atsType?: SourceType;
  boardToken?: string;
  apiUrl?: string;
  notes?: string;
}

export interface CompanyJobStats {
  active: number;
  expired: number;
  total: number;
}

export class CompanyConnectionService {
  /**
   * Safely probes and detects if a company's career page is backed by a supported public ATS.
   * STRICT COMPLIANCE: Uses only documented public API endpoints. Never scrapes HTML, bypasses CAPTCHA, or bypasses auth.
   */
  static async detectAts(careerUrl: string, companyName?: string): Promise<AtsDetectionResult> {
    if (!careerUrl) {
      return { status: ConnectionStatus.EXTERNAL, notes: "No career URL provided" };
    }

    try {
      const url = new URL(careerUrl);
      const host = url.hostname.toLowerCase();
      const pathname = url.pathname;

      // 1. Greenhouse
      if (host.includes("greenhouse.io")) {
        // e.g. boards.greenhouse.io/company
        const parts = pathname.split("/").filter(Boolean);
        const token = parts[0] === "embed" ? parts[1] : parts[0];
        if (token) {
          const verified = await this.verifyGreenhouseBoard(token);
          if (verified) {
            return {
              status: ConnectionStatus.CONNECTED,
              atsType: SourceType.GREENHOUSE,
              boardToken: token,
              apiUrl: `https://boards-api.greenhouse.io/v1/boards/${token}/jobs`,
            };
          }
        }
      }

      // 2. Lever
      if (host.includes("lever.co")) {
        // e.g. jobs.lever.co/company
        const parts = pathname.split("/").filter(Boolean);
        const token = parts[0];
        if (token) {
          const verified = await this.verifyLeverPostings(token);
          if (verified) {
            return {
              status: ConnectionStatus.CONNECTED,
              atsType: SourceType.LEVER,
              boardToken: token,
              apiUrl: `https://api.lever.co/v0/postings/${token}?mode=json`,
            };
          }
        }
      }

      // 3. Ashby
      if (host.includes("ashbyhq.com")) {
        // e.g. jobs.ashbyhq.com/company
        const parts = pathname.split("/").filter(Boolean);
        const token = parts[0];
        if (token) {
          const verified = await this.verifyAshbyBoard(token);
          if (verified) {
            return {
              status: ConnectionStatus.CONNECTED,
              atsType: SourceType.ASHBY,
              boardToken: token,
              apiUrl: `https://api.ashbyhq.com/posting-api/job-board/${token}`,
            };
          }
        }
      }

      // 4. SmartRecruiters
      if (host.includes("smartrecruiters.com")) {
        // e.g. jobs.smartrecruiters.com/Company
        const parts = pathname.split("/").filter(Boolean);
        const token = parts[0];
        if (token) {
          const verified = await this.verifySmartRecruiters(token);
          if (verified) {
            return {
              status: ConnectionStatus.CONNECTED,
              atsType: SourceType.SMART_RECRUITERS,
              boardToken: token,
              apiUrl: `https://api.smartrecruiters.com/v1/companies/${token}/postings`,
            };
          }
        }
      }

      // 5. Recruitee
      if (host.includes("recruitee.com")) {
        // e.g. company.recruitee.com
        const sub = host.split(".")[0];
        if (sub && sub !== "www" && sub !== "careers") {
          const verified = await this.verifyRecruitee(sub);
          if (verified) {
            return {
              status: ConnectionStatus.CONNECTED,
              atsType: SourceType.RECRUITEE,
              boardToken: sub,
              apiUrl: `https://${sub}.recruitee.com/api/offers/`,
            };
          }
        }
      }

      // 6. Workable
      if (host.includes("workable.com")) {
        // e.g. apply.workable.com/company
        const parts = pathname.split("/").filter(Boolean);
        const token = parts[0];
        if (token) {
          const verified = await this.verifyWorkable(token);
          if (verified) {
            return {
              status: ConnectionStatus.CONNECTED,
              atsType: SourceType.WORKABLE,
              boardToken: token,
              apiUrl: `https://apply.workable.com/api/v3/accounts/${token}/jobs`,
            };
          }
        }
      }
    } catch {
      // Invalid URL format
    }

    // Default to External Career Page
    return {
      status: ConnectionStatus.EXTERNAL,
      notes: "External career page — automatic ATS ingestion unavailable.",
    };
  }

  /**
   * Safe public verifiers with 4-second timeout
   */
  private static async verifyGreenhouseBoard(token: string): Promise<boolean> {
    try {
      const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(token)}/jobs`, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; OffCampusJobAggregator/1.0)" },
        signal: AbortSignal.timeout(4000),
      });
      return res.status === 200;
    } catch {
      return false;
    }
  }

  private static async verifyLeverPostings(token: string): Promise<boolean> {
    try {
      const res = await fetch(`https://api.lever.co/v0/postings/${encodeURIComponent(token)}?mode=json`, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; OffCampusJobAggregator/1.0)" },
        signal: AbortSignal.timeout(4000),
      });
      return res.status === 200;
    } catch {
      return false;
    }
  }

  private static async verifyAshbyBoard(token: string): Promise<boolean> {
    try {
      const res = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(token)}`, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; OffCampusJobAggregator/1.0)" },
        signal: AbortSignal.timeout(4000),
      });
      return res.status === 200;
    } catch {
      return false;
    }
  }

  private static async verifySmartRecruiters(token: string): Promise<boolean> {
    try {
      const res = await fetch(`https://api.smartrecruiters.com/v1/companies/${encodeURIComponent(token)}/postings`, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; OffCampusJobAggregator/1.0)" },
        signal: AbortSignal.timeout(4000),
      });
      return res.status === 200;
    } catch {
      return false;
    }
  }

  private static async verifyRecruitee(token: string): Promise<boolean> {
    try {
      const res = await fetch(`https://${encodeURIComponent(token)}.recruitee.com/api/offers/`, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; OffCampusJobAggregator/1.0)" },
        signal: AbortSignal.timeout(4000),
      });
      return res.status === 200;
    } catch {
      return false;
    }
  }

  private static async verifyWorkable(token: string): Promise<boolean> {
    try {
      const res = await fetch(`https://apply.workable.com/api/v3/accounts/${encodeURIComponent(token)}/jobs`, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; OffCampusJobAggregator/1.0)" },
        signal: AbortSignal.timeout(4000),
      });
      return res.status === 200;
    } catch {
      return false;
    }
  }

  /**
   * Trigger live ATS refresh for a connected company
   */
  static async syncCompany(companyId: string): Promise<{ success: boolean; summary: IngestionSummary; activeJobs: number }> {
    const company = await prisma.company.findFirst({
      where: {
        OR: [
          { id: companyId },
          { companyId: companyId },
          { slug: companyId.toLowerCase() },
        ],
      },
      include: {
        connections: {
          where: { status: ConnectionStatus.CONNECTED },
        },
      },
    });

    if (!company) {
      throw new Error(`Company "${companyId}" not found in registry.`);
    }

    const connection = company.connections[0];
    if (!connection) {
      throw new Error("External career page — automatic ingestion unavailable.");
    }

    // Reuse IngestionService with single company config
    const summaries = await IngestionService.runIngestion({
      customSource: {
        name: company.name,
        type: connection.atsType,
        boardToken: connection.boardToken,
        apiUrl: connection.apiUrl || undefined,
        companyRefId: company.id,
      },
    });

    const summary = summaries[0] || {
      sourceName: company.name,
      sourceType: connection.atsType,
      fetchedCount: 0,
      newJobsCount: 0,
      updatedCount: 0,
      duplicateCount: 0,
      errors: [],
      durationMs: 0,
    };

    // Calculate live job stats for this company
    const stats = await this.getCompanyJobCounts(company.id);

    // Update connection & company telemetry
    await Promise.all([
      prisma.company.update({
        where: { id: company.id },
        data: {
          updatedAt: new Date(),
        },
      }),
      prisma.companyConnection.update({
        where: { id: connection.id },
        data: {
          lastCheckedAt: new Date(),
          lastSuccessAt: summary.errors.length === 0 ? new Date() : undefined,
          lastError: summary.errors.length > 0 ? summary.errors.slice(0, 2).join("; ") : null,
          jobCount: stats.active,
        },
      }),
    ]);

    return {
      success: summary.errors.length === 0,
      summary,
      activeJobs: stats.active,
    };
  }

  /**
   * Real PostgreSQL active/expired/total job counts for a company
   */
  static async getCompanyJobCounts(companyId: string): Promise<CompanyJobStats> {
    const [active, expired, total] = await Promise.all([
      prisma.job.count({
        where: {
          companyRefId: companyId,
          status: JobStatus.ACTIVE,
        },
      }),
      prisma.job.count({
        where: {
          companyRefId: companyId,
          status: JobStatus.EXPIRED,
        },
      }),
      prisma.job.count({
        where: {
          companyRefId: companyId,
        },
      }),
    ]);

    return { active, expired, total };
  }
}
