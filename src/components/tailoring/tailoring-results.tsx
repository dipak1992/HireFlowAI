"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Target,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  Loader2,
  Lightbulb,
  FileText,
} from "lucide-react";
import type {
  TailoringSession,
  KeywordMatch,
  MissingKeyword,
  MissingSkill,
  TailoredExperience,
} from "@/lib/tailoring-types";
import { applyTailoredContent } from "@/lib/tailoring-actions";

interface TailoringResultsProps {
  session: TailoringSession;
  onBack: () => void;
  onApplied: () => void;
}

export default function TailoringResults({
  session,
  onBack,
  onApplied,
}: TailoringResultsProps) {
  const [isApplying, setIsApplying] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const keywordMatches = (session.keyword_matches || []) as KeywordMatch[];
  const missingKeywords = (session.missing_keywords || []) as MissingKeyword[];
  const missingSkills = (session.missing_skills || []) as MissingSkill[];
  const tailoredExperience = (session.tailored_experience || []) as TailoredExperience[];

  async function handleApply() {
    if (!confirm("Apply tailored content to your resume? This will update your summary and experience bullets.")) return;
    setIsApplying(true);
    const result = await applyTailoredContent(session.id);
    if (result?.success) {
      onApplied();
    } else {
      alert(result?.error || "Failed to apply changes");
    }
    setIsApplying(false);
  }

  function copyToClipboard(text: string, field: string) {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }

  function getScoreColor(score: number) {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  }

  function getScoreBg(score: number) {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  }

  function getImportanceBadge(importance: "high" | "medium" | "low") {
    switch (importance) {
      case "high":
        return <Badge className="bg-red-100 text-red-700 text-[10px]">High</Badge>;
      case "medium":
        return <Badge className="bg-amber-100 text-amber-700 text-[10px]">Medium</Badge>;
      case "low":
        return <Badge className="bg-gray-100 text-gray-600 text-[10px]">Low</Badge>;
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-xl font-bold">
              {session.job_title || "Job Analysis"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {session.job_company || ""}
              {session.job_url && (
                <a
                  href={session.job_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary ml-2 underline"
                >
                  View Job →
                </a>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {session.applied_to_resume ? (
            <Badge className="bg-green-100 text-green-700 gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Applied to Resume
            </Badge>
          ) : (
            <Button onClick={handleApply} disabled={isApplying}>
              {isApplying ? (
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-1.5" />
              )}
              Apply Tailored Content
            </Button>
          )}
        </div>
      </div>

      {/* ATS Score Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="text-center">
              <div className={`text-5xl font-bold ${getScoreColor(session.ats_score)}`}>
                {session.ats_score}%
              </div>
              <p className="text-sm text-muted-foreground mt-1">ATS Match Score</p>
            </div>
            <div className="flex-1 min-w-[200px] space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Keyword Match</span>
                  <span className="font-medium">{session.ats_score}%</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${getScoreBg(session.ats_score)}`}
                    style={{ width: `${session.ats_score}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="text-lg font-bold text-green-600">{keywordMatches.length}</div>
                  <div className="text-muted-foreground text-xs">Matched</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-600">{missingKeywords.length}</div>
                  <div className="text-muted-foreground text-xs">Missing</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-amber-600">{missingSkills.length}</div>
                  <div className="text-muted-foreground text-xs">Skills Gap</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed content */}
      <Tabs defaultValue="keywords">
        <TabsList variant="line" className="mb-4">
          <TabsTrigger value="keywords">
            Keywords ({keywordMatches.length + missingKeywords.length})
          </TabsTrigger>
          <TabsTrigger value="skills">
            Skills Gap ({missingSkills.length})
          </TabsTrigger>
          <TabsTrigger value="summary">
            Tailored Summary
          </TabsTrigger>
          <TabsTrigger value="experience">
            Tailored Bullets ({tailoredExperience.length})
          </TabsTrigger>
          <TabsTrigger value="jd">
            Job Description
          </TabsTrigger>
        </TabsList>

        {/* Keywords Tab */}
        <TabsContent value="keywords">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Matched Keywords */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Matched Keywords ({keywordMatches.length})
                </CardTitle>
                <CardDescription>
                  Keywords from the job description found in your resume.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {keywordMatches.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No keyword matches found.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {keywordMatches.map((km, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg border border-green-100 bg-green-50/50 p-2.5"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                          <span className="text-sm font-medium">{km.keyword}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-[10px]">
                            {km.found_in}
                          </Badge>
                          {getImportanceBadge(km.importance)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Missing Keywords */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-red-600">
                  <XCircle className="h-4 w-4" />
                  Missing Keywords ({missingKeywords.length})
                </CardTitle>
                <CardDescription>
                  Keywords from the job description not found in your resume.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {missingKeywords.length === 0 ? (
                  <p className="text-sm text-green-600 text-center py-4">
                    🎉 All keywords matched!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {missingKeywords.map((mk, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-red-100 bg-red-50/50 p-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <XCircle className="h-3.5 w-3.5 text-red-400" />
                            <span className="text-sm font-medium">{mk.keyword}</span>
                          </div>
                          {getImportanceBadge(mk.importance)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 ml-5.5">
                          💡 {mk.suggestion}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Skills Gap Tab */}
        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Missing Skills & Suggestions
              </CardTitle>
              <CardDescription>
                Skills mentioned in the job description that are missing from your resume.
                Only add skills you genuinely possess.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {missingSkills.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-green-600 font-medium">
                    Great! No significant skills gaps detected.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {missingSkills.map((ms, i) => (
                    <div
                      key={i}
                      className="rounded-lg border p-3 flex items-start gap-3"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100">
                        <Lightbulb className="h-4 w-4 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{ms.skill}</span>
                          {getImportanceBadge(ms.importance)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {ms.suggestion}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                    ⚠️ <strong>Important:</strong> Only add skills you genuinely have experience with.
                    Never fabricate skills or experience to match a job description.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tailored Summary Tab */}
        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Tailored Professional Summary
              </CardTitle>
              <CardDescription>
                Your summary rewritten to better match the job description.
                No fake experience added — only rephrased for better ATS matching.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {session.tailored_summary ? (
                <div className="space-y-4">
                  <div className="rounded-lg border bg-primary/5 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                        Tailored Version
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(session.tailored_summary, "summary")}
                      >
                        {copiedField === "summary" ? (
                          <Check className="h-3 w-3 mr-1" />
                        ) : (
                          <Copy className="h-3 w-3 mr-1" />
                        )}
                        {copiedField === "summary" ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                    <p className="text-sm leading-relaxed">{session.tailored_summary}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No tailored summary generated. Add a summary to your resume first.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tailored Experience Tab */}
        <TabsContent value="experience">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Tailored Experience Bullets
              </CardTitle>
              <CardDescription>
                Your experience bullets improved with stronger action verbs and better phrasing.
                Original content preserved — no fabricated achievements.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tailoredExperience.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No experience to tailor. Add work experience to your resume first.
                </p>
              ) : (
                <div className="space-y-6">
                  {tailoredExperience.map((te, i) => (
                    <div key={i} className="space-y-3">
                      <h4 className="text-sm font-semibold text-muted-foreground">
                        Experience #{i + 1}
                      </h4>
                      {te.original_bullets.map((original, bi) => {
                        const tailored = te.tailored_bullets[bi];
                        const changed = original !== tailored;
                        return (
                          <div key={bi} className="rounded-lg border p-3 space-y-2">
                            {changed ? (
                              <>
                                <div className="flex items-start gap-2">
                                  <XCircle className="h-3.5 w-3.5 text-red-400 mt-0.5 shrink-0" />
                                  <p className="text-xs text-muted-foreground line-through">
                                    {original}
                                  </p>
                                </div>
                                <div className="flex items-start gap-2">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                                  <div className="flex-1">
                                    <p className="text-sm">{tailored}</p>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="mt-1 h-6 text-xs"
                                      onClick={() => copyToClipboard(tailored, `bullet-${i}-${bi}`)}
                                    >
                                      {copiedField === `bullet-${i}-${bi}` ? (
                                        <Check className="h-3 w-3 mr-1" />
                                      ) : (
                                        <Copy className="h-3 w-3 mr-1" />
                                      )}
                                      {copiedField === `bullet-${i}-${bi}` ? "Copied!" : "Copy"}
                                    </Button>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="flex items-start gap-2">
                                <Check className="h-3.5 w-3.5 text-gray-400 mt-0.5 shrink-0" />
                                <p className="text-xs text-muted-foreground">
                                  {original} <span className="italic">(no changes needed)</span>
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Job Description Tab */}
        <TabsContent value="jd">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Original Job Description</CardTitle>
              {session.job_url && (
                <CardDescription>
                  <a
                    href={session.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    {session.job_url}
                  </a>
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-muted/30 p-4 text-sm whitespace-pre-wrap font-mono text-xs leading-relaxed max-h-[500px] overflow-auto">
                {session.job_description}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
