import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { AlertService } from "@/services/alert.service";

export async function GET() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const alerts = await AlertService.getUserAlerts(sessionUser.id, 10);
    return NextResponse.json({ alerts });
  } catch (err: any) {
    console.error("Fetch alerts error:", err);
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 });
  }
}
