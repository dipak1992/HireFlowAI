"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { analyzeResumeVsJob } from "@/lib/tailoring-engine";
import type { ResumeData } from "@/lib/resume-types";
import type { TailoringSession } from "@/lib/tailoring-types";

export async function createTailoringSession(
  resumeId: string,
  jobDescription: string,
  jobTitle?: string,
  jobCompany?: string,
  jobUrl?: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get the resume
  const { data: resume } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", resumeId)
    .eq("user_id", user.id)
    .single();

  if (!resume) return { error: "Resume not found" };

  // Get LinkedIn skills if available
  const { data: linkedinImport } = await supabase
    .from("linkedin_imports")
    .select("profile_data")
    .eq("user_id", user.id)
    .eq("consent_given", true)
    .single();

  const linkedInSkills: string[] = [];
  if (linkedinImport?.profile_data) {
    const ld = linkedinImport.profile_data as Record<string, unknown>;
    const skills = (ld.skills as string[]) || [];
    linkedInSkills.push(...skills);
  }

  // Run analysis
  const analysis = analyzeResumeVsJob(resume as unknown as ResumeData, jobDescription, linkedInSkills);

  // Save session
  const { data, error } = await supabase
    .from("tailoring_sessions")
    .insert({
      user_id: user.id,
      resume_id: resumeId,
      job_title: jobTitle || "",
      job_company: jobCompany || "",
      job_url: jobUrl || "",
      job_description: jobDescription,
      ats_score: analysis.ats_score,
      keyword_matches: JSON.stringify(analysis.keyword_matches),
      missing_keywords: JSON.stringify(analysis.missing_keywords),
      missing_skills: JSON.stringify(analysis.missing_skills),
      tailored_summary: analysis.tailored_summary,
      tailored_experience: JSON.stringify(analysis.tailored_experience),
      status: "analyzed",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating tailoring session:", error);
    return { error: "Failed to create tailoring session" };
  }

  return { success: true, sessionId: data.id, analysis };
}

export async function getTailoringSessions(resumeId?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from("tailoring_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (resumeId) {
    query = query.eq("resume_id", resumeId);
  }

  const { data } = await query;
  return data || [];
}

export async function getTailoringSession(sessionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("tailoring_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single();

  return data;
}

export async function applyTailoredContent(sessionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Get the session
  const { data: session } = await supabase
    .from("tailoring_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single();

  if (!session) return { error: "Session not found" };

  // Get the resume
  const { data: resume } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", session.resume_id)
    .eq("user_id", user.id)
    .single();

  if (!resume) return { error: "Resume not found" };

  // Build update object
  const updates: Record<string, unknown> = {};

  // Apply tailored summary if available
  if (session.tailored_summary) {
    updates.summary = session.tailored_summary;
  }

  // Apply tailored experience bullets
  const tailoredExp = (session.tailored_experience as unknown as Array<{
    exp_id: string;
    tailored_bullets: string[];
  }>) || [];

  if (tailoredExp.length > 0) {
    const currentExp = (resume.experience as unknown as Array<{
      id: string;
      bullets: string[];
      [key: string]: unknown;
    }>) || [];

    const updatedExp = currentExp.map((exp) => {
      const tailored = tailoredExp.find((t) => t.exp_id === exp.id);
      if (tailored) {
        return { ...exp, bullets: tailored.tailored_bullets };
      }
      return exp;
    });

    updates.experience = JSON.stringify(updatedExp);
  }

  // Update the resume
  if (Object.keys(updates).length > 0) {
    const { error: updateError } = await supabase
      .from("resumes")
      .update(updates)
      .eq("id", session.resume_id)
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Error applying tailored content:", updateError);
      return { error: "Failed to apply tailored content" };
    }
  }

  // Mark session as applied
  await supabase
    .from("tailoring_sessions")
    .update({ applied_to_resume: true, status: "tailored" })
    .eq("id", sessionId)
    .eq("user_id", user.id);

  // Update ATS score on resume
  await supabase
    .from("resumes")
    .update({ ats_score: session.ats_score })
    .eq("id", session.resume_id)
    .eq("user_id", user.id);

  return { success: true };
}

export async function deleteTailoringSession(sessionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("tailoring_sessions")
    .delete()
    .eq("id", sessionId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting session:", error);
    return { error: "Failed to delete session" };
  }

  return { success: true };
}

export async function getUserResumes() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("resumes")
    .select("id, title, template, contact_name, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return data || [];
}
