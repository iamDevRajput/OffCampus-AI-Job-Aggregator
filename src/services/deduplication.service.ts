import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export class DeduplicationService {
  /**
   * Generates a deterministic SHA-256 hash for a job post
   */
  static generateContentHash(company: string, title: string, applyUrl: string, location?: string): string {
    const cleanCompany = company.trim().toLowerCase();
    const cleanTitle = title.trim().toLowerCase().replace(/[^\w\s]/g, "");
    const cleanUrl = applyUrl.split("?")[0].toLowerCase().trim(); // Strip query tracking params
    const cleanLoc = (location || "pan india").trim().toLowerCase();

    const payload = `${cleanCompany}|${cleanTitle}|${cleanUrl}|${cleanLoc}`;
    return crypto.createHash("sha256").update(payload).digest("hex");
  }

  /**
   * Checks whether a job with the same hash or externalId or URL already exists
   */
  static async isDuplicate(contentHash: string, applyUrl: string, externalId?: string): Promise<boolean> {
    const existing = await prisma.job.findFirst({
      where: {
        OR: [
          { contentHash },
          { applyUrl },
          ...(externalId ? [{ externalId }] : []),
        ],
      },
      select: { id: true },
    });

    return !!existing;
  }
}
