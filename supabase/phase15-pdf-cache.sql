-- Phase 15: PDF Cache
-- Caches generated resume PDFs in Supabase Storage

CREATE TABLE IF NOT EXISTS pdf_cache (
  hash          TEXT PRIMARY KEY,
  resume_id     UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  template_id   TEXT NOT NULL,
  content_hash  TEXT NOT NULL,
  storage_path  TEXT NOT NULL,
  expires_at    TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS pdf_cache_resume_id_idx ON pdf_cache(resume_id);
CREATE INDEX IF NOT EXISTS pdf_cache_expires_at_idx ON pdf_cache(expires_at);

-- ─── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE pdf_cache ENABLE ROW LEVEL SECURITY;

-- Only service role can manage PDF cache
CREATE POLICY "service_role_manage_pdf_cache"
  ON pdf_cache FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ─── Storage Bucket ───────────────────────────────────────────────────────────
-- Run this in Supabase Dashboard > Storage to create the bucket:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('resume-pdfs', 'resume-pdfs', false);
