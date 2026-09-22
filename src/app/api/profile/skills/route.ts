import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { MatchingService } from "@/services/matching.service";

export async function GET() {
  const allSkills = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return NextResponse.json({ skills: allSkills });
}

export async function POST(req: Request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { skillId, skillName, category, level } = body;

    let targetSkillId = skillId;

    if (!targetSkillId && skillName) {
      const normalizedName = skillName.toLowerCase().replace(/[^\w]/g, "");
      const skill = await prisma.skill.upsert({
        where: { normalizedName },
        update: {},
        create: {
          name: skillName.trim(),
          category: category || "Core CS",
          normalizedName,
        },
      });
      targetSkillId = skill.id;
    }

    if (!targetSkillId) {
      return NextResponse.json({ error: "Skill is required" }, { status: 400 });
    }

    const userSkill = await prisma.userSkill.upsert({
      where: {
        userId_skillId: {
          userId: sessionUser.id,
          skillId: targetSkillId,
        },
      },
      update: {
        level: level || "INTERMEDIATE",
      },
      create: {
        userId: sessionUser.id,
        skillId: targetSkillId,
        level: level || "INTERMEDIATE",
      },
      include: {
        skill: true,
      },
    });

    // Recalculate matches
    MatchingService.recalculateUserMatches(sessionUser.id).catch(console.error);

    return NextResponse.json({
      success: true,
      userSkill,
    });
  } catch (err: any) {
    console.error("Add skill error:", err);
    return NextResponse.json({ error: "Failed to save skill" }, { status: 500 });
  }
}
