"use server";

import { createClient } from "@/lib/supabase/server";
import { PLANS, type PlanId } from "@/lib/stripe-config";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

// ─── Get current subscription ─────────────────────────────────────────────────

export async function getSubscription() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Auto-create free subscription if missing
  if (!data) {
    const { data: created } = await supabase
      .from("subscriptions")
      .insert({ user_id: user.id, plan: "free", status: "active" })
      .select("*")
      .single();
    return created;
  }

  return data;
}

export async function getCurrentPlan(): Promise<PlanId> {
  const sub = await getSubscription();
  if (!sub || sub.status !== "active") return "free";
  return (sub.plan as PlanId) ?? "free";
}

// ─── Usage tracking ───────────────────────────────────────────────────────────

export async function trackUsage(feature: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("usage_logs").insert({
    user_id: user.id,
    feature,
  });
}

export async function getMonthlyUsage(feature: string): Promise<number> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

  const monthBucket = new Date().toISOString().slice(0, 7); // YYYY-MM

  const { count } = await supabase
    .from("usage_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("feature", feature)
    .eq("month_bucket", monthBucket);

  return count ?? 0;
}

export async function getAllUsage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return {};

  const monthBucket = new Date().toISOString().slice(0, 7);

  const { data } = await supabase
    .from("usage_logs")
    .select("feature")
    .eq("user_id", user.id)
    .eq("month_bucket", monthBucket);

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.feature] = (counts[row.feature] ?? 0) + 1;
  }
  return counts;
}

// ─── Check if user can use a feature ─────────────────────────────────────────

export async function checkFeatureAccess(
  feature: "tailoring" | "saved_jobs" | "ai_prep" | "premium_exports"
): Promise<{ allowed: boolean; reason?: string; upgradeRequired?: PlanId }> {
  const plan = await getCurrentPlan();
  const planConfig = PLANS[plan];

  const getLimit = (key: string) =>
    planConfig.features.find((f) => f.key === key);

  if (feature === "ai_prep") {
    const feat = getLimit("ai_interview_prep");
    if (!feat?.included) return { allowed: false, reason: "AI Interview Prep requires Pro plan", upgradeRequired: "pro" };
    return { allowed: true };
  }

  if (feature === "premium_exports") {
    const feat = getLimit("premium_exports");
    if (!feat?.included) return { allowed: false, reason: "Premium exports require Pro plan", upgradeRequired: "pro" };
    return { allowed: true };
  }

  if (feature === "tailoring") {
    const feat = getLimit("tailoring");
    if (!feat?.included) return { allowed: false, reason: "Tailoring not available on this plan", upgradeRequired: "pro" };
    if (feat.limit === "unlimited") return { allowed: true };
    const used = await getMonthlyUsage("tailoring");
    if (used >= (feat.limit as number)) {
      return {
        allowed: false,
        reason: `You've used all ${feat.limit} tailoring sessions this month`,
        upgradeRequired: "pro",
      };
    }
    return { allowed: true };
  }

  if (feature === "saved_jobs") {
    const feat = getLimit("saved_jobs");
    if (!feat?.included) return { allowed: false, reason: "Saved jobs not available on this plan", upgradeRequired: "pro" };
    if (feat.limit === "unlimited") return { allowed: true };
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { allowed: false, reason: "Not authenticated" };

    const { count } = await supabase
      .from("saved_jobs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if ((count ?? 0) >= (feat.limit as number)) {
      return {
        allowed: false,
        reason: `You've reached the ${feat.limit} saved jobs limit`,
        upgradeRequired: "pro",
      };
    }
    return { allowed: true };
  }

  return { allowed: true };
}

// ─── Stripe Checkout ──────────────────────────────────────────────────────────

export async function createCheckoutSession(planId: PlanId) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const plan = PLANS[planId];
  if (!plan.stripe_price_id_monthly || planId === "free") {
    return { error: "Invalid plan" };
  }

  // Get or create Stripe customer
  const sub = await getSubscription();
  let customerId = sub?.stripe_customer_id;

  if (!customerId) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", user.id)
      .single();

    const customer = await stripe.customers.create({
      email: profile?.email ?? user.email ?? "",
      name: profile?.full_name ?? undefined,
      metadata: { user_id: user.id },
    });
    customerId = customer.id;

    // Save customer ID
    await supabase
      .from("subscriptions")
      .upsert({ user_id: user.id, stripe_customer_id: customerId, plan: "free", status: "active" })
      .eq("user_id", user.id);
  }

  const headersList = await headers();
  const origin = headersList.get("origin") ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: plan.stripe_price_id_monthly, quantity: 1 }],
    success_url: `${origin}/dashboard/billing?success=true&plan=${planId}`,
    cancel_url: `${origin}/dashboard/billing?canceled=true`,
    metadata: { user_id: user.id, plan_id: planId },
    subscription_data: {
      metadata: { user_id: user.id, plan_id: planId },
    },
    allow_promotion_codes: true,
  });

  return { url: session.url };
}

// ─── Stripe Customer Portal ───────────────────────────────────────────────────

export async function createPortalSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const sub = await getSubscription();
  if (!sub?.stripe_customer_id) {
    return { error: "No billing account found" };
  }

  const headersList = await headers();
  const origin = headersList.get("origin") ?? "http://localhost:3000";

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${origin}/dashboard/billing`,
  });

  return { url: session.url };
}

// ─── Cancel subscription ──────────────────────────────────────────────────────

export async function cancelSubscription() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const sub = await getSubscription();
  if (!sub?.stripe_subscription_id) return { error: "No active subscription" };

  // Cancel at period end
  await stripe.subscriptions.update(sub.stripe_subscription_id, {
    cancel_at_period_end: true,
  });

  await supabase
    .from("subscriptions")
    .update({ cancel_at_period_end: true })
    .eq("user_id", user.id);

  return { success: true };
}

// ─── Switch to Annual Plan ────────────────────────────────────────────────────

export async function switchToAnnual(): Promise<{ url?: string; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const sub = await getSubscription();
  if (!sub?.stripe_customer_id) return { error: "No billing account found" };
  if (!sub?.stripe_subscription_id) return { error: "No active subscription" };

  const headersList = await headers();
  const origin = headersList.get("origin") ?? "http://localhost:3000";

  const annualPriceId = process.env.STRIPE_PRO_ANNUAL_PRICE_ID ?? "";
  if (!annualPriceId) return { error: "Annual plan not configured" };

  // Retrieve current subscription to get item ID
  const stripeSub = await stripe.subscriptions.retrieve(sub.stripe_subscription_id);
  const itemId = stripeSub.items.data[0]?.id;
  if (!itemId) return { error: "No subscription item found" };

  // Create a billing portal session with subscription update flow
  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${origin}/dashboard/billing?annual=true`,
    flow_data: {
      type: "subscription_update_confirm",
      subscription_update_confirm: {
        subscription: sub.stripe_subscription_id,
        items: [
          {
            id: itemId,
            price: annualPriceId,
            quantity: 1,
          },
        ],
      },
    },
  });

  return { url: session.url };
}
