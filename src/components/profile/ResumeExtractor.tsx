"use client";

import React, { useState } from "react";
import { Sparkles, Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { STANDARD_SKILLS } from "@/lib/constants";

interface ResumeExtractorProps {
  onAddExtractedSkills: (skillNames: string[]) => Promise<void>;
}

export const ResumeExtractor: React.FC<ResumeExtractorProps> = ({
  onAddExtractedSkills,
}) => {
  const [resumeText, setResumeText] = useState("");
  const [detectedSkills, setDetectedSkills] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleScanText = () => {
    if (!resumeText.trim()) return;
    setIsProcessing(true);

    const text = ` ${resumeText} `.toLowerCase();
    const matched = new Set<string>();

    for (const skillDef of STANDARD_SKILLS) {
      for (const alias of skillDef.aliases) {
        const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`(?:^|[^a-zA-Z0-9_+#])${escaped}(?:$|[^a-zA-Z0-9_+#])`, "i");
        if (regex.test(text)) {
          matched.add(skillDef.name);
          break;
        }
      }
    }

    setDetectedSkills(Array.from(matched));
    setIsProcessing(false);
  };

  const handleApplyAll = async () => {
    if (detectedSkills.length === 0) return;
    setIsSaving(true);
    try {
      await onAddExtractedSkills(detectedSkills);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-brand-400" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Smart Resume / Bio Skill Scanner
        </h4>
      </div>
      <p className="text-xs text-slate-400">
        Paste your resume text or LinkedIn summary below. Our local NLP engine will automatically extract tech skills to boost your job match scoring.
      </p>

      <textarea
        rows={4}
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        placeholder="Paste resume text here (e.g., 'Proficient in React, Next.js, Node.js, PostgreSQL, Docker, AWS and System Design...')"
        className="w-full bg-slate-900 text-xs text-slate-100 placeholder-slate-500 rounded-xl border border-slate-700/80 p-3.5 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
      />

      <div className="flex items-center justify-between">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={handleScanText}
          disabled={!resumeText.trim()}
          isLoading={isProcessing}
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Scan For Skills</span>
        </Button>

        {detectedSkills.length > 0 && (
          <Button
            type="button"
            size="sm"
            variant="success"
            onClick={handleApplyAll}
            isLoading={isSaving}
          >
            <Check className="w-3.5 h-3.5" />
            <span>Add All {detectedSkills.length} Skills to Profile</span>
          </Button>
        )}
      </div>

      {detectedSkills.length > 0 && (
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700 space-y-2">
          <p className="text-xs font-semibold text-emerald-400">
            ✓ Found {detectedSkills.length} Technical Skills:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {detectedSkills.map((sk) => (
              <span
                key={sk}
                className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium"
              >
                {sk}
              </span>
            ))}
          </div>
        </div>
      )}

      {savedSuccess && (
        <p className="text-xs text-emerald-400 font-semibold animate-in fade-in">
          ✓ Skills successfully added to your profile!
        </p>
      )}
    </div>
  );
};
