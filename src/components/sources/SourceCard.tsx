"use client";

import React, { useState } from "react";
import { Radio, RefreshCw, CheckCircle2, AlertTriangle, Globe, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatTimeAgo } from "@/lib/utils";

export interface SourceItem {
  id: string;
  name: string;
  type: string;
  baseUrl?: string | null;
  apiUrl?: string | null;
  fetchFrequencyMinutes: number;
  isActive: boolean;
  lastFetchedAt?: string | null;
  lastError?: string | null;
  _count?: { jobs: number };
}

interface SourceCardProps {
  source: SourceItem;
  onRunSource: (id: string) => Promise<void>;
  onToggleActive: (id: string, currentState: boolean) => Promise<void>;
}

export const SourceCard: React.FC<SourceCardProps> = ({
  source,
  onRunSource,
  onToggleActive,
}) => {
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    try {
      await onRunSource(source.id);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="glass-card rounded-xl p-5 border border-slate-800 flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-brand-500/15 border border-brand-500/30 text-brand-400">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-100">{source.name}</h4>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                {source.type}
              </span>
            </div>
          </div>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
              source.isActive
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
          >
            {source.isActive ? "Active" : "Disabled"}
          </span>
        </div>

        {source.apiUrl && (
          <p className="text-[11px] text-slate-400 font-mono truncate bg-slate-950/60 p-2 rounded border border-slate-800/80 mb-2">
            {source.apiUrl}
          </p>
        )}

        {/* Health status & metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
          <div>
            <span className="text-slate-500 text-[10px] block">Jobs Ingested</span>
            <span className="font-bold text-emerald-400 text-sm">
              {source._count?.jobs ?? 0} jobs
            </span>
          </div>

          <div>
            <span className="text-slate-500 text-[10px] block">Last Sync</span>
            <span className="font-medium text-slate-300 text-xs">
              {formatTimeAgo(source.lastFetchedAt)}
            </span>
          </div>
        </div>

        {source.lastError && (
          <div className="mt-2 p-2 rounded bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-300 flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{source.lastError}</span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
        <button
          onClick={() => onToggleActive(source.id, source.isActive)}
          className="text-xs text-slate-400 hover:text-slate-200"
        >
          {source.isActive ? "Pause Fetching" : "Enable Fetching"}
        </button>

        <Button
          size="sm"
          variant="secondary"
          onClick={handleRun}
          isLoading={isRunning}
          className="text-xs"
        >
          <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
          <span>Run Fetch Now</span>
        </Button>
      </div>
    </div>
  );
};
