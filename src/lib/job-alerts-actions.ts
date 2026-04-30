"use server";

// src/lib/job-alerts-actions.ts
// CRUD for job alerts — Free: max 3 active, Pro: unlimited

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type AlertFrequency = "daily" | "weekly";
export type JobType = "FULLTIME" | "PARTTIME" | "CONTRACTOR" | "INTERN";

export interface JobAlert {
  id: string;
  user_id: string;
  query: string;
  location: string;
  job_types: JobType[];
  remote_only: boolean;
  frequency: AlertFrequency;
  is_active: boolean;
  last_sent_at: string | null;
  created_at: string;
  updated_at: string;
}

const FREE_ALERT_LIMIT = 3;

// ─── Get all job alerts for current user ─────────────────────────────────────

export async function getJobAlerts(): Promise<{
  alerts: JobAlert[];
  canCreate: boolean;
  error: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { alerts: [], canCreate: false, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("job_alerts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return { alerts: [], canCreate: false, error: error.message };

  const alerts = (data || []) as JobAlert[];

  // Check plan for limit
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  const isPro = sub?.plan === "pro";
  const activeCount = alerts.filter((a) => a.is_active).length;
  const canCreate = isPro || activeCount < FREE_ALERT_LIMIT;

  return { alerts, canCreate, error: null };
}

// ─── Create a new job alert ───────────────────────────────────────────────────

export async function createJobAlert(input: {
  query: string;
  location: string;
  job_types: JobType[];
  remote_only: boolean;
  frequency: AlertFrequency;
}): Promise<{ alert: JobAlert | null; error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { alert: null, error: "Not authenticated" };

  if (!input.query.trim()) {
    return { alert: null, error: "Search query is required" };
  }

  // Check plan limits
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  const isPro = sub?.plan === "pro";

  if (!isPro) {
    const { count } = await supabase
      .from("job_alerts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_active", true);

    if ((count || 0) >= FREE_ALERT_LIMIT) {
      return {
        alert: null,
        error: `Free plan allows up to ${FREE_ALERT_LIMIT} active alerts. Upgrade to Pro for unlimited alerts.`,
      };
    }
  }

  const { data, error } = await supabase
    .from("job_alerts")
    .insert({
      user_id: user.id,
      query: input.query.trim(),
      location: input.location.trim(),
      job_types: input.job_types,
      remote_only: input.remote_only,
      frequency: input.frequency,
      is_active: true,
    })
    .select()
    .single();

  if (error) return { alert: null, error: error.message };

  revalidatePath("/dashboard/jobs");
  return { alert: data as JobAlert, error: null };
}

// ─── Toggle job alert active/inactive ────────────────────────────────────────

export async function toggleJobAlert(
  alertId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  // Get current state
  const { data: alert, error: fetchError } = await supabase
    .from("job_alerts")
    .select("is_active")
    .eq("id", alertId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !alert) {
    return { success: false, error: "Alert not found" };
  }

  // If activating, check limits for free users
  if (!alert.is_active) {
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan")
      .eq("user_id", user.id)
      .single();

    const isPro = sub?.plan === "pro";

    if (!isPro) {
      const { count } = await supabase
        .from("job_alerts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_active", true);

      if ((count || 0) >= FREE_ALERT_LIMIT) {
        return {
          success: false,
          error: `Free plan allows up to ${FREE_ALERT_LIMIT} active alerts.`,
        };
      }
    }
  }

  const { error } = await supabase
    .from("job_alerts")
    .update({ is_active: !alert.is_active, updated_at: new Date().toISOString() })
    .eq("id", alertId)
    .eq("user_id", user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/jobs");
  return { success: true, error: null };
}

// ─── Delete a job alert ───────────────────────────────────────────────────────

export async function deleteJobAlert(
  alertId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  const { error } = await supabase
    .from("job_alerts")
    .delete()
    .eq("id", alertId)
    .eq("user_id", user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/jobs");
  return { success: true, error: null };
}

// ─── Update last_sent_at (called by cron) ────────────────────────────────────

export async function updateAlertLastSent(alertId: string): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("job_alerts")
    .update({ last_sent_at: new Date().toISOString() })
    .eq("id", alertId);
}
