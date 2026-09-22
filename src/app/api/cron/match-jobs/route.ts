import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MatchingService } from "@/services/matching.service";

export async function POST(req: Request) {
  try {
    const users = await prisma.user.findMany({ select: { id: true } });
    let totalUpdated = 0;

    for (const u of users) {
      const count = await MatchingService.recalculateUserMatches(u.id);
      totalUpdated += count;
    }

    return NextResponse.json({
      success: true,
      usersProcessed: users.length,
      matchesUpdated: totalUpdated,
    });
  } catch (err: any) {
    console.error("Match jobs cron error:", err);
    return NextResponse.json({ error: "Failed to recalculate matches" }, { status: 500 });
  }
}
