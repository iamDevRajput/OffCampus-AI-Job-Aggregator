import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const sessionUser = await getSessionUser();
  const userId = sessionUser?.id;

  try {
    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: {
        source: true,
        targetCompany: true,
        jobSkills: { include: { skill: true } },
        jobMatches: userId ? { where: { userId } } : false,
        savedJobs: userId ? { where: { userId } } : false,
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const match = job.jobMatches && job.jobMatches[0];
    const saved = job.savedJobs && job.savedJobs[0];

    return NextResponse.json({
      job: {
        ...job,
        skills: job.jobSkills.map((js) => js.skill),
        matchScore: match ? match.score : (job.isPriorityCompany ? 85 : 65),
        matchReasons: match ? match.reasons : [],
        userStatus: saved ? saved.status : null,
        userNotes: saved ? saved.notes : null,
      },
    });
  } catch (err: any) {
    console.error("Get job detail error:", err);
    return NextResponse.json({ error: "Failed to get job detail" }, { status: 500 });
  }
}
