"use server";

// src/lib/referral-actions.ts
// Referral system with clear rewards — credits for conversions

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendReferralInviteEmail, sendReferralRewardEmail } from "@/lib/email-referral";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hireflow.ai";
const CREDITS_PER_REFERRAL = 3; // credits granted when referred user converts

export interface ReferralCode {
  id: string;
  user_id: string;
  code: string;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string | null;
  referred_email: string | null;
  code: string;
  status: "pending" | "signed_up" | "converted" | "rewarded";
  reward_granted: boolean;
  credits_granted: number | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  converted_at: string | null;
}

export interface ReferralStats {
  code: string;
  referralLink: string;
  totalInvited: number;
  totalSignedUp: number;
  totalConverted: number;
  totalRewarded: number;
  creditsEarned: number;
  referrals: Referral[];
}

// ─── Get or create referral code ─────────────────────────────────────────────

export async function getOrCreateReferralCode(): Promise<{
  code: string | null;
  referralLink: string | null;
  error: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { code: null, referralLink: null, error: "Not authenticated" };

  // Try to fetch existing code
  const { data, error } = await supabase
    .from("referral_codes")
    .select("code")
    .eq("user_id", user.id)
    .single();

  if (!error && data) {
    const referralLink = `${APP_URL}/signup?ref=${data.code}`;
    return { code: data.code, referralLink, error: null };
  }

  // Create a new code
  const newCode = generateCode();
  const { data: inserted, error: insertError } = await supabase
    .from("referral_codes")
    .insert({ user_id: user.id, code: newCode })
    .select("code")
    .single();

  if (insertError) return { code: null, referralLink: null, error: insertError.message };

  const referralLink = `${APP_URL}/signup?ref=${inserted.code}`;
  return { code: inserted.code, referralLink, error: null };
}

// ─── Get referral stats ───────────────────────────────────────────────────────

export async function getReferralStats(): Promise<{
  stats: ReferralStats | null;
  error: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { stats: null, error: "Not authenticated" };

  // Get or create code
  const { code, referralLink, error: codeError } = await getOrCreateReferralCode();
  if (codeError || !code || !referralLink) {
    return { stats: null, error: codeError || "Failed to get referral code" };
  }

  // Get all referrals
  const { data: referrals, error: referralsError } = await supabase
    .from("referrals")
    .select("*")
    .eq("referrer_id", user.id)
    .order("created_at", { ascending: false });

  if (referralsError) return { stats: null, error: referralsError.message };

  const list = (referrals || []) as Referral[];

  const stats: ReferralStats = {
    code,
    referralLink,
    totalInvited: list.length,
    totalSignedUp: list.filter((r) => r.status !== "pending").length,
    totalConverted: list.filter((r) => r.status === "converted" || r.status === "rewarded").length,
    totalRewarded: list.filter((r) => r.status === "rewarded").length,
    creditsEarned: list.reduce((sum, r) => sum + (r.credits_granted || 0), 0),
    referrals: list,
  };

  return { stats, error: null };
}

// ─── Send referral invite ─────────────────────────────────────────────────────

export async function sendReferralInvite(
  email: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  // Get referral code
  const { code, referralLink, error: codeError } = await getOrCreateReferralCode();
  if (codeError || !code || !referralLink) {
    return { success: false, error: codeError || "No referral code" };
  }

  // Check if already invited
  const { data: existing } = await supabase
    .from("referrals")
    .select("id")
    .eq("referrer_id", user.id)
    .eq("referred_email", email.toLowerCase())
    .single();

  if (existing) {
    return { success: false, error: "You've already invited this email address" };
  }

  // Record the referral invite
  const { error: insertError } = await supabase.from("referrals").insert({
    referrer_id: user.id,
    referred_email: email.toLowerCase(),
    code,
    status: "pending",
    credits_granted: 0,
  });

  if (insertError) return { success: false, error: insertError.message };

  // Get referrer name for email
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const referrerName = profile?.full_name || "A friend";

  // Send invite email
  await sendReferralInviteEmail({
    toEmail: email,
    referrerName,
    referralCode: code,
    referralLink,
  });

  revalidatePath("/dashboard/referrals");
  return { success: true, error: null };
}

// ─── Process referral signup (called when new user signs up with ref code) ────

