"use client";

import React from "react";
import { ExternalLink, Sparkles, MapPin, Briefcase, Clock, Tag, Building2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PlatformSearchResultItem } from "@/services/platform-search/types";
import { formatTimeAgo } from "@/lib/utils";

interface LiveResultsListProps {
  results: PlatformSearchResultItem[];
  isLoading: boolean;
}

export const LiveResultsList: React.FC<LiveResultsListProps> = ({ results, isLoading }) => {
  if (isLoading && results.length === 0) {
    return (
      <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center space-y-3 animate-pulse">
        <Sparkles className="w-8 h-8 text-brand-400 animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Querying live developer hiring platforms & open repositories...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <span>Live Developer Opportunities Discovered</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
              {results.length} Genuine Live Postings
            </span>
          </h3>
        </div>
        <span className="text-[11px] text-slate-400">
          Source: Verified Live APIs & Open Repositories
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((item) => (
          <div
            key={item.id}
            className="glass-card rounded-xl p-5 border border-slate-800 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all hover:shadow-lg"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-semibold text-brand-400 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    {item.company}
                  </span>
                  <h4 className="font-bold text-sm text-slate-100 line-clamp-2 mt-0.5">
                    {item.title}
                  </h4>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700 shrink-0">
                  {item.platformName}
                </span>
              </div>

              {item.description && (
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
              )}

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {item.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-900/90 text-slate-400 border border-slate-800"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                {item.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    {item.location}
                  </span>
                )}
                {item.postedAt && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {formatTimeAgo(item.postedAt)}
                  </span>
                )}
              </div>

              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
              >
                <span>View on {item.platformName}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
