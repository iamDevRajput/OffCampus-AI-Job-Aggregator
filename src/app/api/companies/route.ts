import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { ConnectionStatus, JobStatus, Prisma } from "@prisma/client";

export async function GET(req: Request) {
  const sessionUser = await getSessionUser();
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search")?.trim() || "";
  const filter = (searchParams.get("filter") || "ALL").toUpperCase();
  const sort = (searchParams.get("sort") || "A-Z").toUpperCase();
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "24", 10)));
  const skip = (page - 1) * limit;

  try {
    const userId = sessionUser?.id;

    // Fetch user target company IDs if authenticated
    let userTargetCompanyMap = new Map<string, string>(); // companyRefId -> priorityLevel
    if (userId) {
      const targets = await prisma.targetCompany.findMany({
        where: { userId, isActive: true },
        select: { companyRefId: true, priorityLevel: true },
      });
      for (const t of targets) {
        if (t.companyRefId) {
          userTargetCompanyMap.set(t.companyRefId, t.priorityLevel);
        }
      }
    }

    // Base WHERE conditions
    const where: Prisma.CompanyWhereInput = {
      active: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { companyId: { contains: search, mode: "insensitive" } },
        { industry: { contains: search, mode: "insensitive" } },
        { country: { contains: search, mode: "insensitive" } },
        {
          aliases: {
            some: {
              alias: { contains: search, mode: "insensitive" },
            },
          },
        },
      ];
    }

    // Filter handling
    if (filter === "TARGET") {
      const targetIds = Array.from(userTargetCompanyMap.keys());
      where.id = { in: targetIds };
    } else if (filter === "CONNECTED" || filter === "LIVE ATS" || filter === "LIVE_ATS") {
      where.connections = {
        some: { status: ConnectionStatus.CONNECTED },
      };
    } else if (filter === "EXTERNAL") {
      where.connections = {
        none: { status: ConnectionStatus.CONNECTED },
      };
    } else if (filter === "HAS_ACTIVE_JOBS" || filter === "HAS ACTIVE JOBS") {
      where.jobs = {
        some: { status: JobStatus.ACTIVE },
      };
    } else if (filter === "NO_ACTIVE_JOBS" || filter === "NO ACTIVE JOBS") {
      where.jobs = {
        none: { status: JobStatus.ACTIVE },
      };
    }

    // Compute aggregate statistics
    const [totalCompanies, connectedCompanies, externalCompanies, withJobsCompanies] = await Promise.all([
      prisma.company.count({ where: { active: true } }),
      prisma.company.count({
        where: {
          active: true,
          connections: { some: { status: ConnectionStatus.CONNECTED } },
        },
      }),
      prisma.company.count({
        where: {
          active: true,
          connections: { none: { status: ConnectionStatus.CONNECTED } },
        },
      }),
      prisma.company.count({
        where: {
          active: true,
          jobs: { some: { status: JobStatus.ACTIVE } },
        },
      }),
    ]);

    // Query matched companies with job counts and connections
    const [totalCount, rawCompanies] = await Promise.all([
      prisma.company.count({ where }),
      prisma.company.findMany({
        where,
        include: {
          connections: {
            select: {
              id: true,
              atsType: true,
              boardToken: true,
              status: true,
              jobCount: true,
              lastCheckedAt: true,
              lastSuccessAt: true,
            },
          },
          aliases: {
            select: { alias: true },
            take: 4,
          },
          _count: {
            select: {
              jobs: { where: { status: JobStatus.ACTIVE } },
            },
          },
        },
        orderBy:
          sort === "JOBS" || sort === "ACTIVE JOBS"
            ? { jobs: { _count: "desc" } }
            : sort === "LATEST" || sort === "LATEST JOB"
            ? { updatedAt: "desc" }
            : { name: "asc" },
        take: limit,
        skip,
      }),
    ]);

    // Format output
    let companies = rawCompanies.map((c) => {
      const activeConn = c.connections.find((conn) => conn.status === ConnectionStatus.CONNECTED) || c.connections[0];
      const isTarget = userTargetCompanyMap.has(c.id);
      const targetPriority = userTargetCompanyMap.get(c.id) || null;

      return {
        id: c.id,
        companyId: c.companyId,
        slug: c.slug,
        name: c.name,
        normalizedName: c.normalizedName,
        careerUrl: c.careerUrl,
        officialWebsite: c.officialWebsite,
        industry: c.industry || "Technology / Other",
        country: c.country,
        primaryLocations: c.primaryLocations,
        logoUrl: c.logoUrl,
        coverImageUrl: c.coverImageUrl,
        activeJobsCount: c._count.jobs,
        connection: activeConn
          ? {
              atsType: activeConn.atsType,
              boardToken: activeConn.boardToken,
              status: activeConn.status,
              lastCheckedAt: activeConn.lastCheckedAt,
              lastSuccessAt: activeConn.lastSuccessAt,
            }
          : {
              status: ConnectionStatus.EXTERNAL,
            },
        aliases: c.aliases.map((a) => a.alias),
        isTarget,
        targetPriority,
        lastSyncedAt: activeConn?.lastCheckedAt || c.updatedAt,
        updatedAt: c.updatedAt,
      };
    });

    // Handle TARGET_PRIORITY sort in-memory
    if (sort === "PRIORITY" || sort === "TARGET PRIORITY") {
      companies.sort((a, b) => {
        if (a.isTarget && !b.isTarget) return -1;
        if (!a.isTarget && b.isTarget) return 1;
        return a.name.localeCompare(b.name);
      });
    }

    return NextResponse.json({
      companies,
      stats: {
        totalCompanies,
        connectedCompanies,
        externalCompanies,
        withJobsCompanies,
        targetCount: userTargetCompanyMap.size,
      },
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (err: any) {
    console.error("[Companies API] Failed to fetch companies:", err);
    return NextResponse.json({ error: "Failed to fetch companies registry" }, { status: 500 });
  }
}
