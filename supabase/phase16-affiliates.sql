-- Phase 16: Affiliate Program
-- Run this in Supabase SQL editor

-- ─── Affiliates table ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS affiliates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code            TEXT NOT NULL UNIQUE,
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  commission_rate INTEGER NOT NULL DEFAULT 30,
  total_clicks    INTEGER NOT NULL DEFAULT 0,
  total_conversions INTEGER NOT NULL DEFAULT 0,
  total_earnings_cents INTEGER NOT NULL DEFAULT 0,
  paid_out_cents  INTEGER NOT NULL DEFAULT 0,
  paypal_email    TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Affiliate clicks table ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id  UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  ip_address    TEXT,
  user_agent    TEXT,
  referrer      TEXT,
  landing_page  TEXT,
  converted     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Affiliate conversions table ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS affiliate_conversions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id     UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  click_id         UUID REFERENCES affiliate_clicks(id) ON DELETE SET NULL,
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id          TEXT NOT NULL,
  amount_cents     INTEGER NOT NULL,
  commission_cents INTEGER NOT NULL,
  status           TEXT NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'approved', 'paid')),
  stripe_charge_id TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS affiliates_user_id_idx ON affiliates(user_id);
CREATE INDEX IF NOT EXISTS affiliates_code_idx ON affiliates(code);
CREATE INDEX IF NOT EXISTS affiliate_clicks_affiliate_id_idx ON affiliate_clicks(affiliate_id);
CREATE INDEX IF NOT EXISTS affiliate_clicks_created_at_idx ON affiliate_clicks(created_at DESC);
CREATE INDEX IF NOT EXISTS affiliate_conversions_affiliate_id_idx ON affiliate_conversions(affiliate_id);
CREATE INDEX IF NOT EXISTS affiliate_conversions_user_id_idx ON affiliate_conversions(user_id);

-- ─── Updated_at trigger ──────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_affiliates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS affiliates_updated_at ON affiliates;
CREATE TRIGGER affiliates_updated_at
  BEFORE UPDATE ON affiliates
  FOR EACH ROW EXECUTE FUNCTION update_affiliates_updated_at();

-- ─── RPC: increment affiliate clicks ────────────────────────────────────────

CREATE OR REPLACE FUNCTION increment_affiliate_clicks(p_affiliate_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE affiliates
  SET total_clicks = total_clicks + 1,
      updated_at   = NOW()
  WHERE id = p_affiliate_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── RPC: update affiliate totals after conversion ───────────────────────────

CREATE OR REPLACE FUNCTION update_affiliate_totals(
  p_affiliate_id    UUID,
  p_commission_cents INTEGER
)
RETURNS VOID AS $$
BEGIN
  UPDATE affiliates
  SET total_conversions     = total_conversions + 1,
      total_earnings_cents  = total_earnings_cents + p_commission_cents,
      updated_at            = NOW()
  WHERE id = p_affiliate_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── Row Level Security ──────────────────────────────────────────────────────

ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_conversions ENABLE ROW LEVEL SECURITY;

-- Affiliates: users can read/update their own record
CREATE POLICY "affiliates_select_own" ON affiliates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "affiliates_insert_own" ON affiliates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "affiliates_update_own" ON affiliates
  FOR UPDATE USING (auth.uid() = user_id);

-- Service role can do everything
CREATE POLICY "affiliates_service_all" ON affiliates
  FOR ALL USING (auth.role() = 'service_role');

-- Clicks: users can read clicks for their affiliate
CREATE POLICY "affiliate_clicks_select_own" ON affiliate_clicks
  FOR SELECT USING (
    affiliate_id IN (
      SELECT id FROM affiliates WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "affiliate_clicks_service_all" ON affiliate_clicks
  FOR ALL USING (auth.role() = 'service_role');

-- Conversions: users can read their own conversions
CREATE POLICY "affiliate_conversions_select_own" ON affiliate_conversions
  FOR SELECT USING (
    affiliate_id IN (
      SELECT id FROM affiliates WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "affiliate_conversions_service_all" ON affiliate_conversions
  FOR ALL USING (auth.role() = 'service_role');
