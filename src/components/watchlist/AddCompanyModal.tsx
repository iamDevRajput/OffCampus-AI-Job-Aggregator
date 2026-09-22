"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PriorityLevel, SourceType } from "@prisma/client";

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (company: {
    name: string;
    aliases: string[];
    careerPageUrl?: string;
    boardToken?: string;
    priorityLevel: PriorityLevel;
    sourceType: SourceType;
  }) => Promise<void>;
}

export const AddCompanyModal: React.FC<AddCompanyModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState("");
  const [aliases, setAliases] = useState("");
  const [careerPageUrl, setCareerPageUrl] = useState("");
  const [boardToken, setBoardToken] = useState("");
  const [priorityLevel, setPriorityLevel] = useState<PriorityLevel>("HIGH");
  const [sourceType, setSourceType] = useState<SourceType>("MOCK");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd({
        name: name.trim(),
        aliases: aliases
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        careerPageUrl: careerPageUrl.trim() || undefined,
        boardToken: boardToken.trim() || undefined,
        priorityLevel,
        sourceType,
      });
      setName("");
      setAliases("");
      setCareerPageUrl("");
      setBoardToken("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Target Dream Company"
      description="Track openings for dream companies with priority alerts and score boosts."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Company Name"
          placeholder="e.g. Google, Stripe, Zepto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Alternative Aliases / Entities (comma separated)"
          placeholder="e.g. Google India, Alphabet"
          value={aliases}
          onChange={(e) => setAliases(e.target.value)}
        />

        <Input
          label="Official Career Page URL"
          placeholder="https://careers.google.com"
          value={careerPageUrl}
          onChange={(e) => setCareerPageUrl(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Priority Level
            </label>
            <select
              value={priorityLevel}
              onChange={(e) => setPriorityLevel(e.target.value as PriorityLevel)}
              className="w-full bg-slate-900 text-slate-100 text-sm rounded-lg border border-slate-700/80 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
            >
              <option value="HIGH">High Priority (Top Feed Rank)</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Source Adapter Type
            </label>
            <select
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value as SourceType)}
              className="w-full bg-slate-900 text-slate-100 text-sm rounded-lg border border-slate-700/80 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
            >
              <option value="MOCK">Mock Feed (Instant)</option>
              <option value="GREENHOUSE">Greenhouse ATS Board</option>
              <option value="LEVER">Lever Postings API</option>
              <option value="ASHBY">Ashby Job Board</option>
              <option value="SMART_RECRUITERS">SmartRecruiters API</option>
              <option value="PUBLIC_FEED">Public Career Feed</option>
            </select>
          </div>
        </div>

        {sourceType !== "MOCK" && (
          <Input
            label="ATS Board Token / Identifier (Optional)"
            placeholder="e.g. stripe, palantir, openai, ramp"
            value={boardToken}
            onChange={(e) => setBoardToken(e.target.value)}
          />
        )}

        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            Add to Watchlist
          </Button>
        </div>
      </form>
    </Modal>
  );
};
