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
  CheckCircle2,
  RefreshCw,
  Lightbulb,
} from "lucide-react";
import type { ResumeData, ResumeExperience } from "@/lib/resume-types";
import { aiImproveBullets } from "@/lib/ai-resume-actions";

interface ExperienceSectionProps {
  resume: ResumeData;
  updateField: <K extends keyof ResumeData>(field: K, value: ResumeData[K]) => void;
}

export default function ExperienceSection({ resume, updateField }: ExperienceSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    resume.experience[0]?.id || null
  );
  const [improvingId, setImprovingId] = useState<string | null>(null);
  const [improvedIds, setImprovedIds] = useState<Set<string>>(new Set());
  const [previousBullets, setPreviousBullets] = useState<Record<string, string[]>>({});

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
    // Save previous bullets for undo
    setPreviousBullets((prev) => ({ ...prev, [expId]: [...exp.bullets] }));
    setImprovedIds((prev) => { const s = new Set(prev); s.delete(expId); return s; });

    const result = await aiImproveBullets(exp.bullets, {
      jobTitle: exp.title,
      company: exp.company,
    });

    updateExperience(expId, "bullets", result.improved);
    setImprovedIds((prev) => new Set([...prev, expId]));
    setImprovingId(null);
  }

  function handleUndoBullets(expId: string) {
    const prev = previousBullets[expId];
    if (prev) {
      updateExperience(expId, "bullets", prev);
      setPreviousBullets((p) => { const n = { ...p }; delete n[expId]; return n; });
      setImprovedIds((s) => { const n = new Set(s); n.delete(expId); return n; });
    }
  }

  const bulletTips = [
    "Start with a strong action verb (Led, Built, Reduced, Increased…)",
    "Include numbers and metrics where possible (e.g., 'by 30%', '5 engineers')",
    "Focus on outcomes, not just tasks",
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            Work Experience
          </CardTitle>
          <Button variant="outline" size="sm" onClick={addExperience} className="gap-1 h-7 text-xs">
            <Plus className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {resume.experience.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-10 text-muted-foreground">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-3">
              <Briefcase className="h-7 w-7 opacity-40" />
            </div>
            <p className="text-sm font-medium">No work experience added yet</p>
            <p className="text-xs mt-1 max-w-xs">
              Add your work history to strengthen your resume and improve your ATS score.
            </p>
            <Button variant="outline" size="sm" className="mt-4 gap-1" onClick={addExperience}>
              <Plus className="h-3.5 w-3.5" />
              Add Experience
            </Button>
          </div>
        ) : (
          resume.experience.map((exp, index) => (
            <div
              key={exp.id}
              className="rounded-xl border bg-card overflow-hidden"
            >
              {/* Collapsed header */}
              <button
                onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                className="flex items-center w-full p-3 text-left gap-2 hover:bg-muted/30 transition-colors"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {exp.title || "Untitled Position"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {exp.company || "Company"}
                    {exp.start_date && ` · ${exp.start_date}`}
                    {(exp.end_date || exp.is_current) && ` – ${exp.is_current ? "Present" : exp.end_date}`}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {improvedIds.has(exp.id) && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  )}
                  {index > 0 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); moveExperience(index, "up"); }}
                      className="p-1 rounded hover:bg-muted"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                  )}
                  {index < resume.experience.length - 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); moveExperience(index, "down"); }}
                      className="p-1 rounded hover:bg-muted"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeExperience(exp.id); }}
                    className="p-1 rounded hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </button>
                </div>
              </button>

              {/* Expanded content */}
              {expandedId === exp.id && (
                <div className="px-3 pb-4 space-y-4 border-t pt-4 bg-muted/10">
                  {/* Basic fields */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Job Title</Label>
                      <Input
                        value={exp.title}
                        onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Company</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                        placeholder="Acme Inc."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Location</Label>
                      <Input
                        value={exp.location}
                        onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                        placeholder="San Francisco, CA"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="space-y-1.5 flex-1">
                        <Label className="text-xs">Start Date</Label>
                        <Input
                          value={exp.start_date}
                          onChange={(e) => updateExperience(exp.id, "start_date", e.target.value)}
                          placeholder="Jan 2022"
                        />
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <Label className="text-xs">End Date</Label>
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
                      className="rounded border-border h-3.5 w-3.5"
                    />
                    <Label htmlFor={`current-${exp.id}`} className="text-xs font-normal cursor-pointer">
                      I currently work here
                    </Label>
                  </div>

                  {/* Bullet points */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Key Achievements & Responsibilities</Label>
                      <div className="flex items-center gap-1.5">
                        {previousBullets[exp.id] && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUndoBullets(exp.id)}
                            className="h-6 text-xs gap-1 px-2"
                          >
                            <RefreshCw className="h-3 w-3" />
                            Undo
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAIImprove(exp.id)}
                          disabled={improvingId === exp.id}
                          className="h-6 text-xs gap-1 px-2"
                        >
                          {improvingId === exp.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Sparkles className="h-3 w-3 text-primary" />
                          )}
                          {improvingId === exp.id ? "Improving…" : "AI Improve"}
                        </Button>
                      </div>
                    </div>

                    {/* AI improving feedback */}
                    {improvingId === exp.id && (
                      <div className="flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/20 px-3 py-2 text-xs text-primary">
                        <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
                        Rewriting bullets with stronger action verbs and impact language…
                      </div>
                    )}

                    {/* Improved success */}
                    {improvedIds.has(exp.id) && !improvingId && (
                      <div className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-2 text-xs text-green-700">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                        Bullets improved! Click Undo to revert.
                      </div>
                    )}

                    {exp.bullets.map((bullet, bIndex) => (
                      <div key={bIndex} className="flex gap-2 items-start">
                        <span className="text-muted-foreground mt-2.5 text-sm shrink-0">•</span>
                        <Input
                          value={bullet}
                          onChange={(e) => updateBullet(exp.id, bIndex, e.target.value)}
                          placeholder="Describe your achievement or responsibility…"
                          className="flex-1"
                        />
                        <button
                          onClick={() => removeBullet(exp.id, bIndex)}
                          className="p-2 rounded-lg hover:bg-destructive/10 shrink-0 mt-0.5"
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
                      className="text-xs gap-1 h-7"
                    >
                      <Plus className="h-3 w-3" />
                      Add Bullet Point
                    </Button>

                    {/* Tips when bullets are empty */}
                    {exp.bullets.filter((b) => b.trim()).length === 0 && (
                      <div className="rounded-xl border bg-muted/30 p-3 space-y-1.5">
                        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                          Bullet point tips:
                        </p>
                        <ul className="space-y-1">
                          {bulletTips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                              <span className="text-primary mt-0.5">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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
