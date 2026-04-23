"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { OnboardingData } from "@/lib/types";

export async function completeOnboarding(data: OnboardingData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Upsert preferences
  const { error: prefError } = await supabase.from("preferences").upsert(
    {
      user_id: user.id,
      goal: data.goal,
      location: data.location,
      desired_pay_min: data.desired_pay_min,
      desired_pay_max: data.desired_pay_max,
      pay_type: data.pay_type,
      job_category: data.job_category,
      remote_preference: data.remote_preference,
    },
    { onConflict: "user_id" }
  );

  if (prefError) {
    console.error("Error saving preferences:", prefError);
    return { error: "Failed to save preferences" };
  }

  // Mark onboarding as completed
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ onboarding_completed: true })
    .eq("id", user.id);

  if (profileError) {
    console.error("Error updating profile:", profileError);
    return { error: "Failed to update profile" };
  }

  redirect("/dashboard");
}
