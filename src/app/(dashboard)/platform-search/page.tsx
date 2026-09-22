"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PlatformSearchHeader } from "@/components/platform-search/PlatformSearchHeader";
import { PlatformCard } from "@/components/platform-search/PlatformCard";
import { LiveResultsList } from "@/components/platform-search/LiveResultsList";
import {
  PlatformConfig,
  PlatformSearchSummary,
  PlatformSearchResultItem,
  SearchFilters,
} from "@/services/platform-search/types";
import { ShieldCheck, Compass, Info, Check, Sparkles, ExternalLink } from "lucide-react";

export default function PlatformSearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "Software Engineer Fresher",
    location: "India",
    experience: "FRESHER",
    workMode: "ALL",
  });

  const [configs, setConfigs] = useState<PlatformConfig[]>([]);
  const [summaries, setSummaries] = useState<PlatformSearchSummary[]>([]);
  const [liveResults, setLiveResults] = useState<PlatformSearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState("Just now");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchPlatformSearches = useCallback(async (currentFilters: SearchFilters) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/platform-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentFilters),
      });

      if (res.ok) {
        const data = await res.json();
        setConfigs(data.configs || []);
        setSummaries(data.summaries || []);
        setLiveResults(data.liveResults || []);
        setLastRefreshed(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " IST");
      }
    } catch (err) {
      console.error("Error executing platform search:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlatformSearches(filters);
  }, []);

  const handleSearchAll = () => {
    fetchPlatformSearches(filters);
  };

  const handleSelectQuery = (query: string) => {
    const updated = { ...filters, query };
    setFilters(updated);
    fetchPlatformSearches(updated);
  };

  const handleOpenSearch = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleOpenAllTabs = () => {
    if (summaries.length === 0) return;

    let openedCount = 0;
    summaries.forEach((s) => {
      if (s.searchUrl) {
        window.open(s.searchUrl, "_blank", "noopener,noreferrer");
        openedCount++;
      }
    });

    setToastMessage(`Opened ${openedCount} platform search tabs in your browser! (Allow pop-ups if prompted)`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in shadow-lg">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header & Search Form */}
      <PlatformSearchHeader
        filters={filters}
        isLoading={isLoading}
        lastRefreshed={lastRefreshed}
        onFilterChange={setFilters}
        onSearchAll={handleSearchAll}
        onOpenAllTabs={handleOpenAllTabs}
      />

      {/* Compliance & Separation of Concerns Banner */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 bg-slate-950/50 flex items-start gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-slate-100 flex items-center gap-2">
            <span>Genuine External Discovery & Zero-Scraping Compliance</span>
          </h4>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Platform Search generates optimized, direct external search queries for third-party job platforms and queries official live APIs (e.g. GitHub). Results are kept independent from our internal database of 6,320+ verified ATS postings.
          </p>
        </div>
      </div>

      {/* Live Discovered Results from Supported APIs */}
      <LiveResultsList results={liveResults} isLoading={isLoading} />

      {/* 10 Platform Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Compass className="w-4 h-4 text-brand-400" />
            <span>Target Platform Hub (10 Platforms)</span>
          </h3>
          <span className="text-[11px] text-slate-500">
            Click any query or button to launch fresh search
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {configs.map((config) => {
            const summary = summaries.find((s) => s.platformId === config.id);
            return (
              <PlatformCard
                key={config.id}
                config={config}
                summary={summary}
                onSelectQuery={handleSelectQuery}
                onOpenSearch={handleOpenSearch}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
