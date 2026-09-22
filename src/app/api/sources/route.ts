import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { SourceType } from "@prisma/client";

export async function GET() {
  const sources = await prisma.jobSource.findMany({
    include: {
      _count: {
        select: { jobs: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ sources });
}

export async function POST(req: Request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, type, baseUrl, apiUrl, boardToken, fetchFrequencyMinutes, isActive } = body;

    if (!name) {
      return NextResponse.json({ error: "Source name is required" }, { status: 400 });
    }

    const source = await prisma.jobSource.create({
      data: {
        name: name.trim(),
        type: (type as SourceType) || SourceType.GREENHOUSE,
        baseUrl: baseUrl || null,
        apiUrl: apiUrl || null,
        boardToken: boardToken || null,
        fetchFrequencyMinutes: fetchFrequencyMinutes ? parseInt(String(fetchFrequencyMinutes), 10) : 60,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ success: true, source });
  } catch (err: any) {
    console.error("Create source error:", err);
    return NextResponse.json({ error: "Failed to create job source" }, { status: 500 });
  }
}
