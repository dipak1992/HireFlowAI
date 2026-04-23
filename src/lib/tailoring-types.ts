export type TailoringStatus = "draft" | "analyzing" | "analyzed" | "tailored" | "applied";

export interface KeywordMatch {
  keyword: string;
  found_in: "summary" | "experience" | "skills" | "education" | "certifications" | "projects";
  importance: "high" | "medium" | "low";
}

export interface MissingKeyword {
  keyword: string;
  importance: "high" | "medium" | "low";
  suggestion: string; // where/how to add it
}

export interface MissingSkill {
  skill: string;
  importance: "high" | "medium" | "low";
  suggestion: string;
}

export interface TailoredExperience {
  exp_id: string;
  original_bullets: string[];
  tailored_bullets: string[];
}

export interface TailoringSession {
  id: string;
  user_id: string;
  resume_id: string;
  job_title: string;
  job_company: string;
  job_url: string;
  job_description: string;
  ats_score: number;
  keyword_matches: KeywordMatch[];
  missing_keywords: MissingKeyword[];
  missing_skills: MissingSkill[];
  tailored_summary: string;
  tailored_experience: TailoredExperience[];
  status: TailoringStatus;
  applied_to_resume: boolean;
  created_at: string;
  updated_at: string;
}

export interface TailoringAnalysis {
  ats_score: number;
  keyword_matches: KeywordMatch[];
  missing_keywords: MissingKeyword[];
  missing_skills: MissingSkill[];
  tailored_summary: string;
  tailored_experience: TailoredExperience[];
}
