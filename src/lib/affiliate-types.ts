// src/lib/affiliate-types.ts
// Affiliate program type definitions

export interface Affiliate {
  id: string;
  user_id: string;
  code: string;
  status: "pending" | "approved" | "rejected" | "suspended";
  commission_rate: number; // percentage (e.g. 30 = 30%)
  total_clicks: number;
  total_conversions: number;
  total_earnings_cents: number;
  paid_out_cents: number;
  paypal_email: string | null;
  created_at: string;
  updated_at: string;
}

export interface AffiliateClick {
  id: string;
  affiliate_id: string;
  ip_address: string | null;
  user_agent: string | null;
  referrer: string | null;
  landing_page: string | null;
  converted: boolean;
  created_at: string;
}

export interface AffiliateConversion {
  id: string;
  affiliate_id: string;
  click_id: string | null;
  user_id: string;
  plan_id: string;
  amount_cents: number;
  commission_cents: number;
  status: "pending" | "approved" | "paid";
  stripe_charge_id: string | null;
  created_at: string;
}

export const AFFILIATE_CONFIG = {
  commission_rate: 30, // 30% commission
  cookie_days: 90, // 90-day attribution window
  min_payout_cents: 5000, // $50 minimum payout
  payout_schedule: "monthly" as const,
} as const;
