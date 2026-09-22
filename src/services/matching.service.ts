import { prisma } from "@/lib/prisma";
import { NormalizationService } from "./normalization.service";

export interface MatchResult {
  score: number;
  reasons: string[];
}

export class MatchingService {
  /**
   * Calculates a match score (0-100) and rationale for a job against a user's profile and target companies
   */
  static async calculateMatch(userId: string, jobId: string): Promise<MatchResult> {
    const [user, job] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          userSkills: { include: { skill: true } },
          targetCompanies: { where: { isActive: true } },
        },
      }),
      prisma.job.findUnique({
        where: { id: jobId },
        include: {
          jobSkills: { include: { skill: true } },
        },
      }),
    ]);

    if (!user || !job) {
      return { score: 50, reasons: ["General profile baseline"] };
    }

    let score = 0;
    const reasons: string[] = [];

    // 1. Target Company Match (Up to +15 pts)
    const normalizedJobCompany = NormalizationService.normalizeCompany(job.company);
    let matchedCompany = user.targetCompanies.find((tc) => {
      const tcNorm = NormalizationService.normalizeCompany(tc.name);
      if (tcNorm === normalizedJobCompany) return true;
      return tc.aliases.some((alias) => NormalizationService.normalizeCompany(alias) === normalizedJobCompany);
    });

    if (matchedCompany) {
      const pts = matchedCompany.priorityLevel === "HIGH" ? 15 : matchedCompany.priorityLevel === "MEDIUM" ? 10 : 5;
      score += pts;
      reasons.push(`+${pts}% Watchlist Target Company (${matchedCompany.name} - ${matchedCompany.priorityLevel} Priority)`);
    }

    // 2. Technical Skills Match (Up to +45 pts)
    const userSkillNames = new Set(user.userSkills.map((us) => us.skill.name.toLowerCase()));
    const jobSkillNames = job.jobSkills.map((js) => js.skill.name);

    if (jobSkillNames.length > 0 && userSkillNames.size > 0) {
      const matched = jobSkillNames.filter((name) => userSkillNames.has(name.toLowerCase()));
      if (matched.length > 0) {
        const skillRatio = Math.min(1, matched.length / Math.max(1, jobSkillNames.length));
        const skillPts = Math.round(skillRatio * 40) + Math.min(5, matched.length * 2);
        score += Math.min(45, skillPts);
        reasons.push(`+${Math.min(45, skillPts)}% Matched ${matched.length} skill${matched.length > 1 ? "s" : ""}: ${matched.slice(0, 4).join(", ")}`);
      }
    } else if (userSkillNames.size > 0) {
      // Baseline if job didn't specify strict skills
      score += 15;
      reasons.push("+15% General engineering profile match");
    }

    // 3. Preferred Role Alignment (Up to +20 pts)
    const preferredRoles = user.profile?.preferredRoles || [];
    if (preferredRoles.length > 0) {
      const titleLower = job.title.toLowerCase();
      const matchedRole = preferredRoles.find((role) => {
        const words = role.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
        return words.some((word) => titleLower.includes(word));
      });

      if (matchedRole) {
        score += 20;
        reasons.push(`+20% Matches target role preference (${matchedRole})`);
      } else {
        score += 5;
      }
    } else {
      score += 10;
    }

    // 4. Location & Work Mode Match (Up to +10 pts)
    const preferredLocations = user.profile?.preferredLocations || [];
    const jobLocLower = job.location.toLowerCase();
    const locMatch = preferredLocations.some((loc) => {
      const l = loc.toLowerCase();
      return l === "pan india" || jobLocLower.includes(l) || l.includes(jobLocLower);
    });

    if (locMatch || jobLocLower.includes("remote") || jobLocLower.includes("pan india")) {
      score += 10;
      reasons.push(`+10% Matches preferred location/work mode (${job.location})`);
    } else {
      score += 3;
    }

    // 5. Freshness / Batch Alignment (Up to +10 pts)
    if (job.experienceMin === 0 || job.title.toLowerCase().includes("fresher") || job.title.toLowerCase().includes("intern")) {
      score += 10;
      reasons.push("+10% Entry-level / Fresher eligibility confirmed");
    } else {
      score += 5;
    }

    const finalScore = Math.min(100, Math.max(10, Math.round(score)));

    // Upsert the JobMatch in the database
    await prisma.jobMatch.upsert({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
      update: {
        score: finalScore,
        reasons,
      },
      create: {
        userId,
        jobId,
        score: finalScore,
        reasons,
      },
    });

    return { score: finalScore, reasons };
  }

  /**
   * Recalculates match scores for all active jobs for a specific user (e.g. after profile or skill edit)
   */
  static async recalculateUserMatches(userId: string): Promise<number> {
    const jobs = await prisma.job.findMany({
      where: { status: "ACTIVE" },
      select: { id: true },
      take: 100,
    });

    let count = 0;
    for (const job of jobs) {
      await this.calculateMatch(userId, job.id);
      count++;
    }
    return count;
  }
}
