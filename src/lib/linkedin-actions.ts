"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function acceptLinkedInConsent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Store consent and LinkedIn profile data
  const { error } = await supabase.from("linkedin_imports").upsert(
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

  if (error) {
    console.error("Error storing LinkedIn consent:", error);
  }

  // Update profile with LinkedIn data
  await supabase
    .from("profiles")
    .update({
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
      avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || "",
      headline: user.user_metadata?.headline || "",
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

  // Store that user skipped
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
  // For Phase 1, redirect to onboarding with a flag
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
