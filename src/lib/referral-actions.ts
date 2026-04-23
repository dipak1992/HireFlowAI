"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
  created_at: string;
  converted_at: string | null;
}

export async function getReferralCode(): Promise<{
  code: string | null;
  error: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { code: null, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("referral_codes")
    .select("code")
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    // Try to create one
    const newCode = generateCode();
    const { data: inserted, error: insertError } = await supabase
      .from("referral_codes")
      .insert({ user_id: user.id, code: newCode })
      .select("code")
      .single();

    if (insertError) return { code: null, error: insertError.message };
    return { code: inserted.code, error: null };
  }

  return { code: data.code, error: null };
}

export async function getReferrals(): Promise<{
  referrals: Referral[];
  total: number;
  converted: number;
  error: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return { referrals: [], total: 0, converted: 0, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("referrals")
    .select("*")
    .eq("referrer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return { referrals: [], total: 0, converted: 0, error: error.message };

  const referrals = (data || []) as Referral[];
  const converted = referrals.filter(
    (r) => r.status === "converted" || r.status === "rewarded"
  ).length;

  return { referrals, total: referrals.length, converted, error: null };
}

export async function sendReferralInvite(
  email: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  // Get referral code
  const { code, error: codeError } = await getReferralCode();
  if (codeError || !code)
    return { success: false, error: codeError || "No referral code" };

  // Check if already invited
  const { data: existing } = await supabase
    .from("referrals")
    .select("id")
    .eq("referrer_id", user.id)
    .eq("referred_email", email.toLowerCase())
    .single();

  if (existing) {
    return { success: false, error: "You've already invited this email" };
  }

  // Record the referral invite
  const { error: insertError } = await supabase.from("referrals").insert({
    referrer_id: user.id,
    referred_email: email.toLowerCase(),
    code,
    status: "pending",
  });

  if (insertError) return { success: false, error: insertError.message };

  revalidatePath("/dashboard/referrals");
  return { success: true, error: null };
}

export async function trackReferralSignup(code: string, userId: string) {
  const supabase = await createClient();

  // Find the referral code owner
  const { data: referralCode } = await supabase
    .from("referral_codes")
    .select("user_id")
    .eq("code", code.toUpperCase())
    .single();

  if (!referralCode) return;

  // Don't self-refer
  if (referralCode.user_id === userId) return;

  // Update or create referral record
  const { data: existing } = await supabase
    .from("referrals")
    .select("id")
    .eq("code", code.toUpperCase())
    .eq("referred_id", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (existing) {
    await supabase
      .from("referrals")
      .update({ referred_id: userId, status: "signed_up" })
      .eq("id", existing.id);
  } else {
    await supabase.from("referrals").insert({
      referrer_id: referralCode.user_id,
      referred_id: userId,
      code: code.toUpperCase(),
      status: "signed_up",
    });
  }
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
