"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, X, Plus } from "lucide-react";
import { createApplication } from "@/lib/tracker-actions";
import type { ApplicationStatus, ApplicationPriority } from "@/lib/tracker-types";
import { cn } from "@/lib/utils";

interface AddApplicationDialogProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddApplicationDialog({
  onClose,
  onSuccess,
}: AddApplicationDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    job_title: "",
    company: "",
    location: "",
    is_remote: false,
    job_url: "",
    apply_url: "",
    company_website: "",
    salary_min: "",
    salary_max: "",
    status: "saved" as ApplicationStatus,
    priority: "medium" as ApplicationPriority,
    applied_at: "",
    deadline_at: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.job_title.trim() || !form.company.trim()) return;

    startTransition(async () => {
      await createApplication({
        job_title: form.job_title.trim(),
        company: form.company.trim(),
        location: form.location.trim(),
        is_remote: form.is_remote,
        job_url: form.job_url.trim(),
        apply_url: form.apply_url.trim(),
        company_website: form.company_website.trim(),
        salary_min: form.salary_min ? parseInt(form.salary_min) : 0,
        salary_max: form.salary_max ? parseInt(form.salary_max) : 0,
        status: form.status,
        priority: form.priority,
        applied_at: form.applied_at || undefined,
        deadline_at: form.deadline_at || undefined,
      });
      onSuccess();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-background rounded-2xl shadow-2xl border w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-base font-bold">Add Application</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <Label className="text-xs font-medium">Job Title *</Label>
              <Input
                placeholder="Senior Software Engineer"
                value={form.job_title}
                onChange={(e) => setForm((f) => ({ ...f, job_title: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label className="text-xs font-medium">Company *</Label>
              <Input
                placeholder="Acme Corp"
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm((f) => ({ ...f, status: v as ApplicationStatus }))}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["saved", "applied", "interview", "offer", "rejected", "archived"] as ApplicationStatus[]).map((s) => (
                    <SelectItem key={s} value={s} className="text-sm capitalize">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(v) => setForm((f) => ({ ...f, priority: v as ApplicationPriority }))}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["low", "medium", "high"] as ApplicationPriority[]).map((p) => (
                    <SelectItem key={p} value={p} className="text-sm capitalize">{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Location</Label>
              <Input
                placeholder="San Francisco, CA"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Work Type</Label>
              <Select
                value={form.is_remote ? "remote" : "onsite"}
                onValueChange={(v) => setForm((f) => ({ ...f, is_remote: v === "remote" }))}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onsite" className="text-sm">On-site</SelectItem>
                  <SelectItem value="remote" className="text-sm">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Salary Min ($)</Label>
              <Input
                type="number"
                placeholder="80000"
                value={form.salary_min}
                onChange={(e) => setForm((f) => ({ ...f, salary_min: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Salary Max ($)</Label>
              <Input
                type="number"
                placeholder="120000"
                value={form.salary_max}
                onChange={(e) => setForm((f) => ({ ...f, salary_max: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label className="text-xs font-medium">Job Posting URL</Label>
              <Input
                placeholder="https://..."
                value={form.job_url}
                onChange={(e) => setForm((f) => ({ ...f, job_url: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label className="text-xs font-medium">Application URL</Label>
              <Input
                placeholder="https://..."
                value={form.apply_url}
                onChange={(e) => setForm((f) => ({ ...f, apply_url: e.target.value }))}
              />
            </div>
            {form.status === "applied" && (
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs font-medium">Date Applied</Label>
                <Input
                  type="date"
                  value={form.applied_at}
                  onChange={(e) => setForm((f) => ({ ...f, applied_at: e.target.value }))}
                />
              </div>
            )}
            <div className="space-y-1.5 col-span-2">
              <Label className="text-xs font-medium">Application Deadline</Label>
              <Input
                type="date"
                value={form.deadline_at}
                onChange={(e) => setForm((f) => ({ ...f, deadline_at: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={!form.job_title.trim() || !form.company.trim() || isPending} className="flex-1">
              {isPending ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Adding...</>
              ) : (
                <><Plus className="h-4 w-4 mr-2" />Add Application</>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
