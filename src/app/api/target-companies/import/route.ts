import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { POPULAR_TARGET_COMPANIES } from "@/lib/constants";
import { PriorityLevel, SourceType } from "@prisma/client";
import { MatchingService } from "@/services/matching.service";

export async function POST(req: Request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const companiesToImport = body.companies || POPULAR_TARGET_COMPANIES;

    let importedCount = 0;

    for (const item of companiesToImport) {
      const existing = await prisma.targetCompany.findFirst({
        where: {
          userId: sessionUser.id,
          name: { equals: item.name, mode: "insensitive" },
        },
      });

      if (!existing) {
        await prisma.targetCompany.create({
          data: {
            userId: sessionUser.id,
            name: item.name,
            aliases: item.aliases || [],
            careerPageUrl: item.careerPageUrl || null,
            sourceType: item.sourceType || SourceType.MOCK,
            priorityLevel: (item.priorityLevel as PriorityLevel) || PriorityLevel.HIGH,
            isActive: true,
          },
        });
        importedCount++;
      }
    }

    MatchingService.recalculateUserMatches(sessionUser.id).catch(console.error);

    return NextResponse.json({
      success: true,
      importedCount,
      message: `Successfully imported ${importedCount} target companies!`,
    });
  } catch (err: any) {
    console.error("Import target companies error:", err);
    return NextResponse.json({ error: "Failed to import companies" }, { status: 500 });
  }
}
