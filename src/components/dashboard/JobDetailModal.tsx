"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { JobCardData } from "./JobCard";
import {
  Building2,
  MapPin,
  Briefcase,
  IndianRupee,
  Sparkles,
  ExternalLink,
  Calendar,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { formatSalary, formatDeadline, formatTimeAgo, getMatchScoreColor } from "@/lib/utils";

interface JobDetailModalProps {
  job: JobCardData | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (jobId: string, status: string | null) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  isOpen,
  onClose,
  onStatusChange,
}) => {
  if (!job) return null;

  const scoreColor = getMatchScoreColor(job.matchScore);
  const deadlineInfo = formatDeadline(job.deadline);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={`${job.company} — ${job.title}`}
      description={`Discovered ${formatTimeAgo(job.postedAt)} • Verified compliant source`}
    >
      <div className="space-y-6">
        {/* Match Scoring & Dream Company Alert */}
        <div className={`p-4 rounded-xl border ${scoreColor.bg} ${scoreColor.border} flex items-start gap-3`}>
          <div className={`p-2 rounded-lg bg-slate-900 border ${scoreColor.border} ${scoreColor.text}`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <span>{job.matchScore}% Profile Match Score</span>
                {job.isPriorityCompany && (
                  <Badge variant="warning" size="sm">
                    ★ Dream Target Company
                  </Badge>
                )}
              </h4>
            </div>
            <div className="mt-2 space-y-1">
              {job.matchReasons.map((r, idx) => (
                <div key={idx} className="text-xs text-slate-300 flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 block mb-1">Compensation</span>
            <span className="font-bold text-emerald-400">
              {formatSalary(job.minSalary, job.maxSalary, job.salaryRaw)}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 block mb-1">Location</span>
            <span className="font-semibold text-slate-200">{job.location}</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 block mb-1">Work Mode</span>
            <span className="font-semibold text-slate-200 capitalize">
              {job.workMode.toLowerCase()}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 block mb-1">Deadline</span>
            <span className={`font-semibold ${deadlineInfo.isUrgent ? "text-rose-400" : "text-slate-200"}`}>
              {deadlineInfo.text}
            </span>
          </div>
        </div>

        {/* Extracted Technical Skills */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Identified Technical Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <span
                key={skill.id}
                className="px-2.5 py-1 rounded-md bg-brand-500/15 text-brand-300 border border-brand-500/30 text-xs font-medium"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        {/* Complete Description */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Job Description & Responsibilities
          </h4>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap font-sans">
            {job.description}
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Public Compliant Listing</span>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="md" onClick={onClose}>
              Close
            </Button>
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all shadow-lg shadow-brand-600/30 active:scale-95"
            >
              <span>Open Career Portal & Apply</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
};
