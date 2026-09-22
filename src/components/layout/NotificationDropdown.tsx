"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, Sparkles, Building2, ExternalLink, Clock } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";

interface AlertItem {
  id: string;
  type: string;
  sentAt: string;
  createdAt: string;
  job: {
    id: string;
    title: string;
    company: string;
    salaryRaw?: string;
    applyUrl: string;
    isPriorityCompany: boolean;
  };
}

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchAlerts = async () => {
    try {
      const res = await fetch("/api/dashboard/alerts");
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
        setUnreadCount(data.alerts?.length || 0);
      }
    } catch {
      // Ignore in mock
    }
  };

  useEffect(() => {
    fetchAlerts();

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setUnreadCount(0);
        }}
        className="relative p-2 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-600 transition-all focus:outline-none"
        title="Notifications & Alerts"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Instant Alerts ({alerts.length})
              </h4>
            </div>
            <span className="text-[10px] text-slate-500">Target & High Match</span>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                <Bell className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                No new alerts yet. Run ingestion or add target companies!
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3.5 hover:bg-slate-800/50 transition-colors flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {alert.type === "PRIORITY_COMPANY" ? "Dream Company Match" : "High Profile Match"}
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {formatTimeAgo(alert.createdAt)}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-100 mt-1">
                    {alert.job.company} — <span className="text-slate-300 font-normal">{alert.job.title}</span>
                  </p>

                  {alert.job.salaryRaw && (
                    <p className="text-[11px] text-emerald-400 font-medium">
                      {alert.job.salaryRaw}
                    </p>
                  )}

                  <div className="mt-1 flex items-center justify-end">
                    <a
                      href={alert.job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-medium text-brand-400 hover:text-brand-300 flex items-center gap-1"
                    >
                      Apply Link <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
