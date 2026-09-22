"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, LogOut, User, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NotificationDropdown } from "./NotificationDropdown";

interface HeaderProps {
  user?: {
    name: string;
    email: string;
  } | null;
  onRefresh?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onRefresh }) => {
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleRunIngestion = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch("/api/cron/ingest-jobs", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSyncMessage("Sync complete!");
        if (onRefresh) onRefresh();
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(null), 3000);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <header className="h-16 bg-surface/80 backdrop-blur-md border-b border-surfaceBorder px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span className="text-xs font-semibold text-slate-300">
            OffCampus Aggregator Live Feed
          </span>
        </div>
        {syncMessage && (
          <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium flex items-center gap-1 animate-in fade-in">
            <Check className="w-3.5 h-3.5" />
            {syncMessage}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleRunIngestion}
          isLoading={isSyncing}
          className="text-xs text-brand-300 border-brand-500/30 hover:bg-brand-500/10"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
          <span>Sync / Ingest Now</span>
        </Button>

        <NotificationDropdown />

        <div className="h-5 w-px bg-slate-800" />

        {/* User profile dropdown/info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow">
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-200 leading-tight">
                {user?.name || "Student / Fresher"}
              </p>
              <p className="text-[10px] text-slate-400 truncate max-w-[120px]">
                {user?.email || "demo@offcampus.ai"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
