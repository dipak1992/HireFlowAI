-- Phase 4: Job Dashboard
-- Run this after phase3-tailoring-schema.sql

-- Jobs table (aggregated job listings)
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Job details
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  company_logo_url TEXT DEFAULT '',
  location TEXT DEFAULT '',
  is_remote BOOLEAN DEFAULT FALSE,
  job_type TEXT DEFAULT 'full_time' CHECK (job_type IN ('full_time', 'part_time', 'contract', 'internship', 'freelance')),
  experience_level TEXT DEFAULT 'mid' CHECK (experience_level IN ('entry', 'mid', 'senior', 'lead', 'executive')),
  
  -- Compensation
  salary_min INTEGER DEFAULT 0,
  salary_max INTEGER DEFAULT 0,
  salary_currency TEXT DEFAULT 'USD',
  salary_period TEXT DEFAULT 'yearly' CHECK (salary_period IN ('hourly', 'monthly', 'yearly')),
  
  -- Description
  description TEXT DEFAULT '',
  requirements JSONB DEFAULT '[]'::jsonb,    -- ["3+ years React", "TypeScript", ...]
  benefits JSONB DEFAULT '[]'::jsonb,        -- ["Health insurance", "401k", ...]
  tags JSONB DEFAULT '[]'::jsonb,            -- ["react", "typescript", "remote", ...]
  
  -- Source
  source TEXT DEFAULT 'manual',              -- 'manual', 'linkedin', 'indeed', 'api'
  source_url TEXT DEFAULT '',                -- original job posting URL
  apply_url TEXT DEFAULT '',                 -- direct apply link
  
  -- Metadata
  is_urgent BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  posted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  
  -- Geo (for nearby filtering)
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved jobs table (user bookmarks + tracking)
CREATE TABLE IF NOT EXISTS saved_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  
  -- Tracking status
  status TEXT DEFAULT 'saved' CHECK (status IN ('saved', 'applied', 'interviewing', 'offered', 'rejected', 'withdrawn')),
  notes TEXT DEFAULT '',
  applied_at TIMESTAMPTZ,
  
  -- Resume used
  resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL,
  tailoring_session_id UUID REFERENCES tailoring_sessions(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, job_id)
);

-- Enable RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;

-- Jobs are readable by all authenticated users
CREATE POLICY "Authenticated users can view jobs"
  ON jobs FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Saved jobs RLS
CREATE POLICY "Users can view own saved jobs"
  ON saved_jobs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save jobs"
  ON saved_jobs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved jobs"
  ON saved_jobs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved jobs"
  ON saved_jobs FOR DELETE
  USING (auth.uid() = user_id);

-- Updated_at triggers
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_jobs_updated_at
  BEFORE UPDATE ON saved_jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_is_remote ON jobs(is_remote);
CREATE INDEX idx_jobs_is_urgent ON jobs(is_urgent);
CREATE INDEX idx_jobs_job_type ON jobs(job_type);
CREATE INDEX idx_jobs_experience_level ON jobs(experience_level);
CREATE INDEX idx_jobs_posted_at ON jobs(posted_at DESC);
CREATE INDEX idx_jobs_tags ON jobs USING GIN(tags);
CREATE INDEX idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX idx_saved_jobs_status ON saved_jobs(status);

-- Seed some sample jobs for demo purposes
INSERT INTO jobs (title, company, location, is_remote, job_type, experience_level, salary_min, salary_max, description, requirements, tags, source_url, apply_url, is_urgent, posted_at) VALUES
('Senior Frontend Engineer', 'TechCorp', 'San Francisco, CA', false, 'full_time', 'senior', 150000, 200000, 'We are looking for a Senior Frontend Engineer to join our team and help build the next generation of our web platform. You will work closely with designers and backend engineers to deliver exceptional user experiences.', '["5+ years React/TypeScript", "Experience with Next.js", "Strong CSS/Tailwind skills", "GraphQL experience preferred"]'::jsonb, '["react", "typescript", "nextjs", "tailwind", "graphql"]'::jsonb, 'https://example.com/jobs/1', 'https://example.com/apply/1', false, NOW() - INTERVAL '2 days'),

