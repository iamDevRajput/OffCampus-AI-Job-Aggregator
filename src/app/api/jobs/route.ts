import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { WorkMode, EmploymentType, SourceType, JobStatus, ApplicationStatus, Prisma } from "@prisma/client";

export async function GET(req: Request) {
  const sessionUser = await getSessionUser();
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search")?.trim() || "";
  const role = searchParams.get("role")?.trim() || "";
  const company = searchParams.get("company")?.trim() || "";
  const skill = searchParams.get("skill")?.trim() || "";
  const location = searchParams.get("location")?.trim() || "";
  const workMode = searchParams.get("workMode")?.trim() || "";
  const employmentType = searchParams.get("employmentType")?.trim() || "";
  const sourceType = searchParams.get("sourceType")?.trim() || "";
  const priorityOnly = searchParams.get("priorityOnly") === "true";
  const salaryDisclosedOnly = searchParams.get("salaryDisclosed") === "true";
  const minSalary = searchParams.get("minSalary") ? parseFloat(searchParams.get("minSalary")!) : null;
  const maxExperience = searchParams.get("maxExperience") ? parseInt(searchParams.get("maxExperience")!, 10) : null;
  const statusFilter = searchParams.get("status")?.toUpperCase() || "ACTIVE"; // ACTIVE, SAVED, APPLIED, IGNORED, ALL, EXPIRED
  const sort = searchParams.get("sort") || "best-match"; // best-match, newest, highest-salary, priority-first, deadline
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const skip = (page - 1) * limit;

  try {
    const userId = sessionUser?.id;

    // Base WHERE conditions
    const where: Prisma.JobWhereInput = {};

    // Status condition
    if (statusFilter === "ALL") {
      // Show any status
    } else if (statusFilter === "EXPIRED") {
      where.status = JobStatus.EXPIRED;
    } else if (!["SAVED", "APPLIED", "IGNORED"].includes(statusFilter)) {
      where.status = JobStatus.ACTIVE;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { jobSkills: { some: { skill: { name: { contains: search, mode: "insensitive" } } } } },
      ];
    }

    if (role) {
      where.title = { contains: role, mode: "insensitive" };
    }

    if (company) {
      where.company = { contains: company, mode: "insensitive" };
    }

    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    if (workMode && workMode !== "ALL") {
      where.workMode = workMode as WorkMode;
    }

    if (employmentType && employmentType !== "ALL") {
      where.employmentType = employmentType as EmploymentType;
    }

    if (sourceType && sourceType !== "ALL") {
      where.source = {
        type: sourceType as SourceType,
      };
    }

    if (priorityOnly) {
      where.isPriorityCompany = true;
    }

    if (salaryDisclosedOnly) {
      where.salaryDisclosed = true;
    }

    if (minSalary) {
      where.OR = [
        { minSalary: { gte: minSalary } },
        { maxSalary: { gte: minSalary } },
      ];
    }

    if (maxExperience !== null && !isNaN(maxExperience)) {
      where.experienceMin = { lte: maxExperience };
    }

    if (skill) {
      where.jobSkills = {
        some: {
          skill: {
            name: { equals: skill, mode: "insensitive" },
          },
        },
      };
    }

    // Application Status Filter (Saved, Applied, Ignored, Active)
    if (userId) {
      if (statusFilter === "SAVED") {
        where.savedJobs = {
          some: {
            userId,
            status: ApplicationStatus.SAVED,
          },
        };
      } else if (statusFilter === "APPLIED") {
        where.savedJobs = {
          some: {
            userId,
            status: ApplicationStatus.APPLIED,
          },
        };
      } else if (statusFilter === "IGNORED") {
        where.savedJobs = {
          some: {
            userId,
            status: ApplicationStatus.IGNORED,
          },
        };
      } else if (statusFilter === "ACTIVE") {
        // Exclude ignored jobs from main feed
        where.savedJobs = {
          none: {
            userId,
            status: ApplicationStatus.IGNORED,
          },
        };
      }
    }

    // Fetch total count and jobs in parallel
    const [totalCount, rawJobs] = await Promise.all([
      prisma.job.count({ where }),
      prisma.job.findMany({
        where,
        include: {
          source: { select: { id: true, name: true, type: true } },
          targetCompany: { select: { id: true, name: true, priorityLevel: true } },
          jobSkills: {
            include: { skill: true },
          },
          ...(userId
            ? {
                jobMatches: {
                  where: { userId },
                  select: { score: true, reasons: true },
                },
                savedJobs: {
                  where: { userId },
                  select: { status: true, notes: true, createdAt: true },
                },
              }
            : {}),
        },
        take: limit,
        skip,
        orderBy:
          sort === "newest"
            ? { postedAt: "desc" }
            : sort === "highest-salary"
            ? { maxSalary: "desc" }
            : sort === "deadline"
            ? { deadline: "asc" }
            : sort === "priority-first"
            ? [{ isPriorityCompany: "desc" }, { postedAt: "desc" }]
            : { postedAt: "desc" },
      }),
    ]);

    // Format jobs with calculated match scores and user status
    let formattedJobs = rawJobs.map((job) => {
      const match = job.jobMatches && job.jobMatches[0];
      const saved = job.savedJobs && job.savedJobs[0];

      return {
        id: job.id,
        title: job.title,
        company: job.company,
        normalizedCompany: job.normalizedCompany,
        description: job.description,
        applyUrl: job.applyUrl,
        location: job.location,
        workMode: job.workMode,
        employmentType: job.employmentType,
        minSalary: job.minSalary,
        maxSalary: job.maxSalary,
        currency: job.currency,
        salaryDisclosed: job.salaryDisclosed,
        salaryRaw: job.salaryRaw,
        experienceMin: job.experienceMin,
        experienceMax: job.experienceMax,
        deadline: job.deadline,
        postedAt: job.postedAt,
        discoveredAt: job.discoveredAt,
        isPriorityCompany: job.isPriorityCompany,
        targetCompany: job.targetCompany,
        status: job.status,
        source: job.source,
        skills: job.jobSkills.map((js) => ({
          id: js.skill.id,
          name: js.skill.name,
          category: js.skill.category,
        })),
        matchScore: match ? match.score : (job.isPriorityCompany ? 85 : 65),
        matchReasons: match ? match.reasons : (job.isPriorityCompany ? ["Target Dream Company Watchlist"] : ["Verified early-career opening"]),
        userStatus: saved ? saved.status : null,
      };
    });

    // Best-match sorting priority
    if (sort === "best-match") {
      formattedJobs.sort((a, b) => {
        if (a.isPriorityCompany && !b.isPriorityCompany) return -1;
        if (!a.isPriorityCompany && b.isPriorityCompany) return 1;
        return b.matchScore - a.matchScore;
      });
    }

    return NextResponse.json({
      jobs: formattedJobs,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (err: any) {
    console.error("Fetch jobs error:", err);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
