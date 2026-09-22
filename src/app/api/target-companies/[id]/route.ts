import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { MatchingService } from "@/services/matching.service";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, aliases, careerPageUrl, boardToken, sourceType, priorityLevel, isActive } = body;

    const company = await prisma.targetCompany.update({
      where: {
        id: params.id,
        userId: sessionUser.id,
      },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(aliases !== undefined
          ? {
              aliases: Array.isArray(aliases)
                ? aliases
                : String(aliases)
                    .split(",")
                    .map((s: string) => s.trim())
                    .filter(Boolean),
            }
          : {}),
        ...(careerPageUrl !== undefined ? { careerPageUrl } : {}),
        ...(boardToken !== undefined ? { boardToken } : {}),
        ...(sourceType ? { sourceType } : {}),
        ...(priorityLevel ? { priorityLevel } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
      },
    });

    MatchingService.recalculateUserMatches(sessionUser.id).catch(console.error);

    return NextResponse.json({ success: true, company });
  } catch (err: any) {
    console.error("Update target company error:", err);
    return NextResponse.json({ error: "Failed to update target company" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.targetCompany.delete({
      where: {
        id: params.id,
        userId: sessionUser.id,
      },
    });

    MatchingService.recalculateUserMatches(sessionUser.id).catch(console.error);

    return NextResponse.json({ success: true, message: "Target company removed" });
  } catch (err: any) {
    console.error("Delete target company error:", err);
    return NextResponse.json({ error: "Failed to delete target company" }, { status: 500 });
  }
}
