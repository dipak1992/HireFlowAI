// src/lib/jsearch-client.ts
// JSearch API client — server-side only
"use server";

import {
  type JSearchJob,
  type JSearchResponse,
  type NormalizedJob,
  type JobSearchParams,
} from "./jsearch-types";

const JSEARCH_API_HOST = "jsearch.p.rapidapi.com";
const JSEARCH_BASE_URL = `https://${JSEARCH_API_HOST}`;

function getHeaders(): Record<string, string> {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    throw new Error(
      "RAPIDAPI_KEY environment variable is not set. Get your key at https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch"
    );
  }
  return {
    "x-rapidapi-key": apiKey,
    "x-rapidapi-host": JSEARCH_API_HOST,
  };
}

function normalizeJob(job: JSearchJob): NormalizedJob {
  const locationParts = [job.job_city, job.job_state, job.job_country].filter(
    Boolean
  );

  let educationLevel: string | null = null;
  if (job.job_required_education) {
    if (job.job_required_education.postgraduate_degree)
      educationLevel = "postgraduate";
    else if (job.job_required_education.bachelors_degree)
      educationLevel = "bachelors";
    else if (job.job_required_education.associates_degree)
      educationLevel = "associates";
    else if (job.job_required_education.high_school)
      educationLevel = "high_school";
  }

  return {
    id: job.job_id,
    external_id: job.job_id,
    title: job.job_title,
    company: job.employer_name,
    company_logo: job.employer_logo,
    company_website: job.employer_website,
    location: locationParts.join(", ") || "Location not specified",
    city: job.job_city || "",
    state: job.job_state || "",
    country: job.job_country || "US",
    is_remote: job.job_is_remote,
    job_type: job.job_employment_type || "FULLTIME",
    description: job.job_description || "",
    apply_url: job.job_apply_link,
    apply_is_direct: job.job_apply_is_direct,
    salary_min: job.job_min_salary,
    salary_max: job.job_max_salary,
    salary_currency: job.job_salary_currency || "USD",
    salary_period: job.job_salary_period,
    posted_at: job.job_posted_at_datetime_utc,
    posted_timestamp: job.job_posted_at_timestamp,
    expires_at: job.job_offer_expiration_datetime_utc,
    source: job.job_publisher || "Unknown",
    required_skills: job.job_required_skills || [],
    required_experience_months:
      job.job_required_experience?.required_experience_in_months ?? null,
    highlights: {
      qualifications: job.job_highlights?.Qualifications || [],
      responsibilities: job.job_highlights?.Responsibilities || [],
      benefits: job.job_highlights?.Benefits || [],
    },
    education: {
      degree_required: job.job_required_education?.degree_mentioned ?? false,
      degree_preferred: job.job_required_education?.degree_preferred ?? false,
      level: educationLevel,
    },
  };
}

export async function searchJobs(
  params: JobSearchParams
): Promise<{ jobs: NormalizedJob[]; totalFound: number; error?: string }> {
  try {
    const searchParams = new URLSearchParams();

    if (params.location) {
      searchParams.set("query", `${params.query} in ${params.location}`);
    } else {
      searchParams.set("query", params.query);
    }

    searchParams.set("page", String(params.page || 1));
    searchParams.set("num_pages", String(params.num_pages || 1));

    if (params.date_posted && params.date_posted !== "all") {
      searchParams.set("date_posted", params.date_posted);
    }

    if (params.remote_jobs_only) {
      searchParams.set("remote_jobs_only", "true");
    }

    if (params.employment_types) {
      searchParams.set("employment_types", params.employment_types);
    }

    if (params.job_requirements) {
      searchParams.set("job_requirements", params.job_requirements);
    }

    if (params.radius) {
      searchParams.set("radius", String(params.radius));
    }

    const url = `${JSEARCH_BASE_URL}/search?${searchParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
      cache: "force-cache",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("JSearch API error:", response.status, errorText);

      if (response.status === 429) {
        return {
          jobs: [],
          totalFound: 0,
          error:
            "Job search is temporarily unavailable. Please try again in a moment.",
        };
      }
      if (response.status === 403) {
        return {
          jobs: [],
          totalFound: 0,
          error: "Job search API key is invalid. Please contact support.",
        };
      }

      return {
        jobs: [],
        totalFound: 0,
        error: "Failed to fetch jobs. Please try again.",
      };
    }

    const data: JSearchResponse = await response.json();

    if (!data.data || !Array.isArray(data.data)) {
      return { jobs: [], totalFound: 0 };
    }

    const jobs = data.data.map(normalizeJob);

    return {
      jobs,
      totalFound: jobs.length,
    };
  } catch (error) {
    console.error("JSearch API error:", error);
    return {
      jobs: [],
      totalFound: 0,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function getJobDetails(
  jobId: string
): Promise<{ job: NormalizedJob | null; error?: string }> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.set("job_id", jobId);

    const url = `${JSEARCH_BASE_URL}/job-details?${searchParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
      cache: "force-cache",
    });

    if (!response.ok) {
      return { job: null, error: "Failed to fetch job details." };
    }

    const data: JSearchResponse = await response.json();

    if (!data.data || data.data.length === 0) {
      return { job: null, error: "Job not found." };
    }

    return { job: normalizeJob(data.data[0]) };
  } catch (error) {
    console.error("JSearch job details error:", error);
    return { job: null, error: "An unexpected error occurred." };
  }
}
