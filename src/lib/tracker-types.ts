export type ApplicationStatus = "saved" | "applied" | "interview" | "offer" | "rejected" | "archived";
export type ApplicationPriority = "low" | "medium" | "high";
export type NoteType = "general" | "interview" | "follow_up" | "offer" | "rejection";
export type InterviewType = "phone" | "video" | "onsite" | "technical" | "behavioral" | "panel" | "final";
export type InterviewStatus = "scheduled" | "completed" | "cancelled" | "rescheduled";
export type InterviewOutcome = "" | "passed" | "failed" | "pending";

export interface Application {
  id: string;
  user_id: string;
  job_id: string | null;
  job_title: string;
  company: string;
  company_website: string;
  job_url: string;
  apply_url: string;
  location: string;
  is_remote: boolean;
  job_type: string;
  salary_min: number;
  salary_max: number;
  salary_currency: string;
  status: ApplicationStatus;
  applied_at: string | null;
  deadline_at: string | null;
  resume_id: string | null;
  tailoring_session_id: string | null;
  ai_prep_generated: boolean;
  ai_interview_questions: InterviewQuestion[];
  ai_salary_tips: string;
  ai_career_suggestions: string;
  priority: ApplicationPriority;
  reminder_at: string | null;
  reminder_sent: boolean;
  created_at: string;
  updated_at: string;
  // Joined
  notes?: ApplicationNote[];
  interviews?: Interview[];
}

export interface ApplicationNote {
  id: string;
  user_id: string;
  application_id: string;
  content: string;
  note_type: NoteType;
  created_at: string;
  updated_at: string;
}

export interface Interview {
  id: string;
  user_id: string;
  application_id: string;
  interview_type: InterviewType;
  scheduled_at: string;
  duration_minutes: number;
  location: string;
  meeting_url: string;
  interviewer_name: string;
  interviewer_title: string;
  status: InterviewStatus;
  outcome: InterviewOutcome;
  feedback: string;
  prep_notes: string;
  created_at: string;
  updated_at: string;
}

export interface InterviewQuestion {
  question: string;
  category: "behavioral" | "technical" | "situational" | "culture" | "role";
  difficulty: "easy" | "medium" | "hard";
  tip: string;
}

export interface ApplicationFilters {
  search?: string;
  status?: ApplicationStatus | "";
  priority?: ApplicationPriority | "";
}

export interface CreateApplicationInput {
  job_title: string;
  company: string;
  company_website?: string;
  job_url?: string;
  apply_url?: string;
  location?: string;
  is_remote?: boolean;
  job_type?: string;
  salary_min?: number;
  salary_max?: number;
  status?: ApplicationStatus;
  priority?: ApplicationPriority;
  applied_at?: string;
  deadline_at?: string;
  resume_id?: string;
  job_id?: string;
}

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  saved: "Saved",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  archived: "Archived",
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  saved: "bg-blue-100 text-blue-700 border-blue-200",
  applied: "bg-indigo-100 text-indigo-700 border-indigo-200",
  interview: "bg-amber-100 text-amber-700 border-amber-200",
  offer: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  archived: "bg-gray-100 text-gray-600 border-gray-200",
};

export const STATUS_BG: Record<ApplicationStatus, string> = {
  saved: "bg-blue-50 border-blue-200",
  applied: "bg-indigo-50 border-indigo-200",
  interview: "bg-amber-50 border-amber-200",
  offer: "bg-green-50 border-green-200",
  rejected: "bg-red-50 border-red-200",
  archived: "bg-gray-50 border-gray-200",
};

export const PRIORITY_COLORS: Record<ApplicationPriority, string> = {
  low: "text-gray-500",
  medium: "text-amber-500",
  high: "text-red-500",
};

export const NOTE_TYPE_LABELS: Record<NoteType, string> = {
  general: "General",
  interview: "Interview",
  follow_up: "Follow Up",
  offer: "Offer",
  rejection: "Rejection",
};

export const INTERVIEW_TYPE_LABELS: Record<InterviewType, string> = {
  phone: "Phone Screen",
  video: "Video Call",
  onsite: "On-site",
  technical: "Technical",
  behavioral: "Behavioral",
  panel: "Panel",
  final: "Final Round",
};

export const ALL_STATUSES: ApplicationStatus[] = [
  "saved", "applied", "interview", "offer", "rejected", "archived"
];
