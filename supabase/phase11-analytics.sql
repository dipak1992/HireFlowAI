-- Phase 11: Analytics Events
-- Stores server-side analytics events for conversion tracking and A/B test analysis

CREATE TABLE IF NOT EXISTS analytics_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event       TEXT NOT NULL,
  properties  JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for querying by user
CREATE INDEX IF NOT EXISTS analytics_events_user_id_idx ON analytics_events(user_id);

-- Index for querying by event name
CREATE INDEX IF NOT EXISTS analytics_events_event_idx ON analytics_events(event);

-- Index for time-based queries
CREATE INDEX IF NOT EXISTS analytics_events_created_at_idx ON analytics_events(created_at DESC);

-- ─── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Service role can insert (server-side tracking)
CREATE POLICY "service_role_insert_analytics"
  ON analytics_events FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Users can read their own events
CREATE POLICY "users_read_own_analytics"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Service role can read all events (for admin dashboards)
CREATE POLICY "service_role_read_analytics"
  ON analytics_events FOR SELECT
  TO service_role
  USING (true);
