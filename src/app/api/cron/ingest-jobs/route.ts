import { NextResponse } from "next/server";
import { IngestionService } from "@/services/ingestion.service";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  const { searchParams } = new URL(req.url);
  const secretParam = searchParams.get("secret");

  // Check if authenticated user or valid CRON_SECRET
  let isAuthorized = false;

  if (cronSecret) {
    if (authHeader === `Bearer ${cronSecret}` || secretParam === cronSecret) {
      isAuthorized = true;
    }
  }

  // Also allow authenticated logged-in sessions (e.g. from the UI "Sync Now" button)
  if (!isAuthorized) {
    const sessionUser = await getSessionUser();
    if (sessionUser) {
      isAuthorized = true;
    }
  }

  // If CRON_SECRET is not set in development, allow it
  if (!cronSecret && process.env.NODE_ENV !== "production") {
    isAuthorized = true;
  }

  if (!isAuthorized) {
    return NextResponse.json(
      { error: "Unauthorized cron execution. Provide valid CRON_SECRET header or query parameter." },
      { status: 401 }
    );
  }

  try {
    const results = await IngestionService.runIngestion();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (err: any) {
    console.error("Cron ingestion failed:", err);
    return NextResponse.json(
      { error: "Ingestion pipeline failure", details: err.message || String(err) },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  return POST(req);
}
