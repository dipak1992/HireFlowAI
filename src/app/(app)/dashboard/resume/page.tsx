"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileText,
  Plus,
  Upload,
  PenLine,
  Sparkles,
  Trash2,
  Clock,
  Star,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { LinkedInIcon } from "@/components/icons";
import { createResume, getResumes, deleteResume } from "@/lib/resume-actions";
import type { ResumeData, ResumeSource, ResumeTemplate } from "@/lib/resume-types";

export default function ResumeStudioPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadResumes();
  }, []);

  async function loadResumes() {
    setLoading(true);
    const data = await getResumes();
    setResumes(data as ResumeData[]);
    setLoading(false);
  }

  function handleCreate(source: ResumeSource) {
    startTransition(async () => {
      const result = await createResume(source, "ats");
      if (result?.id) {
        router.push(`/dashboard/resume/${result.id}`);
      }
    });
  }

  function handleDelete(resumeId: string) {
    if (!confirm("Are you sure you want to delete this resume?")) return;
    setDeletingId(resumeId);
    startTransition(async () => {
      await deleteResume(resumeId);
      setDeletingId(null);
      loadResumes();
    });
  }

  const templateLabels: Record<ResumeTemplate, string> = {
    ats: "ATS Classic",
    professional: "Professional",
    fast_apply: "Fast Apply",
  };

  const templateColors: Record<ResumeTemplate, string> = {
    ats: "bg-blue-500/10 text-blue-600 border-blue-200",
    professional: "bg-violet-500/10 text-violet-600 border-violet-200",
    fast_apply: "bg-amber-500/10 text-amber-600 border-amber-200",
  };

  const sourceLabels: Record<ResumeSource, string> = {
    scratch: "Built from scratch",
    upload: "Uploaded",
    linkedin: "From LinkedIn",
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Resume Studio</h2>
          <p className="text-muted-foreground mt-1">
            Create, edit, and export ATS-optimized resumes powered by AI.
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger
            render={<Button className="shrink-0 gap-1.5" />}
          >
            <Plus className="h-4 w-4" />
            New Resume
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Resume</DialogTitle>
              <DialogDescription>
                Choose how you&apos;d like to start building your resume.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-4">
              <button
                onClick={() => handleCreate("scratch")}
                disabled={isPending}
                className="group flex items-start gap-4 rounded-xl border p-4 text-left transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm disabled:opacity-50"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <PenLine className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">Build from Scratch</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Start with a blank template and fill in your details with AI assistance.
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </button>

              <button
                onClick={() => handleCreate("upload")}
                disabled={isPending}
                className="group flex items-start gap-4 rounded-xl border p-4 text-left transition-all hover:border-blue-400/40 hover:bg-blue-500/5 hover:shadow-sm disabled:opacity-50"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                  <Upload className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">Upload PDF / DOCX</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Import an existing resume and enhance it with AI.
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </button>

              <button
                onClick={() => handleCreate("linkedin")}
                disabled={isPending}
                className="group flex items-start gap-4 rounded-xl border p-4 text-left transition-all hover:border-[#0077B5]/30 hover:bg-[#0077B5]/5 hover:shadow-sm disabled:opacity-50"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0077B5]/10 group-hover:bg-[#0077B5]/20 transition-colors">
                  <LinkedInIcon className="h-5 w-5 text-[#0077B5]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">Generate from LinkedIn</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Auto-fill your resume using your imported LinkedIn profile data.
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </button>
            </div>
            {isPending && (
              <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating your resume…
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Resume Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 w-32 bg-muted rounded-md" />
                <div className="h-4 w-24 bg-muted rounded-md mt-2" />
              </CardHeader>
              <CardContent>
                <div className="h-36 bg-muted rounded-lg" />
                <div className="h-4 w-full bg-muted rounded-md mt-3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : resumes.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 py-20 text-center px-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 mb-5">
            <FileText className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">No resumes yet</h3>
          <p className="text-muted-foreground mt-2 max-w-sm text-sm">
            Create your first AI-powered resume. Build from scratch, upload an existing one,
            or generate from your LinkedIn profile.
          </p>
          <div className="flex flex-wrap gap-3 mt-6 justify-center">
            <Button onClick={() => setCreateOpen(true)} className="gap-1.5">
              <PenLine className="h-4 w-4" />
              Build from Scratch
            </Button>
            <Button variant="outline" onClick={() => setCreateOpen(true)} className="gap-1.5">
              <Upload className="h-4 w-4" />
              Upload Resume
            </Button>
          </div>
          {/* Tips */}
          <div className="mt-10 grid gap-3 sm:grid-cols-3 max-w-2xl w-full text-left">
            {[
              { icon: Sparkles, title: "AI-Powered", desc: "Get AI suggestions for summaries and bullet points" },
              { icon: TrendingUp, title: "ATS Scoring", desc: "See how well your resume passes ATS filters" },
              { icon: FileText, title: "3 Templates", desc: "ATS Classic, Professional, and Fast Apply" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border bg-background p-4">
                <Icon className="h-5 w-5 text-primary mb-2" />
                <p className="font-medium text-sm">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <Link
              key={resume.id}
              href={`/dashboard/resume/${resume.id}`}
              className="group block"
            >
              <Card className="transition-all duration-200 hover:shadow-md hover:shadow-primary/8 hover:border-primary/30 h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {resume.is_primary && (
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                        )}
                        <CardTitle className="text-base truncate">
                          {resume.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-xs">
                        {sourceLabels[resume.source]}
                      </CardDescription>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(resume.id);
                      }}
                      disabled={deletingId === resume.id}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-destructive/10 shrink-0"
                    >
                      {deletingId === resume.id ? (
                        <Loader2 className="h-3.5 w-3.5 text-destructive animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      )}
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Mini resume preview */}
                  <div className="rounded-lg border bg-white dark:bg-slate-50 p-3 text-[8px] leading-tight space-y-1.5 h-36 overflow-hidden relative">
                    <div className="font-bold text-[10px] text-slate-900">
                      {resume.contact_name || "Your Name"}
                    </div>
                    <div className="text-slate-500">
                      {resume.contact_email || "email@example.com"}
                      {resume.contact_phone && ` • ${resume.contact_phone}`}
                    </div>
                    {resume.summary && (
                      <p className="line-clamp-2 text-slate-600 mt-1">
                        {resume.summary}
                      </p>
                    )}
                    {resume.experience?.length > 0 && (
                      <div className="mt-1">
                        <div className="font-semibold text-[9px] text-slate-700 uppercase tracking-wide">
                          Experience
                        </div>
                        {resume.experience.slice(0, 2).map((exp) => (
                          <div key={exp.id} className="text-slate-600 mt-0.5">
                            <span className="font-medium">{exp.title}</span>
                            {exp.company && ` · ${exp.company}`}
                          </div>
                        ))}
                      </div>
                    )}
                    {resume.skills?.length > 0 && (
                      <div className="mt-1">
                        <div className="font-semibold text-[9px] text-slate-700 uppercase tracking-wide">
                          Skills
                        </div>
                        <div className="text-slate-600">
                          {resume.skills.slice(0, 5).map((s) => s.name).join(", ")}
                        </div>
                      </div>
                    )}
                    {/* Fade overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-slate-50 to-transparent" />
                  </div>

                  {/* Footer row */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${templateColors[resume.template]}`}
                    >
                      {templateLabels[resume.template]}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(resume.updated_at).toLocaleDateString()}
                    </div>
                  </div>

                  {/* ATS Score bar */}
                  {resume.ats_score !== null ? (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1">
                          {resume.ats_score >= 80 ? (
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                          ) : (
                            <AlertCircle className="h-3 w-3 text-amber-500" />
                          )}
                          ATS Score
                        </span>
                        <span className={`font-semibold ${getScoreColor(resume.ats_score)}`}>
                          {resume.ats_score}% · {getScoreLabel(resume.ats_score)}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${getScoreBg(resume.ats_score)}`}
                          style={{ width: `${resume.ats_score}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Sparkles className="h-3 w-3 text-primary" />
                      <span>Open to get your ATS score</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}

          {/* Create new card */}
          <button
            onClick={() => setCreateOpen(true)}
            className="group text-left"
          >
            <Card className="transition-all duration-200 hover:shadow-md hover:border-primary/30 h-full border-dashed min-h-[240px]">
              <CardContent className="flex flex-col items-center justify-center h-full min-h-[240px] text-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Plus className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Create New Resume</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Build, upload, or generate from LinkedIn
                  </p>
                </div>
              </CardContent>
            </Card>
          </button>
        </div>
      )}
    </div>
  );
}
