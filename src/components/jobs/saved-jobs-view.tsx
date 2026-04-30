"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Bookmark,
  ExternalLink,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Building2,
  Target,
  Trash2,
  Loader2,
  StickyNote,
} from "lucide-react";
import type { SavedJob, SavedJobStatus } from "@/lib/job-types";
import {
  SAVED_STATUS_LABELS,
  SAVED_STATUS_COLORS,
  JOB_TYPE_LABELS,
  EXPERIENCE_LABELS,
} from "@/lib/job-types";
import {
  getSavedJobsWithStatusAction,
  unsaveJobAction,
  updateSavedJobStatusAction,
} from "@/lib/job-actions";

interface SavedJobsViewProps {
  onBack: () => void;
}

const STATUS_OPTIONS: SavedJobStatus[] = [
  "saved",
  "applied",
  "interviewing",
  "offered",
  "rejected",
  "withdrawn",
];

export default function SavedJobsView({ onBack }: SavedJobsViewProps) {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<SavedJobStatus | "all">("all");
  const [notesJobId, setNotesJobId] = useState<string | null>(null);
  const [notesText, setNotesText] = useState("");

  useEffect(() => {
    loadSavedJobs();
  }, []);

  async function loadSavedJobs() {
    setLoading(true);
    const { jobs } = await getSavedJobsWithStatusAction();
    setSavedJobs(jobs);
    setLoading(false);
  }

  async function handleStatusChange(jobId: string, status: SavedJobStatus) {
    await updateSavedJobStatusAction(jobId, status);
    await loadSavedJobs();
  }

  async function handleRemove(jobId: string) {
    if (!confirm("Remove this job from saved?")) return;
    await unsaveJobAction(jobId);
    await loadSavedJobs();
  }

  async function handleSaveNotes(jobId: string) {
    await updateSavedJobStatusAction(
      jobId,
      savedJobs.find((sj) => sj.job_id === jobId)?.status || "saved",
      notesText
    );
    setNotesJobId(null);
    setNotesText("");
    await loadSavedJobs();
  }

  const filtered = filterStatus === "all"
    ? savedJobs
    : savedJobs.filter((sj) => sj.status === filterStatus);

  // Count by status
  const statusCounts = savedJobs.reduce<Record<string, number>>((acc, sj) => {
    acc[sj.status] = (acc[sj.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-xl font-bold">Saved Jobs & Tracker</h2>
          <p className="text-sm text-muted-foreground">
            {savedJobs.length} saved job{savedJobs.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus("all")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            filterStatus === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          All ({savedJobs.length})
        </button>
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filterStatus === status
                ? "bg-primary text-primary-foreground"
                : `${SAVED_STATUS_COLORS[status]} hover:opacity-80`
            }`}
          >
            {SAVED_STATUS_LABELS[status]} ({statusCounts[status] || 0})
          </button>
        ))}
      </div>

      {/* Saved jobs list */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-center">
              <Bookmark className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <h3 className="text-lg font-semibold">
                {filterStatus === "all" ? "No saved jobs yet" : `No ${SAVED_STATUS_LABELS[filterStatus as SavedJobStatus].toLowerCase()} jobs`}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Save jobs from the dashboard to track your applications.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((savedJob) => {
            const job = savedJob.job;
            if (!job) return null;

            return (
              <Card key={savedJob.id} className="transition-all hover:shadow-sm">
                <CardContent className="pt-4">
                  <div className="flex gap-4">
                    <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Building2 className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-sm">{job.title}</h3>
                          <p className="text-xs text-muted-foreground">{job.company}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Status selector */}
                          <select
                            value={savedJob.status}
                            onChange={(e) => handleStatusChange(savedJob.job_id, e.target.value as SavedJobStatus)}
                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium border-0 cursor-pointer ${SAVED_STATUS_COLORS[savedJob.status]}`}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {SAVED_STATUS_LABELS[s]}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleRemove(savedJob.job_id)}
                            className="p-1 rounded hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </button>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {JOB_TYPE_LABELS[job.job_type]}
                        </span>
                        {savedJob.applied_at && (
                          <span className="flex items-center gap-1 text-primary">
                            <Clock className="h-3 w-3" />
                            Applied {new Date(savedJob.applied_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {/* Notes */}
                      {savedJob.notes && (
                        <p className="text-xs text-muted-foreground mt-2 italic bg-muted/50 rounded p-2">
                          📝 {savedJob.notes}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-2">
                        {job.apply_url && (
                          <a href={job.apply_url} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Apply
                            </Button>
                          </a>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setNotesJobId(savedJob.job_id);
                            setNotesText(savedJob.notes || "");
                          }}
                        >
                          <StickyNote className="h-3 w-3 mr-1" />
                          Notes
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Notes dialog */}
      {notesJobId && (
        <Dialog open={!!notesJobId} onOpenChange={() => setNotesJobId(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Job Notes</DialogTitle>
              <DialogDescription>
                Add notes about this job application.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Interview date, contact person, follow-up reminders..."
              rows={4}
              className="resize-none"
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="outline" onClick={() => setNotesJobId(null)}>
                Cancel
              </Button>
              <Button onClick={() => handleSaveNotes(notesJobId)}>
                Save Notes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
