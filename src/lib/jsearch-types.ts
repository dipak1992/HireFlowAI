// src/lib/jsearch-types.ts
// JSearch API response types

export interface JSearchJob {
  job_id: string;
  employer_name: string;
  employer_logo: string | null;
  employer_website: string | null;
  employer_company_type: string | null;
  job_publisher: string;
  job_employment_type: string;
  job_title: string;
  job_apply_link: string;
  job_apply_is_direct: boolean;
  job_apply_quality_score: number;
  job_description: string;
  job_is_remote: boolean;
  job_posted_at_timestamp: number;
  job_posted_at_datetime_utc: string;
  job_city: string;
  job_state: string;
  job_country: string;
  job_latitude: number | null;
  job_longitude: number | null;
  job_benefits: string[] | null;
  job_google_link: string;
  job_offer_expiration_datetime_utc: string | null;
  job_offer_expiration_timestamp: number | null;
  job_required_experience: {
    no_experience_required: boolean;
    required_experience_in_months: number | null;
    experience_mentioned: boolean;
    experience_preferred: boolean;
  };
  job_required_skills: string[] | null;
  job_required_education: {
    postgraduate_degree: boolean;
    professional_certification: boolean;
    high_school: boolean;
    associates_degree: boolean;
    bachelors_degree: boolean;
    degree_mentioned: boolean;
    degree_preferred: boolean;
    professional_certification_mentioned: boolean;
  };
  job_experience_in_place_of_education: boolean;
  job_min_salary: number | null;
  job_max_salary: number | null;
  job_salary_currency: string | null;
  job_salary_period: string | null;
  job_highlights: {
    Qualifications?: string[];
    Responsibilities?: string[];
    Benefits?: string[];
  };
  job_job_title: string | null;
  job_posting_language: string;
  job_onet_soc: string;
  job_onet_job_zone: string;
  job_naics_code: string;
  job_naics_name: string;
}

export interface JSearchResponse {
  status: string;
  request_id: string;
  parameters: Record<string, unknown>;
  data: JSearchJob[];
}

export interface JSearchEstimatedSalaryResponse {
  status: string;
  request_id: string;
  data: JSearchSalaryEstimate[];
}

export interface JSearchSalaryEstimate {
  location: string;
  job_title: string;
  publisher_name: string;
  publisher_link: string;
  min_salary: number;
  max_salary: number;
  median_salary: number;
  salary_period: string;
  salary_currency: string;
}

// Normalized job type for internal use
export interface NormalizedJob {
  id: string;
  external_id: string;
  title: string;
  company: string;
  company_logo: string | null;
  company_website: string | null;
  location: string;
  city: string;
  state: string;
  country: string;
  is_remote: boolean;
  job_type: string; // FULLTIME, PARTTIME, CONTRACTOR, INTERN
  description: string;
  apply_url: string;
  apply_is_direct: boolean;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  salary_period: string | null; // YEAR, MONTH, HOUR
  posted_at: string;
  posted_timestamp: number;
  expires_at: string | null;
  source: string; // publisher name
  required_skills: string[];
  required_experience_months: number | null;
  highlights: {
    qualifications: string[];
    responsibilities: string[];
    benefits: string[];
  };
  education: {
    degree_required: boolean;
    degree_preferred: boolean;
    level: string | null; // high_school, associates, bachelors, postgraduate
  };
}

export interface JobSearchParams {
  query: string;
  location?: string;
  page?: number;
  num_pages?: number;
  date_posted?: "all" | "today" | "3days" | "week" | "month";
  remote_jobs_only?: boolean;
  employment_types?: string; // comma-separated: FULLTIME,PARTTIME,CONTRACTOR,INTERN
  job_requirements?:
    | "under_3_years_experience"
    | "more_than_3_years_experience"
    | "no_experience"
    | "no_degree";
  radius?: number; // miles
  categories?: string;
}

export interface JobSearchFilters {
  query: string;
  location: string;
  datePosted: "all" | "today" | "3days" | "week" | "month";
  remoteOnly: boolean;
  jobType: string[];
  experienceLevel: string;
  salaryMin: number | null;
  sortBy: "relevance" | "date" | "salary";
  page: number;
}

export const DEFAULT_FILTERS: JobSearchFilters = {
  query: "",
  location: "",
  datePosted: "all",
  remoteOnly: false,
  jobType: [],
  experienceLevel: "",
  salaryMin: null,
  sortBy: "relevance",
  page: 1,
};

export const JOB_TYPE_LABELS: Record<string, string> = {
  FULLTIME: "Full-time",
  PARTTIME: "Part-time",
  CONTRACTOR: "Contract",
  INTERN: "Internship",
};

export const DATE_POSTED_LABELS: Record<string, string> = {
  all: "Any time",
  today: "Last 24 hours",
  "3days": "Last 3 days",
  week: "Last 7 days",
  month: "Last 30 days",
};

export const EXPERIENCE_LABELS: Record<string, string> = {
  "": "Any experience",
  no_experience: "No experience required",
  under_3_years_experience: "Entry level (0-3 years)",
  more_than_3_years_experience: "Senior (3+ years)",
};

export const SALARY_PERIOD_LABELS: Record<string, string> = {
  YEAR: "/yr",
  MONTH: "/mo",
  HOUR: "/hr",
  WEEK: "/wk",
};
