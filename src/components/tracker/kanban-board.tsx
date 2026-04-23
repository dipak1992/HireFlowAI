"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building2,
  MapPin,
  MoreHorizontal,
  Calendar,
  Star,
  Trash2,
  Eye,
  Sparkles,
  ArrowRight,
  DollarSign,
} from "lucide-react";
import {
  type Application,
  type ApplicationStatus,
  ALL_STATUSES,
  STATUS_LABELS,
  STATUS_COLORS,
  STATUS_BG,
  PRIORITY_COLORS,
} from "@/lib/tracker-types";
import { updateApplicationStatus, deleteApplication } from "@/lib/tracker-actions";
import { cn } from "@/lib/utils";

interface KanbanBoardProps {
  applications: Application[];
  onRefresh: () => void;
  onViewDetail: (app: Application) => void;
  onGeneratePrep: (app: Application) => void;
}

const COLUMN_ICONS: Record<ApplicationStatus, string> = {
  saved: "🔖",
  applied: "📤",
  interview: "🎯",
  offer: "🎉",
  rejected: "❌",
  archived: "📦",
};

export default function KanbanBoard({
  applications,
  onRefresh,
  onViewDetail,
  onGeneratePrep,
}: KanbanBoardProps) {
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<ApplicationStatus | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const grouped = ALL_STATUSES.reduce(
    (acc, status) => {
      acc[status] = applications.filter((a) => a.status === status);
      return acc;
    },
    {} as Record<ApplicationStatus, Application[]>
  );

  const handleDragStart = (e: React.DragEvent, appId: string) => {
    e.dataTransfer.setData("appId", appId);
    setDragging(appId);
  };

  const handleDragEnd = () => {
    setDragging(null);
    setDragOver(null);
  };

  const handleDragOver = (e: React.DragEvent, status: ApplicationStatus) => {
    e.preventDefault();
    setDragOver(status);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: ApplicationStatus) => {
    e.preventDefault();
    const appId = e.dataTransfer.getData("appId");
    if (!appId) return;

    const app = applications.find((a) => a.id === appId);
    if (!app || app.status === newStatus) {
      setDragging(null);
      setDragOver(null);
      return;
    }

    setLoading(appId);
    await updateApplicationStatus(appId, newStatus);
    setDragging(null);
    setDragOver(null);
    setLoading(null);
    onRefresh();
  };

  const handleDelete = async (appId: string) => {
    if (!confirm("Delete this application? This cannot be undone.")) return;
    setLoading(appId);
    await deleteApplication(appId);
    setLoading(null);
    onRefresh();
  };

  const handleStatusChange = async (appId: string, status: ApplicationStatus) => {
    setLoading(appId);
    await updateApplicationStatus(appId, status);
    setLoading(null);
    onRefresh();
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 min-h-[600px]">
      {ALL_STATUSES.map((status) => {
        const cols = grouped[status];
        const isOver = dragOver === status;

        return (
          <div
            key={status}
            className={cn(
              "flex-shrink-0 w-64 flex flex-col rounded-xl border-2 transition-colors",
              STATUS_BG[status],
              isOver ? "border-primary/50 scale-[1.01]" : "border-transparent"
            )}
            onDragOver={(e) => handleDragOver(e, status)}
            onDrop={(e) => handleDrop(e, status)}
            onDragLeave={() => setDragOver(null)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-base">{COLUMN_ICONS[status]}</span>
                <span className="text-sm font-semibold">{STATUS_LABELS[status]}</span>
              </div>
              <Badge variant="secondary" className="text-xs h-5 px-1.5">
                {cols.length}
              </Badge>
            </div>

            {/* Cards */}
            <div className="flex-1 flex flex-col gap-2 px-2 pb-3 overflow-y-auto max-h-[calc(100vh-280px)]">
              {cols.length === 0 && (
                <div className="flex-1 flex items-center justify-center py-8">
                  <p className="text-xs text-muted-foreground text-center">
                    Drop cards here
                  </p>
                </div>
              )}
              {cols.map((app) => (
                <KanbanCard
                  key={app.id}
                  app={app}
                  isDragging={dragging === app.id}
                  isLoading={loading === app.id}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onViewDetail={onViewDetail}
                  onGeneratePrep={onGeneratePrep}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface KanbanCardProps {
  app: Application;
  isDragging: boolean;
  isLoading: boolean;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
  onViewDetail: (app: Application) => void;
  onGeneratePrep: (app: Application) => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onDelete: (id: string) => void;
}

function KanbanCard({
  app,
  isDragging,
  isLoading,
  onDragStart,
  onDragEnd,
  onViewDetail,
  onGeneratePrep,
  onStatusChange,
  onDelete,
}: KanbanCardProps) {
  const hasSalary = app.salary_min > 0 || app.salary_max > 0;
  const isDeadlineSoon =
    app.deadline_at &&
    new Date(app.deadline_at) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

  return (
    <Card
      draggable
      onDragStart={(e) => onDragStart(e, app.id)}
      onDragEnd={onDragEnd}
      className={cn(
        "cursor-grab active:cursor-grabbing transition-all select-none",
        isDragging && "opacity-40 scale-95",
        isLoading && "opacity-60 pointer-events-none",
        "hover:shadow-md"
      )}
    >
      <CardContent className="p-3 space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-1">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-tight truncate">{app.job_title}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Building2 className="h-3 w-3 text-muted-foreground shrink-0" />
              <p className="text-xs text-muted-foreground truncate">{app.company}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 -mr-1">
                  <MoreHorizontal className="h-3.5 w-3.5" />
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
                  onClick={() => onStatusChange(app.id, s)}
                  className="pl-6"
                >
                  <ArrowRight className="h-3 w-3 mr-2" />
                  {STATUS_LABELS[s]}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={() => onDelete(app.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Meta */}
        <div className="space-y-1">
          {app.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground truncate">
                {app.is_remote ? "Remote" : app.location}
              </span>
            </div>
          )}
          {hasSalary && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground">
                {app.salary_min > 0 && app.salary_max > 0
                  ? `$${(app.salary_min / 1000).toFixed(0)}k–$${(app.salary_max / 1000).toFixed(0)}k`
                  : app.salary_min > 0
                  ? `$${(app.salary_min / 1000).toFixed(0)}k+`
                  : `Up to $${(app.salary_max / 1000).toFixed(0)}k`}
              </span>
            </div>
          )}
          {app.applied_at && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground">
                Applied {new Date(app.applied_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <Star
              className={cn(
                "h-3 w-3",
                PRIORITY_COLORS[app.priority]
              )}
              fill={app.priority === "high" ? "currentColor" : "none"}
            />
            <span className="text-xs capitalize text-muted-foreground">{app.priority}</span>
          </div>
          <div className="flex items-center gap-1">
            {app.ai_prep_generated && (
              <span title="AI Prep Ready" className="text-xs">✨</span>
            )}
            {isDeadlineSoon && (
              <Badge variant="destructive" className="text-[10px] h-4 px-1">
                Due soon
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
