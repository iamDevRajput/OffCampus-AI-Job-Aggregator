"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { JobCard, JobCardData } from "@/components/dashboard/JobCard";
import { JobDetailModal } from "@/components/dashboard/JobDetailModal";
import { Bookmark, CheckCircle2, EyeOff, Sparkles, Briefcase } from "lucide-react";
import Link from "next/link";

export default function SavedJobsPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab")?.toUpperCase() || "SAVED";

  const [activeTab, setActiveTab] = useState<"SAVED" | "APPLIED" | "IGNORED">(
    initialTab === "APPLIED" ? "APPLIED" : initialTab === "IGNORED" ? "IGNORED" : "SAVED"
  );
  const [jobs, setJobs] = useState<JobCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobCardData | null>(null);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/jobs?status=${activeTab}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error("Error fetching saved jobs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const tab = searchParams.get("tab")?.toUpperCase();
    if (tab === "APPLIED") setActiveTab("APPLIED");
    else if (tab === "IGNORED") setActiveTab("IGNORED");
    else if (tab === "SAVED") setActiveTab("SAVED");
  }, [searchParams]);

  useEffect(() => {
    fetchJobs();
  }, [activeTab]);

  const handleStatusChange = (jobId: string, newStatus: string | null) => {
    // If status changed away from current tab, remove it from list
    if (newStatus !== activeTab) {
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>Application Tracker & Pipeline</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage saved opportunities, track applied companies, and manage hidden listings.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-900/80 rounded-xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab("SAVED")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "SAVED"
              ? "bg-brand-600 text-white shadow-md shadow-brand-600/25"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved Jobs</span>
        </button>

        <button
          onClick={() => setActiveTab("APPLIED")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "APPLIED"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Applied ({jobs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("IGNORED")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "IGNORED"
              ? "bg-slate-700 text-slate-200 shadow-md"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <EyeOff className="w-3.5 h-3.5" />
          <span>Ignored</span>
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400">
          <Sparkles className="w-8 h-8 animate-spin mx-auto mb-2 text-brand-400" />
          <p className="text-xs">Loading application list...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-panel p-12 rounded-xl border border-slate-800 text-center space-y-3">
          <Briefcase className="w-10 h-10 mx-auto text-slate-600" />
          <p className="text-sm font-semibold text-slate-300">
            No {activeTab.toLowerCase()} jobs yet
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You can bookmark jobs, mark them as applied, or hide unwanted roles directly from your job feed.
          </p>
          <Link href="/" className="inline-block pt-2">
            <span className="text-xs font-semibold text-brand-400 hover:text-brand-300">
              ← Return to Main Job Feed
            </span>
          </Link>
        </div>
      ) : (
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
      )}

      {/* Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
