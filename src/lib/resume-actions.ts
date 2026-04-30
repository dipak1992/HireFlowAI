"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { ResumeData, ResumeTemplate, ResumeSource } from "@/lib/resume-types";

export async function createResume(source: ResumeSource, template: ResumeTemplate = "ats") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let resumeData: Record<string, unknown> = {
    user_id: user.id,
    title: "Untitled Resume",
    template,
    source,
    contact_email: user.email || "",
  };

  // If LinkedIn source, auto-fill from profile and linkedin_imports
  if (source === "linkedin") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const { data: linkedinImport } = await supabase
      .from("linkedin_imports")
      .select("*")
      .eq("user_id", user.id)
      .eq("consent_given", true)
      .single();

    resumeData = {
      ...resumeData,
      title: `${profile?.full_name || "My"}'s Resume`,
      contact_name: profile?.full_name || "",
      contact_email: profile?.email || user.email || "",
      contact_phone: profile?.phone || "",
      contact_location: profile?.location || "",
      summary: profile?.bio || profile?.headline || "",
    };

    // Auto-fill from LinkedIn imported data
    if (linkedinImport?.profile_data) {
      const ld = linkedinImport.profile_data as Record<string, unknown>;
      const positions = (ld.positions as Array<Record<string, unknown>>) || [];
      const education = (ld.education as Array<Record<string, unknown>>) || [];
      const skills = (ld.skills as string[]) || [];

      resumeData.experience = JSON.stringify(
        positions.map((p, i) => ({
          id: `exp-${i}`,
          title: p.title || "",
          company: p.company || "",
          location: "",
          start_date: p.start_date || "",
          end_date: p.end_date || "",
          is_current: p.is_current || false,
          description: p.description || "",
          bullets: [],
        }))
      );

      resumeData.education = JSON.stringify(
        education.map((e, i) => ({
          id: `edu-${i}`,
          school: e.school || "",
          degree: e.degree || "",
          field_of_study: e.field_of_study || "",
          location: "",
          start_date: e.start_date || "",
          end_date: e.end_date || "",
          gpa: "",
          description: "",
        }))
      );

      resumeData.skills = JSON.stringify(
        skills.map((s, i) => ({
          id: `skill-${i}`,
          name: s,
          level: "intermediate",
          category: "General",
        }))
      );

      if (ld.headline) {
        resumeData.summary = resumeData.summary || ld.headline;
      }
      if (ld.profile_url) {
        resumeData.contact_linkedin = ld.profile_url;
      }
    }
  }

  // If building from scratch, pre-fill with profile data
  if (source === "scratch") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profile) {
      resumeData.contact_name = profile.full_name || "";
      resumeData.contact_email = profile.email || user.email || "";
      resumeData.contact_phone = profile.phone || "";
      resumeData.contact_location = profile.location || "";
    }
  }

  const { data, error } = await supabase
    .from("resumes")
    .insert(resumeData)
    .select("id")
    .single();

  if (error) {
    console.error("Error creating resume:", error);
    return { error: "Failed to create resume" };
  }

  return { id: data.id };
}

export async function updateResume(resumeId: string, updates: Partial<ResumeData>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Convert arrays to JSON for Supabase
  const dbUpdates: Record<string, unknown> = {};
  const jsonFields = ["experience", "education", "skills", "certifications", "projects"];
  const directFields = [
    "title", "template", "contact_name", "contact_email", "contact_phone",
    "contact_location", "contact_website", "contact_linkedin", "summary",
    "is_primary", "ats_score",
  ];

  for (const field of directFields) {
    if (field in updates) {
      dbUpdates[field] = (updates as Record<string, unknown>)[field];
    }
  }

  for (const field of jsonFields) {
    if (field in updates) {
      dbUpdates[field] = JSON.stringify((updates as Record<string, unknown>)[field]);
    }
  }

  const { error } = await supabase
    .from("resumes")
    .update(dbUpdates)
    .eq("id", resumeId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating resume:", error);
    return { error: "Failed to update resume" };
  }

  return { success: true };
}

export async function deleteResume(resumeId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("resumes")
    .delete()
    .eq("id", resumeId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting resume:", error);
    return { error: "Failed to delete resume" };
  }

  return { success: true };
}

export async function saveResumeVersion(resumeId: string, versionName?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Get current resume data
  const { data: resume } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", resumeId)
    .eq("user_id", user.id)
    .single();

  if (!resume) return { error: "Resume not found" };

  // Get next version number
  const { data: versions } = await supabase
    .from("resume_versions")
    .select("version_number")
    .eq("resume_id", resumeId)
    .order("version_number", { ascending: false })
    .limit(1);

  const nextVersion = (versions?.[0]?.version_number || 0) + 1;

  const { error } = await supabase.from("resume_versions").insert({
    resume_id: resumeId,
    user_id: user.id,
    version_number: nextVersion,
    version_name: versionName || `Version ${nextVersion}`,
    snapshot: resume,
  });

  if (error) {
    console.error("Error saving version:", error);
    return { error: "Failed to save version" };
  }

  return { success: true, version_number: nextVersion };
}

export async function restoreResumeVersion(resumeId: string, versionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: version } = await supabase
    .from("resume_versions")
    .select("snapshot")
    .eq("id", versionId)
    .eq("user_id", user.id)
    .single();

  if (!version) return { error: "Version not found" };

  const snapshot = version.snapshot as Record<string, unknown>;
  const { error } = await supabase
    .from("resumes")
    .update({
      title: snapshot.title,
      template: snapshot.template,
      contact_name: snapshot.contact_name,
      contact_email: snapshot.contact_email,
      contact_phone: snapshot.contact_phone,
      contact_location: snapshot.contact_location,
      contact_website: snapshot.contact_website,
      contact_linkedin: snapshot.contact_linkedin,
      summary: snapshot.summary,
      experience: snapshot.experience,
      education: snapshot.education,
      skills: snapshot.skills,
      certifications: snapshot.certifications,
      projects: snapshot.projects,
    })
    .eq("id", resumeId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error restoring version:", error);
    return { error: "Failed to restore version" };
  }

  return { success: true };
}

export async function getResumes() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return data || [];
}

export async function getResume(resumeId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", resumeId)
    .eq("user_id", user.id)
    .single();

  return data;
}

export async function getResumeVersions(resumeId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("resume_versions")
    .select("*")
    .eq("resume_id", resumeId)
    .eq("user_id", user.id)
    .order("version_number", { ascending: false });

  return data || [];
}

export async function hasLinkedInData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("linkedin_imports")
    .select("id")
    .eq("user_id", user.id)
    .eq("consent_given", true)
    .single();

  return !!data;
}
