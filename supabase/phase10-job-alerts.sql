-- supabase/phase10-job-alerts.sql
-- Job alerts table with RLS

-- ─── job_alerts table ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS job_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  job_types TEXT[] NOT NULL DEFAULT '{}',
  remote_only BOOLEAN NOT NULL DEFAULT false,
  frequency TEXT NOT NULL DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_job_alerts_user_id
  ON job_alerts (user_id);

CREATE INDEX IF NOT EXISTS idx_job_alerts_active
  ON job_alerts (is_active, frequency, last_sent_at)
  WHERE is_active = true;

-- ─── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE job_alerts ENABLE ROW LEVEL SECURITY;

-- Users can only see their own alerts
CREATE POLICY "Users can view own job alerts"
  ON job_alerts FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own alerts
CREATE POLICY "Users can create job alerts"
  ON job_alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own alerts
CREATE POLICY "Users can update own job alerts"
  ON job_alerts FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own alerts
CREATE POLICY "Users can delete own job alerts"
  ON job_alerts FOR DELETE
  USING (auth.uid() = user_id);

-- ─── updated_at trigger ───────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_job_alerts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS job_alerts_updated_at ON job_alerts;
CREATE TRIGGER job_alerts_updated_at
  BEFORE UPDATE ON job_alerts
  FOR EACH ROW
  EXECUTE FUNCTION update_job_alerts_updated_at();
