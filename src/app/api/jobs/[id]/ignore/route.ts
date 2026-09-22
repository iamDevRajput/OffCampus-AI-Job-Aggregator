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

    const existing = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId: sessionUser.id,
          jobId,
        },
      },
    });

    let newStatus: ApplicationStatus | null = ApplicationStatus.IGNORED;

    if (existing && existing.status === ApplicationStatus.IGNORED) {
      // Un-ignore
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
          status: ApplicationStatus.IGNORED,
        },
        create: {
          userId: sessionUser.id,
          jobId,
          status: ApplicationStatus.IGNORED,
        },
      });
    }

    return NextResponse.json({
      success: true,
      status: newStatus,
      message: newStatus ? "Job moved to ignored list" : "Job restored to active feed",
    });
  } catch (err: any) {
    console.error("Ignore job error:", err);
    return NextResponse.json({ error: "Failed to update ignored status" }, { status: 500 });
  }
}
