import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSalary(minSalary?: number | null, maxSalary?: number | null, rawSalary?: string | null, currency = "INR"): string {
  if (rawSalary && rawSalary.trim().length > 0) {
    return rawSalary;
  }
  if (!minSalary && !maxSalary) {
    return "Not disclosed";
  }
  if (minSalary && maxSalary) {
    if (minSalary === maxSalary) return `₹${minSalary} LPA`;
    return `₹${minSalary} - ₹${maxSalary} LPA`;
  }
  if (minSalary) return `₹${minSalary}+ LPA`;
  if (maxSalary) return `Up to ₹${maxSalary} LPA`;
  return "Not disclosed";
}

export function formatTimeAgo(dateInput: Date | string | null | undefined): string {
  if (!dateInput) return "Recently";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export function formatDeadline(dateInput: Date | string | null | undefined): { text: string; isUrgent: boolean } {
  if (!dateInput) return { text: "Open until filled", isUrgent: false };
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffInMs = date.getTime() - now.getTime();
  
  if (diffInMs < 0) return { text: "Expired", isUrgent: true };
  const days = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  
  if (days <= 2) return { text: `Closes in ${days === 1 ? '1 day' : `${days} days`}!`, isUrgent: true };
  if (days <= 7) return { text: `Closes in ${days} days`, isUrgent: false };
  return { text: date.toLocaleDateString("en-IN", { month: "short", day: "numeric" }), isUrgent: false };
}

export function getMatchScoreColor(score: number) {
  if (score >= 80) return { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30", ring: "ring-emerald-500/20" };
  if (score >= 60) return { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30", ring: "ring-cyan-500/20" };
  if (score >= 40) return { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30", ring: "ring-amber-500/20" };
  return { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/30", ring: "ring-slate-500/20" };
}

export function getPriorityBadgeColor(priority: string) {
  switch (priority.toUpperCase()) {
    case "HIGH":
      return { bg: "bg-amber-500/15", text: "text-amber-300", border: "border-amber-500/30" };
    case "MEDIUM":
      return { bg: "bg-indigo-500/15", text: "text-indigo-300", border: "border-indigo-500/30" };
    default:
      return { bg: "bg-slate-500/15", text: "text-slate-300", border: "border-slate-500/30" };
  }
}
