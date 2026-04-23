-- Phase 3: Job Tailoring Engine
-- Run this after phase2-resume-schema.sql

-- Tailoring sessions table
CREATE TABLE IF NOT EXISTS tailoring_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE NOT NULL,
  
  -- Job details
  job_title TEXT DEFAULT '',
  job_company TEXT DEFAULT '',
  job_url TEXT DEFAULT '',
  job_description TEXT NOT NULL DEFAULT '',
  
  -- Analysis results
  ats_score INTEGER DEFAULT 0,                    -- 0-100 keyword match score
  keyword_matches JSONB DEFAULT '[]'::jsonb,      -- matched keywords [{keyword, found_in, importance}]
  missing_keywords JSONB DEFAULT '[]'::jsonb,     -- missing keywords [{keyword, importance, suggestion}]
  missing_skills JSONB DEFAULT '[]'::jsonb,       -- skills gap [{skill, importance, suggestion}]
  
  -- Tailored content
  tailored_summary TEXT DEFAULT '',               -- rewritten summary
  tailored_experience JSONB DEFAULT '[]'::jsonb,  -- rewritten experience bullets [{exp_id, original_bullets, tailored_bullets}]
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'analyzing', 'analyzed', 'tailored', 'applied')),
  applied_to_resume BOOLEAN DEFAULT FALSE,        -- whether tailored content was applied back
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tailoring_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own tailoring sessions"
  ON tailoring_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tailoring sessions"
  ON tailoring_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tailoring sessions"
  ON tailoring_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tailoring sessions"
  ON tailoring_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE TRIGGER update_tailoring_sessions_updated_at
  BEFORE UPDATE ON tailoring_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Index for fast lookups
CREATE INDEX idx_tailoring_sessions_user_id ON tailoring_sessions(user_id);
CREATE INDEX idx_tailoring_sessions_resume_id ON tailoring_sessions(resume_id);
CREATE INDEX idx_tailoring_sessions_status ON tailoring_sessions(status);
