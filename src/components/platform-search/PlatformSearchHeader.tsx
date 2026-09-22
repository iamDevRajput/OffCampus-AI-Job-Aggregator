"use client";

import React from "react";
import { Search, MapPin, Briefcase, Sparkles, ExternalLink, RefreshCw, Compass, Globe, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SearchFilters, ExperienceFilter, WorkModeFilter } from "@/services/platform-search/types";

interface PlatformSearchHeaderProps {
  filters: SearchFilters;
  isLoading: boolean;
  lastRefreshed: string;
  onFilterChange: (newFilters: SearchFilters) => void;
  onSearchAll: () => void;
  onOpenAllTabs: () => void;
}

const PRESET_QUERIES = [
  "Software Engineer Fresher",
  "SDE-1",
  "Full Stack Developer",
  "React Developer",
  "Backend Developer",
  "AI / ML Engineer",
  "SDE Intern",
];

const LOCATIONS = [
  "India",
  "Remote",
  "Bengaluru",
  "Hyderabad",
  "Pune",
  "Noida",
  "Delhi NCR",
  "Gurgaon",
  "Mumbai",
  "Chennai",
  "Any",
];

const EXPERIENCES: { label: string; value: ExperienceFilter }[] = [
  { label: "Fresher / 0 Yrs", value: "FRESHER" },
  { label: "0 - 1 Years", value: "ZERO_TO_ONE" },
  { label: "0 - 2 Years", value: "ZERO_TO_TWO" },
  { label: "1 - 2 Years", value: "ONE_TO_TWO" },
  { label: "Any Experience", value: "ANY" },
];

const WORK_MODES: { label: string; value: WorkModeFilter }[] = [
  { label: "All Modes", value: "ALL" },
  { label: "Remote", value: "REMOTE" },
  { label: "Hybrid", value: "HYBRID" },
  { label: "Onsite", value: "ONSITE" },
];

export const PlatformSearchHeader: React.FC<PlatformSearchHeaderProps> = ({
  filters,
  isLoading,
  lastRefreshed,
  onFilterChange,
  onSearchAll,
  onOpenAllTabs,
}) => {
  const handleQueryChange = (q: string) => {
    onFilterChange({ ...filters, query: q });
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
      {/* Top Banner / Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Placement Search Center</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                10 Platforms
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Query LinkedIn, Naukri, Indeed, Unstop, Cutshort, Hirist, Wellfound, Instahyre, Foundit & GitHub simultaneously.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto text-xs">
          <span className="text-slate-400 text-[11px]">
            Last refreshed: <span className="text-slate-200 font-semibold">{lastRefreshed}</span>
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={onSearchAll}
            isLoading={isLoading}
            className="text-xs h-8 px-2.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh All</span>
          </Button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearchAll()}
            placeholder="Search role e.g. Software Engineer Fresher, React Developer, SDE-1, AI/LLM..."
            className="w-full bg-slate-900/90 text-sm text-slate-100 placeholder-slate-500 rounded-xl border border-slate-700/80 pl-10 pr-4 py-2.5 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-inner"
          />
        </div>

        <Button
          size="md"
          onClick={onSearchAll}
          isLoading={isLoading}
          className="w-full md:w-auto font-bold text-xs shrink-0 px-5 shadow-lg shadow-brand-500/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Search All Platforms</span>
        </Button>

        <Button
          size="md"
          variant="secondary"
          onClick={onOpenAllTabs}
          className="w-full md:w-auto font-medium text-xs shrink-0 px-4 border border-slate-700 hover:border-slate-600"
          title="Opens all 10 platform search pages in separate browser tabs"
        >
          <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
          <span>Open All (10 Tabs)</span>
        </Button>
      </div>

      {/* Preset Query Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3 text-slate-500" />
          Placement Queries:
        </span>
        {PRESET_QUERIES.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => handleQueryChange(q)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              filters.query.toLowerCase() === q.toLowerCase()
                ? "bg-brand-500 text-white shadow-md shadow-brand-500/25"
                : "bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800"
            }`}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Filters Row: Location, Experience, Work Mode */}
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/80 text-xs">
        {/* Location Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <select
            value={filters.location}
            onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
            className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc} className="bg-slate-900 text-slate-200">
                📍 {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Experience Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-slate-300">
          <Briefcase className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <select
            value={filters.experience}
            onChange={(e) => onFilterChange({ ...filters, experience: e.target.value as ExperienceFilter })}
            className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer"
          >
            {EXPERIENCES.map((exp) => (
              <option key={exp.value} value={exp.value} className="bg-slate-900 text-slate-200">
                🎓 {exp.label}
              </option>
            ))}
          </select>
        </div>

        {/* Work Mode Toggle Pills */}
        <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-700/60">
          {WORK_MODES.map((wm) => (
            <button
              key={wm.value}
              type="button"
              onClick={() => onFilterChange({ ...filters, workMode: wm.value })}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                filters.workMode === wm.value
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {wm.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
