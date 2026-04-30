// src/lib/team-types.ts
// Team and enterprise plan type definitions

export interface Team {
  id: string;
  name: string;
  owner_id: string;
  plan: "team" | "enterprise";
  seat_count: number;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  invited_email: string | null;
  accepted_at: string | null;
  created_at: string;
}

export interface TeamUsageStats {
  team_id: string;
  total_members: number;
  active_members: number;
  total_tailoring_this_month: number;
  total_applications: number;
  total_resumes: number;
}

export const TEAM_PLANS = {
  team: {
    id: "team" as const,
    name: "Team",
    price_per_seat: 12,
    min_seats: 3,
    max_seats: 25,
    description: "For small teams of 3–25 people",
    stripe_price_id: process.env.STRIPE_TEAM_PRICE_ID ?? "",
  },
  enterprise: {
    id: "enterprise" as const,
    name: "Enterprise",
    price_per_seat: 8,
    min_seats: 25,
    max_seats: 1000,
    description: "For large organizations of 25–1000 people",
    stripe_price_id: process.env.STRIPE_ENTERPRISE_PRICE_ID ?? "",
  },
} as const;

export type TeamPlanId = keyof typeof TEAM_PLANS;
