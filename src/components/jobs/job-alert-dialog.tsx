"use client";

// src/components/jobs/job-alert-dialog.tsx
// Create job alert dialog with query, location, job types, remote toggle, frequency

import { useState, useTransition } from "react";
import {
  Bell,
  X,
  Loader2,
  CheckCircle2,
  MapPin,
  Search,
  Clock,
  Wifi,
} from "lucide-react";
import { createJobAlert } from "@/lib/job-alerts-actions";
import type { JobType, AlertFrequency } from "@/lib/job-alerts-actions";

interface JobAlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
  defaultQuery?: string;
  defaultLocation?: string;
}

const JOB_TYPE_OPTIONS: { value: JobType; label: string }[] = [
  { value: "FULLTIME", label: "Full-time" },
  { value: "PARTTIME", label: "Part-time" },
  { value: "CONTRACTOR", label: "Contract" },
  { value: "INTERN", label: "Internship" },
];

export function JobAlertDialog({
  isOpen,
  onClose,
  onCreated,
  defaultQuery = "",
  defaultLocation = "",
}: JobAlertDialogProps) {
  const [query, setQuery] = useState(defaultQuery);
  const [location, setLocation] = useState(defaultLocation);
  const [jobTypes, setJobTypes] = useState<JobType[]>(["FULLTIME"]);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [frequency, setFrequency] = useState<AlertFrequency>("daily");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  function toggleJobType(type: JobType) {
    setJobTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) {
      setError("Please enter a job title or keyword");
      return;
    }
    if (jobTypes.length === 0) {
      setError("Please select at least one job type");
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await createJobAlert({
        query: query.trim(),
        location: location.trim(),
        job_types: jobTypes,
        remote_only: remoteOnly,
        frequency,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => {
          onCreated?.();
          onClose();
          setSuccess(false);
          setQuery(defaultQuery);
          setLocation(defaultLocation);
          setJobTypes(["FULLTIME"]);
          setRemoteOnly(false);
          setFrequency("daily");
        }, 1500);
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-2xl bg-background border shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Create Job Alert</h2>
              <p className="text-xs text-muted-foreground">
                Get notified when new jobs match your search
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Success State */}
        {success ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <p className="font-semibold text-lg">Alert Created!</p>
            <p className="text-sm text-muted-foreground mt-1">
              You'll receive {frequency} emails when new jobs match your search.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Query */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Job Title or Keywords *
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Software Engineer, Nurse, Warehouse"
                  required
                  className="w-full rounded-lg border bg-background pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Dallas, TX or leave blank for all"
                  className="w-full rounded-lg border bg-background pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            {/* Remote Only Toggle */}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Remote Only</p>
                  <p className="text-xs text-muted-foreground">
                    Only show fully remote positions
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRemoteOnly(!remoteOnly)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  remoteOnly ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    remoteOnly ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            {/* Job Types */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Job Types
              </label>
              <div className="flex flex-wrap gap-2">
                {JOB_TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleJobType(opt.value)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                      jobTypes.includes(opt.value)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:border-primary/50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Clock className="inline h-3.5 w-3.5 mr-1" />
                Alert Frequency
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["daily", "weekly"] as AlertFrequency[]).map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setFrequency(freq)}
                    className={`rounded-lg border py-2.5 text-sm font-medium transition-colors ${
                      frequency === freq
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:border-primary/50"
                    }`}
                  >
                    {freq === "daily" ? "📅 Daily" : "📆 Weekly"}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Alert...
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4" />
                  Create Alert
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
