-- Phase 17: Public API Keys
-- Run this in Supabase SQL editor

-- ─── API keys table ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS api_keys (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  key_prefix       TEXT NOT NULL,          -- first 8 chars (e.g. "hf_a1b2c3")
  key_hash         TEXT NOT NULL UNIQUE,   -- SHA-256 of full key
  scopes           TEXT[] NOT NULL DEFAULT ARRAY['tailor', 'jobs'],
  last_used_at     TIMESTAMPTZ,
  requests_today   INTEGER NOT NULL DEFAULT 0,
  requests_total   INTEGER NOT NULL DEFAULT 0,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at       TIMESTAMPTZ
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS api_keys_user_id_idx ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS api_keys_key_hash_idx ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS api_keys_is_active_idx ON api_keys(is_active);

-- ─── RPC: increment total requests atomically ────────────────────────────────

CREATE OR REPLACE FUNCTION increment_api_key_requests(p_key_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE api_keys
  SET requests_total = requests_total + 1
  WHERE id = p_key_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── Cron-style reset: reset requests_today at midnight UTC ─────────────────
-- Call this via a daily cron job at /api/cron/reset-api-counters

CREATE OR REPLACE FUNCTION reset_api_key_daily_counters()
RETURNS VOID AS $$
BEGIN
  UPDATE api_keys SET requests_today = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── Row Level Security ──────────────────────────────────────────────────────

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Users can manage their own keys (but never see key_hash)
CREATE POLICY "api_keys_select_own" ON api_keys
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "api_keys_insert_own" ON api_keys
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "api_keys_update_own" ON api_keys
  FOR UPDATE USING (auth.uid() = user_id);

-- Service role can do everything (needed for validateApiKey)
CREATE POLICY "api_keys_service_all" ON api_keys
  FOR ALL USING (auth.role() = 'service_role');
