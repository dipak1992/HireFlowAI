"use client";

import { useState } from "react";
import Link from "next/link";
import { Upload, PenLine, ChevronRight, Link2 } from "lucide-react";
import { ResumeUploadDialog } from "@/components/resume/resume-upload-dialog";

interface Option {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  action: "scratch" | "upload" | "linkedin";
  badge?: string;
}

const options: Option[] = [
  {
    id: "scratch",
    icon: <PenLine className="h-5 w-5" />,
    title: "Build from scratch",
    description: "Start with a blank template and fill in your details step by step.",
    action: "scratch",
  },
  {
    id: "upload",
    icon: <Upload className="h-5 w-5" />,
    title: "Upload existing resume",
    description: "Upload a PDF or image — we'll parse it with AI and pre-fill your editor.",
    action: "upload",
    badge: "AI-powered",
  },
  {
    id: "linkedin",
    icon: <Link2 className="h-5 w-5" />,
    title: "Import from LinkedIn",
    description: "Connect your LinkedIn profile to auto-populate your resume.",
    action: "linkedin",
    badge: "Coming soon",
  },
];

const colorMap = {
  scratch: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
  upload: "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
  linkedin: "bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400",
};

export function NewResumeChooser() {
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <>
      <div className="space-y-3">
        {options.map((opt) => {
          const isComingSoon = opt.badge === "Coming soon";

          if (opt.action === "scratch") {
            return (
              <Link
                key={opt.id}
                href="/dashboard/resume/new"
                className="flex items-center gap-4 rounded-2xl border bg-card p-4 hover:border-primary/30 hover:bg-primary/[0.02] hover:shadow-sm transition-all group"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colorMap[opt.action]}`}
                >
                  {opt.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{opt.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {opt.description}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
              </Link>
            );
          }

          if (opt.action === "upload") {
            return (
              <button
                key={opt.id}
                onClick={() => setUploadOpen(true)}
                className="w-full flex items-center gap-4 rounded-2xl border bg-card p-4 hover:border-primary/30 hover:bg-primary/[0.02] hover:shadow-sm transition-all group text-left"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colorMap[opt.action]}`}
                >
                  {opt.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{opt.title}</p>
                    {opt.badge && (
                      <span className="inline-flex items-center rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700 dark:bg-violet-950/40 dark:text-violet-400">
                        {opt.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {opt.description}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
              </button>
            );
          }

          // LinkedIn — coming soon
          return (
            <div
              key={opt.id}
              className="flex items-center gap-4 rounded-2xl border bg-card p-4 opacity-50 cursor-not-allowed"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colorMap[opt.action]}`}
              >
                {opt.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{opt.title}</p>
                  {opt.badge && (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                      {opt.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {opt.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <ResumeUploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
      />
    </>
  );
}
