"use client";

import React, { useState, useEffect } from "react";
import { SourceCard, SourceItem } from "@/components/sources/SourceCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Radio,
  RefreshCw,
  Play,
  ShieldCheck,
  Sparkles,
  Check,
  Terminal,
  History,
  Building2,
  Clock,
  Plus,
  AlertCircle,
} from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";

interface IngestionRunItem {
  id: string;
  sourceName: string;
  sourceType: string;
  status: string;
  jobsFetched: number;
  jobsCreated: number;
  jobsUpdated: number;
  duplicateCount: number;
  errors: string[];
  durationMs: number;
  createdAt: string;
}

export default function SourcesPage() {
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [runs, setRuns] = useState<IngestionRunItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isIngestingAll, setIsIngestingAll] = useState(false);
  const [ingestionLogs, setIngestionLogs] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [sourcesRes, runsRes] = await Promise.all([
        fetch("/api/sources"),
        fetch("/api/sources/runs"),
      ]);

      if (sourcesRes.ok) {
        const data = await sourcesRes.json();
        setSources(data.sources || []);
      }
      if (runsRes.ok) {
        const data = await runsRes.json();
        setRuns(data.runs || []);
      }
    } catch (err) {
      console.error("Error fetching sources & runs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunAll = async () => {
    setIsIngestingAll(true);
    setIngestionLogs(["[Pipeline] Initializing automated sync across all active ATS adapters..."]);
    try {
      const res = await fetch("/api/cron/ingest-jobs", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        const logs = [
          `[Pipeline] Ingestion cycle completed successfully at ${new Date().toLocaleTimeString()}`,
        ];
        if (data.results && Array.isArray(data.results)) {
          for (const r of data.results) {
            logs.push(
              `-> [${r.sourceType}] ${r.sourceName}: Fetched ${r.fetchedCount} raw posts | New: ${r.newJobsCount} | Updated: ${r.updatedCount} | Filtered: ${r.duplicateCount} (${r.durationMs}ms)`
            );
            if (r.errors?.length > 0) {
              logs.push(`   [Error] ${r.errors.join("; ")}`);
            }
          }
        }
        setIngestionLogs(logs);
        setToastMessage("All ATS sources and target company feeds synced!");
        loadData();
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (err: any) {
      setIngestionLogs((prev) => [...prev, `[Pipeline Error] ${err.message || err}`]);
    } finally {
      setIsIngestingAll(false);
    }
  };

  const handleRunSingle = async (sourceId: string) => {
    setIngestionLogs([`[Single Adapter] Triggering sync for source ID: ${sourceId}...`]);
    try {
      const res = await fetch(`/api/sources/${sourceId}/run`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setIngestionLogs([
          `[Success] Source ingestion complete!`,
          `Details: ${JSON.stringify(data.results, null, 2)}`,
        ]);
        setToastMessage("Source sync complete!");
        loadData();
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (err: any) {
      setIngestionLogs([`[Error] Failed to fetch source: ${err.message || err}`]);
    }
  };

  const handleToggleActive = async (id: string, currentState: boolean) => {
    const res = await fetch(`/api/sources/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !currentState }),
    });
    if (res.ok) {
      setSources((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isActive: !currentState } : s))
      );
    }
  };

  const handleAddPresetSource = async (preset: { name: string; type: string; apiUrl?: string; boardToken?: string }) => {
    const res = await fetch("/api/sources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(preset),
    });
    if (res.ok) {
      setToastMessage(`Added ${preset.name} adapter!`);
      loadData();
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-brand-400" />
            <span>Automated Ingestion Engine & ATS Adapters</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Compliant adapters connecting to public Greenhouse, Lever, Ashby, and SmartRecruiters job boards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            isLoading={isLoading}
            className="text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <Button
            size="md"
            onClick={handleRunAll}
            isLoading={isIngestingAll}
            className="text-xs font-bold"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Ingestion Pipeline Now</span>
          </Button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Compliance Guarantee Banner */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 bg-slate-950/40 flex items-start gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-slate-100">Zero-Scraping Compliance Guarantee</h4>
          <p className="text-slate-400 mt-0.5 leading-relaxed">
            All adapters interface exclusively with standard public JSON API endpoints (Greenhouse, Lever, Ashby, SmartRecruiters). No login walls or anti-bot protections are bypassed.
          </p>
        </div>
      </div>

      {/* Quick Add Preset Real Public ATS Sources */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Building2 className="w-4 h-4 text-brand-400" />
          <span>Quick Connect Verified Public ATS Boards</span>
        </h4>
        <div className="flex flex-wrap gap-2">
          {[
            { name: "Stripe", type: "GREENHOUSE", boardToken: "stripe", apiUrl: "https://boards-api.greenhouse.io/v1/boards/stripe/jobs?content=true" },
            { name: "Palantir", type: "LEVER", boardToken: "palantir", apiUrl: "https://api.lever.co/v0/postings/palantir?mode=json" },
            { name: "OpenAI", type: "ASHBY", boardToken: "openai", apiUrl: "https://api.ashbyhq.com/posting-api/job-board/openai" },
            { name: "Ramp", type: "ASHBY", boardToken: "ramp", apiUrl: "https://api.ashbyhq.com/posting-api/job-board/ramp" },
          ].map((preset) => {
            const alreadyAdded = sources.some((s) => s.name.toLowerCase() === preset.name.toLowerCase());
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => !alreadyAdded && handleAddPresetSource(preset)}
                disabled={alreadyAdded}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  alreadyAdded
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 opacity-70 cursor-default"
                    : "bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-700 active:scale-95"
                }`}
              >
                {alreadyAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-brand-400" />}
                <span>{preset.name} ({preset.type})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Source Cards Grid */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Configured ATS Source Adapters ({sources.length})
        </h3>
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <Sparkles className="w-8 h-8 animate-spin mx-auto mb-2 text-brand-400" />
            <p className="text-xs">Loading sources...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sources.map((source) => (
              <SourceCard
                key={source.id}
                source={source}
                onRunSource={handleRunSingle}
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
        )}
      </div>

      {/* Ingestion Console / Output Log */}
      {ingestionLogs.length > 0 && (
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-400">
            <Terminal className="w-4 h-4" />
            <span>Ingestion Pipeline Live Output</span>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-850 font-mono text-[11px] text-emerald-400 max-h-48 overflow-y-auto space-y-1">
            {ingestionLogs.map((line, idx) => (
              <p key={idx} className="leading-relaxed">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Ingestion Run History Table */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-brand-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Recent Ingestion Run History ({runs.length})
            </h3>
          </div>
        </div>

        {runs.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            No ingestion runs recorded yet. Click "Run Ingestion Pipeline Now" to execute the first sync.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Source Name</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Fetched</th>
                  <th className="py-2.5 px-3">New Jobs</th>
                  <th className="py-2.5 px-3">Updated</th>
                  <th className="py-2.5 px-3">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {runs.slice(0, 10).map((run) => (
                  <tr key={run.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                      {formatTimeAgo(run.createdAt)}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-200">
                      {run.sourceName}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[10px] text-brand-300">
                      {run.sourceType}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          run.status === "SUCCESS"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : run.status === "PARTIAL"
                            ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                            : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {run.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-300">
                      {run.jobsFetched}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-emerald-400">
                      +{run.jobsCreated}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-cyan-400">
                      {run.jobsUpdated}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                      {run.durationMs}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
