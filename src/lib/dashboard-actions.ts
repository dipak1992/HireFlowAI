"use server";

import { createClient } from "@/lib/supabase/server";

export interface DashboardStats {
  applicationCount: number;
  savedJobCount: number;
  resumeCount: number;
  tailoringCount: number;
  interviewCount: number;
  offerCount: number;
}

export interface RecentApplication {
  id: string;
  company: string;
  job_title: string;
  status: string;
  applied_at: string | null;
  updated_at: string;
}

export interface OnboardingStatus {
  hasProfile: boolean;
  hasPreferences: boolean;
  hasResume: boolean;
  hasBrowsedJobs: boolean;
  hasApplied: boolean;
}

export async function getDashboardStatsAction(): Promise<DashboardStats> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      applicationCount: 0,
      savedJobCount: 0,
      resumeCount: 0,
      tailoringCount: 0,
      interviewCount: 0,
      offerCount: 0,
    };
  }

  const [
    { count: applicationCount },
    { count: savedJobCount },
    { count: resumeCount },
    { count: tailoringCount },
    { count: interviewCount },
    { count: offerCount },
  ] = await Promise.all([
    supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("saved_jobs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("resumes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("tailoring_sessions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "interview"),
    supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "offer"),
  ]);

  return {
    applicationCount: applicationCount ?? 0,
    savedJobCount: savedJobCount ?? 0,
    resumeCount: resumeCount ?? 0,
    tailoringCount: tailoringCount ?? 0,
    interviewCount: interviewCount ?? 0,
    offerCount: offerCount ?? 0,
  };
}

export async function getRecentApplicationsAction(): Promise<RecentApplication[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("applications")
    .select("id, company, job_title, status, applied_at, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(5);

  return (data ?? []) as RecentApplication[];
}

export async function getOnboardingStatusAction(): Promise<OnboardingStatus> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      hasProfile: false,
      hasPreferences: false,
      hasResume: false,
      hasBrowsedJobs: false,
      hasApplied: false,
    };
  }

  const [
    { data: profile },
    { data: preferences },
    { count: resumeCount },
    { count: applicationCount },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, headline")
      .eq("id", user.id)
      .single(),
    supabase
      .from("preferences")
      .select("goal")
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("resumes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  return {
    hasProfile: !!(profile?.full_name && profile?.headline),
    hasPreferences: !!preferences?.goal,
    hasResume: (resumeCount ?? 0) > 0,
    hasBrowsedJobs: true, // assume true once they've logged in
    hasApplied: (applicationCount ?? 0) > 0,
  };
}
