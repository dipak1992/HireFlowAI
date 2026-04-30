"use client";

// src/components/tracker/interview-prep-panel.tsx
// Full interview prep UI with locked state for free users, generate button, expandable Q&A

import { useState, useTransition } from "react";
import {
  Brain,
  Lock,
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles,
  Building2,
  Lightbulb,
  BookOpen,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { generateInterviewPrep, CATEGORY_CONFIG } from "@/lib/interview-prep-engine";
import type { InterviewPrepResult, InterviewQuestion } from "@/lib/interview-prep-engine";

interface InterviewPrepPanelProps {
  jobTitle: string;
  company: string;
  jobDescription: string;
  resumeSummary?: string;
  isPro: boolean;
}

export function InterviewPrepPanel({
  jobTitle,
  company,
  jobDescription,
  resumeSummary,
  isPro,
}: InterviewPrepPanelProps) {
  const [result, setResult] = useState<InterviewPrepResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleGenerate() {
    setError(null);
    startTransition(async () => {
      const { result: prep, error: prepError } = await generateInterviewPrep({
        jobTitle,
        company,
        jobDescription,
        resumeSummary,
      });
      if (prepError) {
        setError(prepError);
      } else {
        setResult(prep);
      }
    });
  }

  function toggleQuestion(id: string) {
    setExpandedQuestion((prev) => (prev === id ? null : id));
  }

  // ─── Locked state for free users ──────────────────────────────────────────
  if (!isPro) {
    return (
      <div className="rounded-xl border bg-card overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">AI Interview Prep</h3>
            <p className="text-xs text-muted-foreground">Powered by GPT-4o</p>
          </div>
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 px-2.5 py-0.5 text-xs font-medium">
            <Lock className="h-3 w-3" />
            Pro
          </span>
        </div>

        {/* Locked Preview */}
        <div className="p-5">
          <div className="relative">
            {/* Blurred preview */}
            <div className="space-y-3 blur-sm pointer-events-none select-none">
              {[
                "Tell me about a time you handled a difficult situation at work.",
                "How do you prioritize tasks when you have multiple deadlines?",
                "What's your experience with [key skill from job description]?",
              ].map((q, i) => (
                <div key={i} className="rounded-lg border p-4">
                  <p className="text-sm font-medium">{q}</p>
                  <div className="mt-2 h-2 bg-muted rounded w-3/4" />
                  <div className="mt-1.5 h-2 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 rounded-lg">
              <Lock className="h-8 w-8 text-muted-foreground mb-3" />
              <p className="font-semibold text-center mb-1">
                Unlock AI Interview Prep
              </p>
              <p className="text-sm text-muted-foreground text-center mb-4 max-w-xs">
                Get 10 tailored interview questions with STAR guides, company research, and expert tips.
              </p>
              <Link
                href="/dashboard/billing"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Upgrade to Pro
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Empty state (not yet generated) ──────────────────────────────────────
  if (!result && !isPending) {
    return (
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="flex items-center gap-3 p-5 border-b">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">AI Interview Prep</h3>
            <p className="text-xs text-muted-foreground">Powered by GPT-4o</p>
          </div>
        </div>

        <div className="p-8 text-center">
          <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
          <h4 className="font-semibold text-lg mb-2">
            Prepare for Your {company} Interview
          </h4>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Get 10 tailored interview questions with STAR format guides, company research, and expert tips — all specific to this role.
          </p>

          {error && (
            <p className="text-sm text-destructive mb-4 bg-destructive/10 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          <button
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Brain className="h-4 w-4" />
            Generate Interview Prep
          </button>

          <p className="text-xs text-muted-foreground mt-3">
            Takes ~10 seconds · Uses 1 tailoring credit
          </p>
        </div>
      </div>
    );
  }

  // ─── Loading state ─────────────────────────────────────────────────────────
  if (isPending) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <Loader2 className="h-10 w-10 text-primary mx-auto mb-4 animate-spin" />
        <p className="font-semibold">Generating your interview prep...</p>
        <p className="text-sm text-muted-foreground mt-1">
          Analyzing the job description and crafting tailored questions
        </p>
      </div>
    );
  }

  // ─── Results ───────────────────────────────────────────────────────────────
  if (!result) return null;

  const questionsByCategory = result.questions.reduce(
    (acc, q) => {
      if (!acc[q.category]) acc[q.category] = [];
      acc[q.category].push(q);
      return acc;
    },
    {} as Record<string, InterviewQuestion[]>
  );

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-5 border-b">
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Brain className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">AI Interview Prep</h3>
          <p className="text-xs text-muted-foreground">
            {result.questions.length} questions · Generated{" "}
            {new Date(result.generatedAt).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isPending}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Regenerate
        </button>
      </div>

      <div className="p-5 space-y-6">
        {/* Company Research */}
        <div className="rounded-lg bg-muted/40 p-4">
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            Company Research: {result.company}
          </h4>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Mission
              </p>
              <p>{result.companyResearch.mission}</p>
            </div>
            {result.companyResearch.recentNews.length > 0 && (
              <div>
                <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Recent News
                </p>
                <ul className="space-y-1">
                  {result.companyResearch.recentNews.map((news, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" />
                      {news}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Interview Style
              </p>
              <p>{result.companyResearch.interviewStyle}</p>
            </div>
          </div>
        </div>

        {/* Questions by Category */}
        {Object.entries(questionsByCategory).map(([category, questions]) => {
          const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
          return (
            <div key={category}>
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config?.color || "bg-muted text-muted-foreground"}`}
                >
                  {config?.label || category}
                </span>
                <span className="text-muted-foreground font-normal">
                  {questions.length} question{questions.length !== 1 ? "s" : ""}
                </span>
              </h4>

              <div className="space-y-2">
                {questions.map((q) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    isExpanded={expandedQuestion === q.id}
                    onToggle={() => toggleQuestion(q.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* General Tips */}
        {result.generalTips.length > 0 && (
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              Expert Tips for This Interview
            </h4>
            <ul className="space-y-2">
              {result.generalTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Question Card ─────────────────────────────────────────────────────────────

function QuestionCard({
  question,
  isExpanded,
  onToggle,
}: {
  question: InterviewQuestion;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-lg border bg-background overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
      >
        <p className="font-medium text-sm leading-snug">{question.question}</p>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t pt-4">
          {/* Why they ask */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
              Why they ask this
            </p>
            <p className="text-sm text-muted-foreground">{question.why}</p>
          </div>

          {/* STAR Guide */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              STAR Framework Guide
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { label: "S — Situation", value: question.starGuide.situation, color: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800" },
                { label: "T — Task", value: question.starGuide.task, color: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800" },
                { label: "A — Action", value: question.starGuide.action, color: "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800" },
                { label: "R — Result", value: question.starGuide.result, color: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800" },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`rounded-lg border p-3 ${item.color}`}
                >
                  <p className="text-xs font-bold mb-1">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          {question.tips.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                Pro Tips
              </p>
              <ul className="space-y-1.5">
                {question.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Lightbulb className="h-3.5 w-3.5 text-yellow-500 mt-0.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
