import { prisma } from "@/lib/prisma";
import { AlertType, AlertChannel, AlertStatus } from "@prisma/client";

export class AlertService {
  /**
   * Queue or send an alert for a high matching job or priority company opening
   */
  static async queueAlert(userId: string, jobId: string, type: AlertType): Promise<void> {
    // Check if alert already exists to prevent duplicate notifications
    const existing = await prisma.alert.findFirst({
      where: {
        userId,
        jobId,
        type,
      },
    });

    if (existing) return;

    await prisma.alert.create({
      data: {
        userId,
        jobId,
        type,
        channel: AlertChannel.IN_APP,
        status: AlertStatus.SENT,
        sentAt: new Date(),
      },
    });
  }

  /**
   * Get recent alerts for user
   */
  static async getUserAlerts(userId: string, limit = 10) {
    return prisma.alert.findMany({
      where: { userId },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
            salaryRaw: true,
            applyUrl: true,
            isPriorityCompany: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}
