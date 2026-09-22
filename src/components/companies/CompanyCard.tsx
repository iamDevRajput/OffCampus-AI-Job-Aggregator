"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  ExternalLink,
  MapPin,
  RefreshCw,
  Star,
  CheckCircle2,
  Clock,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";

export interface CompanyCardData {
  id: string;
  companyId: string;
  slug: string;
  name: string;
  careerUrl: string;
  officialWebsite?: string | null;
  industry: string;
  country: string;
  primaryLocations: string[];
  activeJobsCount: number;
  connection: {
    atsType?: string;
    boardToken?: string;
    status: string; // CONNECTED, EXTERNAL, ERROR, UNKNOWN
    lastCheckedAt?: string | null;
    lastSuccessAt?: string | null;
  };
  aliases: string[];
  isTarget?: boolean;
  targetPriority?: string | null;
  lastSyncedAt?: string | null;
  updatedAt?: string | null;
}

interface CompanyCardProps {
  company: CompanyCardData;
  onTargetToggle?: (companyId: string, isTarget: boolean) => void;
  onRefresh?: (companyId: string) => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  onTargetToggle,
  onRefresh,
}) => {
  const [isTarget, setIsTarget] = useState(company.isTarget || false);
  const [isUpdatingTarget, setIsUpdatingTarget] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

  const isConnected = company.connection.status === "CONNECTED";

  // Initials logo
  const initials = company.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const handleTargetClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsUpdatingTarget(true);

    try {
      if (isTarget) {
        const res = await fetch(`/api/companies/${company.id}/target`, { method: "DELETE" });
        if (res.ok) {
          setIsTarget(false);
          if (onTargetToggle) onTargetToggle(company.id, false);
        }
      } else {
        const res = await fetch(`/api/companies/${company.id}/target`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priorityLevel: "HIGH" }),
        });
        if (res.ok) {
          setIsTarget(true);
          if (onTargetToggle) onTargetToggle(company.id, true);
        }
      }
    } catch (err) {
      console.error("Target toggle error:", err);
    } finally {
      setIsUpdatingTarget(false);
    }
  };

  const handleRefreshClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isConnected) {
      window.open(company.careerUrl, "_blank", "noopener,noreferrer");
      return;
    }

    setIsRefreshing(true);
    setRefreshMessage(null);
    try {
      const res = await fetch(`/api/companies/${company.id}/refresh`, { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setRefreshMessage(`Synced ${data.summary?.newJobsCount || 0} new jobs!`);
        if (onRefresh) onRefresh(company.id);
      } else {
        setRefreshMessage(data.message || "Refresh completed");
      }
      setTimeout(() => setRefreshMessage(null), 3000);
    } catch {
      setRefreshMessage("Sync error");
      setTimeout(() => setRefreshMessage(null), 3000);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div
      className={`glass-card rounded-xl p-5 border relative overflow-hidden transition-all duration-200 flex flex-col justify-between group hover:border-brand-500/40 hover:shadow-lg hover:shadow-brand-500/5 ${
        isTarget
          ? "border-amber-500/30 bg-gradient-to-br from-amber-500/[0.03] to-slate-900/90"
          : "border-slate-800"
      }`}
    >
      {/* Top Section: Logo, Name, ID, Target Star */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {/* Logo / Initials */}
            <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center font-bold text-xs text-brand-300 shadow-inner group-hover:border-brand-500/50 transition-colors">
              {initials}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <Link
                  href={`/companies/${company.slug}`}
                  className="font-bold text-slate-100 text-sm hover:text-brand-300 transition-colors line-clamp-1"
                >
                  {company.name}
                </Link>
              </div>

              {/* Stable Company ID badge */}
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-mono font-semibold text-slate-400 bg-slate-800/90 px-1.5 py-0.5 rounded border border-slate-700/60">
                  {company.companyId}
                </span>
                <span className="text-[11px] text-slate-400 line-clamp-1">
                  {company.industry}
                </span>
              </div>
            </div>
          </div>

          {/* Target Watch Button */}
          <button
            onClick={handleTargetClick}
            disabled={isUpdatingTarget}
            title={isTarget ? "In your target watchlist (Click to unwatch)" : "Add to target watchlist"}
            className={`p-1.5 rounded-lg border transition-all ${
              isTarget
                ? "bg-amber-500/15 border-amber-500/30 text-amber-400 hover:bg-amber-500/25"
                : "bg-slate-800/50 border-slate-700/40 text-slate-400 hover:text-amber-400 hover:border-slate-600"
            }`}
          >
            <Star className={`w-4 h-4 ${isTarget ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Location & Aliases */}
        <div className="flex flex-wrap items-center gap-2 mb-3.5 text-xs text-slate-400">
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
            <span className="line-clamp-1">
              {company.primaryLocations.slice(0, 3).join(", ")}
            </span>
          </div>

          {company.aliases.length > 1 && (
            <span className="text-[10px] text-slate-400 bg-slate-800/50 px-1.5 py-0.5 rounded border border-slate-700/40 line-clamp-1">
              aka {company.aliases[1]}
            </span>
          )}
        </div>

        {/* Status Row: Connection Pill & Active Jobs count */}
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 mb-3.5">
          {/* Connection Status */}
          {isConnected ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE ATS ({company.connection.atsType})</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-medium text-sky-400">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>OFFICIAL CAREERS</span>
            </div>
          )}

          {/* Active Job Count from PostgreSQL */}
          <div className="flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-slate-500" />
            <span
              className={`text-xs font-bold ${
                company.activeJobsCount > 0 ? "text-emerald-300" : "text-slate-400"
              }`}
            >
              {company.activeJobsCount} Active Jobs
            </span>
          </div>
        </div>

        {/* Refresh Notification Banner */}
        {refreshMessage && (
          <div className="mb-3 text-[11px] text-center py-1 px-2 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 animate-in fade-in">
            {refreshMessage}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {/* View Jobs Button */}
          <Link
            href={`/companies/${company.slug}`}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-colors"
          >
            <span>View Jobs</span>
          </Link>

          {/* Refresh / Probe Button */}
          <button
            onClick={handleRefreshClick}
            disabled={isRefreshing}
            title={isConnected ? "Run live ATS sync" : "Open official careers portal"}
            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/50 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-brand-400" : ""}`} />
            <span className="hidden sm:inline">{isConnected ? "Refresh" : "Check"}</span>
          </button>
        </div>

        {/* Official Careers Page Link */}
        <a
          href={company.careerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-brand-300 transition-colors"
          title="Open official career page"
        >
          <span>Careers</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
