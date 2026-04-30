// src/lib/stripe-credits.ts
// One-time credit purchase packages via Stripe Checkout

import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Use the project's Stripe API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia" as unknown as "2025-01-27.acacia",
});

// ─── Credit packages ──────────────────────────────────────────────────────────

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number; // in cents
  priceDisplay: string;
  perCreditPrice: string;
  popular?: boolean;
  description: string;
}

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: "credits_1",
    name: "Starter Pack",
    credits: 1,
    price: 300, // $3.00
    priceDisplay: "$3",
    perCreditPrice: "$3.00/credit",
    description: "Perfect for a single application",
  },
  {
    id: "credits_5",
    name: "Value Pack",
    credits: 5,
    price: 1200, // $12.00
    priceDisplay: "$12",
    perCreditPrice: "$2.40/credit",
    popular: true,
    description: "Best value — save 20%",
  },
  {
    id: "credits_10",
    name: "Power Pack",
    credits: 10,
    price: 2000, // $20.00
    priceDisplay: "$20",
    perCreditPrice: "$2.00/credit",
    description: "Maximum savings — save 33%",
  },
];

// ─── Create Stripe checkout session for credit purchase ───────────────────────

export async function createCreditCheckoutSession({
  packageId,
  userId,
  userEmail,
  returnUrl,
}: {
  packageId: string;
  userId: string;
  userEmail: string;
  returnUrl: string;
}): Promise<{ url: string | null; error: string | null }> {
  const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId);
  if (!pkg) {
    return { url: null, error: "Invalid credit package" };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: pkg.price,
            product_data: {
              name: `HireFlow AI — ${pkg.name}`,
              description: `${pkg.credits} AI resume tailoring credit${pkg.credits !== 1 ? "s" : ""}`,
              images: [],
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        user_id: userId,
        package_id: packageId,
        credits: String(pkg.credits),
        type: "credit_purchase",
      },
      success_url: `${returnUrl}?credit_purchase=success&credits=${pkg.credits}`,
      cancel_url: `${returnUrl}?credit_purchase=cancelled`,
    });

    return { url: session.url, error: null };
  } catch (err) {
    console.error("Stripe credit checkout error:", err);
    const message = err instanceof Error ? err.message : "Failed to create checkout session";
    return { url: null, error: message };
  }
}

// ─── Grant purchased credits (called from webhook) ────────────────────────────

export async function grantPurchasedCredits({
  userId,
  packageId,
  credits,
  stripeSessionId,
}: {
  userId: string;
  packageId: string;
  credits: number;
  stripeSessionId: string;
}): Promise<{ success: boolean; error: string | null }> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Check if already processed (idempotency)
  const { data: existing } = await supabase
    .from("usage_logs")
    .select("id")
    .eq("action", "credit_purchase")
    .eq("user_id", userId)
    .contains("metadata", { stripe_session_id: stripeSessionId })
    .single();

  if (existing) {
    return { success: true, error: null }; // Already processed
  }

  // Log the credit purchase
  const { error } = await supabase.from("usage_logs").insert({
    user_id: userId,
    action: "credit_purchase",
    credits_granted: credits,
    metadata: {
      package_id: packageId,
      stripe_session_id: stripeSessionId,
      purchased_at: new Date().toISOString(),
    },
  });

  if (error) {
    console.error("Error granting purchased credits:", error);
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

// ─── Get purchased credits balance ───────────────────────────────────────────

export async function getPurchasedCredits(
  userId: string
): Promise<{ credits: number; error: string | null }> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("usage_logs")
    .select("credits_granted")
    .eq("user_id", userId)
    .eq("action", "credit_purchase");

  if (error) return { credits: 0, error: error.message };

  const credits = (data || []).reduce(
    (sum, log) => sum + (log.credits_granted || 0),
    0
  );

  return { credits, error: null };
}
