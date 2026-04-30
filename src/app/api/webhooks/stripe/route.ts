import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { grantPurchasedCredits } from "@/lib/stripe-credits";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia" as unknown as "2025-01-27.acacia",
});

// Use service role client for webhook (bypasses RLS)
function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Helper: safely get period dates from subscription
function getPeriodDates(sub: Record<string, unknown>) {
  const start = sub.current_period_start as number | undefined;
  const end = sub.current_period_end as number | undefined;
  return {
    current_period_start: start ? new Date(start * 1000).toISOString() : null,
    current_period_end: end ? new Date(end * 1000).toISOString() : null,
  };
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = getServiceClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const sessionType = session.metadata?.type;

        // ── Credit purchase (one-time payment) ──────────────────────────────
        if (sessionType === "credit_purchase") {
          const packageId = session.metadata?.package_id;
          const credits = parseInt(session.metadata?.credits || "0", 10);
          if (userId && packageId && credits > 0) {
            await grantPurchasedCredits({
              userId,
              packageId,
              credits,
              stripeSessionId: session.id,
            });
          }
          break;
        }

        // ── Subscription checkout ────────────────────────────────────────────
        const planId = session.metadata?.plan_id;
        if (!userId || !planId) break;

        const stripeSubId = session.subscription as string;
        const rawSub = await stripe.subscriptions.retrieve(stripeSubId) as unknown as Record<string, unknown>;
        const periods = getPeriodDates(rawSub);
        const items = rawSub.items as { data: Array<{ price: { id: string } }> };
        const priceId = items?.data?.[0]?.price?.id;

        await supabase.from("subscriptions").upsert(
          {
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: stripeSubId,
            stripe_price_id: priceId,
            plan: planId,
            status: rawSub.status as string,
            current_period_start: periods.current_period_start,
            current_period_end: periods.current_period_end,
            cancel_at_period_end: rawSub.cancel_at_period_end as boolean,
          },
          { onConflict: "user_id" }
        );
        break;
      }

      case "customer.subscription.updated": {
        const rawSub = event.data.object as unknown as Record<string, unknown>;
        const userId = (rawSub.metadata as Record<string, string>)?.user_id;
        if (!userId) break;

        const items = rawSub.items as { data: Array<{ price: { id: string } }> };
        const priceId = items?.data?.[0]?.price?.id;
        const periods = getPeriodDates(rawSub);

        let plan = "free";
        if (priceId === process.env.STRIPE_PRO_PRICE_ID) plan = "pro";
        else if (priceId === process.env.STRIPE_FASTHIRE_PRICE_ID) plan = "fasthire";

        const canceledAt = rawSub.canceled_at as number | null;

        await supabase
          .from("subscriptions")
          .update({
            plan,
            status: rawSub.status as string,
            stripe_price_id: priceId,
            current_period_start: periods.current_period_start,
            current_period_end: periods.current_period_end,
            cancel_at_period_end: rawSub.cancel_at_period_end as boolean,
            canceled_at: canceledAt ? new Date(canceledAt * 1000).toISOString() : null,
          })
          .eq("stripe_subscription_id", rawSub.id as string);
        break;
      }

      case "customer.subscription.deleted": {
        const rawSub = event.data.object as unknown as Record<string, unknown>;

        await supabase
          .from("subscriptions")
          .update({
            plan: "free",
            status: "canceled",
            stripe_subscription_id: null,
            stripe_price_id: null,
            cancel_at_period_end: false,
            canceled_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", rawSub.id as string);
        break;
      }

      case "invoice.payment_failed": {
        const rawInvoice = event.data.object as unknown as Record<string, unknown>;
        const subId = rawInvoice.subscription as string | null;
        if (!subId) break;

        await supabase
          .from("subscriptions")
          .update({ status: "past_due" })
          .eq("stripe_subscription_id", subId);
        break;
      }

      case "invoice.payment_succeeded": {
        const rawInvoice = event.data.object as unknown as Record<string, unknown>;
        const subId = rawInvoice.subscription as string | null;
        if (!subId) break;

        await supabase
          .from("subscriptions")
          .update({ status: "active" })
          .eq("stripe_subscription_id", subId);
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
