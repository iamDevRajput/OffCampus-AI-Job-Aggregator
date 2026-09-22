import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { MatchingService } from "@/services/matching.service";

export async function GET() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    include: {
      profile: true,
      userSkills: {
        include: {
          skill: true,
        },
        orderBy: { skill: { name: "asc" } },
      },
      targetCompanies: {
        where: { isActive: true },
        orderBy: { name: "asc" },
      },
    },
  });

  return NextResponse.json({ user });
}

export async function PUT(req: Request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      name,
      college,
      batchYear,
      experienceLevel,
      preferredRoles,
      preferredLocations,
      preferredWorkModes,
      minSalary,
      rawResumeText,
    } = body;

    // Update user display name if changed
    if (name && name.trim().length > 0) {
      await prisma.user.update({
        where: { id: sessionUser.id },
        data: { name: name.trim() },
      });
    }

    // Upsert user profile
    const profile = await prisma.profile.upsert({
      where: { userId: sessionUser.id },
      update: {
        college: college || null,
        batchYear: batchYear ? parseInt(String(batchYear), 10) : null,
        experienceLevel: experienceLevel || "FRESHER",
        preferredRoles: preferredRoles || [],
        preferredLocations: preferredLocations || [],
        preferredWorkModes: preferredWorkModes || [],
        minSalary: minSalary ? parseFloat(String(minSalary)) : null,
        rawResumeText: rawResumeText || null,
      },
      create: {
        userId: sessionUser.id,
        college: college || null,
        batchYear: batchYear ? parseInt(String(batchYear), 10) : null,
        experienceLevel: experienceLevel || "FRESHER",
        preferredRoles: preferredRoles || [],
        preferredLocations: preferredLocations || [],
        preferredWorkModes: preferredWorkModes || [],
        minSalary: minSalary ? parseFloat(String(minSalary)) : null,
        rawResumeText: rawResumeText || null,
      },
    });

    // Auto-recalculate match scores for active jobs
    MatchingService.recalculateUserMatches(sessionUser.id).catch((err) =>
      console.error("Async match recalculation error:", err)
    );

    return NextResponse.json({
      success: true,
      profile,
      message: "Profile updated and match scores refreshed!",
    });
  } catch (err: any) {
    console.error("Profile update error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
