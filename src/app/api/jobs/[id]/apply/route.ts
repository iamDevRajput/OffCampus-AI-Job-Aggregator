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

    const existing = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId: sessionUser.id,
          jobId,
        },
      },
    });

    let newStatus: ApplicationStatus | null = ApplicationStatus.APPLIED;

    if (existing && existing.status === ApplicationStatus.APPLIED) {
      // Untoggle applied
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
          status: ApplicationStatus.APPLIED,
          notes: body.notes || existing?.notes,
        },
        create: {
          userId: sessionUser.id,
          jobId,
          status: ApplicationStatus.APPLIED,
          notes: body.notes,
        },
      });
    }

    return NextResponse.json({
      success: true,
      status: newStatus,
      message: newStatus ? "Marked as Applied! Best of luck!" : "Application status removed",
    });
  } catch (err: any) {
    console.error("Apply job error:", err);
    return NextResponse.json({ error: "Failed to update applied status" }, { status: 500 });
  }
}
