"use server";

import { createClient } from "@/lib/supabase/server";
import {
  canUseTailoring,
  canSaveJob,
  canAddApplication,
  canCreateResume as checkCanCreateResume,
  canExportPremium,
  canUseInterviewPrep,
  getUpgradeMessage,
  type PlanId,
  type FeatureKey,
} from "@/lib/stripe-config";

export interface GateResult {
  allowed: boolean;
  message?: string;
}

async function getUserPlanAndCounts() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [
    { data: profile },
    { count: resumeCount },
    { count: applicationCount },
    { count: savedJobCount },
    { count: tailoringCount },
  ] = await Promise.all([
    supabase.from("profiles").select("plan_id").eq("id", user.id).single(),
    supabase
      .from("resumes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("saved_jobs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("tailoring_sessions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  return {
    planId: (profile?.plan_id ?? "free") as PlanId,
    resumeCount: resumeCount ?? 0,
    applicationCount: applicationCount ?? 0,
    savedJobCount: savedJobCount ?? 0,
    tailoringCount: tailoringCount ?? 0,
  };
}

export async function checkTailoringGateAction(): Promise<GateResult> {
  const data = await getUserPlanAndCounts();
  if (!data) return { allowed: false, message: "Not authenticated" };
  const allowed = canUseTailoring(data.planId, data.tailoringCount);
  return {
    allowed,
    message: allowed ? undefined : getUpgradeMessage("tailoring"),
  };
}

export async function checkSaveJobGateAction(): Promise<GateResult> {
  const data = await getUserPlanAndCounts();
  if (!data) return { allowed: false, message: "Not authenticated" };
  const allowed = canSaveJob(data.planId, data.savedJobCount);
  return {
    allowed,
    message: allowed ? undefined : getUpgradeMessage("saved_jobs"),
  };
}

export async function checkApplicationGateAction(): Promise<GateResult> {
  const data = await getUserPlanAndCounts();
  if (!data) return { allowed: false, message: "Not authenticated" };
  const allowed = canAddApplication(data.planId, data.applicationCount);
  return {
    allowed,
    message: allowed ? undefined : getUpgradeMessage("applications"),
  };
}

export async function checkResumeGateAction(): Promise<GateResult> {
  const data = await getUserPlanAndCounts();
  if (!data) return { allowed: false, message: "Not authenticated" };
  const allowed = checkCanCreateResume(data.planId, data.resumeCount);
  return {
    allowed,
    message: allowed ? undefined : getUpgradeMessage("resumes"),
  };
}

export async function checkExportGateAction(): Promise<GateResult> {
  const data = await getUserPlanAndCounts();
  if (!data) return { allowed: false, message: "Not authenticated" };
  const allowed = canExportPremium(data.planId);
  return {
    allowed,
    message: allowed ? undefined : getUpgradeMessage("premium_exports"),
  };
}

export async function checkInterviewPrepGateAction(): Promise<GateResult> {
  const data = await getUserPlanAndCounts();
  if (!data) return { allowed: false, message: "Not authenticated" };
  const allowed = canUseInterviewPrep(data.planId);
  return {
    allowed,
    message: allowed ? undefined : getUpgradeMessage("ai_interview_prep"),
  };
}

export async function checkFeatureGateAction(
  feature: FeatureKey
): Promise<GateResult> {
  switch (feature) {
    case "tailoring":
      return checkTailoringGateAction();
    case "saved_jobs":
      return checkSaveJobGateAction();
    case "applications":
      return checkApplicationGateAction();
    case "resumes":
      return checkResumeGateAction();
    case "premium_exports":
      return checkExportGateAction();
    case "ai_interview_prep":
      return checkInterviewPrepGateAction();
    default: {
      const data = await getUserPlanAndCounts();
      if (!data) return { allowed: false, message: "Not authenticated" };
      return { allowed: true };
    }
  }
}
