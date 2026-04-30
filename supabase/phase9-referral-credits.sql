-- supabase/phase9-referral-credits.sql
-- Adds credits_granted and metadata columns to usage_logs
-- Adds referred_user_id and referral_code columns to referrals

-- ─── usage_logs enhancements ──────────────────────────────────────────────────

ALTER TABLE usage_logs
  ADD COLUMN IF NOT EXISTS credits_granted INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Index for referral credit lookups
CREATE INDEX IF NOT EXISTS idx_usage_logs_action
  ON usage_logs (user_id, action);

-- ─── referrals table enhancements ────────────────────────────────────────────

ALTER TABLE referrals
  ADD COLUMN IF NOT EXISTS referred_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS referral_code TEXT,
  ADD COLUMN IF NOT EXISTS credits_granted INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Index for referral code lookups
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user
  ON referrals (referred_user_id);

CREATE INDEX IF NOT EXISTS idx_referrals_code
  ON referrals (code);

-- ─── Backfill: sync referred_user_id from referred_id if column exists ────────

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'referrals' AND column_name = 'referred_id'
  ) THEN
    UPDATE referrals
    SET referred_user_id = referred_id
    WHERE referred_user_id IS NULL AND referred_id IS NOT NULL;
  END IF;
END $$;

-- ─── RLS policies for new columns ────────────────────────────────────────────

-- usage_logs: users can read their own credit logs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'usage_logs' AND policyname = 'Users can view own usage logs'
  ) THEN
    CREATE POLICY "Users can view own usage logs"
      ON usage_logs FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;
