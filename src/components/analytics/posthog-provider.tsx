"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host:
          process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
        person_profiles: "identified_only",
        capture_pageview: false, // We'll capture manually for SPA
        capture_pageleave: true,
        loaded: (ph) => {
          if (process.env.NODE_ENV === "development") ph.debug();
        },
      });
    }
  }, []);

  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>;
  }

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

// Analytics event helpers
export const analytics = {
  // Auth events
  signUp: (method: string) =>
    posthog.capture("user_signed_up", { method }),
  signIn: (method: string) =>
    posthog.capture("user_signed_in", { method }),

  // Onboarding funnel
  onboardingStarted: () =>
    posthog.capture("onboarding_started"),
  onboardingCompleted: (step: number) =>
    posthog.capture("onboarding_completed", { final_step: step }),

  // Resume events
  resumeCreated: (template: string) =>
    posthog.capture("resume_created", { template }),
  resumeExported: (format: string) =>
    posthog.capture("resume_exported", { format }),

  // Job events
  jobViewed: (jobId: string, source: string) =>
    posthog.capture("job_viewed", { job_id: jobId, source }),
  jobSaved: (jobId: string) =>
    posthog.capture("job_saved", { job_id: jobId }),
  jobApplied: (jobId: string) =>
    posthog.capture("job_applied", { job_id: jobId }),

  // Tailoring events
  tailoringStarted: (jobId: string) =>
    posthog.capture("tailoring_started", { job_id: jobId }),
  tailoringCompleted: (jobId: string, score: number) =>
    posthog.capture("tailoring_completed", { job_id: jobId, match_score: score }),

  // Tracker events
  applicationAdded: (status: string) =>
    posthog.capture("application_added", { status }),
  applicationStatusChanged: (from: string, to: string) =>
    posthog.capture("application_status_changed", { from, to }),

  // Billing events
  upgradeClicked: (plan: string, source: string) =>
    posthog.capture("upgrade_clicked", { plan, source }),
  subscriptionStarted: (plan: string) =>
    posthog.capture("subscription_started", { plan }),
  subscriptionCancelled: (plan: string) =>
    posthog.capture("subscription_cancelled", { plan }),

  // Referral events
  referralLinkCopied: () =>
    posthog.capture("referral_link_copied"),
  referralInviteSent: (method: string) =>
    posthog.capture("referral_invite_sent", { method }),

  // Identify user
  identify: (userId: string, traits?: Record<string, unknown>) =>
    posthog.identify(userId, traits),

  // Reset on logout
  reset: () => posthog.reset(),
};
