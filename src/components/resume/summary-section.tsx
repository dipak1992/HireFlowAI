"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlignLeft, Sparkles, Loader2, Wand2, RefreshCw, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import type { ResumeData } from "@/lib/resume-types";
import { aiImproveSummary, aiGenerateSummary } from "@/lib/ai-resume-actions";

interface SummarySectionProps {
  resume: ResumeData;
  updateField: <K extends keyof ResumeData>(field: K, value: ResumeData[K]) => void;
}

const WORD_TARGET = { min: 30, max: 80 };

export default function SummarySection({ resume, updateField }: SummarySectionProps) {
  const [isImproving, setIsImproving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastAction, setLastAction] = useState<"improved" | "generated" | null>(null);
  const [previousSummary, setPreviousSummary] = useState<string | null>(null);

  const wordCount = resume.summary.trim()
    ? resume.summary.trim().split(/\s+/).length
    : 0;
  const charCount = resume.summary.length;

  const wordStatus =
    wordCount === 0
      ? "empty"
      : wordCount < WORD_TARGET.min
      ? "short"
      : wordCount > WORD_TARGET.max
      ? "long"
      : "good";

  const wordStatusColor = {
    empty: "text-muted-foreground",
    short: "text-amber-600",
    long: "text-amber-600",
    good: "text-green-600",
  }[wordStatus];

  async function handleAIImprove() {
    if (!resume.summary.trim()) return;
    setIsImproving(true);
    setPreviousSummary(resume.summary);
    setLastAction(null);

    const result = await aiImproveSummary(resume.summary, {
      name: resume.contact_name,
      experienceCount: resume.experience.length,
      topSkills: resume.skills.slice(0, 6).map((s) => s.name),
      latestTitle: resume.experience[0]?.title ?? "",
    });

    updateField("summary", result.improved);
    setLastAction("improved");
    setIsImproving(false);
  }

  async function handleAIGenerate() {
    setIsGenerating(true);
    setPreviousSummary(resume.summary);
    setLastAction(null);

    const result = await aiGenerateSummary(resume);
    updateField("summary", result.summary);
    setLastAction("generated");
    setIsGenerating(false);
  }

  function handleUndo() {
    if (previousSummary !== null) {
      updateField("summary", previousSummary);
      setPreviousSummary(null);
      setLastAction(null);
    }
  }

  const tips = [
    "Start with your professional title and years of experience.",
    "Mention 2-3 top skills or technologies relevant to your target role.",
    "Include a quantified achievement if possible (e.g., 'reduced costs by 30%').",
    "End with what value you bring to the employer.",
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="text-base flex items-center gap-2">
            <AlignLeft className="h-4 w-4 text-primary" />
            Professional Summary
          </CardTitle>
          <div className="flex items-center gap-2">
            {previousSummary !== null && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUndo}
                className="text-xs gap-1 h-7"
              >
                <RefreshCw className="h-3 w-3" />
                Undo
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleAIGenerate}
              disabled={isGenerating || isImproving}
              className="gap-1.5 h-7 text-xs"
            >
              {isGenerating ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Wand2 className="h-3 w-3" />
              )}
              Generate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAIImprove}
              disabled={isImproving || isGenerating || !resume.summary.trim()}
              className="gap-1.5 h-7 text-xs"
            >
              {isImproving ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Sparkles className="h-3 w-3 text-primary" />
              )}
              AI Improve
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Success feedback */}
        {lastAction && (
          <div className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-2 text-xs text-green-700">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            <span>
              {lastAction === "improved"
                ? "Summary improved with AI. Click Undo to revert."
                : "Summary generated with AI. Click Undo to revert."}
            </span>
          </div>
        )}

        {/* Loading state */}
        {(isImproving || isGenerating) && (
          <div className="flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/20 px-3 py-2 text-xs text-primary">
            <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
            <span>
              {isImproving ? "Improving your summary with AI…" : "Generating summary from your resume data…"}
            </span>
          </div>
        )}

        <Textarea
          value={resume.summary}
          onChange={(e) => {
            updateField("summary", e.target.value);
            setLastAction(null);
          }}
          placeholder="Write a compelling professional summary that highlights your key achievements, skills, and career objectives…"
          rows={6}
          className="resize-none"
        />

        {/* Stats row */}
        <div className="flex items-center justify-between text-xs">
          <span className={wordStatusColor}>
            {wordCount === 0
              ? "Write 30–80 words for best results"
              : wordCount < WORD_TARGET.min
              ? `${wordCount} words — aim for at least ${WORD_TARGET.min}`
              : wordCount > WORD_TARGET.max
              ? `${wordCount} words — consider trimming to under ${WORD_TARGET.max}`
              : `✓ ${wordCount} words — good length`}
          </span>
          <span className="text-muted-foreground">{charCount} chars</span>
        </div>

        {/* Tips */}
        {wordCount === 0 && (
          <div className="rounded-xl border bg-muted/30 p-3 space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Writing tips:</p>
            <ul className="space-y-1">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <span className="text-primary mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
