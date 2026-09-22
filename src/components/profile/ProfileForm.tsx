"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PREFERRED_ROLE_OPTIONS, PREFERRED_LOCATION_OPTIONS } from "@/lib/constants";
import { User, GraduationCap, MapPin, Briefcase, IndianRupee, Sparkles, Check } from "lucide-react";

interface ProfileData {
  name: string;
  college?: string;
  batchYear?: number | null;
  experienceLevel?: string;
  preferredRoles: string[];
  preferredLocations: string[];
  preferredWorkModes: string[];
  minSalary?: number | null;
  rawResumeText?: string;
}

interface ProfileFormProps {
  initialData: ProfileData;
  onSave: (data: ProfileData) => Promise<void>;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ initialData, onSave }) => {
  const [formData, setFormData] = useState<ProfileData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await onSave(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRoleToggle = (role: string) => {
    const roles = formData.preferredRoles.includes(role)
      ? formData.preferredRoles.filter((r) => r !== role)
      : [...formData.preferredRoles, role];
    setFormData({ ...formData, preferredRoles: roles });
  };

  const handleLocationToggle = (loc: string) => {
    const locs = formData.preferredLocations.includes(loc)
      ? formData.preferredLocations.filter((l) => l !== loc)
      : [...formData.preferredLocations, loc];
    setFormData({ ...formData, preferredLocations: locs });
  };

  const handleWorkModeToggle = (mode: string) => {
    const modes = formData.preferredWorkModes.includes(mode)
      ? formData.preferredWorkModes.filter((m) => m !== mode)
      : [...formData.preferredWorkModes, mode];
    setFormData({ ...formData, preferredWorkModes: modes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Academic Info */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4" />
          <span>Academic & Personal Details</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Dev Rajput"
            required
          />

          <Input
            label="College / University"
            value={formData.college || ""}
            onChange={(e) => setFormData({ ...formData, college: e.target.value })}
            placeholder="e.g. IIT, NIT, BITS, VIT, DTU"
          />

          <Input
            label="Graduation Batch Year"
            type="number"
            value={formData.batchYear || 2025}
            onChange={(e) =>
              setFormData({
                ...formData,
                batchYear: e.target.value ? parseInt(e.target.value, 10) : null,
              })
            }
            placeholder="2025"
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Experience Level
            </label>
            <select
              value={formData.experienceLevel || "FRESHER"}
              onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
              className="w-full bg-slate-900 text-slate-100 text-sm rounded-lg border border-slate-700/80 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
            >
              <option value="FRESHER">Fresher / 2024-2026 Batch Graduate</option>
              <option value="INTERNSHIP">Seeking 6-Month / Summer Internship</option>
              <option value="ZERO_TO_ONE">0-1 Year Experience</option>
              <option value="ONE_TO_TWO">1-2 Years Experience</option>
            </select>
          </div>
        </div>
      </div>

      {/* Target Job Preferences */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
          <Briefcase className="w-4 h-4" />
          <span>Job Preferences & Roles</span>
        </h4>

        {/* Roles */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Target Engineering Roles
          </label>
          <div className="flex flex-wrap gap-2">
            {PREFERRED_ROLE_OPTIONS.map((role) => {
              const isSelected = formData.preferredRoles.includes(role);
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleToggle(role)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    isSelected
                      ? "bg-brand-600 text-white border-brand-500 shadow-sm"
                      : "bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200"
                  }`}
                >
                  {role}
                </button>
              );
            })}
          </div>
        </div>

        {/* Minimum Target Salary */}
        <div className="max-w-xs">
          <Input
            label="Minimum Expected Package (in ₹ LPA)"
            type="number"
            step="0.5"
            value={formData.minSalary || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                minSalary: e.target.value ? parseFloat(e.target.value) : null,
              })
            }
            placeholder="e.g. 12"
            icon={<IndianRupee className="w-4 h-4" />}
          />
        </div>

        {/* Work Modes */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Accepted Work Modes
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Remote", value: "REMOTE" },
              { label: "Hybrid", value: "HYBRID" },
              { label: "Onsite", value: "ONSITE" },
            ].map((m) => {
              const isSelected = formData.preferredWorkModes.includes(m.value);
              return (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => handleWorkModeToggle(m.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                      : "bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200"
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Locations */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Preferred Job Locations
          </label>
          <div className="flex flex-wrap gap-2">
            {PREFERRED_LOCATION_OPTIONS.map((loc) => {
              const isSelected = formData.preferredLocations.includes(loc);
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => handleLocationToggle(loc)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    isSelected
                      ? "bg-cyan-600 text-white border-cyan-500 shadow-sm"
                      : "bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200"
                  }`}
                >
                  {loc}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        {saveSuccess && (
          <span className="text-xs px-3 py-1.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 font-medium animate-in fade-in">
            <Check className="w-3.5 h-3.5" />
            Profile & Match Preferences Saved!
          </span>
        )}
        <div className="ml-auto">
          <Button type="submit" size="md" isLoading={isSaving}>
            Save Preferences & Recalculate Matches
          </Button>
        </div>
      </div>
    </form>
  );
};
