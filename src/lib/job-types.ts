export type JobType = "full_time" | "part_time" | "contract" | "internship" | "freelance";
export type ExperienceLevel = "entry" | "mid" | "senior" | "lead" | "executive";
export type SavedJobStatus = "saved" | "applied" | "interviewing" | "offered" | "rejected" | "withdrawn";

export interface Job {
  id: string;
  title: string;
  company: string;
  company_logo_url: string;
  location: string;
  is_remote: boolean;
  job_type: JobType;
  experience_level: ExperienceLevel;
  salary_min: number;
  salary_max: number;
  salary_currency: string;
  salary_period: string;
  description: string;
  requirements: string[];
  benefits: string[];
  tags: string[];
  source: string;
  source_url: string;
  apply_url: string;
  is_urgent: boolean;
  is_featured: boolean;
  posted_at: string;
  expires_at: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export interface SavedJob {
  id: string;
  user_id: string;
  job_id: string;
  status: SavedJobStatus;
  notes: string;
  applied_at: string | null;
  resume_id: string | null;
  tailoring_session_id: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  job?: Job;
}

export interface JobFilters {
  search?: string;
  location?: string;
  is_remote?: boolean;
  job_type?: JobType | "";
  experience_level?: ExperienceLevel | "";
  salary_min?: number;
  salary_max?: number;
  tags?: string[];
  is_urgent?: boolean;
}

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  full_time: "Full Time",
  part_time: "Part Time",
  contract: "Contract",
  internship: "Internship",
  freelance: "Freelance",
};

export const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = {
  entry: "Entry Level",
  mid: "Mid Level",
  senior: "Senior",
  lead: "Lead",
  executive: "Executive",
};

export const SAVED_STATUS_LABELS: Record<SavedJobStatus, string> = {
  saved: "Saved",
  applied: "Applied",
  interviewing: "Interviewing",
  offered: "Offered",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export const SAVED_STATUS_COLORS: Record<SavedJobStatus, string> = {
  saved: "bg-blue-100 text-blue-700",
  applied: "bg-indigo-100 text-indigo-700",
  interviewing: "bg-amber-100 text-amber-700",
  offered: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  withdrawn: "bg-gray-100 text-gray-600",
};
