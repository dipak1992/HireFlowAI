export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  location: string | null;
  bio: string | null;
  headline: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Preferences {
  id: string;
  user_id: string;
  goal: "need_work_fast" | "grow_career" | null;
  location: string | null;
  desired_pay_min: number | null;
  desired_pay_max: number | null;
  pay_type: "hourly" | "salary" | null;
  job_category: string | null;
  remote_preference: "remote" | "hybrid" | "onsite" | "any" | null;
  created_at: string;
  updated_at: string;
}

export interface AuthProvider {
  id: string;
  user_id: string;
  provider: "google" | "linkedin" | "email";
  provider_user_id: string | null;
  provider_email: string | null;
  connected_at: string;
}

export interface LinkedInImport {
  id: string;
  user_id: string;
  consent_given: boolean;
  consent_date: string | null;
  profile_data: LinkedInProfileData | null;
  import_status: "pending" | "imported" | "skipped" | "failed";
  created_at: string;
  updated_at: string;
}

export interface LinkedInProfileData {
  first_name?: string;
  last_name?: string;
  headline?: string;
  summary?: string;
  location?: string;
  industry?: string;
  positions?: LinkedInPosition[];
  education?: LinkedInEducation[];
  skills?: string[];
  profile_url?: string;
}

export interface LinkedInPosition {
  title: string;
  company: string;
  start_date: string;
  end_date?: string;
  description?: string;
  is_current: boolean;
}

export interface LinkedInEducation {
  school: string;
  degree?: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
}

export type OnboardingGoal = "need_work_fast" | "grow_career";

export interface OnboardingData {
  goal: OnboardingGoal;
  location: string;
  desired_pay_min: number;
  desired_pay_max: number;
  pay_type: "hourly" | "salary";
  job_category: string;
  remote_preference: "remote" | "hybrid" | "onsite" | "any";
}
