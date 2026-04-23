"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  X,
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  Plus,
  Trash2,
  Sparkles,
  Loader2,
  MessageSquare,
  Clock,
  DollarSign,
  Star,
  Video,
  Phone,
  Users,
  Code2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  type Application,
  type ApplicationNote,
  type Interview,
  type NoteType,
  type InterviewType,
  type ApplicationStatus,
  STATUS_LABELS,
  STATUS_COLORS,
  NOTE_TYPE_LABELS,
  INTERVIEW_TYPE_LABELS,
  PRIORITY_COLORS,
  ALL_STATUSES,
} from "@/lib/tracker-types";
import {
  addNote,
  deleteNote,
  addInterview,
  deleteInterview,
  updateInterview,
  updateApplicationStatus,
  generateAIPrep,
} from "@/lib/tracker-actions";
import { cn } from "@/lib/utils";

interface ApplicationDetailProps {
  app: Application;
  notes: ApplicationNote[];
  interviews: Interview[];
  onClose: () => void;
  onRefresh: () => void;
}

const INTERVIEW_ICONS: Record<InterviewType, React.ReactNode> = {
  phone: <Phone className="h-3.5 w-3.5" />,
  video: <Video className="h-3.5 w-3.5" />,
  onsite: <Users className="h-3.5 w-3.5" />,
  technical: <Code2 className="h-3.5 w-3.5" />,
  behavioral: <MessageSquare className="h-3.5 w-3.5" />,
  panel: <Users className="h-3.5 w-3.5" />,
  final: <Star className="h-3.5 w-3.5" />,
};

