"use client";

import React, { useState } from "react";
import {
  Building2,
  MapPin,
  Clock,
  Briefcase,
  IndianRupee,
  Sparkles,
  ExternalLink,
  Bookmark,
  CheckCircle2,
  EyeOff,
  ChevronDown,
  Info,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatSalary, formatTimeAgo, formatDeadline, getMatchScoreColor } from "@/lib/utils";

export interface JobCardData {
  id: string;
  title: string;
  company: string;
  description: string;
  applyUrl: string;
  location: string;
  workMode: string;
  employmentType: string;
  minSalary?: number | null;
  maxSalary?: number | null;
  currency: string;
  salaryDisclosed: boolean;
  salaryRaw?: string | null;
  experienceMin?: number | null;
  experienceMax?: number | null;
  deadline?: string | Date | null;
  postedAt?: string | Date | null;
  isPriorityCompany: boolean;
  targetCompany?: {
    name: string;
    priorityLevel: string;
  } | null;
  source?: {
    name: string;
    type: string;
  } | null;
  skills: { id: string; name: string; category?: string }[];
  matchScore: number;
  matchReasons: string[];
  userStatus?: "SAVED" | "APPLIED" | "IGNORED" | null;
}

interface JobCardProps {
  job: JobCardData;
  onStatusChange?: (jobId: string, newStatus: string | null) => void;
  onSelectDetail?: (job: JobCardData) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onStatusChange,
  onSelectDetail,
}) => {
  const [currentStatus, setCurrentStatus] = useState(job.userStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showScoreDetails, setShowScoreDetails] = useState(false);

  const scoreColor = getMatchScoreColor(job.matchScore);
  const deadlineInfo = formatDeadline(job.deadline);

  const handleAction = async (action: "save" | "apply" | "ignore") => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/jobs/${job.id}/${action}`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setCurrentStatus(data.status);
        if (onStatusChange) onStatusChange(job.id, data.status);
      }
    } catch (err) {
      console.error(`Error updating job ${action}:`, err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className={`glass-card rounded-xl p-5 border relative overflow-hidden transition-all duration-200 flex flex-col justify-between ${
        job.isPriorityCompany
          ? "border-amber-500/30 bg-gradient-to-br from-amber-500/[0.04] to-slate-900/90"
          : "border-slate-800"
      }`}
    >
      {/* Top Meta Line: Company, Priority, Match Score */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-100 text-sm tracking-wide">
              <Building2 className="w-4 h-4 text-brand-400" />
              <span>{job.company}</span>
            </div>

            {job.isPriorityCompany && (
              <Badge variant="warning" size="sm" className="font-bold">
                ★ Dream Target
              </Badge>
            )}

            {job.source && (
              <span className="text-[10px] text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50">
                {job.source.name}
              </span>
            )}
          </div>

          {/* Match Score Badge with dropdown breakdown */}
          <div className="relative">
            <button
              onClick={() => setShowScoreDetails(!showScoreDetails)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${scoreColor.bg} ${scoreColor.text} ${scoreColor.border} hover:opacity-90`}
              title="Click to view AI match breakdown"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{job.matchScore}% Match</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {/* Score Breakdown Tooltip */}
            {showScoreDetails && (
              <div className="absolute right-0 top-8 w-72 glass-panel bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl z-20 animate-in fade-in zoom-in-95 text-xs text-slate-200">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 font-bold">
                  <span className="text-slate-300">Match Scoring Rationale</span>
                  <span className={scoreColor.text}>{job.matchScore}/100</span>
                </div>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {job.matchReasons.length > 0 ? (
                    job.matchReasons.map((reason, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] leading-snug text-slate-300">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{reason}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-[11px]">Calculated based on skills, role, and fresher eligibility.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Job Title */}
        <h3
          onClick={() => onSelectDetail && onSelectDetail(job)}
          className="text-base font-semibold text-slate-100 hover:text-brand-300 cursor-pointer transition-colors line-clamp-1 mb-2.5"
        >
          {job.title}
        </h3>

        {/* Tags Row: Package, Location, Work Mode, Exp, Deadline */}
        <div className="flex flex-wrap items-center gap-2 mb-3.5 text-xs text-slate-300">
          {/* Salary Package */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md border font-semibold ${
              job.salaryDisclosed
                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/25"
                : "bg-slate-800/80 text-slate-400 border-slate-700/60"
            }`}
          >
            <IndianRupee className="w-3 h-3" />
            <span>{formatSalary(job.minSalary, job.maxSalary, job.salaryRaw)}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800/60 text-slate-300 border border-slate-700/50">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span>{job.location}</span>
          </div>

          {/* Work Mode */}
          {job.workMode && job.workMode !== "NOT_SPECIFIED" && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800/60 text-slate-300 border border-slate-700/50">
              <Briefcase className="w-3 h-3 text-slate-400" />
              <span className="capitalize">{job.workMode.toLowerCase()}</span>
            </div>
          )}

          {/* Experience */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800/60 text-slate-300 border border-slate-700/50">
            <span>{job.experienceMin === 0 ? "Fresher / 0-1 Yrs" : `${job.experienceMin}-${job.experienceMax} Yrs`}</span>
          </div>

          {/* Deadline */}
          {job.deadline && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] ${
                deadlineInfo.isUrgent
                  ? "bg-rose-500/15 text-rose-300 border-rose-500/30 font-semibold animate-pulse"
                  : "bg-slate-800/60 text-slate-400 border-slate-700/50"
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>{deadlineInfo.text}</span>
            </div>
          )}
        </div>

        {/* Extracted Skills Pills */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {job.skills.slice(0, 5).map((skill) => (
            <span
              key={skill.id}
              className="text-[11px] px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20 font-medium"
            >
              {skill.name}
            </span>
          ))}
          {job.skills.length > 5 && (
            <span className="text-[10px] text-slate-500 self-center">
              +{job.skills.length - 5} more
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {/* Save Button */}
          <Button
            size="sm"
            variant={currentStatus === "SAVED" ? "primary" : "outline"}
            onClick={() => handleAction("save")}
            disabled={isUpdating}
            className="text-xs px-2.5 py-1.5"
            title="Save for later"
          >
            <Bookmark className={`w-3.5 h-3.5 ${currentStatus === "SAVED" ? "fill-current" : ""}`} />
            <span className="hidden sm:inline">{currentStatus === "SAVED" ? "Saved" : "Save"}</span>
          </Button>

          {/* Mark Applied Button */}
          <Button
            size="sm"
            variant={currentStatus === "APPLIED" ? "success" : "outline"}
            onClick={() => handleAction("apply")}
            disabled={isUpdating}
            className="text-xs px-2.5 py-1.5"
            title="Mark as Applied"
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${currentStatus === "APPLIED" ? "fill-current" : ""}`} />
            <span className="hidden sm:inline">{currentStatus === "APPLIED" ? "Applied" : "Applied?"}</span>
          </Button>

          {/* Ignore Button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleAction("ignore")}
            disabled={isUpdating}
            className="text-xs px-2 py-1.5 text-slate-500 hover:text-rose-400"
            title="Hide / Ignore Job"
          >
            <EyeOff className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* External Apply Link */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 flex items-center gap-1 hidden md:flex">
            <Clock className="w-2.5 h-2.5" />
            {formatTimeAgo(job.postedAt)}
          </span>

          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all shadow-md shadow-brand-600/25 active:scale-95"
          >
            <span>Apply Now</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
