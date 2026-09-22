import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: Request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "15", 10)));

  try {
    const runs = await prisma.ingestionRun.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ runs });
  } catch (err: any) {
    console.error("Fetch ingestion runs error:", err);
    return NextResponse.json({ error: "Failed to fetch ingestion run history" }, { status: 500 });
  }
}
