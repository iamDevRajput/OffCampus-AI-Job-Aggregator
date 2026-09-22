"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CompanyCard, CompanyCardData } from "@/components/companies/CompanyCard";
import { CompanyFilters } from "@/components/companies/CompanyFilters";
import {
  Building2,
  CheckCircle2,
  Globe,
  Briefcase,
  Star,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface StatsData {
  totalCompanies: number;
  connectedCompanies: number;
  externalCompanies: number;
  withJobsCompanies: number;
  targetCount: number;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyCardData[]>([]);
  const [stats, setStats] = useState<StatsData>({
    totalCompanies: 183,
    connectedCompanies: 6,
    externalCompanies: 177,
    withJobsCompanies: 8,
    targetCount: 8,
  });
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("A-Z");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCompanies = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        filter: activeFilter,
        sort: sortBy,
        page: page.toString(),
        limit: "24",
      });

      const res = await fetch(`/api/companies?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCompanies(data.companies || []);
        if (data.stats) setStats(data.stats);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
          setTotalCount(data.pagination.totalCount || 0);
        }
      }
    } catch (err) {
      console.error("Failed to load companies:", err);
    } finally {
      setIsLoading(false);
    }
  }, [search, activeFilter, sortBy, page]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleTargetToggle = (companyId: string, isTarget: boolean) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === companyId ? { ...c, isTarget } : c))
    );
    setStats((prev) => ({
      ...prev,
      targetCount: isTarget ? prev.targetCount + 1 : Math.max(0, prev.targetCount - 1),
    }));
  };

  const handleRefresh = (companyId: string) => {
    fetchCompanies();
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Brand Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20 text-xs font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Authoritative Employer Hub</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            COMPANY CAREERS
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Discover jobs directly from company career systems.
          </p>
        </div>
      </div>

      {/* 5 Stats Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="glass-card rounded-xl p-4 border border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Building2 className="w-4 h-4 text-brand-400" />
            <span>Directory Total</span>
          </div>
          <div className="text-xl font-black text-white">{stats.totalCompanies}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Authoritative registry</div>
        </div>

        <div className="glass-card rounded-xl p-4 border border-emerald-500/20 bg-emerald-950/20">
          <div className="flex items-center gap-2 text-emerald-400 text-xs mb-1 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Connected ATS</span>
          </div>
          <div className="text-xl font-black text-emerald-300">{stats.connectedCompanies}</div>
          <div className="text-[11px] text-emerald-400/80 mt-0.5">Live API sync</div>
        </div>

        <div className="glass-card rounded-xl p-4 border border-sky-500/20 bg-sky-950/20">
          <div className="flex items-center gap-2 text-sky-400 text-xs mb-1 font-semibold">
            <Globe className="w-4 h-4" />
            <span>External Portals</span>
          </div>
          <div className="text-xl font-black text-sky-300">{stats.externalCompanies}</div>
          <div className="text-[11px] text-sky-400/80 mt-0.5">Direct career links</div>
        </div>

        <div className="glass-card rounded-xl p-4 border border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <span>With Active Jobs</span>
          </div>
          <div className="text-xl font-black text-white">{stats.withJobsCompanies}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Database indexed</div>
        </div>

        <div className="glass-card rounded-xl p-4 border border-amber-500/20 bg-amber-950/20">
          <div className="flex items-center gap-2 text-amber-400 text-xs mb-1 font-semibold">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>Target Watchlist</span>
          </div>
          <div className="text-xl font-black text-amber-300">{stats.targetCount}</div>
          <div className="text-[11px] text-amber-400/80 mt-0.5">Priority companies</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <CompanyFilters
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        activeFilter={activeFilter}
        onFilterChange={(v) => {
          setActiveFilter(v);
          setPage(1);
        }}
        sortBy={sortBy}
        onSortChange={(v) => {
          setSortBy(v);
          setPage(1);
        }}
      />

      {/* Company Grid */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Loading company registry...</p>
        </div>
      ) : companies.length === 0 ? (
        <div className="py-16 text-center glass-card rounded-2xl border border-slate-800 p-8 space-y-3">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-bold text-slate-200">No companies found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your search query or switching filters to see more results from the 183-company registry.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setActiveFilter("ALL");
              setPage(1);
            }}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onTargetToggle={handleTargetToggle}
                onRefresh={handleRefresh}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-800 text-xs text-slate-400">
              <div>
                Showing page <span className="font-bold text-white">{page}</span> of{" "}
                <span className="font-bold text-white">{totalPages}</span> ({totalCount} total companies)
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
