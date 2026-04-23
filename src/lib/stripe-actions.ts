"use server";

import { createClient } from "@/lib/supabase/server";
import { stripe, PLANS, type PlanId } from "@/lib/stripe-config";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

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
  feature: "tailoring" | "saved_jobs" | "ai_prep" | "premium_exports" | "linkedin_premium" | "urgent_alerts" | "priority_nearby" | "quick_apply"
): Promise<{ allowed: boolean; reason?: string; upgradeRequired?: PlanId }> {
  const plan = await getCurrentPlan();
  const limits = PLANS[plan].limits;

  // Boolean features
  if (feature === "ai_prep") {
    if (!limits.ai_prep) return { allowed: false, reason: "AI Interview Prep requires Pro plan", upgradeRequired: "pro" };
    return { allowed: true };
  }
  if (feature === "premium_exports") {
    if (!limits.premium_exports) return { allowed: false, reason: "Premium exports require Pro plan", upgradeRequired: "pro" };
    return { allowed: true };
  }
  if (feature === "linkedin_premium") {
    if (!limits.linkedin_premium) return { allowed: false, reason: "LinkedIn premium analysis requires Pro plan", upgradeRequired: "pro" };
    return { allowed: true };
  }
  if (feature === "urgent_alerts") {
    if (!limits.urgent_alerts) return { allowed: false, reason: "Urgent alerts require FastHire plan", upgradeRequired: "fasthire" };
    return { allowed: true };
  }
  if (feature === "priority_nearby") {
    if (!limits.priority_nearby) return { allowed: false, reason: "Priority nearby jobs require FastHire plan", upgradeRequired: "fasthire" };
    return { allowed: true };
  }
  if (feature === "quick_apply") {
    if (!limits.quick_apply) return { allowed: false, reason: "Quick apply requires FastHire plan", upgradeRequired: "fasthire" };
    return { allowed: true };
  }

  // Count-limited features
  if (feature === "tailoring") {
    if (limits.tailoring_per_month === null) return { allowed: true }; // unlimited
    const used = await getMonthlyUsage("tailoring");
    if (used >= limits.tailoring_per_month) {
      return {
        allowed: false,
        reason: `You've used all ${limits.tailoring_per_month} tailoring sessions this month`,
        upgradeRequired: "pro",
      };
    }
    return { allowed: true };
  }

  if (feature === "saved_jobs") {
    if (limits.saved_jobs === null) return { allowed: true }; // unlimited
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { allowed: false, reason: "Not authenticated" };

    const { count } = await supabase
      .from("saved_jobs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if ((count ?? 0) >= limits.saved_jobs) {
      return {
        allowed: false,
        reason: `You've reached the ${limits.saved_jobs} saved jobs limit`,
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
  if (!plan.stripePriceId || planId === "free") {
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
    line_items: [{ price: plan.stripePriceId, quantity: 1 }],
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
