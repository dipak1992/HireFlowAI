"use server";

// src/lib/analytics-actions.ts
// Server-side event tracking for HireFlow AI

import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, unknown>;
  user_id?: string;
}

// ─── Track Event ──────────────────────────────────────────────────────────────

export async function trackEvent(
  event: string,
  properties?: Record<string, unknown>
): Promise<void> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    await serviceClient.from("analytics_events").insert({
      user_id: user?.id ?? null,
      event,
      properties: properties ?? {},
      created_at: new Date().toISOString(),
    });
  } catch {
    // Analytics should never break the app
  }
}

// ─── Track Conversion ─────────────────────────────────────────────────────────

export async function trackConversion(
  type: "signup" | "upgrade" | "referral" | "credit_purchase" | "tailoring",
  metadata?: Record<string, unknown>
): Promise<void> {
  await trackEvent(`conversion_${type}`, {
    conversion_type: type,
    ...metadata,
  });
}

// ─── PostHog Server-Side Event ────────────────────────────────────────────────

export async function trackPostHogServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>
): Promise<void> {
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!apiKey) return;

  try {
    await fetch("https://app.posthog.com/capture/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        event,
        distinct_id: distinctId,
        properties: {
          $lib: "hireflow-server",
          ...properties,
        },
        timestamp: new Date().toISOString(),
      }),
    });
  } catch {
    // PostHog errors should never break the app
  }
}
