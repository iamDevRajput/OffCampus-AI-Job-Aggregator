"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Building2,
  ExternalLink,
  MapPin,
  RefreshCw,
  Star,
  ChevronLeft,
  Briefcase,
  Globe,
  SlidersHorizontal,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { JobCard, JobCardData } from "@/components/dashboard/JobCard";
import { CompanyHealthCard } from "@/components/companies/CompanyHealthCard";

interface CompanyDetailData {
  id: string;
  companyId: string;
  slug: string;
  name: string;
  careerUrl: string;
  officialWebsite?: string | null;
  industry: string;
  country: string;
  primaryLocations: string[];
  active: boolean;
  jobStats: {
    active: number;
    expired: number;
    total: number;
  };
  isTarget?: boolean;
  targetPriority?: string | null;
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
  aliases: string[];
  recentRuns?: any[];
}

export default function CompanyDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [company, setCompany] = useState<CompanyDetailData | null>(null);
  const [jobs, setJobs] = useState<JobCardData[]>([]);
  const [isLoadingCompany, setIsLoadingCompany] = useState(true);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);
  const [isTarget, setIsTarget] = useState(false);
  const [isUpdatingTarget, setIsUpdatingTarget] = useState(false);

  // Job filter states
  const [roleFilter, setRoleFilter] = useState("");
  const [workModeFilter, setWorkModeFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");

  const fetchCompanyDetails = useCallback(async () => {
    if (!slug) return;
    try {
      const res = await fetch(`/api/companies/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setCompany(data.company);
        setIsTarget(data.company.isTarget || false);
      }
    } catch (err) {
      console.error("Failed to load company detail:", err);
    } finally {
      setIsLoadingCompany(false);
    }
  }, [slug]);

  const fetchCompanyJobs = useCallback(async () => {
    if (!slug) return;
    setIsJobsLoading();
    try {
      const q = new URLSearchParams({
        role: roleFilter,
        workMode: workModeFilter,
        sort: sortBy,
        limit: "50",
      });
      const res = await fetch(`/api/companies/${slug}/jobs?${q.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error("Failed to load company jobs:", err);
    } finally {
      setIsLoadingJobs(false);
    }
  }, [slug, roleFilter, workModeFilter, sortBy]);

  function setIsJobsLoading() {
    setIsLoadingJobs(true);
  }

  useEffect(() => {
    fetchCompanyDetails();
  }, [fetchCompanyDetails]);

  useEffect(() => {
    fetchCompanyJobs();
  }, [fetchCompanyJobs]);

  const handleRefresh = async () => {
    if (!company) return;
    setIsRefreshing(true);
    setRefreshMessage(null);

    try {
      const res = await fetch(`/api/companies/${company.id}/refresh`, { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setRefreshMessage(`Successfully synced! Found ${data.summary?.newJobsCount || 0} new jobs.`);
        fetchCompanyDetails();
        fetchCompanyJobs();
      } else {
        setRefreshMessage(data.message || "Refresh completed");
      }
      setTimeout(() => setRefreshMessage(null), 4000);
    } catch {
      setRefreshMessage("Failed to refresh ATS jobs");
      setTimeout(() => setRefreshMessage(null), 4000);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleTargetToggle = async () => {
    if (!company) return;
    setIsUpdatingTarget(true);

    try {
      if (isTarget) {
        const res = await fetch(`/api/companies/${company.id}/target`, { method: "DELETE" });
        if (res.ok) setIsTarget(false);
      } else {
        const res = await fetch(`/api/companies/${company.id}/target`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priorityLevel: "HIGH" }),
        });
        if (res.ok) setIsTarget(true);
      }
    } catch (err) {
      console.error("Target toggle error:", err);
    } finally {
      setIsUpdatingTarget(false);
    }
  };

  if (isLoadingCompany) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-slate-400 font-medium">Loading company profile...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center py-20 space-y-4">
        <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
        <h2 className="text-xl font-bold text-white">Company not found</h2>
        <p className="text-xs text-slate-400">
          The requested company could not be located in our authoritative 183-company registry.
        </p>
        <Link
          href="/companies"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-600 text-xs font-semibold text-white"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Company Directory</span>
        </Link>
      </div>
    );
  }

  const isConnected = company.connection.status === "CONNECTED";
  const initials = company.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/companies" className="hover:text-brand-300 transition-colors flex items-center gap-1">
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Company Careers</span>
        </Link>
        <span>/</span>
        <span className="text-slate-200 font-medium">{company.name}</span>
      </div>

      {/* Hero Profile Banner */}
      <div className="glass-card rounded-2xl p-6 lg:p-8 border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            {/* Logo / Initials */}
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center font-black text-lg text-brand-300 shadow-xl shrink-0">
              {initials}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
                  {company.name}
                </h1>
                <span className="text-xs font-mono font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {company.companyId}
                </span>

                {isTarget && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>Target Watchlist</span>
                  </span>
                )}
              </div>

              {/* Industry, Country, Location */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="text-slate-300 font-medium">{company.industry}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{company.primaryLocations.join(", ")}</span>
                </span>
                <span>•</span>
                <span>{company.country}</span>
              </div>

              {/* Official Links */}
              <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                {company.officialWebsite && (
                  <a
                    href={company.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-slate-400 hover:text-brand-300 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Official Website</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                )}

                <a
                  href={company.careerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-300 hover:text-brand-300 font-semibold transition-colors"
                >
                  <Briefcase className="w-3.5 h-3.5 text-brand-400" />
                  <span>Official Careers Portal</span>
                  <ExternalLink className="w-3 h-3 text-brand-400" />
                </a>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isConnected
                  ? "bg-brand-600 hover:bg-brand-500 text-white border-brand-500 shadow-md shadow-brand-600/25 active:scale-95"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Syncing..." : isConnected ? "Refresh Jobs" : "Check ATS"}</span>
            </button>

            {/* Target Toggle */}
            <button
              onClick={handleTargetToggle}
              disabled={isUpdatingTarget}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isTarget
                  ? "bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500/25"
                  : "bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700"
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isTarget ? "fill-amber-400 text-amber-400" : ""}`} />
              <span>{isTarget ? "Watching Target" : "Add to Target"}</span>
            </button>

            {/* Open External Careers */}
            <a
              href={company.careerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
            >
              <span>Open Careers</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Refresh feedback alert */}
        {refreshMessage && (
          <div className="mt-4 p-2.5 rounded-xl bg-brand-500/20 text-brand-200 border border-brand-500/30 text-xs text-center font-medium animate-in fade-in">
            {refreshMessage}
          </div>
        )}
      </div>

      {/* Connection & Telemetry Card */}
      <CompanyHealthCard company={company} />

      {/* Real Jobs Section */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Active Openings at {company.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {jobs.length} Available
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Real jobs ingested into our internal database from verified career feeds.
            </p>
          </div>

          {/* Job Filter Controls */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <input
              type="text"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              placeholder="Filter by role / keyword..."
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
            />

            <select
              value={workModeFilter}
              onChange={(e) => setWorkModeFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="ALL">All Work Modes</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ONSITE">Onsite</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="newest">Newest First</option>
              <option value="best-match">Best AI Match</option>
              <option value="highest-salary">Highest Package</option>
            </select>
          </div>
        </div>

        {/* Jobs List */}
        {isLoadingJobs ? (
          <div className="py-16 text-center space-y-2">
            <div className="w-6 h-6 rounded-full border-2 border-brand-500 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading cataloged jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="glass-card rounded-2xl border border-slate-800 p-8 text-center space-y-4">
            <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="font-bold text-slate-200 text-sm">
              No active jobs currently in our aggregator for {company.name}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              We haven&apos;t indexed any active fresher/early-career openings for this company yet. You can visit their official career page directly or trigger a refresh if connected.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <a
                href={company.careerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors"
              >
                <span>Open Official Careers Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
