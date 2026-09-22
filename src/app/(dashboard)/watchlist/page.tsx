"use client";

import React, { useState, useEffect } from "react";
import { TargetCompanyTable, TargetCompanyItem } from "@/components/watchlist/TargetCompanyTable";
import { AddCompanyModal } from "@/components/watchlist/AddCompanyModal";
import { Button } from "@/components/ui/Button";
import { Building2, Plus, Download, Sparkles, Check } from "lucide-react";

export default function WatchlistPage() {
  const [companies, setCompanies] = useState<TargetCompanyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/target-companies");
      if (res.ok) {
        const data = await res.json();
        setCompanies(data.companies || []);
      }
    } catch (err) {
      console.error("Error fetching target companies:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleAddCompany = async (companyData: any) => {
    const res = await fetch("/api/target-companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(companyData),
    });

    if (res.ok) {
      setToastMessage("Target company added!");
      fetchCompanies();
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleDeleteCompany = async (id: string) => {
    const res = await fetch(`/api/target-companies/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setCompanies((prev) => prev.filter((c) => c.id !== id));
      setToastMessage("Company removed from watchlist");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleToggleActive = async (id: string, currentState: boolean) => {
    const res = await fetch(`/api/target-companies/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !currentState }),
    });
    if (res.ok) {
      setCompanies((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: !currentState } : c))
      );
    }
  };

  const handleImportTopTech = async () => {
    setIsImporting(true);
    try {
      const res = await fetch("/api/target-companies/import", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setToastMessage(data.message || "Imported top tech companies!");
        fetchCompanies();
        setTimeout(() => setToastMessage(null), 3000);
      }
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <span>Target Company Watchlist</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Jobs from these companies receive priority ranking and automatic instant alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleImportTopTech}
            isLoading={isImporting}
            className="text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Import Popular Top Tech</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Dream Company</span>
          </Button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Target Companies Table */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400">
          <Sparkles className="w-8 h-8 animate-spin mx-auto mb-2 text-brand-400" />
          <p className="text-xs">Loading watchlist...</p>
        </div>
      ) : (
        <TargetCompanyTable
          companies={companies}
          onDelete={handleDeleteCompany}
          onToggleActive={handleToggleActive}
        />
      )}

      {/* Add Company Modal */}
      <AddCompanyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCompany}
      />
    </div>
  );
}
