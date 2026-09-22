"use client";

import React, { useState } from "react";
import { Plus, X, Sparkles, Check } from "lucide-react";
import { SKILL_CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

interface UserSkillItem {
  id: string;
  skillId: string;
  level: string;
  skill: {
    id: string;
    name: string;
    category: string;
  };
}

interface AllSkillItem {
  id: string;
  name: string;
  category: string;
}

interface SkillPickerProps {
  userSkills: UserSkillItem[];
  allAvailableSkills: AllSkillItem[];
  onAddSkill: (skillId?: string, skillName?: string, category?: string) => Promise<void>;
  onRemoveSkill: (userSkillId: string) => Promise<void>;
}

export const SkillPicker: React.FC<SkillPickerProps> = ({
  userSkills,
  allAvailableSkills,
  onAddSkill,
  onRemoveSkill,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [customSkillName, setCustomSkillName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const existingSkillIds = new Set(userSkills.map((us) => us.skill.id));
  const existingSkillNames = new Set(userSkills.map((us) => us.skill.name.toLowerCase()));

  const filteredSkills = allAvailableSkills.filter((s) => {
    if (selectedCategory !== "All" && s.category !== selectedCategory) return false;
    return true;
  });

  const handleAddCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSkillName.trim()) return;
    setIsAdding(true);
    try {
      await onAddSkill(undefined, customSkillName.trim(), "Core CS");
      setCustomSkillName("");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Current Active User Skills */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Your Profile Skills ({userSkills.length})
        </label>

        {userSkills.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-slate-700 bg-slate-900/40 text-center text-xs text-slate-400">
            No skills added yet. Select from the recommended skills below to improve match accuracy!
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            {userSkills.map((us) => (
              <span
                key={us.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-500/20 text-brand-200 border border-brand-500/40 text-xs font-medium group"
              >
                <span>{us.skill.name}</span>
                <span className="text-[10px] text-brand-400 bg-brand-500/30 px-1 rounded">
                  {us.level}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveSkill(us.id)}
                  className="p-0.5 rounded text-brand-400 hover:text-rose-400 hover:bg-rose-500/20 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Add Custom Skill Form */}
      <form onSubmit={handleAddCustom} className="flex items-center gap-2">
        <input
          type="text"
          value={customSkillName}
          onChange={(e) => setCustomSkillName(e.target.value)}
          placeholder="Add custom skill (e.g. PyTorch, Rust, Solidity)..."
          className="flex-1 bg-slate-900 text-xs text-slate-100 placeholder-slate-500 rounded-lg border border-slate-700 px-3.5 py-2 focus:outline-none focus:border-brand-500"
        />
        <Button
          type="submit"
          size="sm"
          variant="secondary"
          isLoading={isAdding}
          disabled={!customSkillName.trim()}
          className="text-xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom</span>
        </Button>
      </form>

      {/* Suggested Skills Palette */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Suggested Tech Stacks & Categories
          </label>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              selectedCategory === "All"
                ? "bg-brand-600 text-white shadow-sm"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            All
          </button>
          {SKILL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Quick Select Chips */}
        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2 bg-slate-950/40 rounded-xl border border-slate-800/80">
          {filteredSkills.map((sk) => {
            const isAdded = existingSkillIds.has(sk.id) || existingSkillNames.has(sk.name.toLowerCase());
            return (
              <button
                key={sk.id}
                type="button"
                onClick={() => !isAdded && onAddSkill(sk.id, sk.name, sk.category)}
                disabled={isAdded}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  isAdded
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 opacity-70 cursor-default"
                    : "bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 active:scale-95 cursor-pointer"
                }`}
              >
                {isAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 text-slate-500" />}
                <span>{sk.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
