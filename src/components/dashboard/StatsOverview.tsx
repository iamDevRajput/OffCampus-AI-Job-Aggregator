"use client";

import React from "react";
import { Briefcase, Sparkles, Building2, Bookmark, CheckCircle2 } from "lucide-react";

interface StatsOverviewProps {
  stats: {
    totalActiveJobs: number;
    highMatchCount: number;
    priorityCompanyCount: number;
    savedCount: number;
    appliedCount: number;
  };
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const cards = [
    {
      label: "Active Tech Openings",
      value: stats.totalActiveJobs || 0,
      icon: Briefcase,
      color: "text-brand-400",
      bg: "bg-brand-500/10 border-brand-500/20",
    },
    {
      label: "High Match (≥75%)",
      value: stats.highMatchCount || 0,
      icon: Sparkles,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Dream Companies",
      value: stats.priorityCompanyCount || 0,
      icon: Building2,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Saved & Applied",
      value: (stats.savedCount || 0) + (stats.appliedCount || 0),
      icon: Bookmark,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`glass-card p-4 rounded-xl border flex items-center gap-3.5 ${c.bg}`}
        >
          <div className={`p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 ${c.color}`}>
            <c.icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-100">{c.value}</p>
            <p className="text-[11px] font-medium text-slate-400">{c.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
