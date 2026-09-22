import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { MatchingService } from "@/services/matching.service";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;

    await prisma.userSkill.deleteMany({
      where: {
        userId: sessionUser.id,
        OR: [{ id }, { skillId: id }],
      },
    });

    // Recalculate matches
    MatchingService.recalculateUserMatches(sessionUser.id).catch(console.error);

    return NextResponse.json({ success: true, message: "Skill removed" });
  } catch (err: any) {
    console.error("Delete skill error:", err);
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
