-- Phase 12: Churn Reduction
-- cancel_surveys table + subscriptions columns for pause/resume

-- ─── Cancel Surveys ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS cancel_surveys (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason      TEXT NOT NULL,
  feedback    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS cancel_surveys_user_id_idx ON cancel_surveys(user_id);

ALTER TABLE cancel_surveys ENABLE ROW LEVEL SECURITY;

-- Service role can insert and read
CREATE POLICY "service_role_manage_cancel_surveys"
  ON cancel_surveys FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Users can insert their own survey
CREATE POLICY "users_insert_own_cancel_survey"
  ON cancel_surveys FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ─── Subscriptions: Pause / Cancel columns ────────────────────────────────────

ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS paused_at          TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS resumes_at         TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE;
