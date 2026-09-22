"use client";

import React from "react";
import { Building2, ExternalLink, Trash2, CheckCircle2, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatTimeAgo, getPriorityBadgeColor } from "@/lib/utils";

export interface TargetCompanyItem {
  id: string;
  name: string;
  aliases: string[];
  careerPageUrl?: string | null;
  sourceType: string;
  priorityLevel: string;
  isActive: boolean;
  lastCheckedAt?: string | null;
  _count?: { jobs: number };
}

interface TargetCompanyTableProps {
  companies: TargetCompanyItem[];
  onDelete: (id: string) => Promise<void>;
  onToggleActive: (id: string, currentState: boolean) => Promise<void>;
}

export const TargetCompanyTable: React.FC<TargetCompanyTableProps> = ({
  companies,
  onDelete,
  onToggleActive,
}) => {
  if (companies.length === 0) {
    return (
      <div className="p-8 text-center glass-panel rounded-xl border border-slate-800 text-slate-400">
        <Building2 className="w-8 h-8 mx-auto mb-2 text-slate-600" />
        <p className="text-sm font-semibold text-slate-300">No Target Companies Configured</p>
        <p className="text-xs text-slate-500 mt-1">
          Add your target dream companies or import standard top tech companies to prioritize openings on your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Company</th>
              <th className="py-3.5 px-4">Priority Level</th>
              <th className="py-3.5 px-4">Source Type</th>
              <th className="py-3.5 px-4">Jobs Found</th>
              <th className="py-3.5 px-4">Career Page</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {companies.map((company) => {
              const priorityColors = getPriorityBadgeColor(company.priorityLevel);
              return (
                <tr key={company.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-100 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-brand-400" />
                      <span>{company.name}</span>
                    </div>
                    {company.aliases.length > 0 && (
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        Aliases: {company.aliases.join(", ")}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${priorityColors.bg} ${priorityColors.text} ${priorityColors.border}`}
                    >
                      {company.priorityLevel}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60 font-mono">
                      {company.sourceType}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-emerald-400">
                      {company._count?.jobs ?? 0} jobs
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {company.careerPageUrl ? (
                      <a
                        href={company.careerPageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-400 hover:text-brand-300 inline-flex items-center gap-1 font-medium"
                      >
                        <span>Visit</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onToggleActive(company.id, company.isActive)}
                        className={`text-[11px] font-medium px-2 py-1 rounded border transition-colors ${
                          company.isActive
                            ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/30"
                            : "text-slate-500 bg-slate-900 border-slate-800"
                        }`}
                      >
                        {company.isActive ? "Active" : "Paused"}
                      </button>

                      <button
                        onClick={() => onDelete(company.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Delete Company"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
