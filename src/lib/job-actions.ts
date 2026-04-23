"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { JobFilters, SavedJobStatus, Job } from "@/lib/job-types";

export async function getJobs(filters?: JobFilters) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from("jobs")
    .select("*")
    .order("posted_at", { ascending: false });

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,company.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }
  if (filters?.location) {
    query = query.ilike("location", `%${filters.location}%`);
  }
  if (filters?.is_remote !== undefined) {
    query = query.eq("is_remote", filters.is_remote);
  }
  if (filters?.job_type) {
    query = query.eq("job_type", filters.job_type);
  }
  if (filters?.experience_level) {
    query = query.eq("experience_level", filters.experience_level);
  }
  if (filters?.salary_min) {
    query = query.gte("salary_max", filters.salary_min);
  }
  if (filters?.salary_max) {
    query = query.lte("salary_min", filters.salary_max);
  }
  if (filters?.is_urgent) {
    query = query.eq("is_urgent", true);
  }

  const { data } = await query;
  return data || [];
}

export async function getRecommendedJobs() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Get user profile for preferences
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Get user preferences
  const { data: prefs } = await supabase
    .from("preferences")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Get LinkedIn data for better recommendations
  const { data: linkedinImport } = await supabase
    .from("linkedin_imports")
    .select("profile_data")
    .eq("user_id", user.id)
    .eq("consent_given", true)
    .single();

  // Get user's resume skills
  const { data: resumes } = await supabase
    .from("resumes")
    .select("skills, experience")
    .eq("user_id", user.id)
    .limit(1);

  // Build recommendation query based on user data
  let query = supabase
    .from("jobs")
    .select("*")
    .order("posted_at", { ascending: false });

  // If user has preferences, filter by them
  if (prefs?.preferred_location) {
    // Don't strictly filter, but we'll sort by relevance later
  }

  const { data: allJobs } = await query;
  if (!allJobs) return [];

  // Score and rank jobs based on user profile
  const userSkills: string[] = [];
  const userTitles: string[] = [];

  // Extract skills from resume
  if (resumes?.[0]?.skills) {
    const skills = resumes[0].skills as Array<{ name: string }>;
    userSkills.push(...skills.map((s) => s.name.toLowerCase()));
  }

  // Extract from resume experience
  if (resumes?.[0]?.experience) {
    const experience = resumes[0].experience as Array<{ title: string }>;
    userTitles.push(...experience.map((e) => e.title.toLowerCase()));
  }

  // Extract from LinkedIn
  if (linkedinImport?.profile_data) {
    const ld = linkedinImport.profile_data as Record<string, unknown>;
    const linkedInSkills = (ld.skills as string[]) || [];
    userSkills.push(...linkedInSkills.map((s) => s.toLowerCase()));

    const positions = (ld.positions as Array<{ title: string }>) || [];
    userTitles.push(...positions.map((p) => p.title?.toLowerCase()).filter(Boolean));

    if (ld.headline) {
      const headlineWords = (ld.headline as string).toLowerCase().split(/\s+/);
      userSkills.push(...headlineWords.filter((w) => w.length > 3));
    }
  }

  // Extract from profile
  if (profile?.headline) {
    const headlineWords = profile.headline.toLowerCase().split(/\s+/);
    userSkills.push(...headlineWords.filter((w: string) => w.length > 3));
  }

  const uniqueSkills = [...new Set(userSkills)];
  const uniqueTitles = [...new Set(userTitles)];

  // Score each job
  const scoredJobs = allJobs.map((job) => {
    let score = 0;
    const jobTags = (job.tags as string[]) || [];
    const jobTitle = job.title.toLowerCase();
    const jobDesc = job.description.toLowerCase();

    // Tag/skill match (highest weight)
    for (const skill of uniqueSkills) {
      if (jobTags.some((t: string) => t.toLowerCase().includes(skill))) score += 10;
      if (jobDesc.includes(skill)) score += 3;
      if (jobTitle.includes(skill)) score += 5;
    }

    // Title similarity
    for (const title of uniqueTitles) {
      const titleWords = title.split(/\s+/);
      for (const word of titleWords) {
        if (word.length > 3 && jobTitle.includes(word)) score += 8;
      }
    }

    // Location preference
    if (prefs?.preferred_location && job.location.toLowerCase().includes(prefs.preferred_location.toLowerCase())) {
      score += 5;
    }

    // Remote preference
    if (job.is_remote) score += 2;

    // Recency bonus
    const daysOld = (Date.now() - new Date(job.posted_at).getTime()) / (1000 * 60 * 60 * 24);
    if (daysOld < 1) score += 5;
    else if (daysOld < 3) score += 3;
    else if (daysOld < 7) score += 1;

    // Urgent bonus
    if (job.is_urgent) score += 3;

    return { ...job, _score: score };
  });

  // Sort by score descending
  scoredJobs.sort((a, b) => b._score - a._score);

  return scoredJobs;
}

export async function getRemoteJobs() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("jobs")
    .select("*")
    .eq("is_remote", true)
    .order("posted_at", { ascending: false });

  return data || [];
}

export async function getUrgentJobs() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("jobs")
    .select("*")
    .eq("is_urgent", true)
    .order("posted_at", { ascending: false });

  return data || [];
}

export async function getNearbyJobs(userLocation?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Get user's location from profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("location")
    .eq("id", user.id)
    .single();

  const location = userLocation || profile?.location || "";
  
  if (!location) {
    // Return all non-remote jobs if no location
    const { data } = await supabase
      .from("jobs")
      .select("*")
      .eq("is_remote", false)
      .order("posted_at", { ascending: false });
    return data || [];
  }

  // Simple text-based location matching
  const locationParts = location.toLowerCase().split(",").map((s: string) => s.trim());
  
  const { data: allJobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("is_remote", false)
    .order("posted_at", { ascending: false });

  if (!allJobs) return [];

  // Filter by location similarity
  return allJobs.filter((job) => {
    const jobLoc = job.location.toLowerCase();
    return locationParts.some((part: string) => jobLoc.includes(part));
  });
}

// Saved jobs actions
export async function saveJob(jobId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("saved_jobs")
    .upsert({
      user_id: user.id,
      job_id: jobId,
      status: "saved",
    }, { onConflict: "user_id,job_id" });

  if (error) {
    console.error("Error saving job:", error);
    return { error: "Failed to save job" };
  }

  return { success: true };
}

export async function unsaveJob(jobId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("saved_jobs")
    .delete()
    .eq("user_id", user.id)
    .eq("job_id", jobId);

  if (error) {
    console.error("Error unsaving job:", error);
    return { error: "Failed to unsave job" };
  }

  return { success: true };
}

export async function updateSavedJobStatus(jobId: string, status: SavedJobStatus, notes?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const updates: Record<string, unknown> = { status };
  if (status === "applied") {
    updates.applied_at = new Date().toISOString();
  }
  if (notes !== undefined) {
    updates.notes = notes;
  }

  const { error } = await supabase
    .from("saved_jobs")
    .update(updates)
    .eq("user_id", user.id)
    .eq("job_id", jobId);

  if (error) {
    console.error("Error updating saved job:", error);
    return { error: "Failed to update job status" };
  }

  return { success: true };
}

export async function getSavedJobs() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("saved_jobs")
    .select("*, job:jobs(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function getSavedJobIds() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("saved_jobs")
    .select("job_id")
    .eq("user_id", user.id);

  return (data || []).map((d) => d.job_id);
}
