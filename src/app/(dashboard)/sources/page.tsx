"use client";

import React, { useState, useEffect } from "react";
import { SourceCard, SourceItem } from "@/components/sources/SourceCard";
import { Button } from "@/components/ui/Button";
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
  Globe2,
  Database,
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

  // Custom Source Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSourceName, setNewSourceName] = useState("");
  const [newSourceType, setNewSourceType] = useState("GREENHOUSE");
  const [newBoardToken, setNewBoardToken] = useState("");
  const [isSubmittingSource, setIsSubmittingSource] = useState(false);

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
    setIngestionLogs(["[Pipeline] Initializing automated sync across all active ATS adapters and public feeds..."]);
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
              `-> [${r.sourceType}] ${r.sourceName}: Fetched ${r.fetchedCount} posts | Created: ${r.newJobsCount} | Updated: ${r.updatedCount} | (${r.durationMs}ms)`
            );
            if (r.errors?.length > 0) {
              logs.push(`   [Error] ${r.errors.join("; ")}`);
            }
          }
        }
        setIngestionLogs(logs);
        setToastMessage("All sources successfully ingested & synced!");
        loadData();
        setTimeout(() => setToastMessage(null), 4000);
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
          `[Success] Source sync complete!`,
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

  const handleCreateCustomSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName.trim()) return;

    setIsSubmittingSource(true);
    try {
      const res = await fetch("/api/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newSourceName.trim(),
          type: newSourceType,
          boardToken: newBoardToken.trim() || undefined,
        }),
      });

      if (res.ok) {
        setToastMessage(`Registered ${newSourceName} source!`);
        setIsAddModalOpen(false);
        setNewSourceName("");
        setNewBoardToken("");
        loadData();
        setTimeout(() => setToastMessage(null), 3000);
      }
    } finally {
      setIsSubmittingSource(false);
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
            Real multi-source ingestion discovering verified jobs across Greenhouse, Lever, Ashby, SmartRecruiters, Recruitee, and Public Developer Feeds.
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
            All adapters interface exclusively with standard public JSON API endpoints (Greenhouse, Lever, Ashby, SmartRecruiters, Recruitee, and Open Feeds). No authentication or anti-bot protections are bypassed.
          </p>
        </div>
      </div>

      {/* Quick Add Preset Real Public ATS Sources */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-brand-400" />
            <span>Quick Connect Verified Public ATS Boards</span>
          </h4>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Custom Company Board
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { name: "Stripe", type: "GREENHOUSE", boardToken: "stripe" },
            { name: "Cloudflare", type: "GREENHOUSE", boardToken: "cloudflare" },
            { name: "Palantir", type: "LEVER", boardToken: "palantir" },
            { name: "Spotify", type: "LEVER", boardToken: "spotify" },
            { name: "OpenAI", type: "ASHBY", boardToken: "openai" },
            { name: "Bosch Group", type: "SMART_RECRUITERS", boardToken: "BoschGroup" },
            { name: "bunq", type: "RECRUITEE", boardToken: "bunq" },
            { name: "Arbeitnow Global Developer Feed", type: "PUBLIC_FEED", boardToken: "arbeitnow", apiUrl: "https://www.arbeitnow.com/api/job-board-api" },
            { name: "WeWorkRemotely Tech RSS Feed", type: "PUBLIC_FEED", boardToken: "weworkremotely", apiUrl: "https://weworkremotely.com/categories/remote-programming-jobs.rss" },
            { name: "RemoteOK Developer API Feed", type: "PUBLIC_FEED", boardToken: "remoteok", apiUrl: "https://remoteok.com/api" },
          ].map((preset) => {
            const alreadyAdded = sources.some(
              (s) => s.name.toLowerCase() === preset.name.toLowerCase() || (preset.boardToken && s.type === preset.type)
            );
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
                {alreadyAdded ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-3.5 h-3.5 text-brand-400" />}
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
                {runs.slice(0, 15).map((run) => (
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

      {/* Add Custom Source Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-xl border border-slate-700 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white">Add Custom Public ATS Source</h3>
            <p className="text-xs text-slate-400">
              Enter the company name and public ATS board token (e.g. Greenhouse board slug, Lever site name, Ashby board ID, SmartRecruiters company ID).
            </p>

            <form onSubmit={handleCreateCustomSource} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Company / Source Name</label>
                <input
                  type="text"
                  required
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                  placeholder="e.g. Uber, Airbnb, Databricks"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">ATS Platform Type</label>
                <select
                  value={newSourceType}
                  onChange={(e) => setNewSourceType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                >
                  <option value="GREENHOUSE">Greenhouse (boards-api.greenhouse.io)</option>
                  <option value="LEVER">Lever (api.lever.co/v0/postings)</option>
                  <option value="ASHBY">Ashby (api.ashbyhq.com)</option>
                  <option value="SMART_RECRUITERS">SmartRecruiters (api.smartrecruiters.com)</option>
                  <option value="RECRUITEE">Recruitee (recruitee.com/api/offers)</option>
                  <option value="WORKABLE">Workable (apply.workable.com)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Board Token / Identifier</label>
                <input
                  type="text"
                  value={newBoardToken}
                  onChange={(e) => setNewBoardToken(e.target.value)}
                  placeholder="e.g. stripe, palantir, openai, BoschGroup"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  isLoading={isSubmittingSource}
                >
                  Register Source
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
