export type ResumeTemplate = "ats" | "professional" | "fast_apply";
export type ResumeSource = "scratch" | "upload" | "linkedin";

export interface ResumeExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  bullets: string[];
}

export interface ResumeEducation {
  id: string;
  school: string;
  degree: string;
  field_of_study: string;
  location: string;
  start_date: string;
  end_date: string;
  gpa: string;
  description: string;
}

export interface ResumeSkill {
  id: string;
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  category: string;
}

export interface ResumeCertification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface ResumeProject {
  id: string;
  name: string;
  description: string;
  url: string;
  technologies: string[];
}

export interface ResumeData {
  id: string;
  user_id: string;
  title: string;
  template: ResumeTemplate;
  source: ResumeSource;
  is_primary: boolean;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  contact_location: string;
  contact_website: string;
  contact_linkedin: string;
  summary: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkill[];
  certifications: ResumeCertification[];
  projects: ResumeProject[];
  ats_score: number | null;
  last_exported_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResumeVersion {
  id: string;
  resume_id: string;
  user_id: string;
  version_number: number;
  version_name: string | null;
  snapshot: ResumeData;
  created_at: string;
}

export const EMPTY_RESUME: Omit<ResumeData, "id" | "user_id" | "created_at" | "updated_at"> = {
  title: "Untitled Resume",
  template: "ats",
  source: "scratch",
  is_primary: false,
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  contact_location: "",
  contact_website: "",
  contact_linkedin: "",
  summary: "",
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
  ats_score: null,
  last_exported_at: null,
};
