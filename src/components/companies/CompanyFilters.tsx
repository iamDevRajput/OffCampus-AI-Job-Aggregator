"use client";

import React from "react";
import { Search, SlidersHorizontal, Star, Building2, CheckCircle2, Globe, Briefcase } from "lucide-react";

interface CompanyFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export const CompanyFilters: React.FC<CompanyFiltersProps> = ({
  search,
  onSearchChange,
  activeFilter,
  onFilterChange,
  sortBy,
  onSortChange,
}) => {
  const filterPills = [
    { id: "ALL", label: "All Companies", icon: Building2 },
    { id: "TARGET", label: "Target Watchlist", icon: Star },
    { id: "LIVE ATS", label: "Live ATS Connected", icon: CheckCircle2, color: "text-emerald-400" },
    { id: "EXTERNAL", label: "External Portals", icon: Globe, color: "text-sky-400" },
    { id: "HAS_ACTIVE_JOBS", label: "Has Active Jobs", icon: Briefcase },
    { id: "NO_ACTIVE_JOBS", label: "No Active Jobs", icon: Building2 },
  ];

  const sortOptions = [
    { id: "A-Z", label: "Company Name (A-Z)" },
    { id: "ACTIVE JOBS", label: "Active Jobs (High to Low)" },
    { id: "LATEST JOB", label: "Latest Updated" },
    { id: "TARGET PRIORITY", label: "Target Watchlist First" },
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Search Input & Sort Dropdown */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search 183 companies by name, alias, industry, or location..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-slate-500 hidden sm:inline" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full sm:w-auto px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs font-medium text-slate-200 focus:outline-none focus:border-brand-500"
          >
            {sortOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                Sort: {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Tabs / Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {filterPills.map((pill) => {
          const isActive = activeFilter === pill.id;
          const Icon = pill.icon;

          return (
            <button
              key={pill.id}
              onClick={() => onFilterChange(pill.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all border ${
                isActive
                  ? "bg-brand-600/20 text-brand-300 border-brand-500/40 shadow-sm"
                  : "bg-slate-900/50 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${pill.color || ""}`} />
              <span>{pill.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
