"use client";

import React from "react";
import { ExternalLink, Check, Copy, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PlatformConfig, PlatformSearchSummary } from "@/services/platform-search/types";

interface PlatformCardProps {
  config: PlatformConfig;
  summary?: PlatformSearchSummary;
  onSelectQuery: (query: string) => void;
  onOpenSearch: (url: string) => void;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({
  config,
  summary,
  onSelectQuery,
  onOpenSearch,
}) => {
  const [copied, setCopied] = React.useState(false);

  const searchUrl = summary?.searchUrl || config.homepageUrl;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(searchUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = () => {
    switch (config.mode) {
      case "LIVE_INTEGRATION":
        return {
          label: "LIVE INTEGRATION",
          style: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
          dot: "bg-emerald-400 animate-pulse",
        };
      case "PUBLIC_FEED":
        return {
          label: "PUBLIC FEED",
          style: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
          dot: "bg-cyan-400",
        };
      case "EXTERNAL_SEARCH":
        return {
          label: "EXTERNAL SEARCH",
          style: "bg-amber-500/15 text-amber-400 border-amber-500/30",
          dot: "bg-amber-400",
        };
      default:
        return {
          label: "MANUAL SEARCH",
          style: "bg-slate-700/50 text-slate-400 border-slate-600/30",
          dot: "bg-slate-400",
        };
    }
  };

  const status = getStatusBadge();

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700/80 transition-all hover:shadow-lg group">
      {/* Header with Logo, Title, and Mode Badge */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${config.logoColor} flex items-center justify-center font-bold text-white shadow-md text-sm`}
            >
              {config.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100 group-hover:text-brand-300 transition-colors">
                {config.name}
              </h3>
              <p className="text-[11px] text-slate-400 line-clamp-1">{config.tagline}</p>
            </div>
          </div>

          <span
            className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider flex items-center gap-1.5 shrink-0 select-none ${status.style}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            <span>{status.label}</span>
          </span>
        </div>

        {/* Feature Tags */}
        <div className="flex flex-wrap gap-1 mt-2.5 mb-3">
          {config.features.slice(0, 2).map((feat, i) => (
            <span
              key={i}
              className="text-[10px] px-2 py-0.5 rounded bg-slate-900/90 text-slate-400 border border-slate-800/80"
            >
              ✓ {feat}
            </span>
          ))}
        </div>

        {/* Recommended Queries Pills */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Recommended Placement Queries:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {config.defaultQueries.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => onSelectQuery(q)}
                className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-900 text-slate-300 hover:text-white hover:bg-brand-600/30 hover:border-brand-500/40 border border-slate-700/60 transition-all text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer / Launch Action */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="text-[11px] font-medium text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
          title="Copy direct search URL"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? "Copied" : "Copy URL"}</span>
        </button>

        <Button
          size="sm"
          onClick={() => onOpenSearch(searchUrl)}
          className="text-xs font-bold px-3 py-1.5 group-hover:shadow-md group-hover:shadow-brand-500/20"
        >
          <span>Search {config.name}</span>
          <ExternalLink className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </div>
  );
};