('Full Stack Developer', 'StartupAI', 'New York, NY', true, 'full_time', 'mid', 120000, 160000, 'Join our fast-growing AI startup as a Full Stack Developer. You will build features end-to-end, from database design to frontend implementation. We use modern tech and ship fast.', '["3+ years full stack experience", "React + Node.js", "PostgreSQL", "AWS or GCP", "Startup experience a plus"]'::jsonb, '["react", "nodejs", "postgresql", "aws", "fullstack"]'::jsonb, 'https://example.com/jobs/2', 'https://example.com/apply/2', true, NOW() - INTERVAL '1 day'),

('Backend Engineer', 'DataFlow Inc', 'Austin, TX', true, 'full_time', 'mid', 130000, 170000, 'We need a Backend Engineer to design and implement scalable APIs and data pipelines. You will work with large datasets and help us process millions of events daily.', '["3+ years backend development", "Python or Go", "PostgreSQL/Redis", "Docker/Kubernetes", "CI/CD experience"]'::jsonb, '["python", "go", "postgresql", "redis", "kubernetes", "docker"]'::jsonb, 'https://example.com/jobs/3', 'https://example.com/apply/3', false, NOW() - INTERVAL '3 days'),

('React Native Developer', 'MobileFirst', 'Remote', true, 'contract', 'mid', 80, 120, 'Looking for a React Native developer for a 6-month contract to build our mobile app from scratch. Experience with both iOS and Android required.', '["3+ years React Native", "iOS and Android experience", "TypeScript", "REST APIs", "App Store deployment"]'::jsonb, '["react-native", "typescript", "ios", "android", "mobile"]'::jsonb, 'https://example.com/jobs/4', 'https://example.com/apply/4', true, NOW()),

('Junior Software Engineer', 'LearnTech', 'Chicago, IL', false, 'full_time', 'entry', 70000, 95000, 'Great opportunity for a junior developer to join our engineering team. We provide mentorship and a structured growth path. You will work on our education platform used by millions.', '["CS degree or bootcamp", "JavaScript/TypeScript basics", "Eagerness to learn", "Team player"]'::jsonb, '["javascript", "typescript", "react", "entry-level"]'::jsonb, 'https://example.com/jobs/5', 'https://example.com/apply/5', false, NOW() - INTERVAL '5 days'),

('DevOps Engineer', 'CloudScale', 'Seattle, WA', true, 'full_time', 'senior', 160000, 210000, 'Lead our infrastructure and DevOps practices. You will manage our cloud infrastructure, CI/CD pipelines, and ensure 99.99% uptime for our SaaS platform.', '["5+ years DevOps/SRE", "AWS expertise", "Terraform/Pulumi", "Kubernetes", "Monitoring (Datadog/Grafana)"]'::jsonb, '["aws", "terraform", "kubernetes", "devops", "docker", "ci/cd"]'::jsonb, 'https://example.com/jobs/6', 'https://example.com/apply/6', false, NOW() - INTERVAL '1 day'),

('Product Designer', 'DesignHub', 'Los Angeles, CA', true, 'full_time', 'mid', 110000, 150000, 'We are looking for a Product Designer to create beautiful, intuitive interfaces for our B2B SaaS product. You will own the design process from research to handoff.', '["3+ years product design", "Figma expertise", "User research skills", "Design systems experience", "B2B SaaS preferred"]'::jsonb, '["figma", "design", "ux", "ui", "saas"]'::jsonb, 'https://example.com/jobs/7', 'https://example.com/apply/7', false, NOW() - INTERVAL '4 days'),

('Data Scientist', 'AnalyticsPro', 'Boston, MA', false, 'full_time', 'senior', 140000, 190000, 'Join our data science team to build ML models that power our recommendation engine. You will work with petabytes of data and deploy models to production.', '["5+ years data science", "Python/R", "Machine Learning", "SQL", "TensorFlow/PyTorch", "PhD preferred"]'::jsonb, '["python", "machine-learning", "tensorflow", "sql", "data-science"]'::jsonb, 'https://example.com/jobs/8', 'https://example.com/apply/8', false, NOW() - INTERVAL '2 days');
