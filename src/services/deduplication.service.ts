import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import { NormalizedJob } from "./adapters/base.adapter";

export class DeduplicationService {
  /**
   * Sanitizes and canonicalizes job apply URLs by removing tracking params, UTM tags, session hashes
   */
  static canonicalizeUrl(url: string): string {
    if (!url) return "";
    try {
      const parsed = new URL(url.trim());
      // Remove standard tracking search parameters
      const cleanParams = new URLSearchParams();
      parsed.searchParams.forEach((value, key) => {
        if (!key.startsWith("utm_") && !["ref", "source", "gh_jid", "lever-source", "sr_source", "fbclid", "gclid"].includes(key.toLowerCase())) {
          cleanParams.append(key, value);
        }
      });
      parsed.search = cleanParams.toString() ? `?${cleanParams.toString()}` : "";
      parsed.hash = "";
      return parsed.toString().replace(/\/$/, "").toLowerCase();
    } catch {
      return url.split("?")[0].replace(/\/$/, "").toLowerCase().trim();
    }
  }

  /**
   * Generates a deterministic SHA-256 hash for a job post
   */
  static generateContentHash(company: string, title: string, applyUrl: string, location?: string): string {
    const cleanCompany = company.trim().toLowerCase().replace(/[^\w]/g, "");
    const cleanTitle = title.trim().toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ");
    const cleanUrl = this.canonicalizeUrl(applyUrl);
    const cleanLoc = (location || "pan india").trim().toLowerCase().replace(/[^\w\s]/g, "");

    const payload = `${cleanCompany}|${cleanTitle}|${cleanUrl}|${cleanLoc}`;
    return crypto.createHash("sha256").update(payload).digest("hex");
  }

  /**
   * Finds any existing job in the database matching externalId, canonical URL, or contentHash
   */
  static async findExistingJob(prisma: PrismaClient, normalized: NormalizedJob) {
    const canonicalUrl = this.canonicalizeUrl(normalized.applyUrl);

    // 1. Exact match by externalId, applyUrl, or contentHash
    const match = await prisma.job.findFirst({
      where: {
        OR: [
          { contentHash: normalized.contentHash },
          { applyUrl: normalized.applyUrl },
          { applyUrl: canonicalUrl },
          ...(normalized.externalId ? [{ externalId: normalized.externalId }] : []),
        ],
      },
    });

    if (match) return match;

    // 2. Soft match by normalizedCompany + normalized title for cross-posted listings
    const cleanTitle = normalized.title.trim().toLowerCase().replace(/[^\w\s]/g, "");
    if (normalized.normalizedCompany && cleanTitle.length > 5) {
      const companyJobs = await prisma.job.findMany({
        where: {
          normalizedCompany: normalized.normalizedCompany,
          status: "ACTIVE",
        },
        select: {
          id: true,
          title: true,
          applyUrl: true,
          minSalary: true,
          maxSalary: true,
          salaryRaw: true,
          salaryDisclosed: true,
          deadline: true,
          targetCompanyId: true,
          isPriorityCompany: true,
        },
      });

      for (const cj of companyJobs) {
        const existingCleanTitle = cj.title.trim().toLowerCase().replace(/[^\w\s]/g, "");
        if (existingCleanTitle === cleanTitle) {
          return cj;
        }
      }
    }

    return null;
  }
}
