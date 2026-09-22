import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { MatchingService } from "@/services/matching.service";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await MatchingService.calculateMatch(sessionUser.id, params.id);
    return NextResponse.json({ success: true, match: result });
  } catch (err: any) {
    console.error("Recalculate match error:", err);
    return NextResponse.json({ error: "Failed to recalculate match score" }, { status: 500 });
  }
}
