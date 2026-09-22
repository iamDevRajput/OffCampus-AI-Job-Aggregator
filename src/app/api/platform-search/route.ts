import { NextResponse } from "next/server";
import { PlatformRegistry } from "@/services/platform-search/platform.registry";
import { PlatformSearchService } from "@/services/platform-search/platform-search.service";
import { SearchFilters, ExperienceFilter, WorkModeFilter } from "@/services/platform-search/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const query = searchParams.get("query")?.trim() || "Software Engineer Fresher";
  const location = searchParams.get("location")?.trim() || "India";
  const experience = (searchParams.get("experience")?.trim() || "FRESHER") as ExperienceFilter;
  const workMode = (searchParams.get("workMode")?.trim() || "ALL") as WorkModeFilter;

  const filters: SearchFilters = {
    query,
    location,
    experience,
    workMode,
  };

  try {
    const configs = PlatformRegistry.getAllConfigs();
    const summaries = PlatformRegistry.buildAllSearchSummaries(filters);

    return NextResponse.json({
      filters,
      configs,
      summaries,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Platform search GET error:", err);
    return NextResponse.json({ error: "Failed to generate platform searches" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      query = "Software Engineer Fresher",
      location = "India",
      experience = "FRESHER",
      workMode = "ALL",
    } = body;

    const filters: SearchFilters = {
      query: query.trim(),
      location: location.trim(),
      experience,
      workMode,
    };

    const data = await PlatformSearchService.searchAllPlatforms(filters);
    const configs = PlatformRegistry.getAllConfigs();

    return NextResponse.json({
      filters,
      configs,
      ...data,
    });
  } catch (err: any) {
    console.error("Platform search POST error:", err);
    return NextResponse.json({ error: "Failed to execute platform search" }, { status: 500 });
  }
}
