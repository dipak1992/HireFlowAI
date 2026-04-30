"use server";

// src/lib/affiliate-actions.ts
// Affiliate program server actions

import { createClient } from "@/lib/supabase/server";
import {
  type Affiliate,
  type AffiliateClick,
  type AffiliateConversion,
  AFFILIATE_CONFIG,
} from "@/lib/affiliate-types";
import { headers } from "next/headers";

// ─── Apply for affiliate program ────────────────────────────────────────────

export async function applyForAffiliate(paypalEmail: string): Promise<{
  affiliate?: Affiliate;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Check if already applied
  const { data: existing } = await supabase
    .from("affiliates")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (existing) {
    return { error: "You have already applied for the affiliate program" };
  }

  // Generate unique affiliate code
  const code = await generateAffiliateCode(user.id);

  const { data, error } = await supabase
    .from("affiliates")
    .insert({
      user_id: user.id,
      code,
      status: "pending",
      commission_rate: AFFILIATE_CONFIG.commission_rate,
      total_clicks: 0,
      total_conversions: 0,
      total_earnings_cents: 0,
      paid_out_cents: 0,
      paypal_email: paypalEmail,
    })
    .select()
    .single();

  if (error) return { error: error.message };
  return { affiliate: data as Affiliate };
}

// ─── Get affiliate data for current user ────────────────────────────────────

export async function getAffiliateData(): Promise<{
  affiliate?: Affiliate;
  clicks?: AffiliateClick[];
  conversions?: AffiliateConversion[];
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: affiliate, error } = await supabase
    .from("affiliates")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error || !affiliate) return { error: "No affiliate account found" };

  const { data: clicks } = await supabase
    .from("affiliate_clicks")
    .select("*")
    .eq("affiliate_id", affiliate.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: conversions } = await supabase
    .from("affiliate_conversions")
    .select("*")
    .eq("affiliate_id", affiliate.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return {
    affiliate: affiliate as Affiliate,
    clicks: (clicks ?? []) as AffiliateClick[],
    conversions: (conversions ?? []) as AffiliateConversion[],
  };
}

// ─── Track affiliate click ───────────────────────────────────────────────────

export async function trackAffiliateClick(code: string): Promise<{
  affiliateId?: string;
  error?: string;
}> {
  const supabase = await createClient();
  const headersList = await headers();

  // Look up affiliate by code
  const { data: affiliate, error: affError } = await supabase
    .from("affiliates")
    .select("id, status")
    .eq("code", code)
    .single();

  if (affError || !affiliate) return { error: "Invalid affiliate code" };
  if (affiliate.status !== "approved") return { error: "Affiliate not active" };

  const ipAddress =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = headersList.get("user-agent") ?? null;
  const referer = headersList.get("referer") ?? null;

  // Record the click
  await supabase.from("affiliate_clicks").insert({
    affiliate_id: affiliate.id,
    ip_address: ipAddress,
    user_agent: userAgent,
    referrer: referer,
    landing_page: null,
    converted: false,
  });

  // Increment click counter
  await supabase.rpc("increment_affiliate_clicks", {
    p_affiliate_id: affiliate.id,
  });

  return { affiliateId: affiliate.id };
}

// ─── Process affiliate conversion ───────────────────────────────────────────

export async function processAffiliateConversion({
  affiliateCode,
  userId,
  planId,
  amountCents,
  stripeChargeId,
}: {
  affiliateCode: string;
  userId: string;
  planId: string;
  amountCents: number;
  stripeChargeId: string;
}): Promise<{ success: boolean; error?: string }> {
  // Use service client for webhook-style processing
  const { createClient: createServiceClientDirect } = await import(
    "@supabase/supabase-js"
  );
  const supabase = createServiceClientDirect(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Look up affiliate
  const { data: affiliate, error: affError } = await supabase
    .from("affiliates")
    .select("id, commission_rate, status")
    .eq("code", affiliateCode)
    .single();

  if (affError || !affiliate) return { success: false, error: "Affiliate not found" };
  if (affiliate.status !== "approved") return { success: false, error: "Affiliate not active" };

  // Find the most recent unconverted click for this affiliate
  const { data: click } = await supabase
    .from("affiliate_clicks")
    .select("id")
    .eq("affiliate_id", affiliate.id)
    .eq("converted", false)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const commissionCents = Math.floor(
    (amountCents * affiliate.commission_rate) / 100
  );

  // Record conversion
  const { error: convError } = await supabase
    .from("affiliate_conversions")
    .insert({
      affiliate_id: affiliate.id,
      click_id: click?.id ?? null,
      user_id: userId,
      plan_id: planId,
      amount_cents: amountCents,
      commission_cents: commissionCents,
      status: "pending",
      stripe_charge_id: stripeChargeId,
    });

  if (convError) return { success: false, error: convError.message };

  // Mark click as converted
  if (click?.id) {
    await supabase
      .from("affiliate_clicks")
      .update({ converted: true })
      .eq("id", click.id);
  }

  // Update affiliate totals
  await supabase.rpc("update_affiliate_totals", {
    p_affiliate_id: affiliate.id,
    p_commission_cents: commissionCents,
  });

  return { success: true };
}

// ─── Update payout email ─────────────────────────────────────────────────────

export async function updatePayoutEmail(paypalEmail: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { error } = await supabase
    .from("affiliates")
    .update({ paypal_email: paypalEmail, updated_at: new Date().toISOString() })
    .eq("user_id", user.id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ─── Helper: generate unique affiliate code ──────────────────────────────────

async function generateAffiliateCode(userId: string): Promise<string> {
  // Use first 8 chars of user ID + random suffix
  const base = userId.replace(/-/g, "").slice(0, 6).toUpperCase();
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${base}${suffix}`;
}
