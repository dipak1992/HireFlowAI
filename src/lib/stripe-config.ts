// src/lib/stripe-config.ts
// Stripe plans configuration — simplified to Free + Pro

export type PlanId = "free" | "pro";

export type FeatureKey =
  | "tailoring"
  | "saved_jobs"
  | "applications"
  | "resumes"
  | "ai_interview_prep"
  | "premium_exports"
  | "salary_tips"
  | "career_insights"
  | "priority_support";

export interface PlanFeature {
  key: FeatureKey;
  label: string;
  included: boolean;
  limit?: number | "unlimited";
}

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  price_monthly: number;
  price_annual: number;
  stripe_price_id_monthly: string | null;
  stripe_price_id_annual: string | null;
  features: PlanFeature[];
  is_popular: boolean;
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Free",
    description: "Perfect to try AI resume tailoring.",
    price_monthly: 0,
    price_annual: 0,
    stripe_price_id_monthly: null,
    stripe_price_id_annual: null,
    is_popular: false,
    features: [
      { key: "resumes", label: "Resumes", included: true, limit: 1 },
      {
        key: "tailoring",
        label: "AI tailoring per month",
        included: true,
        limit: 1,
      },
      { key: "saved_jobs", label: "Saved jobs", included: true, limit: 5 },
      {
        key: "applications",
        label: "Tracked applications",
        included: true,
        limit: 10,
      },
      { key: "premium_exports", label: "PDF & DOCX export", included: false },
      { key: "ai_interview_prep", label: "AI Interview Prep", included: false },
      {
        key: "salary_tips",
        label: "Salary negotiation tips",
        included: false,
      },
      { key: "career_insights", label: "Career insights", included: false },
      { key: "priority_support", label: "Priority support", included: false },
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    description: "For serious job seekers who want every advantage.",
    price_monthly: 19,
    price_annual: 190,
    stripe_price_id_monthly: process.env.STRIPE_PRO_PRICE_ID || "",
    stripe_price_id_annual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID || "",
    is_popular: true,
    features: [
      {
        key: "resumes",
        label: "Resumes",
        included: true,
        limit: "unlimited",
      },
      {
        key: "tailoring",
        label: "AI tailoring",
        included: true,
        limit: "unlimited",
      },
      {
        key: "saved_jobs",
        label: "Saved jobs",
        included: true,
        limit: "unlimited",
      },
      {
        key: "applications",
        label: "Tracked applications",
        included: true,
        limit: "unlimited",
      },
      { key: "premium_exports", label: "PDF & DOCX export", included: true },
      { key: "ai_interview_prep", label: "AI Interview Prep", included: true },
      {
        key: "salary_tips",
        label: "Salary negotiation tips",
        included: true,
      },
      { key: "career_insights", label: "Career insights", included: true },
      { key: "priority_support", label: "Priority support", included: true },
    ],
  },
};

// ----- Feature Gate Helpers -----

export function getPlan(planId: string | null | undefined): Plan {
  if (planId && planId in PLANS) {
    return PLANS[planId as PlanId];
  }
  return PLANS.free;
}

export function getFeatureLimit(
  planId: PlanId,
  feature: FeatureKey
): number | "unlimited" {
  const plan = PLANS[planId];
  const feat = plan.features.find((f) => f.key === feature);
  if (!feat || !feat.included) return 0;
  return feat.limit ?? (feat.included ? "unlimited" : 0);
}

export function isFeatureIncluded(
  planId: PlanId,
  feature: FeatureKey
): boolean {
  const plan = PLANS[planId];
  const feat = plan.features.find((f) => f.key === feature);
  return feat?.included ?? false;
}

export function canUseTailoring(
  planId: PlanId,
  currentUsage: number
): boolean {
  const limit = getFeatureLimit(planId, "tailoring");
  if (limit === "unlimited") return true;
  return currentUsage < (limit as number);
}

export function canSaveJob(planId: PlanId, currentSaved: number): boolean {
  const limit = getFeatureLimit(planId, "saved_jobs");
  if (limit === "unlimited") return true;
  return currentSaved < (limit as number);
}

export function canAddApplication(
  planId: PlanId,
  currentCount: number
): boolean {
  const limit = getFeatureLimit(planId, "applications");
  if (limit === "unlimited") return true;
  return currentCount < (limit as number);
}

export function canCreateResume(
  planId: PlanId,
  currentCount: number
): boolean {
  const limit = getFeatureLimit(planId, "resumes");
  if (limit === "unlimited") return true;
  return currentCount < (limit as number);
}

export function canExportPremium(planId: PlanId): boolean {
  return isFeatureIncluded(planId, "premium_exports");
}

export function canUseInterviewPrep(planId: PlanId): boolean {
  return isFeatureIncluded(planId, "ai_interview_prep");
}

// ----- Upgrade Message Helpers -----

export function getUpgradeMessage(feature: FeatureKey): string {
  const messages: Record<FeatureKey, string> = {
    tailoring:
      "You've used your free tailoring this month. Upgrade to Pro for unlimited AI tailoring.",
    saved_jobs:
      "You've reached the free limit of 5 saved jobs. Upgrade to Pro for unlimited saved jobs.",
    applications:
      "Free accounts can track up to 10 applications. Upgrade to Pro for unlimited tracking.",
    resumes:
      "Free accounts include 1 resume. Upgrade to Pro for unlimited resumes.",
    premium_exports:
      "PDF and DOCX export is a Pro feature. Upgrade to export professional documents.",
    ai_interview_prep:
      "AI Interview Prep is a Pro feature. Get tailored questions and STAR-format answers.",
    salary_tips:
      "Salary negotiation tips are a Pro feature. Get AI-powered salary insights.",
    career_insights:
      "Career progression insights are a Pro feature. Upgrade for personalized career guidance.",
    priority_support: "Priority support is available on the Pro plan.",
  };
  return messages[feature];
}