function TimelineEvent({
  date,
  label,
  sub,
  dot,
}: {
  date: string;
  label: string;
  sub?: string;
  dot: string;
}) {
  return (
    <div className="relative flex items-start gap-3">
      <div className={cn("absolute -left-4 mt-1.5 h-2.5 w-2.5 rounded-full border-2 border-background", dot)} />
      <div>
        <p className="text-sm font-medium">{label}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        <p className="text-xs text-muted-foreground">
          {new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}

export default function ApplicationDetail({
  app,
  notes,
  interviews,
  onClose,
  onRefresh,
}: ApplicationDetailProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "notes" | "interviews" | "ai_prep">("overview");
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState<NoteType>("general");
  const [showAddInterview, setShowAddInterview] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [aiData, setAiData] = useState<{
    questions: Application["ai_interview_questions"];
    salaryTips: string;
    careerSuggestions: string;
  } | null>(
    app.ai_prep_generated
      ? {
          questions: app.ai_interview_questions,
          salaryTips: app.ai_salary_tips,
          careerSuggestions: app.ai_career_suggestions,
        }
      : null
  );
  const [expandedQ, setExpandedQ] = useState<number | null>(null);
  const [aiSection, setAiSection] = useState<"questions" | "salary" | "career">("questions");

  const [interviewForm, setInterviewForm] = useState({
    interview_type: "video" as InterviewType,
    scheduled_at: "",
    duration_minutes: 60,
    location: "",
    meeting_url: "",
    interviewer_name: "",
    interviewer_title: "",
    prep_notes: "",
  });

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    startTransition(async () => {
      await addNote(app.id, newNote.trim(), noteType);
      setNewNote("");
      onRefresh();
    });
  };

  const handleDeleteNote = (noteId: string) => {
    startTransition(async () => {
      await deleteNote(noteId);
      onRefresh();
    });
  };

  const handleAddInterview = () => {
    if (!interviewForm.scheduled_at) return;
    startTransition(async () => {
      await addInterview(app.id, interviewForm);
      setShowAddInterview(false);
      setInterviewForm({
        interview_type: "video",
        scheduled_at: "",
        duration_minutes: 60,
        location: "",
        meeting_url: "",
        interviewer_name: "",
        interviewer_title: "",
        prep_notes: "",
      });
      onRefresh();
    });
  };

  const handleDeleteInterview = (interviewId: string) => {
    startTransition(async () => {
      await deleteInterview(interviewId);
      onRefresh();
    });
  };

  const handleInterviewOutcome = (interviewId: string, outcome: string) => {
    startTransition(async () => {
      await updateInterview(interviewId, { outcome, status: "completed" });
      onRefresh();
    });
  };

  const handleStatusChange = (status: ApplicationStatus) => {
    startTransition(async () => {
      await updateApplicationStatus(app.id, status);
      onRefresh();
    });
  };

  const handleGeneratePrep = () => {
    startTransition(async () => {
      const result = await generateAIPrep(app.id);
      if (result && "questions" in result) {
        setAiData({
          questions: result.questions as Application["ai_interview_questions"],
          salaryTips: result.salaryTips as string,
          careerSuggestions: result.careerSuggestions as string,
        });
      }
      onRefresh();
    });
  };

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "notes" as const, label: `Notes (${notes.length})` },
    { id: "interviews" as const, label: `Interviews (${interviews.length})` },
    { id: "ai_prep" as const, label: "✨ AI Prep" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-2xl bg-background border-l shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold truncate">{app.job_title}</h2>
              <Badge variant="outline" className={cn("text-xs shrink-0", STATUS_COLORS[app.status])}>
                {STATUS_LABELS[app.status]}
              </Badge>
            </div>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" />
                {app.company}
              </div>
              {app.location && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {app.is_remote ? "Remote" : app.location}
                </div>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0 ml-2">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Status Change */}
        <div className="flex items-center gap-2 px-5 py-2.5 border-b bg-muted/30 overflow-x-auto">
          <span className="text-xs text-muted-foreground shrink-0">Move to:</span>
          {ALL_STATUSES.filter((s) => s !== app.status).map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              disabled={isPending}
              className={cn(
                "text-xs px-2.5 py-1 rounded-full border font-medium transition-colors shrink-0 hover:opacity-80",
                STATUS_COLORS[s]
              )}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b px-5 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-3 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* ── Overview ── */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {(app.salary_min > 0 || app.salary_max > 0) && (
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <DollarSign className="h-3.5 w-3.5" />
                      Salary Range
                    </div>
                    <p className="font-semibold text-sm">
                      {app.salary_min > 0 && app.salary_max > 0
                        ? `$${app.salary_min.toLocaleString()} – $${app.salary_max.toLocaleString()}`
                        : app.salary_min > 0
                        ? `$${app.salary_min.toLocaleString()}+`
                        : `Up to $${app.salary_max.toLocaleString()}`}
                    </p>
                  </div>
                )}
                {app.applied_at && (
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Applied
                    </div>
                    <p className="font-semibold text-sm">
                      {new Date(app.applied_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}
                {app.deadline_at && (
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Clock className="h-3.5 w-3.5" />
                      Deadline
                    </div>
                    <p className="font-semibold text-sm">
                      {new Date(app.deadline_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Star className="h-3.5 w-3.5" />
                    Priority
                  </div>
                  <p className={cn("font-semibold text-sm capitalize", PRIORITY_COLORS[app.priority])}>
                    {app.priority}
                  </p>
                </div>
              </div>

              {/* Links */}
              <div className="space-y-2">
                {app.job_url && (
                  <a href={app.job_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <ExternalLink className="h-3.5 w-3.5" />
                    View Job Posting
                  </a>
                )}
                {app.apply_url && (
                  <a href={app.apply_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Application Link
                  </a>
                )}
                {app.company_website && (
                  <a href={app.company_website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Company Website
                  </a>
                )}
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Timeline</h3>
                <div className="relative pl-6 space-y-4">
                  <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
                  <TimelineEvent date={app.created_at} label="Added to tracker" dot="bg-blue-500" />
                  {app.applied_at && (
                    <TimelineEvent date={app.applied_at} label="Applied" dot="bg-indigo-500" />
                  )}
                  {interviews.map((iv) => (
                    <TimelineEvent
                      key={iv.id}
                      date={iv.scheduled_at}
                      label={`${INTERVIEW_TYPE_LABELS[iv.interview_type]} Interview`}
                      sub={iv.interviewer_name ? `with ${iv.interviewer_name}` : undefined}
                      dot="bg-amber-500"
                    />
                  ))}
                  {app.status === "offer" && (
                    <TimelineEvent date={app.updated_at} label="Offer Received 🎉" dot="bg-green-500" />
                  )}
                  {app.status === "rejected" && (
                    <TimelineEvent date={app.updated_at} label="Not Selected" dot="bg-red-500" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Notes ── */}
          {activeTab === "notes" && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs font-medium shrink-0">Note Type</Label>
                    <Select value={noteType} onValueChange={(v) => setNoteType(v as NoteType)}>
                      <SelectTrigger className="h-7 text-xs w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(NOTE_TYPE_LABELS).map(([k, v]) => (
                          <SelectItem key={k} value={k} className="text-xs">{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    placeholder="Add a note about this application..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="text-sm min-h-[80px] resize-none"
                  />
                  <Button size="sm" onClick={handleAddNote} disabled={!newNote.trim() || isPending} className="w-full">
                    {isPending ? <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" /> : <Plus className="h-3.5 w-3.5 mr-2" />}
                    Add Note
                  </Button>
                </CardContent>
              </Card>

              {notes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No notes yet.</p>
              ) : (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div key={note.id} className="rounded-lg border p-3 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {NOTE_TYPE_LABELS[note.note_type]}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(note.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                          <button onClick={() => handleDeleteNote(note.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Interviews ── */}
          {activeTab === "interviews" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Scheduled Interviews</h3>
                <Button size="sm" variant="outline" onClick={() => setShowAddInterview(!showAddInterview)}>
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Interview
                </Button>
              </div>

              {showAddInterview && (
                <Card>
                  <CardHeader className="pb-3 pt-4 px-4">
                    <CardTitle className="text-sm">Schedule Interview</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Type</Label>
                        <Select
                          value={interviewForm.interview_type}
                          onValueChange={(v) => setInterviewForm((f) => ({ ...f, interview_type: v as InterviewType }))}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(INTERVIEW_TYPE_LABELS).map(([k, v]) => (
                              <SelectItem key={k} value={k} className="text-xs">{v}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Date & Time</Label>
                        <Input type="datetime-local" className="h-8 text-xs"
                          value={interviewForm.scheduled_at}
                          onChange={(e) => setInterviewForm((f) => ({ ...f, scheduled_at: e.target.value }))} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Interviewer Name</Label>
                        <Input className="h-8 text-xs" placeholder="Jane Smith"
                          value={interviewForm.interviewer_name}
                          onChange={(e) => setInterviewForm((f) => ({ ...f, interviewer_name: e.target.value }))} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Interviewer Title</Label>
                        <Input className="h-8 text-xs" placeholder="Engineering Manager"
                          value={interviewForm.interviewer_title}
                          onChange={(e) => setInterviewForm((f) => ({ ...f, interviewer_title: e.target.value }))} />
                      </div>
                      <div className="space-y-1 col-span-2">
                        <Label className="text-xs">Meeting URL / Location</Label>
                        <Input className="h-8 text-xs" placeholder="https://zoom.us/..."
                          value={interviewForm.meeting_url}
                          onChange={(e) => setInterviewForm((f) => ({ ...f, meeting_url: e.target.value }))} />
                      </div>
                      <div className="space-y-1 col-span-2">
                        <Label className="text-xs">Prep Notes</Label>
                        <Textarea className="text-xs min-h-[60px] resize-none"
                          placeholder="Topics to prepare, questions to ask..."
                          value={interviewForm.prep_notes}
                          onChange={(e) => setInterviewForm((f) => ({ ...f, prep_notes: e.target.value }))} />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleAddInterview}
                        disabled={!interviewForm.scheduled_at || isPending} className="flex-1">
                        {isPending ? <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" /> : <Plus className="h-3.5 w-3.5 mr-2" />}
                        Schedule
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setShowAddInterview(false)}>Cancel</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {interviews.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No interviews scheduled yet.</p>
              ) : (
                <div className="space-y-3">
                  {interviews.map((iv) => (
                    <div key={iv.id} className="rounded-lg border p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                            {INTERVIEW_ICONS[iv.interview_type]}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{INTERVIEW_TYPE_LABELS[iv.interview_type]}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(iv.scheduled_at).toLocaleDateString("en-US", {
                                weekday: "short", month: "short", day: "numeric",
                                hour: "numeric", minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {iv.outcome === "passed" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                          {iv.outcome === "failed" && <XCircle className="h-4 w-4 text-red-500" />}
                          {iv.outcome === "pending" && <AlertCircle className="h-4 w-4 text-amber-500" />}
                          <button onClick={() => handleDeleteInterview(iv.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {iv.interviewer_name && (
                        <p className="text-xs text-muted-foreground">
                          with {iv.interviewer_name}{iv.interviewer_title && ` (${iv.interviewer_title})`}
                        </p>
                      )}
                      {iv.meeting_url && (
                        <a href={iv.meeting_url} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1">
                          <Video className="h-3 w-3" />
                          Join Meeting
                        </a>
                      )}
                      {iv.prep_notes && (
                        <div className="rounded bg-muted/50 p-2">
                          <p className="text-xs text-muted-foreground font-medium mb-1">Prep Notes</p>
                          <p className="text-xs whitespace-pre-wrap">{iv.prep_notes}</p>
                        </div>
                      )}
                      {!iv.outcome && iv.status !== "cancelled" && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline"
                            className="text-xs h-7 text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => handleInterviewOutcome(iv.id, "passed")}>
                            <CheckCircle2 className="h-3 w-3 mr-1" />Passed
                          </Button>
                          <Button size="sm" variant="outline"
                            className="text-xs h-7 text-amber-600 border-amber-200 hover:bg-amber-50"
                            onClick={() => handleInterviewOutcome(iv.id, "pending")}>
                            <AlertCircle className="h-3 w-3 mr-1" />Pending
                          </Button>
                          <Button size="sm" variant="outline"
                            className="text-xs h-7 text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleInterviewOutcome(iv.id, "failed")}>
                            <XCircle className="h-3 w-3 mr-1" />Not Passed
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── AI Prep ── */}
          {activeTab === "ai_prep" && (
            <div className="space-y-5">
              {!aiData ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">AI Interview Prep</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                      Generate personalized interview questions, salary negotiation tips, and career
                      progression insights for this role.
                    </p>
                  </div>
                  <Button onClick={handleGeneratePrep} disabled={isPending} size="lg">
                    {isPending ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating...</>
                    ) : (
                      <><Sparkles className="h-4 w-4 mr-2" />Generate AI Prep</>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Sub-tabs + regenerate */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex gap-1 p-1 bg-muted rounded-lg flex-1">
                      {(["questions", "salary", "career"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setAiSection(t)}
                          className={cn(
                            "flex-1 text-xs font-medium py-1.5 rounded-md transition-colors capitalize",
                            aiSection === t
                              ? "bg-background shadow-sm text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {t === "questions" ? "Questions" : t === "salary" ? "Salary Tips" : "Career Path"}
                        </button>
                      ))}
                    </div>
                    <Button size="sm" variant="outline" onClick={handleGeneratePrep} disabled={isPending} className="shrink-0">
                      {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                    </Button>
                  </div>

                  {/* Questions */}
                  {aiSection === "questions" && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        {aiData.questions.length} questions generated for {app.job_title} at {app.company}
                      </p>
                      {aiData.questions.map((q, idx) => (
                        <div key={idx} className="rounded-lg border overflow-hidden">
                          <button
                            onClick={() => setExpandedQ(expandedQ === idx ? null : idx)}
                            className="w-full flex items-start justify-between gap-3 p-3 text-left hover:bg-muted/30 transition-colors"
                          >
                            <div className="flex items-start gap-2 flex-1 min-w-0">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[10px] shrink-0 mt-0.5",
                                  q.difficulty === "hard"
                                    ? "border-red-200 text-red-600"
                                    : q.difficulty === "medium"
                                    ? "border-amber-200 text-amber-600"
                                    : "border-green-200 text-green-600"
                                )}
                              >
                                {q.difficulty}
                              </Badge>
                              <span className="text-sm font-medium">{q.question}</span>
                            </div>
                            <Badge variant="secondary" className="text-[10px] shrink-0 capitalize">
                              {q.category}
                            </Badge>
                          </button>
                          {expandedQ === idx && (
                            <div className="px-3 pb-3 pt-0">
                              <div className="rounded bg-primary/5 border border-primary/10 p-2.5">
                                <p className="text-xs font-medium text-primary mb-1">💡 Tip</p>
                                <p className="text-xs text-muted-foreground">{q.tip}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Salary Tips */}
                  {aiSection === "salary" && (
                    <div className="rounded-lg border p-4">
                      <div className="prose prose-sm max-w-none">
                        {aiData.salaryTips.split("\n\n").map((block, idx) => {
                          if (block.startsWith("**")) {
                            const [title, ...rest] = block.split("\n");
                            return (
                              <div key={idx} className="mb-4">
                                <p className="font-semibold text-sm mb-1">
                                  {title.replace(/\*\*/g, "")}
                                </p>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                  {rest.join("\n")}
                                </p>
                              </div>
                            );
                          }
                          return (
                            <p key={idx} className="text-sm text-muted-foreground mb-3 whitespace-pre-wrap">
                              {block}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Career Path */}
                  {aiSection === "career" && (
                    <div className="rounded-lg border p-4">
                      <div className="space-y-4">
                        {aiData.careerSuggestions.split("\n\n").map((block, idx) => {
                          if (block.startsWith("##")) {
                            return (
                              <h3 key={idx} className="font-bold text-sm">
                                {block.replace(/^##\s*/, "")}
                              </h3>
                            );
                          }
                          if (block.startsWith("**")) {
                            const [title, ...rest] = block.split("\n");
                            return (
                              <div key={idx}>
                                <p className="font-semibold text-sm mb-1">
                                  {title.replace(/\*\*/g, "")}
                                </p>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                  {rest.join("\n")}
                                </p>
                              </div>
                            );
                          }
                          return (
                            <p key={idx} className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {block}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}