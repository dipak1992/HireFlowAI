"use client";

import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LayoutGrid,
  List,
  Plus,
  Search,
  TrendingUp,
  Briefcase,
  Calendar,
  Trophy,
  Filter,
  Sparkles,
} from "lucide-react";
import {
  type Application,
  type ApplicationNote,
  type Interview,
  type ApplicationStatus,
  type ApplicationPriority,
  STATUS_LABELS,
  STATUS_COLORS,
} from "@/lib/tracker-types";
import {
  getApplications,
  getApplicationNotes,
  getInterviews,
  getTrackerStats,
  getLinkedInCareerProgression,
} from "@/lib/tracker-actions";
import KanbanBoard from "@/components/tracker/kanban-board";
import TrackerTable from "@/components/tracker/tracker-table";
import ApplicationDetail from "@/components/tracker/application-detail";
import AddApplicationDialog from "@/components/tracker/add-application-dialog";
import { cn } from "@/lib/utils";

type ViewMode = "kanban" | "table";

interface TrackerStats {
  total: number;
  saved: number;
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
  archived: number;
  responseRate: number;
  offerRate: number;
}

export default function TrackerPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApps, setFilteredApps] = useState<Application[]>([]);
  const [stats, setStats] = useState<TrackerStats | null>(null);
  const [linkedInData, setLinkedInData] = useState<Record<string, unknown> | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "">("");
  const [priorityFilter, setPriorityFilter] = useState<ApplicationPriority | "">("");
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [selectedNotes, setSelectedNotes] = useState<ApplicationNote[]>([]);
  const [selectedInterviews, setSelectedInterviews] = useState<Interview[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [apps, statsData, liData] = await Promise.all([
      getApplications(),
      getTrackerStats(),
      getLinkedInCareerProgression(),
    ]);
    setApplications(apps as Application[]);
    setStats(statsData);
    setLinkedInData(liData as Record<string, unknown> | null);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter applications
  useEffect(() => {
    let filtered = [...applications];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.job_title.toLowerCase().includes(q) ||
          a.company.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }
    if (priorityFilter) {
      filtered = filtered.filter((a) => a.priority === priorityFilter);
    }
    setFilteredApps(filtered);
  }, [applications, search, statusFilter, priorityFilter]);

  const handleViewDetail = async (app: Application) => {
    setSelectedApp(app);
    setDetailLoading(true);
    const [notes, interviews] = await Promise.all([
      getApplicationNotes(app.id),
      getInterviews(app.id),
    ]);
    setSelectedNotes(notes as ApplicationNote[]);
    setSelectedInterviews(interviews as Interview[]);
    setDetailLoading(false);
  };

  const handleDetailRefresh = async () => {
    if (!selectedApp) return;
    const [apps, notes, interviews, statsData] = await Promise.all([
      getApplications(),
      getApplicationNotes(selectedApp.id),
      getInterviews(selectedApp.id),
      getTrackerStats(),
    ]);
    const updatedApps = apps as Application[];
    setApplications(updatedApps);
    setStats(statsData);
    setSelectedNotes(notes as ApplicationNote[]);
    setSelectedInterviews(interviews as Interview[]);
    // Update selected app with fresh data
    const freshApp = updatedApps.find((a) => a.id === selectedApp.id);
    if (freshApp) setSelectedApp(freshApp);
  };

  const handleGeneratePrep = (app: Application) => {
    handleViewDetail(app).then(() => {
      // The detail panel will open on the AI prep tab
    });
  };

  const statCards = [
    { label: "Total", value: stats?.total ?? 0, icon: Briefcase, color: "text-blue-600" },
    { label: "Applied", value: stats?.applied ?? 0, icon: Calendar, color: "text-indigo-600" },
    { label: "Interviews", value: stats?.interview ?? 0, icon: TrendingUp, color: "text-amber-600" },
    { label: "Offers", value: stats?.offer ?? 0, icon: Trophy, color: "text-green-600" },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Application Tracker</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track every application from saved to offer
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Add Application
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">{card.label}</span>
              <card.icon className={cn("h-4 w-4", card.color)} />
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Response Rate + Offer Rate */}
      {stats && stats.applied > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs font-medium text-muted-foreground mb-1">Response Rate</p>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold">{stats.responseRate}%</p>
              <p className="text-xs text-muted-foreground mb-1">of applications got a response</p>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all"
                style={{ width: `${Math.min(stats.responseRate, 100)}%` }}
              />
            </div>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs font-medium text-muted-foreground mb-1">Offer Rate</p>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold">{stats.offerRate}%</p>
              <p className="text-xs text-muted-foreground mb-1">of applications led to offers</p>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-green-500 transition-all"
                style={{ width: `${Math.min(stats.offerRate, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* LinkedIn Career Progression */}
      {linkedInData && (
        <div className="rounded-xl border bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600">
              <span className="text-white text-xs font-bold">in</span>
            </div>
            <h3 className="text-sm font-semibold">LinkedIn Career Snapshot</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xl font-bold">{linkedInData.totalYearsExperience as number}y</p>
              <p className="text-xs text-muted-foreground">Experience</p>
            </div>
            <div>
              <p className="text-xl font-bold">{linkedInData.totalPositions as number}</p>
              <p className="text-xs text-muted-foreground">Positions</p>
            </div>
            <div>
              <p className="text-xl font-bold">{linkedInData.totalCompanies as number}</p>
              <p className="text-xs text-muted-foreground">Companies</p>
            </div>
          </div>
          {(linkedInData.skills as string[])?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {(linkedInData.skills as string[]).slice(0, 8).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {(linkedInData.skills as string[]).length > 8 && (
                <Badge variant="outline" className="text-xs">
                  +{(linkedInData.skills as string[]).length - 8} more
                </Badge>
              )}
            </div>
          )}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ApplicationStatus | "")}>
          <SelectTrigger className="h-9 w-36 text-sm">
            <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            {(["saved", "applied", "interview", "offer", "rejected", "archived"] as ApplicationStatus[]).map((s) => (
              <SelectItem key={s} value={s} className="text-sm">{STATUS_LABELS[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as ApplicationPriority | "")}>
          <SelectTrigger className="h-9 w-36 text-sm">
            <SelectValue placeholder="All Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Priority</SelectItem>
            <SelectItem value="high" className="text-sm">High</SelectItem>
            <SelectItem value="medium" className="text-sm">Medium</SelectItem>
            <SelectItem value="low" className="text-sm">Low</SelectItem>
          </SelectContent>
        </Select>

        {/* View Toggle */}
        <div className="flex items-center gap-1 rounded-lg border p-1 bg-muted/30">
          <button
            onClick={() => setViewMode("kanban")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
              viewMode === "kanban"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Kanban
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
              viewMode === "table"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <List className="h-3.5 w-3.5" />
            Table
          </button>
        </div>
      </div>

      {/* Filter chips */}
      {(statusFilter || priorityFilter || search) && (
        <div className="flex items-center gap-2 flex-wrap -mt-2">
          <span className="text-xs text-muted-foreground">
            Showing {filteredApps.length} of {applications.length}
          </span>
          {statusFilter && (
            <Badge
              variant="secondary"
              className={cn("text-xs cursor-pointer", STATUS_COLORS[statusFilter])}
              onClick={() => setStatusFilter("")}
            >
              {STATUS_LABELS[statusFilter]} ×
            </Badge>
          )}
          {priorityFilter && (
            <Badge variant="secondary" className="text-xs cursor-pointer" onClick={() => setPriorityFilter("")}>
              {priorityFilter} priority ×
            </Badge>
          )}
          {search && (
            <Badge variant="secondary" className="text-xs cursor-pointer" onClick={() => setSearch("")}>
              &ldquo;{search}&rdquo; ×
            </Badge>
          )}
        </div>
      )}

      {/* Main Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-sm text-muted-foreground">Loading applications...</p>
          </div>
        </div>
      ) : applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
            <Briefcase className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
          <p className="text-muted-foreground text-sm max-w-sm mb-6">
            Start tracking your job applications. Add your first application to see the Kanban board
            and get AI-powered interview prep.
          </p>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Application
          </Button>
        </div>
      ) : viewMode === "kanban" ? (
        <KanbanBoard
          applications={filteredApps}
          onRefresh={loadData}
          onViewDetail={handleViewDetail}
          onGeneratePrep={handleGeneratePrep}
        />
      ) : (
        <TrackerTable
          applications={filteredApps}
          onRefresh={loadData}
          onViewDetail={handleViewDetail}
          onGeneratePrep={handleGeneratePrep}
        />
      )}

      {/* Add Application Dialog */}
      {showAddDialog && (
        <AddApplicationDialog
          onClose={() => setShowAddDialog(false)}
          onSuccess={() => {
            setShowAddDialog(false);
            loadData();
          }}
        />
      )}

      {/* Application Detail Panel */}
      {selectedApp && !detailLoading && (
        <ApplicationDetail
          app={selectedApp}
          notes={selectedNotes}
          interviews={selectedInterviews}
          onClose={() => setSelectedApp(null)}
          onRefresh={handleDetailRefresh}
        />
      )}
    </div>
  );
}
