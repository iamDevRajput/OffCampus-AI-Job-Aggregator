"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Bookmark,
  CheckCircle2,
  EyeOff,
  User,
  Building2,
  Radio,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  stats?: {
    savedCount?: number;
    appliedCount?: number;
    priorityCompanyCount?: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({ stats }) => {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Job Feed",
      href: "/",
      icon: Briefcase,
      badge: "6.3k+",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    },
    {
      name: "Platform Search",
      href: "/platform-search",
      icon: Compass,
      badge: "10 Hubs",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",
    },
    {
      name: "Saved Jobs",
      href: "/saved?tab=saved",
      icon: Bookmark,
      count: stats?.savedCount,
    },
    {
      name: "Applied Pipeline",
      href: "/saved?tab=applied",
      icon: CheckCircle2,
      count: stats?.appliedCount,
    },
    {
      name: "Ignored Jobs",
      href: "/saved?tab=ignored",
      icon: EyeOff,
    },
    {
      name: "Target Companies",
      href: "/watchlist",
      icon: Building2,
      count: stats?.priorityCompanyCount,
      highlight: true,
    },
    {
      name: "Profile & Skills",
      href: "/profile",
      icon: User,
    },
    {
      name: "Sources & Ingestion",
      href: "/sources",
      icon: Radio,
    },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-surfaceBorder flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-surfaceBorder flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-purple flex items-center justify-center shadow-lg shadow-brand-500/30">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
            OffCampus <span className="text-xs px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">AI</span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium">Placement & Jobs Engine</p>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Main Dashboard
        </div>
        {navigation.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href.split("?")[0]);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group",
                isActive
                  ? "bg-brand-600/15 text-brand-300 border border-brand-500/30 font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              )}
            >
              <div className="flex items-center gap-2.5">
                <item.icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive
                      ? "text-brand-400"
                      : "text-slate-500 group-hover:text-slate-300"
                  )}
                />
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider",
                    item.badgeColor
                  )}
                >
                  {item.badge}
                </span>
              )}

              {typeof item.count === "number" && item.count > 0 && (
                <span
                  className={cn(
                    "text-[11px] px-1.5 py-0.2 rounded-full font-bold",
                    isActive
                      ? "bg-brand-500 text-white"
                      : "bg-slate-800 text-slate-300 border border-slate-700"
                  )}
                >
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Compliance & Quick Status */}
      <div className="p-4 border-t border-surfaceBorder bg-slate-950/40 text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 -ml-3.5 inline-block" />
            Compliant Ingestion
          </span>
          <span className="text-[10px] text-slate-500">v1.0 MVP</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-relaxed">
          Aggregates public career portals, Greenhouse & Lever public APIs. Zero private scraping.
        </p>
      </div>
    </aside>
  );
};
