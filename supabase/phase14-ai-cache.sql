-- Phase 14: AI Response Cache
-- Stores hashed AI responses to avoid redundant API calls

CREATE TABLE IF NOT EXISTS ai_cache (
  hash        TEXT PRIMARY KEY,
  cache_type  TEXT NOT NULL CHECK (cache_type IN ('tailoring', 'interview_prep', 'resume_parse')),
  response    TEXT NOT NULL,
  tokens_used INTEGER NOT NULL DEFAULT 0,
  hit_count   INTEGER NOT NULL DEFAULT 0,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for type-based queries
CREATE INDEX IF NOT EXISTS ai_cache_type_idx ON ai_cache(cache_type);

-- Index for expiry cleanup
CREATE INDEX IF NOT EXISTS ai_cache_expires_at_idx ON ai_cache(expires_at);

-- ─── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE ai_cache ENABLE ROW LEVEL SECURITY;

-- Only service role can read/write cache (it's a server-side optimization)
CREATE POLICY "service_role_manage_ai_cache"
  ON ai_cache FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
