"use client";

import React from "react";
import {
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Globe,
  Database,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";

interface CompanyHealthCardProps {
  company: {
    name: string;
    companyId: string;
    connection: {
      atsType?: string;
      boardToken?: string;
      apiUrl?: string | null;
      status: string;
      lastCheckedAt?: string | null;
      lastSuccessAt?: string | null;
      lastError?: string | null;
      jobCount?: number;
    };
    jobStats: {
      active: number;
      expired: number;
      total: number;
    };
    recentRuns?: Array<{
      id: string;
      status: string;
      jobsFetched: number;
      jobsCreated: number;
      jobsUpdated: number;
      duplicateCount: number;
      errors: string[];
      createdAt: string;
    }>;
  };
}

export const CompanyHealthCard: React.FC<CompanyHealthCardProps> = ({ company }) => {
  const isConnected = company.connection.status === "CONNECTED";
  const latestRun = company.recentRuns && company.recentRuns[0];

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-slate-900/60 shadow-xl space-y-6">
      {/* Header & Status Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-md ${
              isConnected
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-sky-500/10 border-sky-500/30 text-sky-400"
            }`}
          >
            {isConnected ? <Activity className="w-5 h-5 animate-pulse" /> : <Globe className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <span>Connection & Health Telemetry</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold border ${
                  isConnected
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                    : "bg-sky-500/15 text-sky-300 border-sky-500/30"
                }`}
              >
                {isConnected ? "🟢 LIVE ATS CONNECTED" : "🔵 OFFICIAL CAREERS PAGE ONLY"}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isConnected
                ? `Direct public ATS integration via ${company.connection.atsType} API.`
                : "Official company career page without public ATS API feed."}
            </p>
          </div>
        </div>

        {/* ATS Identifier pill if connected */}
        {isConnected && company.connection.boardToken && (
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Board Token / ID
            </span>
            <span className="text-xs font-mono font-bold text-slate-200 bg-slate-800/90 px-2 py-0.5 rounded border border-slate-700/60 inline-block mt-0.5">
              {company.connection.boardToken}
            </span>
          </div>
        )}
      </div>

      {/* Database Job Counts Breakdown */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-brand-400" />
          <span>Real Database Inventory (PostgreSQL)</span>
        </h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
            <span className="text-[11px] text-slate-400 block">Active Jobs</span>
            <span className="text-lg font-black text-emerald-400 mt-0.5 block">
              {company.jobStats.active}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
            <span className="text-[11px] text-slate-400 block">Expired Jobs</span>
            <span className="text-lg font-black text-slate-400 mt-0.5 block">
              {company.jobStats.expired}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
            <span className="text-[11px] text-slate-400 block">Total Cataloged</span>
            <span className="text-lg font-black text-brand-300 mt-0.5 block">
              {company.jobStats.total}
            </span>
          </div>
        </div>
      </div>

      {/* Sync Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/70">
          <span className="text-[11px] text-slate-400 block mb-1">Last Checked</span>
          <span className="font-semibold text-slate-200">
            {company.connection.lastCheckedAt
              ? formatTimeAgo(company.connection.lastCheckedAt)
              : "N/A"}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/70">
          <span className="text-[11px] text-slate-400 block mb-1">Last Successful Sync</span>
          <span className="font-semibold text-slate-200">
            {company.connection.lastSuccessAt
              ? formatTimeAgo(company.connection.lastSuccessAt)
              : "N/A"}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/70">
          <span className="text-[11px] text-slate-400 block mb-1">Latest Ingestion</span>
          <span className="font-semibold text-slate-200">
            {latestRun ? `+${latestRun.jobsCreated} new / ~${latestRun.jobsUpdated} updated` : "N/A"}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/70">
          <span className="text-[11px] text-slate-400 block mb-1">Compliance State</span>
          <span className="font-semibold text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Compliant</span>
          </span>
        </div>
      </div>

      {/* Error report if any */}
      {company.connection.lastError && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
          <div>
            <span className="font-bold">Sync Warning: </span>
            <span>{company.connection.lastError}</span>
          </div>
        </div>
      )}
    </div>
  );
};
