import React from "react";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  // If no user is logged in, redirect to login page
  if (!user) {
    redirect("/login");
  }

  // Fetch quick stats for the sidebar badges
  const [savedCount, appliedCount, priorityCompanyCount] = await Promise.all([
    prisma.savedJob.count({
      where: { userId: user.id, status: "SAVED" },
    }),
    prisma.savedJob.count({
      where: { userId: user.id, status: "APPLIED" },
    }),
    prisma.targetCompany.count({
      where: { userId: user.id, isActive: true },
    }),
  ]);

  return (
    <div className="flex min-h-screen bg-background text-slate-100">
      <Sidebar
        stats={{
          savedCount,
          appliedCount,
          priorityCompanyCount,
        }}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header user={user} />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
