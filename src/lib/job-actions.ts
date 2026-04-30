// src/lib/job-actions.ts
// Job search server actions — integrates with JSearch API + Supabase
"use server";

import { createClient } from "@/lib/supabase/server";
import { searchJobs, getJobDetails } from "@/lib/jsearch-client";
import type { JobSearchFilters, NormalizedJob } from "@/lib/jsearch-types";
import { revalidatePath } from "next/cache";

// ----- Job Search -----

export async function searchJobsAction(filters: JobSearchFilters): Promise<{
  jobs: NormalizedJob[];
  totalFound: number;
  error?: string;
}> {
  if (!filters.query && !filters.location) {
    return {
      jobs: [],
      totalFound: 0,
      error: "Please enter a job title or location.",
    };
  }

  const employmentTypes =
    filters.jobType.length > 0 ? filters.jobType.join(",") : undefined;

  const result = await searchJobs({
    query: filters.query || "jobs",
    location: filters.location || undefined,
    page: filters.page || 1,
    num_pages: 1,
    date_posted: filters.datePosted,
    remote_jobs_only: filters.remoteOnly,
    employment_types: employmentTypes,
    job_requirements: filters.experienceLevel
      ? (filters.experienceLevel as
          | "under_3_years_experience"
          | "more_than_3_years_experience"
          | "no_experience"
          | "no_degree")
      : undefined,
  });

  // Sort client-side if needed
  if (result.jobs.length > 0 && filters.sortBy === "date") {
    result.jobs.sort((a, b) => b.posted_timestamp - a.posted_timestamp);
  } else if (result.jobs.length > 0 && filters.sortBy === "salary") {
    result.jobs.sort((a, b) => (b.salary_max || 0) - (a.salary_max || 0));
  }

  // Filter by min salary if set
  if (filters.salaryMin !== null && filters.salaryMin > 0) {
    result.jobs = result.jobs.filter((job) => {
      if (!job.salary_max) return true; // Include jobs without salary info
      return job.salary_max >= (filters.salaryMin as number);
    });
  }

  return result;
}

export async function getJobDetailsAction(
  jobId: string
): Promise<{ job: NormalizedJob | null; error?: string }> {
  return getJobDetails(jobId);
}

// ----- Saved Jobs -----

export async function saveJobAction(job: NormalizedJob): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be logged in to save jobs." };
  }

  // Check saved jobs limit for free users
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan_id, status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  const isPro = subscription?.plan_id === "pro";

  if (!isPro) {
    const { count } = await supabase
      .from("saved_jobs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if ((count || 0) >= 5) {
      return {
        success: false,
        error:
          "Free accounts can save up to 5 jobs. Upgrade to Pro for unlimited saved jobs.",
      };
    }
  }

  // Upsert into jobs table first
  const { error: jobError } = await supabase.from("jobs").upsert(
    {
      id: job.external_id,
      title: job.title,
      company: job.company,
      company_logo: job.company_logo,
      company_website: job.company_website,
      location: job.location,
      is_remote: job.is_remote,
      job_type: job.job_type,
      description: job.description,
      apply_url: job.apply_url,
      salary_min: job.salary_min,
      salary_max: job.salary_max,
      salary_currency: job.salary_currency,
      salary_period: job.salary_period,
      posted_at: job.posted_at,
      source: job.source,
      required_skills: job.required_skills,
      external_id: job.external_id,
    },
    { onConflict: "id" }
  );

  if (jobError) {
    console.error("Error upserting job:", jobError);
    return { success: false, error: "Failed to save job." };
  }

  // Save to user's saved jobs
  const { error: saveError } = await supabase.from("saved_jobs").upsert(
    {
      user_id: user.id,
      job_id: job.external_id,
    },
    { onConflict: "user_id,job_id" }
  );

  if (saveError) {
    console.error("Error saving job:", saveError);
    return { success: false, error: "Failed to save job." };
  }

  revalidatePath("/dashboard/jobs");
  return { success: true };
}

export async function unsaveJobAction(jobId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be logged in." };
  }

  const { error } = await supabase
    .from("saved_jobs")
    .delete()
    .eq("user_id", user.id)
    .eq("job_id", jobId);

  if (error) {
    console.error("Error unsaving job:", error);
    return { success: false, error: "Failed to unsave job." };
  }

  revalidatePath("/dashboard/jobs");
  return { success: true };
}

export async function getSavedJobIdsAction(): Promise<string[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("saved_jobs")
    .select("job_id")
    .eq("user_id", user.id);

  return data?.map((row: { job_id: string }) => row.job_id) || [];
}

export async function getSavedJobsAction(): Promise<{
  jobs: NormalizedJob[];
  error?: string;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { jobs: [], error: "You must be logged in." };
  }

  const { data, error } = await supabase
    .from("saved_jobs")
    .select(
      `
      job_id,
      jobs (
        id, title, company, company_logo, company_website,
        location, is_remote, job_type, description, apply_url,
        salary_min, salary_max, salary_currency, salary_period,
        posted_at, source, required_skills, external_id
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching saved jobs:", error);
    return { jobs: [], error: "Failed to load saved jobs." };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jobs: NormalizedJob[] = ((data as any[]) || [])
    .filter((row) => row.jobs)
    .map((row) => ({
      id: row.jobs.id,
      external_id: row.jobs.external_id || row.jobs.id,
      title: row.jobs.title,
      company: row.jobs.company,
      company_logo: row.jobs.company_logo,
      company_website: row.jobs.company_website,
      location: row.jobs.location,
      city: "",
      state: "",
      country: "US",
      is_remote: row.jobs.is_remote,
      job_type: row.jobs.job_type,
      description: row.jobs.description,
      apply_url: row.jobs.apply_url,
      apply_is_direct: false,
      salary_min: row.jobs.salary_min,
      salary_max: row.jobs.salary_max,
      salary_currency: row.jobs.salary_currency,
      salary_period: row.jobs.salary_period,
      posted_at: row.jobs.posted_at,
      posted_timestamp: new Date(row.jobs.posted_at).getTime() / 1000,
      expires_at: null,
      source: row.jobs.source,
      required_skills: row.jobs.required_skills || [],
      required_experience_months: null,
      highlights: { qualifications: [], responsibilities: [], benefits: [] },
      education: {
        degree_required: false,
        degree_preferred: false,
        level: null,
      },
    }));

  return { jobs };
}

// ----- Tailoring Counter (for landing page social proof) -----

export async function getTailoringCountAction(): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("tailoring_sessions")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error fetching tailoring count:", error);
    return 0;
  }

  return count || 0;
}
