"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  ArrowUpDown,
  Eye,
  Sparkles,
  Trash2,
  ArrowRight,
  Star,
} from "lucide-react";
import {
  type Application,
  type ApplicationStatus,
  ALL_STATUSES,
  STATUS_LABELS,
  STATUS_COLORS,
  PRIORITY_COLORS,
} from "@/lib/tracker-types";
import { updateApplicationStatus, deleteApplication } from "@/lib/tracker-actions";
import { cn } from "@/lib/utils";

interface TrackerTableProps {
  applications: Application[];
  onRefresh: () => void;
  onViewDetail: (app: Application) => void;
  onGeneratePrep: (app: Application) => void;
}

type SortKey = "job_title" | "company" | "status" | "priority" | "applied_at" | "updated_at";
type SortDir = "asc" | "desc";

export default function TrackerTable({
  applications,
  onRefresh,
  onViewDetail,
  onGeneratePrep,
}: TrackerTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("updated_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [loading, setLoading] = useState<string | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = [...applications].sort((a, b) => {
    let aVal: string | number = a[sortKey] as string ?? "";
    let bVal: string | number = b[sortKey] as string ?? "";

    if (sortKey === "priority") {
      const order = { high: 3, medium: 2, low: 1 };
      aVal = order[a.priority] ?? 0;
      bVal = order[b.priority] ?? 0;
    }

    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this application?")) return;
    setLoading(id);
    await deleteApplication(id);
    setLoading(null);
    onRefresh();
  };

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    setLoading(id);
    await updateApplicationStatus(id, status);
    setLoading(null);
    onRefresh();
  };

  const SortHeader = ({
    label,
    field,
  }: {
    label: string;
    field: SortKey;
  }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
    >
      {label}
      <ArrowUpDown
        className={cn(
          "h-3 w-3",
          sortKey === field ? "text-primary" : "text-muted-foreground/50"
        )}
      />
    </button>
  );

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground text-sm">No applications yet.</p>
        <p className="text-muted-foreground text-xs mt-1">
          Add your first application to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="text-left px-4 py-3">
                <SortHeader label="Job Title" field="job_title" />
              </th>
              <th className="text-left px-4 py-3">
                <SortHeader label="Company" field="company" />
              </th>
              <th className="text-left px-4 py-3">
                <SortHeader label="Status" field="status" />
              </th>
              <th className="text-left px-4 py-3">
                <SortHeader label="Priority" field="priority" />
              </th>
              <th className="text-left px-4 py-3">
                <SortHeader label="Applied" field="applied_at" />
              </th>
              <th className="text-left px-4 py-3">
                <SortHeader label="Updated" field="updated_at" />
              </th>
              <th className="text-left px-4 py-3">
                <span className="text-xs font-semibold text-muted-foreground">Salary</span>
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((app, idx) => (
              <tr
                key={app.id}
                className={cn(
                  "border-b last:border-0 hover:bg-muted/30 transition-colors",
                  loading === app.id && "opacity-50 pointer-events-none",
                  idx % 2 === 0 ? "bg-background" : "bg-muted/10"
                )}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewDetail(app)}
                      className="font-medium hover:text-primary transition-colors text-left"
                    >
                      {app.job_title}
                    </button>
                    {app.ai_prep_generated && (
                      <span title="AI Prep Ready" className="text-xs">✨</span>
                    )}
                  </div>
                  {app.location && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {app.is_remote ? "Remote" : app.location}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium">{app.company}</span>
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={cn("text-xs", STATUS_COLORS[app.status])}
                  >
                    {STATUS_LABELS[app.status]}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Star
                      className={cn("h-3.5 w-3.5", PRIORITY_COLORS[app.priority])}
                      fill={app.priority === "high" ? "currentColor" : "none"}
                    />
                    <span className="text-xs capitalize text-muted-foreground">
                      {app.priority}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {app.applied_at
                    ? new Date(app.applied_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "2-digit",
                      })
                    : "—"}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(app.updated_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {app.salary_min > 0 && app.salary_max > 0
                    ? `$${(app.salary_min / 1000).toFixed(0)}k–$${(app.salary_max / 1000).toFixed(0)}k`
                    : app.salary_min > 0
                    ? `$${(app.salary_min / 1000).toFixed(0)}k+`
                    : app.salary_max > 0
                    ? `Up to $${(app.salary_max / 1000).toFixed(0)}k`
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => onViewDetail(app)}>
                        <Eye className="h-3.5 w-3.5 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onGeneratePrep(app)}>
                        <Sparkles className="h-3.5 w-3.5 mr-2" />
                        AI Interview Prep
                      </DropdownMenuItem>
                      <DropdownMenuItem className="font-medium text-xs text-muted-foreground" disabled>
                        Move to →
                      </DropdownMenuItem>
                      {ALL_STATUSES.filter((s) => s !== app.status).map((s) => (
                        <DropdownMenuItem
                          key={s}
                          onClick={() => handleStatusChange(app.id, s)}
                          className="pl-6"
                        >
                          <ArrowRight className="h-3 w-3 mr-2" />
                          {STATUS_LABELS[s]}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuItem
                        onClick={() => handleDelete(app.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