export async function processReferralSignup(
  code: string,
  newUserId: string,
  newUserEmail: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  // Find the referral code owner
  const { data: referralCode } = await supabase
    .from("referral_codes")
    .select("user_id")
    .eq("code", code.toUpperCase())
    .single();

  if (!referralCode) return { success: false, error: "Invalid referral code" };

  // Don't self-refer
  if (referralCode.user_id === newUserId) {
    return { success: false, error: "Cannot use your own referral code" };
  }

  // Check if this user was already referred
  const { data: alreadyReferred } = await supabase
    .from("referrals")
    .select("id")
    .eq("referred_id", newUserId)
    .single();

  if (alreadyReferred) return { success: false, error: "User already referred" };

  // Find existing pending invite for this email or create new record
  const { data: pendingInvite } = await supabase
    .from("referrals")
    .select("id")
    .eq("code", code.toUpperCase())
    .eq("referred_email", newUserEmail.toLowerCase())
    .eq("status", "pending")
    .single();

  if (pendingInvite) {
    await supabase
      .from("referrals")
      .update({
        referred_id: newUserId,
        status: "signed_up",
        metadata: { signed_up_at: new Date().toISOString() },
      })
      .eq("id", pendingInvite.id);
  } else {
    await supabase.from("referrals").insert({
      referrer_id: referralCode.user_id,
      referred_id: newUserId,
      referred_email: newUserEmail.toLowerCase(),
      code: code.toUpperCase(),
      status: "signed_up",
      credits_granted: 0,
      metadata: { signed_up_at: new Date().toISOString() },
    });
  }

  return { success: true, error: null };
}

// ─── Grant referral credits (called when referred user upgrades to Pro) ───────

export async function grantReferralCredits(
  referredUserId: string
): Promise<{ success: boolean; creditsGranted: number; error: string | null }> {
  const supabase = await createClient();

  // Find the referral record for this user
  const { data: referral } = await supabase
    .from("referrals")
    .select("*")
    .eq("referred_id", referredUserId)
    .in("status", ["signed_up", "converted"])
    .single();

  if (!referral) return { success: false, creditsGranted: 0, error: "No referral found" };
  if (referral.reward_granted) return { success: false, creditsGranted: 0, error: "Reward already granted" };

  const referrerId = referral.referrer_id;

  // Get referrer profile for email
  const { data: referrerProfile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", referrerId)
    .single();

  // Get referred user profile for email
  const { data: referredProfile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", referredUserId)
    .single();

  // Update referral status to rewarded
  await supabase
    .from("referrals")
    .update({
      status: "rewarded",
      reward_granted: true,
      credits_granted: CREDITS_PER_REFERRAL,
      converted_at: new Date().toISOString(),
      metadata: {
        ...(referral.metadata as Record<string, unknown> || {}),
        rewarded_at: new Date().toISOString(),
        credits_amount: CREDITS_PER_REFERRAL,
      },
    })
    .eq("id", referral.id);

  // Log credits in usage_logs
  await supabase.from("usage_logs").insert({
    user_id: referrerId,
    action: "referral_credit",
    credits_granted: CREDITS_PER_REFERRAL,
    metadata: {
      referred_user_id: referredUserId,
      referral_code: referral.code,
      reason: "referral_conversion",
    },
  });

  // Get current credit balance for email
  const { data: creditLogs } = await supabase
    .from("usage_logs")
    .select("credits_granted")
    .eq("user_id", referrerId)
    .eq("action", "referral_credit");

  const totalCredits = (creditLogs || []).reduce(
    (sum, log) => sum + (log.credits_granted || 0),
    0
  );

  // Send reward email to referrer
  if (referrerProfile?.email) {
    await sendReferralRewardEmail({
      toEmail: referrerProfile.email,
      referrerName: referrerProfile.full_name || "there",
      referredName: referredProfile?.full_name || "Your friend",
      creditsGranted: CREDITS_PER_REFERRAL,
      totalCredits,
    });
  }

  revalidatePath("/dashboard/referrals");
  return { success: true, creditsGranted: CREDITS_PER_REFERRAL, error: null };
}

// ─── Get referral credits balance ─────────────────────────────────────────────

export async function getReferralCredits(): Promise<{
  credits: number;
  error: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { credits: 0, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("usage_logs")
    .select("credits_granted")
    .eq("user_id", user.id)
    .eq("action", "referral_credit");

  if (error) return { credits: 0, error: error.message };

  const credits = (data || []).reduce(
    (sum, log) => sum + (log.credits_granted || 0),
    0
  );

  return { credits, error: null };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
