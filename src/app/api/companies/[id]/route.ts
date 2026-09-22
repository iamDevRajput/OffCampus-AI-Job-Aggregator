import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { ConnectionStatus, JobStatus } from "@prisma/client";
import { CompanyConnectionService } from "@/services/company-connection.service";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const sessionUser = await getSessionUser();

  try {
    const company = await prisma.company.findFirst({
      where: {
        OR: [
          { id },
          { companyId: id.toUpperCase() },
          { slug: id.toLowerCase() },
        ],
      },
      include: {
        connections: true,
        aliases: true,
      },
    });

    if (!company) {
      return NextResponse.json({ error: `Company "${id}" not found in registry.` }, { status: 404 });
    }

    // Compute real PostgreSQL job counts
    const jobStats = await CompanyConnectionService.getCompanyJobCounts(company.id);

    // Check user target status
    let isTarget = false;
    let targetPriority = null;
    let targetCompanyRecordId = null;

    if (sessionUser) {
      const target = await prisma.targetCompany.findFirst({
        where: {
          userId: sessionUser.id,
          companyRefId: company.id,
          isActive: true,
        },
      });
      if (target) {
        isTarget = true;
        targetPriority = target.priorityLevel;
        targetCompanyRecordId = target.id;
      }
    }

    // Recent ingestion runs
    const recentRuns = await prisma.ingestionRun.findMany({
      where: {
        OR: [
          { sourceName: { equals: company.name, mode: "insensitive" } },
          { sourceName: { contains: company.name, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const activeConn = company.connections.find((c) => c.status === ConnectionStatus.CONNECTED) || company.connections[0];

    return NextResponse.json({
      company: {
        id: company.id,
        companyId: company.companyId,
        slug: company.slug,
        name: company.name,
        normalizedName: company.normalizedName,
        careerUrl: company.careerUrl,
        officialWebsite: company.officialWebsite,
        industry: company.industry,
        country: company.country,
        primaryLocations: company.primaryLocations,
        logoUrl: company.logoUrl,
        coverImageUrl: company.coverImageUrl,
        active: company.active,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
        jobStats,
        isTarget,
        targetPriority,
        targetCompanyRecordId,
        connection: activeConn
          ? {
              id: activeConn.id,
              atsType: activeConn.atsType,
              boardToken: activeConn.boardToken,
              apiUrl: activeConn.apiUrl,
              status: activeConn.status,
              lastCheckedAt: activeConn.lastCheckedAt,
              lastSuccessAt: activeConn.lastSuccessAt,
              lastError: activeConn.lastError,
              jobCount: activeConn.jobCount,
            }
          : {
              status: ConnectionStatus.EXTERNAL,
              notes: "External career page — automatic ATS ingestion unavailable.",
            },
        aliases: company.aliases.map((a) => a.alias),
        recentRuns,
      },
    });
  } catch (err: any) {
    console.error("[Company Detail API] Error:", err);
    return NextResponse.json({ error: "Failed to fetch company details" }, { status: 500 });
  }
}
