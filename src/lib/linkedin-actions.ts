"use server";

// src/lib/linkedin-actions.ts
// LinkedIn OAuth + profile import actions

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { ResumeData, ResumeExperience, ResumeEducation, ResumeSkill } from "@/lib/resume-types";

// ─── Sign in with LinkedIn via Supabase OAuth ─────────────────────────────────

export async function signInWithLinkedIn(): Promise<{ url: string | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "linkedin_oidc",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/dashboard`,
      scopes: "openid profile email",
    },
  });

  if (error) {
    return { url: null, error: error.message };
  }

  return { url: data.url, error: null };
}

// ─── Import LinkedIn profile from OAuth metadata ──────────────────────────────

export async function importLinkedInProfile(): Promise<{
  success: boolean;
  error: string | null;
  profileData?: Record<string, unknown>;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Extract profile data from OAuth user metadata
  const metadata = user.user_metadata || {};
  const identities = user.identities || [];
  const linkedInIdentity = identities.find(
    (id) => id.provider === "linkedin_oidc"
  );
  const identityData = linkedInIdentity?.identity_data || {};

  const profileData = {
    full_name:
      metadata.full_name ||
      metadata.name ||
      `${identityData.given_name || ""} ${identityData.family_name || ""}`.trim() ||
      "",
    email: user.email || identityData.email || "",
    headline: metadata.headline || identityData.headline || "",
    location: metadata.location || identityData.locale || "",
    avatar_url:
      metadata.avatar_url ||
      metadata.picture ||
      identityData.picture ||
      "",
    profile_url:
      metadata.profile_url ||
      identityData.sub
        ? `https://www.linkedin.com/in/${identityData.sub}`
        : "",
    positions: (metadata.positions || identityData.positions || []) as Array<{
      title: string;
      company: string;
      location?: string;
      startDate?: string;
      endDate?: string;
      description?: string;
      isCurrent?: boolean;
    }>,
    educations: (metadata.educations || identityData.educations || []) as Array<{
      school: string;
      degree?: string;
      fieldOfStudy?: string;
      startDate?: string;
      endDate?: string;
    }>,
    skills: (metadata.skills || identityData.skills || []) as string[],
    summary: metadata.summary || identityData.summary || "",
  };

  // Store in linkedin_imports table
  const { error: importError } = await supabase
    .from("linkedin_imports")
    .upsert(
      {
        user_id: user.id,
        consent_given: true,
        consent_date: new Date().toISOString(),
        import_status: "imported",
        profile_data: profileData,
      },
      { onConflict: "user_id" }
    );

  if (importError) {
    return { success: false, error: importError.message };
  }

  // Update profile table
  await supabase
    .from("profiles")
    .update({
      full_name: profileData.full_name,
      avatar_url: profileData.avatar_url,
      headline: profileData.headline,
    })
    .eq("id", user.id);

  // Store auth provider
  await supabase.from("auth_providers").upsert(
    {
      user_id: user.id,
      provider: "linkedin",
      provider_email: user.email,
    },
    { onConflict: "user_id,provider" }
  );

  return { success: true, error: null, profileData };
}

// ─── Convert LinkedIn profile data to flat ResumeData structure ───────────────

