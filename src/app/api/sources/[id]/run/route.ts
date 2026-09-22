import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { IngestionService } from "@/services/ingestion.service";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = await IngestionService.runIngestion({ targetSourceId: params.id });
    return NextResponse.json({
      success: true,
      results,
      message: "Ingestion completed for source",
    });
  } catch (err: any) {
    console.error("Run source ingestion error:", err);
    return NextResponse.json({ error: "Failed to run ingestion for source" }, { status: 500 });
  }
}
