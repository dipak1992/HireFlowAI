// src/components/jobs/job-card.tsx
"use client";

import { useState, useTransition } from "react";
import {
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  MapPin,
  Building2,
  Clock,
  DollarSign,
  Wifi,
  Briefcase,
  FileText,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveJobAction, unsaveJobAction } from "@/lib/job-actions";
import type { NormalizedJob } from "@/lib/jsearch-types";
import { JOB_TYPE_LABELS, SALARY_PERIOD_LABELS } from "@/lib/jsearch-types";

interface JobCardProps {
  job: NormalizedJob;
  isSaved: boolean;
  onSavedChange?: (saved: boolean) => void;
  onTailor?: (job: NormalizedJob) => void;
  compact?: boolean;
}

function formatSalary(job: NormalizedJob): string | null {
  if (!job.salary_min && !job.salary_max) return null;

  const currency = job.salary_currency || "USD";
  const period = job.salary_period
    ? (SALARY_PERIOD_LABELS[job.salary_period] || "")
    : "";

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  if (job.salary_min && job.salary_max) {
    return `${formatter.format(job.salary_min)} – ${formatter.format(job.salary_max)}${period}`;
  }
  if (job.salary_min) {
    return `From ${formatter.format(job.salary_min)}${period}`;
  }
  if (job.salary_max) {
    return `Up to ${formatter.format(job.salary_max)}${period}`;
  }
  return null;
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

export function JobCard({
  job,
  isSaved,
  onSavedChange,
  onTailor,
  compact = false,
}: JobCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [saving, startSaving] = useTransition();
  const salary = formatSalary(job);

  const handleSave = () => {
    startSaving(async () => {
      if (isSaved) {
        const result = await unsaveJobAction(job.id);
        if (result.success) onSavedChange?.(false);
      } else {
        const result = await saveJobAction(job);
        if (result.success) {
          onSavedChange?.(true);
        } else if (result.error) {
          alert(result.error);
        }
      }
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
      <div className="flex gap-3">
        {/* Company Logo */}
        <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
          {job.company_logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={job.company_logo}
              alt={job.company}
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                if (target.parentElement) {
                  target.parentElement.innerHTML = `<span class="text-lg font-bold text-zinc-500">${job.company.charAt(0)}</span>`;
                }
              }}
            />
          ) : (
            <Building2 className="h-5 w-5 text-zinc-400" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm leading-tight truncate">
                {job.title}
              </h3>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
                  {job.company}
                </span>
                {job.company_website && (
                  <a
                    href={job.company_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 shrink-0"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="shrink-0 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              aria-label={isSaved ? "Unsave job" : "Save job"}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isSaved ? (
                <BookmarkCheck className="h-4 w-4 text-blue-600" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
            {job.location && (
              <span className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                <MapPin className="h-3 w-3" />
                {job.location}
              </span>
            )}

            {job.is_remote && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <Wifi className="h-3 w-3" />
                Remote
              </span>
            )}

            {job.job_type && (
              <span className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                <Briefcase className="h-3 w-3" />
                {JOB_TYPE_LABELS[job.job_type] || job.job_type}
              </span>
            )}

            {salary && (
              <span className="inline-flex items-center gap-1 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                <DollarSign className="h-3 w-3" />
                {salary}
              </span>
            )}

            {job.posted_at && (
              <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
                <Clock className="h-3 w-3" />
                {timeAgo(job.posted_at)}
              </span>
            )}
          </div>

          {/* Skills */}
          {job.required_skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {job.required_skills.slice(0, 6).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs"
                >
                  {skill}
                </span>
              ))}
              {job.required_skills.length > 6 && (
                <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-xs">
                  +{job.required_skills.length - 6} more
                </span>
              )}
            </div>
          )}

          {/* Source */}
          <div className="mt-2">
            <span className="text-[11px] text-zinc-400">
              via {job.source}
            </span>
          </div>

          {/* Expanded Description */}
          {expanded && (
            <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
              <div
                className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-[12] prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: job.description
                    .replace(/\n/g, "<br/>")
                    .slice(0, 3000),
                }}
              />

              {job.highlights.qualifications.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Qualifications
                  </p>
                  <ul className="space-y-0.5">
                    {job.highlights.qualifications.slice(0, 5).map((q, i) => (
                      <li key={i} className="text-xs text-zinc-600 dark:text-zinc-400 flex gap-1.5">
                        <span className="text-zinc-400 shrink-0">•</span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.highlights.benefits.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Benefits
                  </p>
                  <ul className="space-y-0.5">
                    {job.highlights.benefits.slice(0, 5).map((b, i) => (
                      <li key={i} className="text-xs text-zinc-600 dark:text-zinc-400 flex gap-1.5">
                        <span className="text-zinc-400 shrink-0">•</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Actions Row */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <a
              href={job.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              Apply
              {job.apply_is_direct && (
                <span className="text-blue-200 text-[10px]">(Direct)</span>
              )}
            </a>

            {onTailor && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onTailor(job)}
                className="text-xs"
              >
                <FileText className="h-3 w-3 mr-1" />
                Tailor Resume &amp; Apply
              </Button>
            )}

            <button
              onClick={() => setExpanded(!expanded)}
              className="ml-auto text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 flex items-center gap-1"
            >
              {expanded ? (
                <>
                  Less <ChevronUp className="h-3 w-3" />
                </>
              ) : (
                <>
                  Details <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
