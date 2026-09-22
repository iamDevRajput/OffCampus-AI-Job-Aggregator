import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { WorkMode, EmploymentType, JobStatus, Prisma } from "@prisma/client";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const sessionUser = await getSessionUser();
  const { searchParams } = new URL(req.url);

  const role = searchParams.get("role")?.trim() || "";
  const location = searchParams.get("location")?.trim() || "";
  const workMode = searchParams.get("workMode")?.trim() || "";
  const minSalary = searchParams.get("minSalary") ? parseFloat(searchParams.get("minSalary")!) : null;
  const sort = searchParams.get("sort") || "newest";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const skip = (page - 1) * limit;

  try {
    const company = await prisma.company.findFirst({
      where: {
        OR: [
          { id },
          { companyId: id.toUpperCase() },
          { slug: id.toLowerCase() },
        ],
      },
    });

    if (!company) {
      return NextResponse.json({ error: `Company "${id}" not found.` }, { status: 404 });
    }

    const userId = sessionUser?.id;

    // Filter jobs for this company
    const where: Prisma.JobWhereInput = {
      OR: [
        { companyRefId: company.id },
        { normalizedCompany: company.normalizedName },
      ],
      status: JobStatus.ACTIVE,
    };

    if (role) {
      where.title = { contains: role, mode: "insensitive" };
    }

    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    if (workMode && workMode !== "ALL") {
      where.workMode = workMode as WorkMode;
    }

    if (minSalary) {
      where.OR = [
        { minSalary: { gte: minSalary } },
        { maxSalary: { gte: minSalary } },
      ];
    }

    const [totalCount, rawJobs] = await Promise.all([
      prisma.job.count({ where }),
      prisma.job.findMany({
        where,
        include: {
          source: { select: { id: true, name: true, type: true } },
          targetCompany: { select: { id: true, name: true, priorityLevel: true } },
          jobSkills: { include: { skill: true } },
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
          sort === "highest-salary"
            ? { maxSalary: "desc" }
            : sort === "deadline"
            ? { deadline: "asc" }
            : { postedAt: "desc" },
      }),
    ]);

    const formattedJobs = rawJobs.map((job) => {
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
        matchScore: match ? match.score : 75,
        matchReasons: match ? match.reasons : ["Direct opening from company careers hub"],
        userStatus: saved ? saved.status : null,
      };
    });

    if (sort === "best-match") {
      formattedJobs.sort((a, b) => b.matchScore - a.matchScore);
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
    console.error("[Company Jobs API] Error:", err);
    return NextResponse.json({ error: "Failed to fetch company jobs" }, { status: 500 });
  }
}
