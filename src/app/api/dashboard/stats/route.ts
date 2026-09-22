import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { ApplicationStatus } from "@prisma/client";

export async function GET() {
  const sessionUser = await getSessionUser();
  const userId = sessionUser?.id;

  try {
    const [totalActiveJobs, priorityCompanyCount, savedCount, appliedCount] = await Promise.all([
      prisma.job.count({
        where: {
          status: "ACTIVE",
          ...(userId
            ? {
                savedJobs: {
                  none: {
                    userId,
                    status: ApplicationStatus.IGNORED,
                  },
                },
              }
            : {}),
        },
      }),
      prisma.job.count({
        where: {
          status: "ACTIVE",
          isPriorityCompany: true,
          ...(userId
            ? {
                savedJobs: {
                  none: {
                    userId,
                    status: ApplicationStatus.IGNORED,
                  },
                },
              }
            : {}),
        },
      }),
      userId
        ? prisma.savedJob.count({
            where: { userId, status: ApplicationStatus.SAVED },
          })
        : 0,
      userId
        ? prisma.savedJob.count({
            where: { userId, status: ApplicationStatus.APPLIED },
          })
        : 0,
    ]);

    let highMatchCount = 0;
    if (userId) {
      highMatchCount = await prisma.jobMatch.count({
        where: {
          userId,
          score: { gte: 75 },
          job: { status: "ACTIVE" },
        },
      });
    }

    return NextResponse.json({
      totalActiveJobs,
      priorityCompanyCount,
      highMatchCount,
      savedCount,
      appliedCount,
    });
  } catch (err: any) {
    console.error("Dashboard stats error:", err);
    return NextResponse.json({ error: "Failed to load dashboard stats" }, { status: 500 });
  }
}
