import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { PriorityLevel, SourceType } from "@prisma/client";
import { MatchingService } from "@/services/matching.service";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

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

    const body = await req.json().catch(() => ({}));
    const priorityLevel = (body.priorityLevel as PriorityLevel) || PriorityLevel.HIGH;

    const activeConn = company.connections[0];

    // Check if target company record already exists for this user and company
    const existing = await prisma.targetCompany.findFirst({
      where: {
        userId: sessionUser.id,
        OR: [
          { companyRefId: company.id },
          { name: { equals: company.name, mode: "insensitive" } },
        ],
      },
    });

    let targetCompany;
    if (existing) {
      targetCompany = await prisma.targetCompany.update({
        where: { id: existing.id },
        data: {
          companyRefId: company.id,
          priorityLevel,
          isActive: true,
          careerPageUrl: company.careerUrl,
          boardToken: activeConn?.boardToken || null,
          sourceType: activeConn?.atsType || SourceType.MOCK,
        },
      });
    } else {
      targetCompany = await prisma.targetCompany.create({
        data: {
          userId: sessionUser.id,
          companyRefId: company.id,
          name: company.name,
          careerPageUrl: company.careerUrl,
          boardToken: activeConn?.boardToken || null,
          sourceType: activeConn?.atsType || SourceType.MOCK,
          priorityLevel,
          isActive: true,
        },
      });
    }

    // Mark matching jobs as priority
    await prisma.job.updateMany({
      where: {
        OR: [
          { companyRefId: company.id },
          { normalizedCompany: company.normalizedName },
        ],
      },
      data: {
        isPriorityCompany: true,
        targetCompanyId: targetCompany.id,
      },
    });

    // Asynchronously recalculate user matches
    MatchingService.recalculateUserMatches(sessionUser.id).catch(console.error);

    return NextResponse.json({
      success: true,
      isTarget: true,
      targetCompany,
    });
  } catch (err: any) {
    console.error("[Target Company POST API] Error:", err);
    return NextResponse.json({ error: "Failed to add company to target list" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

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
    });

    if (!company) {
      return NextResponse.json({ error: `Company "${id}" not found.` }, { status: 404 });
    }

    await prisma.targetCompany.deleteMany({
      where: {
        userId: sessionUser.id,
        OR: [
          { companyRefId: company.id },
          { name: { equals: company.name, mode: "insensitive" } },
        ],
      },
    });

    // Recalculate matches
    MatchingService.recalculateUserMatches(sessionUser.id).catch(console.error);

    return NextResponse.json({
      success: true,
      isTarget: false,
    });
  } catch (err: any) {
    console.error("[Target Company DELETE API] Error:", err);
    return NextResponse.json({ error: "Failed to remove company from target list" }, { status: 500 });
  }
}
