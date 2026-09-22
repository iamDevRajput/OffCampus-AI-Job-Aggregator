import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, type, baseUrl, apiUrl, fetchFrequencyMinutes, isActive } = body;

    const source = await prisma.jobSource.update({
      where: { id: params.id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(type ? { type } : {}),
        ...(baseUrl !== undefined ? { baseUrl } : {}),
        ...(apiUrl !== undefined ? { apiUrl } : {}),
        ...(fetchFrequencyMinutes !== undefined ? { fetchFrequencyMinutes: parseInt(String(fetchFrequencyMinutes), 10) } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
      },
    });

    return NextResponse.json({ success: true, source });
  } catch (err: any) {
    console.error("Update source error:", err);
    return NextResponse.json({ error: "Failed to update source" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.jobSource.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Source deleted" });
  } catch (err: any) {
    console.error("Delete source error:", err);
    return NextResponse.json({ error: "Failed to delete source" }, { status: 500 });
  }
}
