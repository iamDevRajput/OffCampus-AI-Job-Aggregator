"use client";

import React from "react";
import { Search, Filter, Sparkles, Building2, SlidersHorizontal, ArrowUpDown, Globe2 } from "lucide-react";
import { PREFERRED_ROLE_OPTIONS } from "@/lib/constants";

export interface FiltersState {
  search: string;
  role: string;
  workMode: string;
  employmentType: string;
  sourceType: string;
  priorityOnly: boolean;
  minSalary: string;
  sort: string;
}

interface JobFiltersProps {
  filters: FiltersState;
  totalFound?: number;
  onChange: (newFilters: FiltersState) => void;
  onReset: () => void;
}

export const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  totalFound,
  onChange,
  onReset,
}) => {
  const handleChange = (field: keyof FiltersState, value: any) => {
    onChange({
      ...filters,
      [field]: value,
    });
  };

  const workModes = [
    { label: "All Modes", value: "ALL" },
    { label: "Remote", value: "REMOTE" },
    { label: "Hybrid", value: "HYBRID" },
    { label: "Onsite", value: "ONSITE" },
  ];

  const sourceTypes = [
    { label: "All Sources", value: "ALL" },
    { label: "Greenhouse Boards", value: "GREENHOUSE" },
    { label: "Lever Postings", value: "LEVER" },
    { label: "Ashby Boards", value: "ASHBY" },
    { label: "SmartRecruiters", value: "SMART_RECRUITERS" },
    { label: "Recruitee Offers", value: "RECRUITEE" },
    { label: "Public Tech Feeds", value: "PUBLIC_FEED" },
  ];

  const employmentTypes = [
    { label: "All Job Types", value: "ALL" },
    { label: "Full Time (Fresher/SDE)", value: "FULL_TIME" },
    { label: "Internships", value: "INTERNSHIP" },
    { label: "Contract / Freelance", value: "CONTRACT" },
  ];

  const sortOptions = [
    { label: "Best AI Match %", value: "best-match" },
    { label: "Target Watchlist First", value: "priority-first" },
    { label: "Latest Discovered", value: "newest" },
    { label: "Highest Package (CTC)", value: "highest-salary" },
    { label: "Application Deadline", value: "deadline" },
  ];

  const salaryOptions = [
    { label: "Any CTC", value: "" },
    { label: "₹8+ LPA", value: "8" },
    { label: "₹12+ LPA", value: "12" },
    { label: "₹18+ LPA", value: "18" },
    { label: "₹24+ LPA", value: "24" },
  ];

  return (
    <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3.5 mb-6">
      {/* Top Search & Primary Filters */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            placeholder="Search by role title, company (Stripe, Bosch, OpenAI), skills (React, Python), or location..."
            className="w-full bg-slate-900/90 text-sm text-slate-100 placeholder-slate-500 rounded-lg border border-slate-700/80 pl-10 pr-4 py-2.5 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>

        {/* Priority Only Toggle */}
        <button
          onClick={() => handleChange("priorityOnly", !filters.priorityOnly)}
          className={`px-3.5 py-2.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-2 shrink-0 select-none ${
            filters.priorityOnly
              ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/10"
              : "bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200"
          }`}
        >
          <Building2 className="w-4 h-4 text-amber-400" />
          <span>Dream Companies</span>
        </button>

        {/* Sort Dropdown */}
        <div className="relative shrink-0 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.sort}
              onChange={(e) => handleChange("sort", e.target.value)}
              className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Secondary Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Work Mode Selector */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-700/60">
            {workModes.map((wm) => (
              <button
                key={wm.value}
                onClick={() => handleChange("workMode", wm.value)}
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

          {/* Source Platform Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
            <Globe2 className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.sourceType}
              onChange={(e) => handleChange("sourceType", e.target.value)}
              className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer"
            >
              {sourceTypes.map((st) => (
                <option key={st.value} value={st.value} className="bg-slate-900 text-slate-200">
                  {st.label}
                </option>
              ))}
            </select>
          </div>

          {/* Employment Type Filter */}
          <select
            value={filters.employmentType}
            onChange={(e) => handleChange("employmentType", e.target.value)}
            className="bg-slate-900 text-slate-300 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-brand-500"
          >
            {employmentTypes.map((et) => (
              <option key={et.value} value={et.value} className="bg-slate-900 text-slate-200">
                {et.label}
              </option>
            ))}
          </select>

          {/* Role Filter */}
          <select
            value={filters.role}
            onChange={(e) => handleChange("role", e.target.value)}
            className="bg-slate-900 text-slate-300 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-brand-500"
          >
            <option value="">All Engineering Roles</option>
            {PREFERRED_ROLE_OPTIONS.map((r) => (
              <option key={r} value={r} className="bg-slate-900 text-slate-200">
                {r}
              </option>
            ))}
          </select>

          {/* Min CTC Filter */}
          <select
            value={filters.minSalary}
            onChange={(e) => handleChange("minSalary", e.target.value)}
            className="bg-slate-900 text-slate-300 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-brand-500"
          >
            {salaryOptions.map((s) => (
              <option key={s.value} value={s.value} className="bg-slate-900 text-slate-200">
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          {typeof totalFound === "number" && (
            <span className="text-[11px] font-medium text-slate-400">
              Showing <span className="text-slate-200 font-bold">{totalFound.toLocaleString()}</span> jobs
            </span>
          )}

          {/* Reset Filter Button */}
          {(filters.search ||
            filters.role ||
            filters.workMode !== "ALL" ||
            filters.employmentType !== "ALL" ||
            filters.sourceType !== "ALL" ||
            filters.priorityOnly ||
            filters.minSalary) && (
            <button
              onClick={onReset}
              className="text-[11px] font-semibold text-brand-400 hover:text-brand-300 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
