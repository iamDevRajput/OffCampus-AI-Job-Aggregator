import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { PriorityLevel, SourceType } from "@prisma/client";
import { MatchingService } from "@/services/matching.service";
import { NormalizationService } from "@/services/normalization.service";

export async function GET() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const companies = await prisma.targetCompany.findMany({
    where: { userId: sessionUser.id },
    include: {
      _count: {
        select: { jobs: true },
      },
    },
    orderBy: [{ priorityLevel: "asc" }, { name: "asc" }],
  });

  return NextResponse.json({ companies });
}

export async function POST(req: Request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, aliases, careerPageUrl, boardToken, sourceType, priorityLevel } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }

    const company = await prisma.targetCompany.create({
      data: {
        userId: sessionUser.id,
        name: name.trim(),
        aliases: Array.isArray(aliases)
          ? aliases
          : aliases
          ? String(aliases)
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
          : [],
        careerPageUrl: careerPageUrl || null,
        boardToken: boardToken ? String(boardToken).trim() : null,
        sourceType: sourceType || SourceType.MOCK,
        priorityLevel: priorityLevel || PriorityLevel.HIGH,
        isActive: true,
      },
    });

    // Retroactively link existing jobs and mark priority
    const norm = NormalizationService.normalizeCompany(name);
    const existingJobs = await prisma.job.findMany({
      where: {
        OR: [
          { normalizedCompany: norm },
          { company: { contains: name.trim(), mode: "insensitive" } },
        ],
      },
    });

    for (const job of existingJobs) {
      await prisma.job.update({
        where: { id: job.id },
        data: {
          isPriorityCompany: true,
          targetCompanyId: company.id,
        },
      });
    }

    // Refresh matches
    MatchingService.recalculateUserMatches(sessionUser.id).catch(console.error);

    return NextResponse.json({ success: true, company });
  } catch (err: any) {
    console.error("Create target company error:", err);
    return NextResponse.json({ error: "Failed to create target company" }, { status: 500 });
  }
}
