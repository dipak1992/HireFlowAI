"use client";

import { useState, useCallback, useTransition, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  FileText,
  RotateCcw,
  Loader2,
} from "lucide-react";
import type { ResumeData, ResumeTemplate, ResumeVersion } from "@/lib/resume-types";
import { updateResume, saveResumeVersion, restoreResumeVersion } from "@/lib/resume-actions";
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

  // Auto-save with debounce
  const debouncedSave = useCallback(
    (updates: Partial<ResumeData>) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(async () => {
        setIsSaving(true);
        const result = await updateResume(resume.id, updates);
        if (!result?.error) {
          setLastSaved(new Date());
        }
        setIsSaving(false);
      }, 1500);
    },
    [resume.id]
  );

  // Update resume field and trigger auto-save
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

  // Manual save
  async function handleSave() {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    setIsSaving(true);
    const result = await updateResume(resume.id, resume);
    if (!result?.error) {
      setLastSaved(new Date());
    }
    setIsSaving(false);
  }

  // Save version
  async function handleSaveVersion() {
    const result = await saveResumeVersion(resume.id, versionName || undefined);
    if (result?.success) {
      setVersionDialogOpen(false);
      setVersionName("");
      // Refresh versions
      const { getResumeVersions } = await import("@/lib/resume-actions");
      const newVersions = await getResumeVersions(resume.id);
      setVersions(newVersions as ResumeVersion[]);
    }
  }

  // Restore version
  async function handleRestoreVersion(versionId: string) {
    if (!confirm("Restore this version? Current changes will be overwritten.")) return;
    const result = await restoreResumeVersion(resume.id, versionId);
    if (result?.success) {
      // Reload resume data
      const { getResume } = await import("@/lib/resume-actions");
      const updated = await getResume(resume.id);
      if (updated) {
        setResume(updated as ResumeData);
      }
    }
  }

  // Template change
  function handleTemplateChange(template: ResumeTemplate) {
    updateField("template", template);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      {/* Top toolbar */}
      <div className="flex items-center justify-between border-b pb-3 mb-4 gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/resume"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted h-8 w-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <input
              type="text"
              value={resume.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="text-lg font-bold bg-transparent border-none outline-none focus:ring-0 p-0 w-auto"
              placeholder="Resume Title"
            />
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <Badge variant="secondary" className="text-[10px]">
                {resume.template === "ats"
                  ? "ATS Classic"
                  : resume.template === "professional"
                  ? "Professional"
                  : "Fast Apply"}
              </Badge>
              {isSaving && (
                <span className="flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Saving...
                </span>
              )}
              {!isSaving && lastSaved && (
                <span>Saved {lastSaved.toLocaleTimeString()}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="h-3.5 w-3.5 mr-1.5" />
            {showPreview ? "Editor" : "Preview"}
          </Button>

          <Dialog open={versionDialogOpen} onOpenChange={setVersionDialogOpen}>
            <DialogTrigger
              className="inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted text-sm font-medium h-7 gap-1 px-2.5 transition-colors"
            >
              <History className="h-3.5 w-3.5 mr-1.5" />
              Versions
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Version History</DialogTitle>
                <DialogDescription>
                  Save snapshots and restore previous versions of your resume.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Version name (optional)"
                    value={versionName}
                    onChange={(e) => setVersionName(e.target.value)}
                  />
                  <Button onClick={handleSaveVersion} size="sm">
                    <Save className="h-3.5 w-3.5 mr-1" />
                    Save
                  </Button>
                </div>
                <ScrollArea className="max-h-64">
                  {versions.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      No saved versions yet. Save a version to create a snapshot.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {versions.map((v) => (
                        <div
                          key={v.id}
                          className="flex items-center justify-between rounded-lg border p-3"
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
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
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

          <ExportMenu resume={resume} />

          <Button onClick={handleSave} disabled={isSaving} size="sm">
            {isSaving ? (
              <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5 mr-1.5" />
            )}
            Save
          </Button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        {showPreview ? (
          /* Full preview mode */
          <div className="h-full flex flex-col">
            <TemplateSwitcher
              current={resume.template}
              onChange={handleTemplateChange}
            />
            <div className="flex-1 overflow-auto mt-4">
              <TemplatePreview resume={resume} />
            </div>
          </div>
        ) : (
          /* Editor + side preview */
          <div className="flex gap-6 h-full">
            {/* Editor panel */}
            <div className="flex-1 overflow-auto pr-2">
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

            {/* Side preview (hidden on small screens) */}
            <div className="hidden xl:block w-[400px] shrink-0 overflow-auto">
              <div className="sticky top-0">
                <TemplateSwitcher
                  current={resume.template}
                  onChange={handleTemplateChange}
                />
                <div className="mt-3 transform scale-[0.55] origin-top-left w-[727px]">
                  <TemplatePreview resume={resume} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
