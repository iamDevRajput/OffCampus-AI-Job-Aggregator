import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ConnectionStatus, JobStatus } from "@prisma/client";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

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
      },
    });

    if (!company) {
      return NextResponse.json({ error: `Company "${id}" not found.` }, { status: 404 });
    }

    const activeConn = company.connections.find((c) => c.status === ConnectionStatus.CONNECTED) || company.connections[0];

    // Find latest ingestion run for this company
    const latestRun = await prisma.ingestionRun.findFirst({
      where: {
        OR: [
          { sourceName: { equals: company.name, mode: "insensitive" } },
          { sourceName: { contains: company.name, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    // Real PostgreSQL expired count
    const expiredCount = await prisma.job.count({
      where: {
        companyRefId: company.id,
        status: JobStatus.EXPIRED,
      },
    });

    return NextResponse.json({
      health: {
        companyId: company.companyId,
        companyName: company.name,
        connectionStatus: activeConn ? activeConn.status : ConnectionStatus.EXTERNAL,
        atsType: activeConn?.atsType || null,
        boardToken: activeConn?.boardToken || null,
        lastChecked: activeConn?.lastCheckedAt ? activeConn.lastCheckedAt.toISOString() : null,
        lastSuccessfulSync: activeConn?.lastSuccessAt ? activeConn.lastSuccessAt.toISOString() : null,
        lastError: activeConn?.lastError || null,
        jobsFetched: latestRun ? latestRun.jobsFetched : (activeConn ? activeConn.jobCount : 0),
        jobsCreated: latestRun ? latestRun.jobsCreated : 0,
        jobsUpdated: latestRun ? latestRun.jobsUpdated : 0,
        duplicates: latestRun ? latestRun.duplicateCount : 0,
        expired: expiredCount,
        hasRunHistory: !!latestRun,
      },
    });
  } catch (err: any) {
    console.error("[Company Health API] Error:", err);
    return NextResponse.json({ error: "Failed to fetch company health metrics" }, { status: 500 });
  }
}