export async function convertLinkedInToResume(): Promise<{
  resumeData: Partial<ResumeData> | null;
  error: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { resumeData: null, error: "Not authenticated" };
  }

  // Fetch stored LinkedIn import data
  const { data: importData, error: fetchError } = await supabase
    .from("linkedin_imports")
    .select("profile_data")
    .eq("user_id", user.id)
    .single();

  if (fetchError || !importData?.profile_data) {
    return { resumeData: null, error: "No LinkedIn profile data found. Please import your profile first." };
  }

  const profile = importData.profile_data as {
    full_name?: string;
    email?: string;
    headline?: string;
    location?: string;
    avatar_url?: string;
    profile_url?: string;
    summary?: string;
    positions?: Array<{
      title: string;
      company: string;
      location?: string;
      startDate?: string;
      endDate?: string;
      description?: string;
      isCurrent?: boolean;
    }>;
    educations?: Array<{
      school: string;
      degree?: string;
      fieldOfStudy?: string;
      startDate?: string;
      endDate?: string;
    }>;
    skills?: string[];
  };

  // Build experience array from positions — flat ResumeExperience objects
  const experience: ResumeExperience[] = (profile.positions || []).map(
    (pos, i) => ({
      id: `li-exp-${i}`,
      title: pos.title || "",
      company: pos.company || "",
      location: pos.location || "",
      start_date: pos.startDate || "",
      end_date: pos.endDate || "",
      is_current: pos.isCurrent ?? false,
      description: pos.description || "",
      bullets: pos.description
        ? pos.description
            .split("\n")
            .map((b) => b.trim())
            .filter(Boolean)
        : [],
    })
  );

  // Build education array — flat ResumeEducation objects
  const education: ResumeEducation[] = (profile.educations || []).map(
    (edu, i) => ({
      id: `li-edu-${i}`,
      school: edu.school || "",
      degree: edu.degree || "",
      field_of_study: edu.fieldOfStudy || "",
      location: "",
      start_date: edu.startDate || "",
      end_date: edu.endDate || "",
      gpa: "",
      description: "",
    })
  );

  // Build skills array — flat ResumeSkill objects
  const skills: ResumeSkill[] = (profile.skills || []).map((skill, i) => ({
    id: `li-skill-${i}`,
    name: typeof skill === "string" ? skill : String(skill),
    level: "intermediate" as const,
    category: "General",
  }));

  // Build the flat ResumeData partial — using flat contact_* fields (NOT nested contact object)
  const resumeData: Partial<ResumeData> = {
    title: `${profile.full_name || "My"} Resume (LinkedIn)`,
    source: "linkedin",
    template: "ats",
    is_primary: false,
    // Flat contact fields — matches ResumeData interface exactly
    contact_name: profile.full_name || "",
    contact_email: profile.email || user.email || "",
    contact_phone: "",
    contact_location: profile.location || "",
    contact_website: "",
    contact_linkedin: profile.profile_url || "",
    summary: profile.summary || profile.headline || "",
    experience,
    education,
    skills,
    certifications: [],
    projects: [],
    ats_score: null,
    last_exported_at: null,
  };

  return { resumeData, error: null };
}

// ─── Get LinkedIn import status ───────────────────────────────────────────────

export async function getLinkedInImportStatus(): Promise<{
  status: "not_started" | "imported" | "skipped" | "error";
  importedAt: string | null;
  error: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "not_started", importedAt: null, error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("linkedin_imports")
    .select("import_status, created_at")
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    return { status: "not_started", importedAt: null, error: null };
  }

  return {
    status: data.import_status as "not_started" | "imported" | "skipped" | "error",
    importedAt: data.created_at,
    error: null,
  };
}

// ─── Legacy consent actions (kept for backward compatibility) ─────────────────

export async function acceptLinkedInConsent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase.from("linkedin_imports").upsert(
    {
      user_id: user.id,
      consent_given: true,
      consent_date: new Date().toISOString(),
      import_status: "imported",
      profile_data: {
        first_name: user.user_metadata?.full_name?.split(" ")[0] || "",
        last_name: user.user_metadata?.full_name?.split(" ").slice(1).join(" ") || "",
        headline: user.user_metadata?.headline || "",
        location: user.user_metadata?.location || "",
        profile_url: user.user_metadata?.profile_url || "",
      },
    },
    { onConflict: "user_id" }
  );

  await supabase
    .from("profiles")
    .update({
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
      avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || "",
      headline: user.user_metadata?.headline || "",
    })
    .eq("id", user.id);

  await supabase.from("auth_providers").upsert(
    {
      user_id: user.id,
      provider: "linkedin",
      provider_email: user.email,
    },
    { onConflict: "user_id,provider" }
  );

  redirect("/onboarding");
}

export async function skipLinkedInConsent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase.from("linkedin_imports").upsert(
    {
      user_id: user.id,
      consent_given: false,
      import_status: "skipped",
    },
    { onConflict: "user_id" }
  );

  redirect("/onboarding");
}

export async function uploadResumeInstead() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase.from("linkedin_imports").upsert(
    {
      user_id: user.id,
      consent_given: false,
      import_status: "skipped",
    },
    { onConflict: "user_id" }
  );

  redirect("/onboarding");
}
