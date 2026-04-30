"use server";

// src/lib/churn-actions.ts
// Churn reduction: pause, resume, cancel with survey, discount offers

import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
  });
}

export const CANCEL_REASONS = [
  { id: "too_expensive", label: "It's too expensive" },
  { id: "not_using", label: "I'm not using it enough" },
  { id: "missing_features", label: "Missing features I need" },
  { id: "found_job", label: "I found a job!" },
  { id: "technical_issues", label: "Technical issues" },
  { id: "switching", label: "Switching to another tool" },
  { id: "other", label: "Other reason" },
] as const;

export type CancelReason = (typeof CANCEL_REASONS)[number]["id"];

// ─── Pause Subscription ───────────────────────────────────────────────────────

export async function pauseSubscription(
  months: 1 | 2 | 3
): Promise<{ success?: boolean; error?: string }> {
  try {
    const stripe = getStripe();
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("stripe_subscription_id")
      .eq("user_id", user.id)
      .single();

    if (!sub?.stripe_subscription_id) return { error: "No active subscription" };

    const resumesAt = new Date();
    resumesAt.setMonth(resumesAt.getMonth() + months);

    await stripe.subscriptions.update(sub.stripe_subscription_id, {
      pause_collection: {
        behavior: "void",
        resumes_at: Math.floor(resumesAt.getTime() / 1000),
      },
    });

    await supabase
      .from("subscriptions")
      .update({
        paused_at: new Date().toISOString(),
        resumes_at: resumesAt.toISOString(),
      })
      .eq("user_id", user.id);

    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to pause subscription" };
  }
}

// ─── Resume Subscription ──────────────────────────────────────────────────────

export async function resumeSubscription(): Promise<{ success?: boolean; error?: string }> {
  try {
    const stripe = getStripe();
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("stripe_subscription_id")
      .eq("user_id", user.id)
      .single();

    if (!sub?.stripe_subscription_id) return { error: "No active subscription" };

    await stripe.subscriptions.update(sub.stripe_subscription_id, {
      pause_collection: "",
    } as Parameters<typeof stripe.subscriptions.update>[1]);

    await supabase
      .from("subscriptions")
      .update({ paused_at: null, resumes_at: null })
      .eq("user_id", user.id);

    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to resume subscription" };
  }
}

// ─── Cancel with Survey ───────────────────────────────────────────────────────

export async function cancelSubscriptionWithSurvey(
  reason: CancelReason,
  feedback?: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const stripe = getStripe();
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("stripe_subscription_id")
      .eq("user_id", user.id)
      .single();

    if (!sub?.stripe_subscription_id) return { error: "No active subscription" };

    // Cancel at period end
    await stripe.subscriptions.update(sub.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    // Store cancel survey
    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    await serviceClient.from("cancel_surveys").insert({
      user_id: user.id,
      reason,
      feedback: feedback ?? null,
      created_at: new Date().toISOString(),
    });

    await supabase
      .from("subscriptions")
      .update({ cancel_at_period_end: true })
      .eq("user_id", user.id);

    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to cancel subscription" };
  }
}

// ─── Offer Churn Discount ─────────────────────────────────────────────────────

export async function offerChurnDiscount(): Promise<{
  success?: boolean;
  discountApplied?: boolean;
  error?: string;
}> {
  try {
    const stripe = getStripe();
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("stripe_subscription_id, stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    if (!sub?.stripe_subscription_id) return { error: "No active subscription" };

    // Create a 50% off coupon for 2 months
    const coupon = await stripe.coupons.create({
      percent_off: 50,
      duration: "repeating",
      duration_in_months: 2,
      name: "Loyalty Discount — 50% off for 2 months",
    });

    // Apply coupon to subscription (Stripe v22: use discounts array)
    await stripe.subscriptions.update(sub.stripe_subscription_id, {
      discounts: [{ coupon: coupon.id }],
    });

    return { success: true, discountApplied: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to apply discount" };
  }
}
