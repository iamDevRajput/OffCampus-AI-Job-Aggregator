import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AlertStatus } from "@prisma/client";

export async function POST() {
  try {
    const pendingAlerts = await prisma.alert.findMany({
      where: { status: AlertStatus.PENDING },
      include: {
        user: { select: { email: true, name: true } },
        job: { select: { title: true, company: true, applyUrl: true } },
      },
      take: 50,
    });

    // In MVP, mark alerts as SENT and log to console
    for (const alert of pendingAlerts) {
      console.log(`[Alert Placeholder] Sending ${alert.type} alert to ${alert.user.email} for ${alert.job.company} - ${alert.job.title}`);
      await prisma.alert.update({
        where: { id: alert.id },
        data: {
          status: AlertStatus.SENT,
          sentAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      processed: pendingAlerts.length,
    });
  } catch (err: any) {
    console.error("Alert delivery error:", err);
    return NextResponse.json({ error: "Failed to dispatch alerts" }, { status: 500 });
  }
}
