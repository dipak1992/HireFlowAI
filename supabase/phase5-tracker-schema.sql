-- Phase 5: Application Tracker
-- Standalone: can be run without phase2/phase3/phase4 schemas.
-- job_id, resume_id, tailoring_session_id are stored as plain UUIDs
-- (no FK constraints) so this file runs independently.

-- Applications table (core tracker)
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Job info (can be linked to jobs table or manual entry)
  job_id UUID,  -- references jobs(id) when phase4 schema is present
  job_title TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  company_website TEXT DEFAULT '',
  job_url TEXT DEFAULT '',
  apply_url TEXT DEFAULT '',
  location TEXT DEFAULT '',
  is_remote BOOLEAN DEFAULT FALSE,
  job_type TEXT DEFAULT 'full_time',
  
  -- Compensation
  salary_min INTEGER DEFAULT 0,
  salary_max INTEGER DEFAULT 0,
  salary_currency TEXT DEFAULT 'USD',
  
  -- Status pipeline
  status TEXT DEFAULT 'saved' CHECK (status IN ('saved', 'applied', 'interview', 'offer', 'rejected', 'archived')),
  
  -- Dates
  applied_at TIMESTAMPTZ,
  deadline_at TIMESTAMPTZ,
  
  -- Resume used
  resume_id UUID,               -- references resumes(id) when phase2/3 schema is present
  tailoring_session_id UUID,    -- references tailoring_sessions(id) when phase3 schema is present
  
  -- AI prep data
  ai_prep_generated BOOLEAN DEFAULT FALSE,
  ai_interview_questions JSONB DEFAULT '[]'::jsonb,
  ai_salary_tips TEXT DEFAULT '',
  ai_career_suggestions TEXT DEFAULT '',
  
  -- Priority
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  
  -- Reminder
  reminder_at TIMESTAMPTZ,
  reminder_sent BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Application notes
CREATE TABLE IF NOT EXISTS application_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  note_type TEXT DEFAULT 'general' CHECK (note_type IN ('general', 'interview', 'follow_up', 'offer', 'rejection')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  
  -- Interview details
  interview_type TEXT DEFAULT 'phone' CHECK (interview_type IN ('phone', 'video', 'onsite', 'technical', 'behavioral', 'panel', 'final')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  location TEXT DEFAULT '',
  meeting_url TEXT DEFAULT '',
  interviewer_name TEXT DEFAULT '',
  interviewer_title TEXT DEFAULT '',
  
  -- Outcome
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  outcome TEXT DEFAULT '' CHECK (outcome IN ('', 'passed', 'failed', 'pending')),
  feedback TEXT DEFAULT '',
  
  -- Prep
  prep_notes TEXT DEFAULT '',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

-- Applications RLS
CREATE POLICY "Users can view own applications"
  ON applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own applications"
  ON applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own applications"
  ON applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own applications"
  ON applications FOR DELETE USING (auth.uid() = user_id);

-- Notes RLS
CREATE POLICY "Users can view own notes"
  ON application_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own notes"
  ON application_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes"
  ON application_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes"
  ON application_notes FOR DELETE USING (auth.uid() = user_id);

-- Interviews RLS
CREATE POLICY "Users can view own interviews"
  ON interviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own interviews"
  ON interviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own interviews"
  ON interviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own interviews"
  ON interviews FOR DELETE USING (auth.uid() = user_id);

-- Updated_at triggers
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_application_notes_updated_at
  BEFORE UPDATE ON application_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interviews_updated_at
  BEFORE UPDATE ON interviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_applied_at ON applications(applied_at DESC);
CREATE INDEX idx_application_notes_application_id ON application_notes(application_id);
CREATE INDEX idx_interviews_application_id ON interviews(application_id);
CREATE INDEX idx_interviews_scheduled_at ON interviews(scheduled_at);
