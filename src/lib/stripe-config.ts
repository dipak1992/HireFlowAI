import Stripe from "stripe";

// Stripe singleton (server-side only)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder", {
  apiVersion: "2026-03-25.dahlia",
  typescript: true,
});

// ─── Plan definitions ─────────────────────────────────────────────────────────

export type PlanId = "free" | "pro" | "fasthire";

export interface PlanFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

export interface Plan {
  id: PlanId;
  name: string;
  price: number; // USD cents per month (0 = free)
  priceDisplay: string;
  period: string;
  description: string;
  badge?: string;
  popular?: boolean;
  stripePriceId: string | null; // null for free
  features: PlanFeature[];
  limits: {
    tailoring_per_month: number | null; // null = unlimited
    saved_jobs: number | null;
    ai_prep: boolean;
    premium_exports: boolean;
    linkedin_premium: boolean;
    urgent_alerts: boolean;
    priority_nearby: boolean;
    quick_apply: boolean;
  };
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    priceDisplay: "$0",
    period: "forever",
    description: "Get started with essential job search tools",
    stripePriceId: null,
    features: [
      { text: "3 resume tailoring uses/month", included: true },
      { text: "10 saved jobs", included: true },
      { text: "Job Dashboard (Recommended, Remote, Urgent)", included: true },
      { text: "Application Tracker (Kanban + Table)", included: true },
      { text: "Basic resume builder", included: true },
      { text: "LinkedIn import", included: true },
      { text: "AI Interview Prep", included: false },
      { text: "Premium resume exports (PDF/DOCX)", included: false },
      { text: "LinkedIn premium analysis", included: false },
      { text: "Urgent local job alerts", included: false },
    ],
    limits: {
      tailoring_per_month: 3,
      saved_jobs: 10,
      ai_prep: false,
      premium_exports: false,
      linkedin_premium: false,
      urgent_alerts: false,
      priority_nearby: false,
      quick_apply: false,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 1900,
    priceDisplay: "$19",
    period: "/month",
    description: "Unlimited AI-powered job search and career tools",
    badge: "Most Popular",
    popular: true,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID ?? "price_pro_placeholder",
    features: [
      { text: "Unlimited resume tailoring", included: true, highlight: true },
      { text: "Unlimited saved jobs", included: true, highlight: true },
      { text: "AI Interview Prep (questions, tips)", included: true, highlight: true },
      { text: "Premium resume exports (PDF/DOCX)", included: true, highlight: true },
      { text: "LinkedIn premium career analysis", included: true, highlight: true },
      { text: "Job Dashboard + all tabs", included: true },
      { text: "Application Tracker (Kanban + Table)", included: true },
      { text: "Full resume builder", included: true },
      { text: "Salary negotiation tips", included: true },
      { text: "Career progression insights", included: true },
    ],
    limits: {
      tailoring_per_month: null,
      saved_jobs: null,
      ai_prep: true,
      premium_exports: true,
      linkedin_premium: true,
      urgent_alerts: false,
      priority_nearby: false,
      quick_apply: false,
    },
  },
  fasthire: {
    id: "fasthire",
    name: "FastHire",
    price: 1500,
    priceDisplay: "$15",
    period: "/month",
    description: "Speed-optimized tools for urgent job seekers",
    badge: "Best for Speed",
    stripePriceId: process.env.STRIPE_FASTHIRE_PRICE_ID ?? "price_fasthire_placeholder",
    features: [
      { text: "Urgent local job alerts", included: true, highlight: true },
      { text: "Priority nearby jobs feed", included: true, highlight: true },
      { text: "Quick apply tools", included: true, highlight: true },
      { text: "3 resume tailoring uses/month", included: true },
      { text: "10 saved jobs", included: true },
      { text: "Application Tracker", included: true },
      { text: "AI Interview Prep", included: false },
      { text: "Premium resume exports", included: false },
      { text: "LinkedIn premium analysis", included: false },
    ],
    limits: {
      tailoring_per_month: 3,
      saved_jobs: 10,
      ai_prep: false,
      premium_exports: false,
      linkedin_premium: false,
      urgent_alerts: true,
      priority_nearby: true,
      quick_apply: true,
    },
  },
};

export const PLAN_ORDER: PlanId[] = ["free", "pro", "fasthire"];

// ─── Usage limits ─────────────────────────────────────────────────────────────

export type FeatureKey = keyof Plan["limits"];

export function getPlanLimits(planId: PlanId) {
  return PLANS[planId].limits;
}

export function canUseFeature(planId: PlanId, feature: FeatureKey): boolean {
  const limits = getPlanLimits(planId);
  const val = limits[feature];
  if (typeof val === "boolean") return val;
  if (val === null) return true; // unlimited
  if (typeof val === "number") return val > 0;
  return false;
}
