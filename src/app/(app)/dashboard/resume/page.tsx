"use client";

import { useEffect, useState, useTransition } from "react";
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
  MoreVertical,
  Trash2,
  Copy,
  Clock,
  Star,
} from "lucide-react";
import { LinkedInIcon } from "@/components/icons";
import { createResume, getResumes, deleteResume } from "@/lib/resume-actions";
import type { ResumeData, ResumeSource, ResumeTemplate } from "@/lib/resume-types";

export default function ResumeStudioPage() {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

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
      await createResume(source, "ats");
    });
  }

  function handleDelete(resumeId: string) {
    if (!confirm("Are you sure you want to delete this resume?")) return;
    startTransition(async () => {
      await deleteResume(resumeId);
    });
  }

  const templateLabels: Record<ResumeTemplate, string> = {
    ats: "ATS Classic",
    professional: "Professional",
    fast_apply: "Fast Apply",
  };

  const sourceLabels: Record<ResumeSource, string> = {
    scratch: "Built from scratch",
    upload: "Uploaded",
    linkedin: "From LinkedIn",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Resume Studio</h2>
          <p className="text-muted-foreground mt-1">
            Create, edit, and export ATS-optimized resumes powered by AI.
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium h-8 gap-1.5 px-2.5 transition-all hover:bg-primary/80"
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
                className="flex items-start gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-muted/50 disabled:opacity-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <PenLine className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Build from Scratch</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Start with a blank template and fill in your details with AI assistance.
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleCreate("upload")}
                disabled={isPending}
                className="flex items-start gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-muted/50 disabled:opacity-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                  <Upload className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Upload PDF / DOCX</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Import an existing resume and enhance it with AI.
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleCreate("linkedin")}
                disabled={isPending}
                className="flex items-start gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-muted/50 disabled:opacity-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0077B5]/10">
                  <LinkedInIcon className="h-5 w-5 text-[#0077B5]" />
                </div>
                <div>
                  <p className="font-medium">Generate from LinkedIn</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Auto-fill your resume using your imported LinkedIn profile data.
                  </p>
                </div>
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resume Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 w-32 bg-muted rounded" />
                <div className="h-4 w-24 bg-muted rounded mt-2" />
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">No resumes yet</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                Create your first AI-powered resume. Choose to build from scratch,
                upload an existing one, or generate from your LinkedIn profile.
              </p>
              <Button
                className="mt-6"
                onClick={() => setCreateOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Create Your First Resume
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <Link
              key={resume.id}
              href={`/dashboard/resume/${resume.id}`}
              className="group"
            >
              <Card className="transition-all hover:shadow-md hover:border-primary/30 h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">
                        {resume.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {sourceLabels[resume.source]}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1.5 ml-2">
                      {resume.is_primary && (
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(resume.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Mini preview */}
                  <div className="rounded-lg border bg-white p-3 text-[8px] leading-tight space-y-1.5 h-32 overflow-hidden">
                    <div className="font-bold text-[10px]">
                      {resume.contact_name || "Your Name"}
                    </div>
                    <div className="text-muted-foreground">
                      {resume.contact_email || "email@example.com"}
                      {resume.contact_phone && ` • ${resume.contact_phone}`}
                    </div>
                    {resume.summary && (
                      <p className="line-clamp-2 text-muted-foreground">
                        {resume.summary}
                      </p>
                    )}
                    {resume.experience?.length > 0 && (
                      <div>
                        <div className="font-semibold text-[9px] mt-1">Experience</div>
                        {resume.experience.slice(0, 2).map((exp) => (
                          <div key={exp.id} className="text-muted-foreground">
                            {exp.title} at {exp.company}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer info */}
                  <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-[10px]">
                      {templateLabels[resume.template]}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(resume.updated_at).toLocaleDateString()}
                    </div>
                  </div>

                  {resume.ats_score !== null && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">ATS Score</span>
                        <span className="font-medium">{resume.ats_score}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            resume.ats_score >= 80
                              ? "bg-green-500"
                              : resume.ats_score >= 60
                              ? "bg-amber-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${resume.ats_score}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}

          {/* Create new card */}
          <button
            onClick={() => setCreateOpen(true)}
            className="group"
          >
            <Card className="transition-all hover:shadow-md hover:border-primary/30 h-full border-dashed">
              <CardContent className="flex flex-col items-center justify-center h-full min-h-[240px] text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-3 group-hover:bg-primary/20 transition-colors">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <p className="font-medium">Create New Resume</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Build, upload, or generate
                </p>
              </CardContent>
            </Card>
          </button>
        </div>
      )}
    </div>
  );
}
