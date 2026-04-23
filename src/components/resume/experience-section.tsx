"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Loader2,
} from "lucide-react";
import type { ResumeData, ResumeExperience } from "@/lib/resume-types";

interface ExperienceSectionProps {
  resume: ResumeData;
  updateField: <K extends keyof ResumeData>(field: K, value: ResumeData[K]) => void;
}

export default function ExperienceSection({ resume, updateField }: ExperienceSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    resume.experience[0]?.id || null
  );
  const [improvingId, setImprovingId] = useState<string | null>(null);

  function addExperience() {
    const newExp: ResumeExperience = {
      id: `exp-${Date.now()}`,
      title: "",
      company: "",
      location: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: "",
      bullets: [""],
    };
    const updated = [...resume.experience, newExp];
    updateField("experience", updated);
    setExpandedId(newExp.id);
  }

  function removeExperience(id: string) {
    const updated = resume.experience.filter((e) => e.id !== id);
    updateField("experience", updated);
    if (expandedId === id) {
      setExpandedId(updated[0]?.id || null);
    }
  }

  function updateExperience(id: string, field: keyof ResumeExperience, value: unknown) {
    const updated = resume.experience.map((e) =>
      e.id === id ? { ...e, [field]: value } : e
    );
    updateField("experience", updated);
  }

  function updateBullet(expId: string, bulletIndex: number, value: string) {
    const updated = resume.experience.map((e) => {
      if (e.id !== expId) return e;
      const bullets = [...e.bullets];
      bullets[bulletIndex] = value;
      return { ...e, bullets };
    });
    updateField("experience", updated);
  }

  function addBullet(expId: string) {
    const updated = resume.experience.map((e) => {
      if (e.id !== expId) return e;
      return { ...e, bullets: [...e.bullets, ""] };
    });
    updateField("experience", updated);
  }

  function removeBullet(expId: string, bulletIndex: number) {
    const updated = resume.experience.map((e) => {
      if (e.id !== expId) return e;
      const bullets = e.bullets.filter((_, i) => i !== bulletIndex);
      return { ...e, bullets: bullets.length === 0 ? [""] : bullets };
    });
    updateField("experience", updated);
  }

  function moveExperience(index: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= resume.experience.length) return;
    const updated = [...resume.experience];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updateField("experience", updated);
  }

  async function handleAIImprove(expId: string) {
    const exp = resume.experience.find((e) => e.id === expId);
    if (!exp) return;
    setImprovingId(expId);

    // Simulate AI improvement
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const improvedBullets = exp.bullets.map((bullet) => {
      if (!bullet.trim()) return bullet;
      // Simple enhancement: add action verbs and quantification hints
      let improved = bullet;
      const actionVerbs = ["Spearheaded", "Orchestrated", "Implemented", "Optimized", "Delivered", "Architected"];
      const startsWithVerb = actionVerbs.some((v) => improved.toLowerCase().startsWith(v.toLowerCase()));
      if (!startsWithVerb && improved.length > 10) {
        const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
        improved = `${randomVerb} ${improved.charAt(0).toLowerCase()}${improved.slice(1)}`;
      }
      if (!improved.endsWith(".")) improved += ".";
      return improved;
    });

    updateExperience(expId, "bullets", improvedBullets);
    setImprovingId(null);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Work Experience
          </CardTitle>
          <Button variant="outline" size="sm" onClick={addExperience}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {resume.experience.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No work experience added yet.</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={addExperience}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Experience
            </Button>
          </div>
        ) : (
          resume.experience.map((exp, index) => (
            <div
              key={exp.id}
              className="rounded-lg border bg-card"
            >
              {/* Collapsed header */}
              <button
                onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                className="flex items-center w-full p-3 text-left gap-2"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {exp.title || "Untitled Position"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {exp.company || "Company"}{" "}
                    {exp.start_date && `• ${exp.start_date}`}
                    {exp.end_date && ` - ${exp.end_date}`}
                    {exp.is_current && " - Present"}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {index > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveExperience(index, "up");
                      }}
                      className="p-1 rounded hover:bg-muted"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                  )}
                  {index < resume.experience.length - 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveExperience(index, "down");
                      }}
                      className="p-1 rounded hover:bg-muted"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeExperience(exp.id);
                    }}
                    className="p-1 rounded hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </button>
                </div>
              </button>

              {/* Expanded content */}
              {expandedId === exp.id && (
                <div className="px-3 pb-3 space-y-4 border-t pt-3">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Job Title</Label>
                      <Input
                        value={exp.title}
                        onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                        placeholder="Acme Inc."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={exp.location}
                        onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                        placeholder="San Francisco, CA"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="space-y-2 flex-1">
                        <Label>Start Date</Label>
                        <Input
                          value={exp.start_date}
                          onChange={(e) => updateExperience(exp.id, "start_date", e.target.value)}
                          placeholder="Jan 2022"
                        />
                      </div>
                      <div className="space-y-2 flex-1">
                        <Label>End Date</Label>
                        <Input
                          value={exp.is_current ? "Present" : exp.end_date}
                          onChange={(e) => updateExperience(exp.id, "end_date", e.target.value)}
                          placeholder="Dec 2023"
                          disabled={exp.is_current}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`current-${exp.id}`}
                      checked={exp.is_current}
                      onChange={(e) => updateExperience(exp.id, "is_current", e.target.checked)}
                      className="rounded border-border"
                    />
                    <Label htmlFor={`current-${exp.id}`} className="text-sm font-normal">
                      I currently work here
                    </Label>
                  </div>

                  {/* Bullet points */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Key Achievements & Responsibilities</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAIImprove(exp.id)}
                        disabled={improvingId === exp.id}
                      >
                        {improvingId === exp.id ? (
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                          <Sparkles className="h-3 w-3 mr-1" />
                        )}
                        AI Improve
                      </Button>
                    </div>
                    {exp.bullets.map((bullet, bIndex) => (
                      <div key={bIndex} className="flex gap-2">
                        <span className="text-muted-foreground mt-2.5 text-sm">•</span>
                        <Input
                          value={bullet}
                          onChange={(e) => updateBullet(exp.id, bIndex, e.target.value)}
                          placeholder="Describe your achievement or responsibility..."
                          className="flex-1"
                        />
                        <button
                          onClick={() => removeBullet(exp.id, bIndex)}
                          className="p-2 rounded hover:bg-destructive/10 shrink-0"
                          disabled={exp.bullets.length <= 1}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </button>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addBullet(exp.id)}
                      className="text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Bullet Point
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
