"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Target,
  FileText,
  Link2,
  Sparkles,
  Loader2,
  Plus,
  Clock,
  Trash2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Zap,
} from "lucide-react";
import {
  createTailoringSession,
  getTailoringSessions,
  deleteTailoringSession,
  getUserResumes,
} from "@/lib/tailoring-actions";
import {
  checkFeatureAccess,
  trackUsage,
  getMonthlyUsage,
  getCurrentPlan,
} from "@/lib/stripe-actions";
import { PLANS } from "@/lib/stripe-config";
import type { TailoringSession } from "@/lib/tailoring-types";
import TailoringResults from "@/components/tailoring/tailoring-results";
import UpgradeModal from "@/components/billing/upgrade-modal";

export default function TailoringPage() {
  const [resumes, setResumes] = useState<{ id: string; title: string; template: string; contact_name: string; updated_at: string }[]>([]);
  const [sessions, setSessions] = useState<TailoringSession[]>([]);
  const [loading, setLoading] = useState(true);

  // New session form
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobCompany, setJobCompany] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeSession, setActiveSession] = useState<TailoringSession | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Usage / billing state
  const [usedThisMonth, setUsedThisMonth] = useState(0);
  const [planId, setPlanId] = useState<"free" | "pro" | "fasthire">("free");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [resumeData, sessionData, used, plan] = await Promise.all([
      getUserResumes(),
      getTailoringSessions(),
      getMonthlyUsage("tailoring"),
      getCurrentPlan(),
    ]);
    setResumes(resumeData as typeof resumes);
    setSessions(sessionData as TailoringSession[]);
    setUsedThisMonth(used);
    setPlanId(plan);
    if (resumeData.length > 0 && !selectedResumeId) {
      setSelectedResumeId(resumeData[0].id);
    }
    setLoading(false);
  }

  async function handleAnalyze() {
    if (!selectedResumeId || !jobDescription.trim()) return;

    // Check usage limit before running
    const access = await checkFeatureAccess("tailoring");
    if (!access.allowed) {
      setShowUpgradeModal(true);
      return;
    }

    setIsAnalyzing(true);

    const result = await createTailoringSession(
      selectedResumeId,
      jobDescription,
      jobTitle || undefined,
      jobCompany || undefined,
      jobUrl || undefined
    );

    if (result?.success && result.sessionId) {
      // Track usage
      await trackUsage("tailoring");
      setUsedThisMonth((prev) => prev + 1);

      // Reload sessions and show results
      const sessionData = await getTailoringSessions();
      setSessions(sessionData as TailoringSession[]);
      const newSession = (sessionData as TailoringSession[]).find(
        (s) => s.id === result.sessionId
      );
      if (newSession) {
        setActiveSession(newSession);
      }
      // Reset form
      setJobDescription("");
      setJobTitle("");
      setJobCompany("");
      setJobUrl("");
      setShowForm(false);
    }

    setIsAnalyzing(false);
  }

  async function handleDelete(sessionId: string) {
    if (!confirm("Delete this tailoring session?")) return;
    await deleteTailoringSession(sessionId);
    if (activeSession?.id === sessionId) {
      setActiveSession(null);
    }
    const sessionData = await getTailoringSessions();
    setSessions(sessionData as TailoringSession[]);
  }

  function getScoreColor(score: number) {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-red-600 bg-red-50 border-red-200";
  }

  // If viewing a session's results
  if (activeSession) {
    return (
      <TailoringResults
        session={activeSession}
        onBack={() => setActiveSession(null)}
        onApplied={async () => {
          const sessionData = await getTailoringSessions();
          setSessions(sessionData as TailoringSession[]);
          setActiveSession(null);
        }}
      />
    );
  }

  const tailoringLimit = PLANS[planId].limits.tailoring_per_month;
  const isAtLimit = tailoringLimit !== null && usedThisMonth >= tailoringLimit;

  return (
    <div className="space-y-6">
      {/* Upgrade modal */}
      {showUpgradeModal && (
        <UpgradeModal
          feature="tailoring"
          reason={`You've used all ${tailoringLimit} tailoring sessions this month. Upgrade to Pro for unlimited access.`}
          upgradeRequired="pro"
          onClose={() => setShowUpgradeModal(false)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Job Tailoring</h2>
          <p className="text-muted-foreground mt-1">
            Compare your resume against job descriptions and optimize for ATS.
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} disabled={isAtLimit}>
          <Plus className="h-4 w-4 mr-1.5" />
          New Analysis
        </Button>
      </div>

      {/* Usage banner */}
      {tailoringLimit !== null && (
        <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${isAtLimit ? "bg-red-50 border-red-200 dark:bg-red-950/30" : "bg-muted/40"}`}>
          <div className="flex items-center gap-2">
            {isAtLimit
              ? <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
              : <Zap className="h-4 w-4 text-primary shrink-0" />}
            <span className="text-sm">
              {isAtLimit
                ? `You've used all ${tailoringLimit} tailoring sessions this month.`
                : `${usedThisMonth} / ${tailoringLimit} tailoring sessions used this month`}
            </span>
          </div>
          {isAtLimit && (
            <Button size="sm" onClick={() => setShowUpgradeModal(true)}>
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Upgrade to Pro
            </Button>
          )}
        </div>
      )}

      {/* New Analysis Form */}
      {showForm && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4" />
              Analyze Resume vs Job
            </CardTitle>
            <CardDescription>
              Paste a job description to compare against your resume and get tailoring suggestions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Resume selector */}
            <div className="space-y-2">
              <Label>Select Resume</Label>
              {resumes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No resumes found.{" "}
                  <Link href="/dashboard/resume" className="text-primary underline">
                    Create one first
                  </Link>
                  .
                </p>
              ) : (
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full h-8 rounded-lg border border-border bg-background px-3 text-sm"
                >
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} {r.contact_name && `(${r.contact_name})`}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Job details */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Job Title (optional)</Label>
                <Input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Software Engineer"
                />
              </div>
              <div className="space-y-2">
                <Label>Company (optional)</Label>
                <Input
                  value={jobCompany}
                  onChange={(e) => setJobCompany(e.target.value)}
                  placeholder="Google"
                />
              </div>
              <div className="space-y-2">
                <Label>Job URL (optional)</Label>
                <Input
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Job description */}
            <div className="space-y-2">
              <Label>Job Description *</Label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={10}
                className="resize-none font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                {jobDescription.length} characters • Paste the complete job posting for best results
              </p>
            </div>

            {/* Analyze button */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !selectedResumeId || !jobDescription.trim()}
              >
                {isAnalyzing ? (
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-1.5" />
                )}
                {isAnalyzing ? "Analyzing..." : "Analyze & Tailor"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sessions list */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 w-32 bg-muted rounded" />
                <div className="h-4 w-24 bg-muted rounded mt-2" />
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : sessions.length === 0 && !showForm ? (
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">No tailoring sessions yet</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                Paste a job description to analyze how well your resume matches
                and get AI-powered suggestions to improve your ATS score.
              </p>
              <Button className="mt-6" onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-1.5" />
                Start Your First Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => setActiveSession(session)}
              className="text-left group"
            >
              <Card className="transition-all hover:shadow-md hover:border-primary/30 h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">
                        {session.job_title || "Untitled Job"}
                      </CardTitle>
                      <CardDescription className="mt-0.5 truncate">
                        {session.job_company || "Unknown Company"}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1.5 ml-2">
                      {session.applied_to_resume && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(session.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* ATS Score */}
                  <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-bold ${getScoreColor(session.ats_score)}`}>
                    <Target className="h-3.5 w-3.5" />
                    {session.ats_score}% ATS Match
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-muted-foreground">
                    <div>
                      <span className="text-green-600 font-medium">
                        {(session.keyword_matches as unknown[])?.length || 0}
                      </span>{" "}
                      keywords matched
                    </div>
                    <div>
                      <span className="text-red-600 font-medium">
                        {(session.missing_keywords as unknown[])?.length || 0}
                      </span>{" "}
                      keywords missing
                    </div>
                    <div>
                      <span className="text-amber-600 font-medium">
                        {(session.missing_skills as unknown[])?.length || 0}
                      </span>{" "}
                      skills gap
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(session.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {/* JD preview */}
                  <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
                    {session.job_description.slice(0, 120)}...
                  </p>

                  <div className="flex items-center gap-1 mt-3 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details <ArrowRight className="h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
