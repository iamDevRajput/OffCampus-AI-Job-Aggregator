"use client";

import React, { useState, useEffect, useCallback } from "react";
import { JobCard, JobCardData } from "@/components/dashboard/JobCard";
import { JobFilters, FiltersState } from "@/components/dashboard/JobFilters";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { JobDetailModal } from "@/components/dashboard/JobDetailModal";
import { Button } from "@/components/ui/Button";
import { Sparkles, RefreshCw, Briefcase, Plus, Filter, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [jobs, setJobs] = useState<JobCardData[]>([]);
  const [stats, setStats] = useState({
    totalActiveJobs: 0,
    highMatchCount: 0,
    priorityCompanyCount: 0,
    savedCount: 0,
    appliedCount: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalCount: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobCardData | null>(null);

  const [filters, setFilters] = useState<FiltersState>({
    search: "",
    role: "",
    workMode: "ALL",
    employmentType: "ALL",
    sourceType: "ALL",
    priorityOnly: false,
    minSalary: "",
    sort: "best-match",
  });

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.role) params.set("role", filters.role);
      if (filters.workMode && filters.workMode !== "ALL") params.set("workMode", filters.workMode);
      if (filters.employmentType && filters.employmentType !== "ALL") params.set("employmentType", filters.employmentType);
      if (filters.sourceType && filters.sourceType !== "ALL") params.set("sourceType", filters.sourceType);
      if (filters.priorityOnly) params.set("priorityOnly", "true");
      if (filters.minSalary) params.set("minSalary", filters.minSalary);
      if (filters.sort) params.set("sort", filters.sort);
      params.set("page", String(pagination.page));
      params.set("limit", "20");
      params.set("status", "ACTIVE");

      const [jobsRes, statsRes] = await Promise.all([
        fetch(`/api/jobs?${params.toString()}`),
        fetch("/api/dashboard/stats"),
      ]);

      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobs(jobsData.jobs || []);
        if (jobsData.pagination) {
          setPagination(jobsData.pagination);
        }
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      console.error("Error fetching jobs feed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.page]);

  useEffect(() => {
    fetchJobs();

    const interval = setInterval(fetchJobs, 30000);
    return () => clearInterval(interval);
  }, [fetchJobs]);

  const handleStatusChange = (jobId: string, newStatus: string | null) => {
    setJobs((prev) =>
      prev
        .map((j) => (j.id === jobId ? { ...j, userStatus: newStatus as any } : j))
        .filter((j) => newStatus !== "IGNORED")
    );
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      role: "",
      workMode: "ALL",
      employmentType: "ALL",
      sourceType: "ALL",
      priorityOnly: false,
      minSalary: "",
      sort: "best-match",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Feed Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Verified Off-Campus Tech Feed</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 font-medium">
              Ranked by AI Match
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated from Greenhouse, Lever, Ashby, SmartRecruiters, Recruitee, and verified public tech career feeds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchJobs}
            isLoading={isLoading}
            className="text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh Feed</span>
          </Button>

          <Link href="/watchlist">
            <Button size="sm" variant="secondary" className="text-xs">
              <Plus className="w-3.5 h-3.5" />
              <span>Add Dream Company</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsOverview stats={stats} />

      {/* Filter and Search Bar */}
      <JobFilters
        filters={filters}
        totalFound={pagination.totalCount}
        onChange={(newFilters) => {
          setFilters(newFilters);
          setPagination((prev) => ({ ...prev, page: 1 }));
        }}
        onReset={handleResetFilters}
      />

      {/* Job Cards Stream */}
      {isLoading && jobs.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="glass-card rounded-xl p-5 border border-slate-800 animate-pulse h-48 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                <div className="h-6 bg-slate-850 rounded w-3/4"></div>
                <div className="h-4 bg-slate-800 rounded w-1/2"></div>
              </div>
              <div className="h-8 bg-slate-800/60 rounded"></div>
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-panel p-12 rounded-xl border border-slate-800 text-center space-y-4">
          <Briefcase className="w-12 h-12 mx-auto text-slate-600" />
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-200">No matching job openings found</h3>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search query, removing filter restrictions, or running the ingestion adapter.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={handleResetFilters}>
              Clear All Filters
            </Button>
            <Link href="/sources">
              <Button size="sm">Go to Ingestion Console</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onStatusChange={handleStatusChange}
                onSelectDetail={(j) => setSelectedJob(j)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 glass-panel rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400">
                Page <span className="text-slate-200 font-bold">{pagination.page}</span> of{" "}
                <span className="text-slate-200 font-bold">{pagination.totalPages}</span> ({pagination.totalCount.toLocaleString()} total jobs)
              </span>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pagination.page <= 1}
                  onClick={() => setPagination((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  className="text-xs px-3"
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                  Previous
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPagination((prev) => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                  className="text-xs px-3"
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Job Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
