"use client";

import React, { useState, useEffect } from "react";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { SkillPicker } from "@/components/profile/SkillPicker";
import { ResumeExtractor } from "@/components/profile/ResumeExtractor";
import { User, Sparkles, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<any>(null);
  const [userSkills, setUserSkills] = useState<any[]>([]);
  const [allAvailableSkills, setAllAvailableSkills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [profileRes, skillsRes] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/profile/skills"),
      ]);

      if (profileRes.ok) {
        const data = await profileRes.json();
        const user = data.user;
        setProfileData({
          name: user.name || "",
          college: user.profile?.college || "",
          batchYear: user.profile?.batchYear || 2025,
          experienceLevel: user.profile?.experienceLevel || "FRESHER",
          preferredRoles: user.profile?.preferredRoles || [],
          preferredLocations: user.profile?.preferredLocations || [],
          preferredWorkModes: user.profile?.preferredWorkModes || ["REMOTE", "HYBRID", "ONSITE"],
          minSalary: user.profile?.minSalary || 12,
          rawResumeText: user.profile?.rawResumeText || "",
        });
        setUserSkills(user.userSkills || []);
      }

      if (skillsRes.ok) {
        const data = await skillsRes.json();
        setAllAvailableSkills(data.skills || []);
      }
    } catch (err) {
      console.error("Error loading profile data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveProfile = async (data: any) => {
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to save profile");
    }
  };

  const handleAddSkill = async (skillId?: string, skillName?: string, category?: string) => {
    const res = await fetch("/api/profile/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skillId, skillName, category, level: "ADVANCED" }),
    });
    if (res.ok) {
      const data = await res.json();
      setUserSkills((prev) => [...prev, data.userSkill]);
    }
  };

  const handleRemoveSkill = async (userSkillId: string) => {
    const res = await fetch(`/api/profile/skills/${userSkillId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setUserSkills((prev) => prev.filter((us) => us.id !== userSkillId));
    }
  };

  const handleAddBulkSkills = async (skillNames: string[]) => {
    for (const name of skillNames) {
      await handleAddSkill(undefined, name, "Core CS");
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-400">
        <Sparkles className="w-8 h-8 animate-spin mx-auto mb-2 text-brand-400" />
        <p className="text-xs">Loading profile & match configuration...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>Profile & Match Preferences</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Your profile parameters directly power the real-time scoring engine for off-campus openings.
        </p>
      </div>

      {/* Main Profile Form */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl">
        {profileData && (
          <ProfileForm initialData={profileData} onSave={handleSaveProfile} />
        )}
      </div>

      {/* Skills Manager */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl">
        <SkillPicker
          userSkills={userSkills}
          allAvailableSkills={allAvailableSkills}
          onAddSkill={handleAddSkill}
          onRemoveSkill={handleRemoveSkill}
        />
      </div>

      {/* Resume NLP Scanner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl">
        <ResumeExtractor onAddExtractedSkills={handleAddBulkSkills} />
      </div>
    </div>
  );
}
