"use client";

import { useState, useCallback, useTransition, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  Save,
  Download,
  History,
  Eye,
  Sparkles,
  RotateCcw,
  Loader2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ChevronRight,
  X,
} from "lucide-react";
import type { ResumeData, ResumeTemplate, ResumeVersion } from "@/lib/resume-types";
import { updateResume, saveResumeVersion, restoreResumeVersion } from "@/lib/resume-actions";
import { aiScoreResume } from "@/lib/ai-resume-actions";
import ContactSection from "@/components/resume/contact-section";
import SummarySection from "@/components/resume/summary-section";
import ExperienceSection from "@/components/resume/experience-section";
import EducationSection from "@/components/resume/education-section";
import SkillsSection from "@/components/resume/skills-section";
import CertificationsSection from "@/components/resume/certifications-section";
import ProjectsSection from "@/components/resume/projects-section";
import TemplatePreview from "@/components/resume/template-preview";
import TemplateSwitcher from "@/components/resume/template-switcher";
import ExportMenu from "@/components/resume/export-menu";

interface ResumeEditorClientProps {
  initialResume: ResumeData;
  initialVersions: ResumeVersion[];
}

export default function ResumeEditorClient({
  initialResume,
  initialVersions,
}: ResumeEditorClientProps) {
  const [resume, setResume] = useState<ResumeData>(initialResume);
  const [versions, setVersions] = useState<ResumeVersion[]>(initialVersions);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [versionDialogOpen, setVersionDialogOpen] = useState(false);
  const [versionName, setVersionName] = useState("");
  const [isPending, startTransition] = useTransition();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ATS Score panel
  const [scoreOpen, setScoreOpen] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [scoreData, setScoreData] = useState<{
    score: number;
    feedback: string[];
    usedAI: boolean;
  } | null>(null);

  // Auto-save with debounce
  const debouncedSave = useCallback(
    (updates: Partial<ResumeData>) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(async () => {
        setIsSaving(true);
        const result = await updateResume(resume.id, updates);
        if (!result?.error) setLastSaved(new Date());
        setIsSaving(false);
      }, 1500);
    },
    [resume.id]
  );

  const updateField = useCallback(
    <K extends keyof ResumeData>(field: K, value: ResumeData[K]) => {
      setResume((prev) => {
        const updated = { ...prev, [field]: value };
        debouncedSave({ [field]: value });
        return updated;
      });
    },
    [debouncedSave]
  );

  async function handleSave() {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    setIsSaving(true);
    const result = await updateResume(resume.id, resume);
    if (!result?.error) setLastSaved(new Date());
    setIsSaving(false);
  }

  async function handleSaveVersion() {
    const result = await saveResumeVersion(resume.id, versionName || undefined);
    if (result?.success) {
      setVersionDialogOpen(false);
      setVersionName("");
      const { getResumeVersions } = await import("@/lib/resume-actions");
      const newVersions = await getResumeVersions(resume.id);
      setVersions(newVersions as ResumeVersion[]);
    }
  }

  async function handleRestoreVersion(versionId: string) {
    if (!confirm("Restore this version? Current changes will be overwritten.")) return;
    const result = await restoreResumeVersion(resume.id, versionId);
    if (result?.success) {
      const { getResume } = await import("@/lib/resume-actions");
      const updated = await getResume(resume.id);
      if (updated) setResume(updated as ResumeData);
    }
  }

  function handleTemplateChange(template: ResumeTemplate) {
    updateField("template", template);
  }

  async function handleGetATSScore() {
    setIsScoring(true);
    setScoreOpen(true);
    const result = await aiScoreResume(resume);
    setScoreData(result);
    // Persist score to DB
    await updateResume(resume.id, { ats_score: result.score });
    setResume((prev) => ({ ...prev, ats_score: result.score }));
    setIsScoring(false);
  }

  function getScoreColor(score: number) {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-500";
  }

  function getScoreBg(score: number) {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  }

  function getScoreLabel(score: number) {
    if (score >= 80) return "Strong";
    if (score >= 60) return "Good";
    return "Needs Work";
  }

  const templateLabel =
    resume.template === "ats"
      ? "ATS Classic"
      : resume.template === "professional"
      ? "Professional"
      : "Fast Apply";

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      {/* ── Top toolbar ── */}
      <div className="flex items-center justify-between border-b pb-3 mb-4 gap-3 flex-wrap">
        {/* Left: back + title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/dashboard/resume"
            className="inline-flex items-center justify-center rounded-xl border border-border bg-background hover:bg-muted h-8 w-8 transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <input
              type="text"
              value={resume.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="text-base font-bold bg-transparent border-none outline-none focus:ring-0 p-0 w-full max-w-[200px] sm:max-w-xs truncate"
              placeholder="Resume Title"
            />
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {templateLabel}
              </Badge>
              {isSaving ? (
                <span className="flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Saving…
                </span>
              ) : lastSaved ? (
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* ATS Score button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleGetATSScore}
            disabled={isScoring}
            className="gap-1.5 h-8 text-xs"
          >
            {isScoring ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
            )}
            {resume.ats_score !== null ? (
              <span className={getScoreColor(resume.ats_score)}>
                {resume.ats_score}% ATS
              </span>
            ) : (
              "ATS Score"
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="gap-1.5 h-8 text-xs"
          >
            <Eye className="h-3.5 w-3.5" />
            {showPreview ? "Editor" : "Preview"}
          </Button>

          {/* Version history */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setVersionDialogOpen(true)}
            className="gap-1.5 h-8 text-xs"
          >
            <History className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Versions</span>
          </Button>

          <ExportMenu resume={resume} />

          <Button onClick={handleSave} disabled={isSaving} size="sm" className="h-8 gap-1.5 text-xs">
            {isSaving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            Save
          </Button>
        </div>
      </div>

      {/* ── ATS Score Panel (inline below toolbar) ── */}
      {scoreOpen && (
        <div className="mb-4 rounded-xl border bg-card p-4 relative">
          <button
            onClick={() => setScoreOpen(false)}
            className="absolute top-3 right-3 p-1 rounded-lg hover:bg-muted"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
          {isScoring ? (
            <div className="flex items-center gap-3 py-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <div>
                <p className="text-sm font-medium">Analyzing your resume…</p>
                <p className="text-xs text-muted-foreground">Checking ATS compatibility and completeness</p>
              </div>
            </div>
          ) : scoreData ? (
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl border-2 shrink-0"
                  style={{ borderColor: scoreData.score >= 80 ? "#22c55e" : scoreData.score >= 60 ? "#f59e0b" : "#ef4444" }}
                >
                  <span className={`text-xl font-bold ${getScoreColor(scoreData.score)}`}>
                    {scoreData.score}
                  </span>
                  <span className="text-[10px] text-muted-foreground">/ 100</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">
                      ATS Score: <span className={getScoreColor(scoreData.score)}>{getScoreLabel(scoreData.score)}</span>
                    </p>
                    {scoreData.usedAI && (
                      <Badge variant="secondary" className="text-[10px] gap-1 px-1.5">
                        <Sparkles className="h-2.5 w-2.5" />
                        AI
                      </Badge>
                    )}
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${getScoreBg(scoreData.score)}`}
                      style={{ width: `${scoreData.score}%` }}
                    />
                  </div>
                </div>
              </div>
              {scoreData.feedback.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground">Improvement tips:</p>
                  {scoreData.feedback.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      {scoreData.score >= 80 ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                      ) : (
                        <AlertCircle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                      )}
                      <span className="text-muted-foreground">{tip}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* ── Main content area ── */}
      <div className="flex-1 overflow-hidden">
        {showPreview ? (
          <div className="h-full flex flex-col">
            <TemplateSwitcher current={resume.template} onChange={handleTemplateChange} />
            <div className="flex-1 overflow-auto mt-4">
              <TemplatePreview resume={resume} />
            </div>
          </div>
        ) : (
          <div className="flex gap-6 h-full">
            {/* Editor panel */}
            <div className="flex-1 overflow-auto pr-1">
              <Tabs defaultValue="contact">
                <TabsList variant="line" className="mb-4">
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                  <TabsTrigger value="more">More</TabsTrigger>
                </TabsList>

                <TabsContent value="contact">
                  <ContactSection resume={resume} updateField={updateField} />
                </TabsContent>
                <TabsContent value="summary">
                  <SummarySection resume={resume} updateField={updateField} />
                </TabsContent>
                <TabsContent value="experience">
                  <ExperienceSection resume={resume} updateField={updateField} />
                </TabsContent>
                <TabsContent value="education">
                  <EducationSection resume={resume} updateField={updateField} />
                </TabsContent>
                <TabsContent value="skills">
                  <SkillsSection resume={resume} updateField={updateField} />
                </TabsContent>
                <TabsContent value="more">
                  <div className="space-y-6">
                    <CertificationsSection resume={resume} updateField={updateField} />
                    <ProjectsSection resume={resume} updateField={updateField} />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Side preview (xl+) */}
            <div className="hidden xl:block w-[400px] shrink-0 overflow-auto">
              <div className="sticky top-0">
                <TemplateSwitcher current={resume.template} onChange={handleTemplateChange} />
                <div className="mt-3 transform scale-[0.55] origin-top-left w-[727px]">
                  <TemplatePreview resume={resume} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Version History Dialog ── */}
      <Dialog open={versionDialogOpen} onOpenChange={setVersionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="flex gap-2">
              <Input
                placeholder="Version name (optional)"
                value={versionName}
                onChange={(e) => setVersionName(e.target.value)}
              />
              <Button onClick={handleSaveVersion} size="sm" className="shrink-0">
                <Save className="h-3.5 w-3.5 mr-1" />
                Save
              </Button>
            </div>
            <ScrollArea className="max-h-64">
              {versions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No saved versions yet. Save a version to create a snapshot.
                </p>
              ) : (
                <div className="space-y-2">
                  {versions.map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center justify-between rounded-xl border p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {v.version_name || `Version ${v.version_number}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(v.created_at).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestoreVersion(v.id)}
                        className="gap-1 h-7 text-xs"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Restore
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
