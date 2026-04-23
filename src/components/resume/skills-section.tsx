"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Plus, Trash2, X } from "lucide-react";
import type { ResumeData, ResumeSkill } from "@/lib/resume-types";

interface SkillsSectionProps {
  resume: ResumeData;
  updateField: <K extends keyof ResumeData>(field: K, value: ResumeData[K]) => void;
}

const SKILL_LEVELS: ResumeSkill["level"][] = ["beginner", "intermediate", "advanced", "expert"];

const SUGGESTED_CATEGORIES = [
  "Programming Languages",
  "Frameworks & Libraries",
  "Databases",
  "Cloud & DevOps",
  "Tools & Software",
  "Soft Skills",
  "Languages",
  "Other",
];

export default function SkillsSection({ resume, updateField }: SkillsSectionProps) {
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("General");
  const [newSkillLevel, setNewSkillLevel] = useState<ResumeSkill["level"]>("intermediate");

  function addSkill() {
    if (!newSkillName.trim()) return;
    const newSkill: ResumeSkill = {
      id: `skill-${Date.now()}`,
      name: newSkillName.trim(),
      level: newSkillLevel,
      category: newSkillCategory,
    };
    updateField("skills", [...resume.skills, newSkill]);
    setNewSkillName("");
  }

  function removeSkill(id: string) {
    updateField("skills", resume.skills.filter((s) => s.id !== id));
  }

  function updateSkillLevel(id: string, level: ResumeSkill["level"]) {
    const updated = resume.skills.map((s) =>
      s.id === id ? { ...s, level } : s
    );
    updateField("skills", updated);
  }

  // Group skills by category
  const grouped = resume.skills.reduce<Record<string, ResumeSkill[]>>((acc, skill) => {
    const cat = skill.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const levelColors: Record<ResumeSkill["level"], string> = {
    beginner: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    intermediate: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    advanced: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    expert: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Wrench className="h-4 w-4" />
          Skills
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add skill form */}
        <div className="flex gap-2 flex-wrap">
          <Input
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            placeholder="Skill name (e.g., React, Python)"
            className="flex-1 min-w-[200px]"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
          />
          <select
            value={newSkillCategory}
            onChange={(e) => setNewSkillCategory(e.target.value)}
            className="h-8 rounded-lg border border-border bg-background px-2 text-sm"
          >
            {SUGGESTED_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={newSkillLevel}
            onChange={(e) => setNewSkillLevel(e.target.value as ResumeSkill["level"])}
            className="h-8 rounded-lg border border-border bg-background px-2 text-sm"
          >
            {SKILL_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>
          <Button onClick={addSkill} size="sm" disabled={!newSkillName.trim()}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add
          </Button>
        </div>

        {/* Skills grouped by category */}
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Wrench className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No skills added yet. Start typing to add skills.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([category, skills]) => (
              <div key={category}>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${levelColors[skill.level]}`}
                    >
                      <span>{skill.name}</span>
                      <button
                        onClick={() => {
                          const currentIndex = SKILL_LEVELS.indexOf(skill.level);
                          const nextLevel = SKILL_LEVELS[(currentIndex + 1) % SKILL_LEVELS.length];
                          updateSkillLevel(skill.id, nextLevel);
                        }}
                        className="opacity-60 hover:opacity-100 text-[10px] underline"
                        title={`Click to change level (current: ${skill.level})`}
                      >
                        {skill.level.slice(0, 3)}
                      </button>
                      <button
                        onClick={() => removeSkill(skill.id)}
                        className="opacity-60 hover:opacity-100 ml-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Tip: Click the level abbreviation on a skill to cycle through levels (beg → int → adv → exp).
        </p>
      </CardContent>
    </Card>
  );
}
