"use client";

import { cn } from "@/lib/utils";
import { FileText, Layout, Zap } from "lucide-react";
import type { ResumeTemplate } from "@/lib/resume-types";

interface TemplateSwitcherProps {
  current: ResumeTemplate;
  onChange: (template: ResumeTemplate) => void;
}

const templates: {
  id: ResumeTemplate;
  name: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    id: "ats",
    name: "ATS Classic",
    description: "Clean, single-column. Best for ATS systems.",
    icon: FileText,
  },
  {
    id: "professional",
    name: "Professional",
    description: "Modern two-column with sidebar.",
    icon: Layout,
  },
  {
    id: "fast_apply",
    name: "Fast Apply",
    description: "Minimal, compact. One-page optimized.",
    icon: Zap,
  },
];

export default function TemplateSwitcher({ current, onChange }: TemplateSwitcherProps) {
  return (
    <div className="flex gap-2">
      {templates.map((t) => {
        const Icon = t.icon;
        const isActive = current === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-2 text-left transition-all text-sm",
              isActive
                ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20"
                : "border-border hover:border-primary/30 hover:bg-muted/50"
            )}
          >
            <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
            <div>
              <p className="font-medium text-xs">{t.name}</p>
              <p className="text-[10px] text-muted-foreground hidden sm:block">{t.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
