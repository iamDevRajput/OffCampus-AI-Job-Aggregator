import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { ApplicationStatus } from "@prisma/client";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const jobId = params.id;
    const body = await req.json().catch(() => ({}));
    const notes = body.notes;

    // Check existing status
    const existing = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId: sessionUser.id,
          jobId,
        },
      },
    });

    let newStatus: ApplicationStatus | null = ApplicationStatus.SAVED;

    if (existing && existing.status === ApplicationStatus.SAVED) {
      // Toggle off
      await prisma.savedJob.delete({
        where: { id: existing.id },
      });
      newStatus = null;
    } else {
      await prisma.savedJob.upsert({
        where: {
          userId_jobId: {
            userId: sessionUser.id,
            jobId,
          },
        },
        update: {
          status: ApplicationStatus.SAVED,
          notes: notes || existing?.notes,
        },
        create: {
          userId: sessionUser.id,
          jobId,
          status: ApplicationStatus.SAVED,
          notes,
        },
      });
    }

    return NextResponse.json({
      success: true,
      status: newStatus,
      message: newStatus ? "Job saved to your list" : "Job removed from saved list",
    });
  } catch (err: any) {
    console.error("Save job error:", err);
    return NextResponse.json({ error: "Failed to update save status" }, { status: 500 });
  }
}
