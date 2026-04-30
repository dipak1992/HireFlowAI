-- ============================================================
-- HireFlow AI — Full Database Schema (All Phases Combined)
-- Run this ONCE in your Supabase SQL Editor.
-- Safe to re-run: uses IF NOT EXISTS / OR REPLACE / DROP IF EXISTS.
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Shared updated_at function ──────────────────────────────
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- PHASE 1 — Core (profiles, preferences, auth_providers, linkedin)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  location TEXT,
  bio TEXT,
  headline TEXT,
  plan_id TEXT DEFAULT 'free',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"   ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS public.preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  goal TEXT CHECK (goal IN ('need_work_fast', 'grow_career')),
  location TEXT,
  desired_pay_min INTEGER,
  desired_pay_max INTEGER,
  pay_type TEXT CHECK (pay_type IN ('hourly', 'salary')),
  job_category TEXT,
  remote_preference TEXT CHECK (remote_preference IN ('remote', 'hybrid', 'onsite', 'any')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.preferences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own preferences" ON public.preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON public.preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON public.preferences;
CREATE POLICY "Users can view own preferences"   ON public.preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON public.preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON public.preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.auth_providers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('google', 'linkedin', 'email')),
  provider_user_id TEXT,
  provider_email TEXT,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

ALTER TABLE public.auth_providers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own auth providers" ON public.auth_providers;
DROP POLICY IF EXISTS "Users can insert own auth providers" ON public.auth_providers;
CREATE POLICY "Users can view own auth providers"   ON public.auth_providers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own auth providers" ON public.auth_providers FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.linkedin_imports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  consent_given BOOLEAN DEFAULT FALSE,
  consent_date TIMESTAMPTZ,
  profile_data JSONB,
  import_status TEXT CHECK (import_status IN ('pending', 'imported', 'skipped', 'failed')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.linkedin_imports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own linkedin imports" ON public.linkedin_imports;
DROP POLICY IF EXISTS "Users can update own linkedin imports" ON public.linkedin_imports;
DROP POLICY IF EXISTS "Users can insert own linkedin imports" ON public.linkedin_imports;
CREATE POLICY "Users can view own linkedin imports"   ON public.linkedin_imports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own linkedin imports" ON public.linkedin_imports FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own linkedin imports" ON public.linkedin_imports FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

CREATE INDEX IF NOT EXISTS idx_preferences_user_id ON public.preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_providers_user_id ON public.auth_providers(user_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_imports_user_id ON public.linkedin_imports(user_id);

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_preferences_updated_at ON public.preferences;
CREATE TRIGGER update_preferences_updated_at
  BEFORE UPDATE ON public.preferences FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_linkedin_imports_updated_at ON public.linkedin_imports;
CREATE TRIGGER update_linkedin_imports_updated_at
  BEFORE UPDATE ON public.linkedin_imports FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- ============================================================
-- PHASE 2 — Resumes
-- ============================================================

CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Resume',
  template TEXT NOT NULL DEFAULT 'ats' CHECK (template IN ('ats', 'professional', 'fast_apply')),
  source TEXT CHECK (source IN ('scratch', 'upload', 'linkedin')) DEFAULT 'scratch',
  is_primary BOOLEAN DEFAULT FALSE,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  contact_location TEXT,
  contact_website TEXT,
  contact_linkedin TEXT,
  summary TEXT,
  experience JSONB DEFAULT '[]'::jsonb,
  education JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  projects JSONB DEFAULT '[]'::jsonb,
  ats_score INTEGER,
  last_exported_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own resumes" ON public.resumes;
DROP POLICY IF EXISTS "Users can insert own resumes" ON public.resumes;
DROP POLICY IF EXISTS "Users can update own resumes" ON public.resumes;
DROP POLICY IF EXISTS "Users can delete own resumes" ON public.resumes;
CREATE POLICY "Users can view own resumes"   ON public.resumes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own resumes" ON public.resumes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own resumes" ON public.resumes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own resumes" ON public.resumes FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.resume_versions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  version_number INTEGER NOT NULL DEFAULT 1,
  version_name TEXT,
  snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own resume versions" ON public.resume_versions;
DROP POLICY IF EXISTS "Users can insert own resume versions" ON public.resume_versions;
DROP POLICY IF EXISTS "Users can delete own resume versions" ON public.resume_versions;
CREATE POLICY "Users can view own resume versions"   ON public.resume_versions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own resume versions" ON public.resume_versions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own resume versions" ON public.resume_versions FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_versions_resume_id ON public.resume_versions(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_versions_user_id ON public.resume_versions(user_id);

DROP TRIGGER IF EXISTS update_resumes_updated_at ON public.resumes;
CREATE TRIGGER update_resumes_updated_at
  BEFORE UPDATE ON public.resumes FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- ============================================================
-- PHASE 3 — Tailoring Sessions
-- ============================================================

CREATE TABLE IF NOT EXISTS public.tailoring_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE NOT NULL,
  job_title TEXT DEFAULT '',
  job_company TEXT DEFAULT '',
  job_url TEXT DEFAULT '',
  job_description TEXT NOT NULL DEFAULT '',
  ats_score INTEGER DEFAULT 0,
  keyword_matches JSONB DEFAULT '[]'::jsonb,
  missing_keywords JSONB DEFAULT '[]'::jsonb,
  missing_skills JSONB DEFAULT '[]'::jsonb,
  tailored_summary TEXT DEFAULT '',
  tailored_experience JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'analyzing', 'analyzed', 'tailored', 'applied')),
  applied_to_resume BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tailoring_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own tailoring sessions" ON public.tailoring_sessions;
DROP POLICY IF EXISTS "Users can create own tailoring sessions" ON public.tailoring_sessions;
DROP POLICY IF EXISTS "Users can update own tailoring sessions" ON public.tailoring_sessions;
DROP POLICY IF EXISTS "Users can delete own tailoring sessions" ON public.tailoring_sessions;
CREATE POLICY "Users can view own tailoring sessions"   ON public.tailoring_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own tailoring sessions" ON public.tailoring_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tailoring sessions" ON public.tailoring_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tailoring sessions" ON public.tailoring_sessions FOR DELETE USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS update_tailoring_sessions_updated_at ON public.tailoring_sessions;
CREATE TRIGGER update_tailoring_sessions_updated_at
  BEFORE UPDATE ON public.tailoring_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_tailoring_sessions_user_id ON public.tailoring_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_tailoring_sessions_resume_id ON public.tailoring_sessions(resume_id);
CREATE INDEX IF NOT EXISTS idx_tailoring_sessions_status ON public.tailoring_sessions(status);

-- ============================================================
-- PHASE 4 — Jobs (schema matches job-actions.ts exactly)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  company_logo TEXT DEFAULT '',
  company_website TEXT DEFAULT '',
  location TEXT DEFAULT '',
  is_remote BOOLEAN DEFAULT FALSE,
  job_type TEXT DEFAULT 'full_time',
  description TEXT DEFAULT '',
  apply_url TEXT DEFAULT '',
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT DEFAULT 'USD',
  salary_period TEXT DEFAULT 'yearly',
  posted_at TIMESTAMPTZ DEFAULT NOW(),
  source TEXT DEFAULT 'jsearch',
  required_skills JSONB DEFAULT '[]'::jsonb,
  external_id TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can view jobs" ON public.jobs;
DROP POLICY IF EXISTS "Authenticated users can insert jobs" ON public.jobs;
DROP POLICY IF EXISTS "Authenticated users can update jobs" ON public.jobs;
CREATE POLICY "Authenticated users can view jobs"   ON public.jobs FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can insert jobs" ON public.jobs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update jobs" ON public.jobs FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_id TEXT REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'saved' CHECK (status IN ('saved', 'applied', 'interviewing', 'offered', 'rejected', 'withdrawn')),
  notes TEXT DEFAULT '',
  applied_at TIMESTAMPTZ,
  resume_id UUID,
  tailoring_session_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own saved jobs" ON public.saved_jobs;
DROP POLICY IF EXISTS "Users can save jobs" ON public.saved_jobs;
DROP POLICY IF EXISTS "Users can update own saved jobs" ON public.saved_jobs;
DROP POLICY IF EXISTS "Users can delete own saved jobs" ON public.saved_jobs;
CREATE POLICY "Users can view own saved jobs"   ON public.saved_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can save jobs"             ON public.saved_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own saved jobs" ON public.saved_jobs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved jobs" ON public.saved_jobs FOR DELETE USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS update_jobs_updated_at ON public.jobs;
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_saved_jobs_updated_at ON public.saved_jobs;
CREATE TRIGGER update_saved_jobs_updated_at
  BEFORE UPDATE ON public.saved_jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_saved_jobs_user_id ON public.saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_status ON public.saved_jobs(status);

-- ============================================================
-- PHASE 5 — Application Tracker
-- ============================================================

CREATE TABLE IF NOT EXISTS public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_id UUID,
  job_title TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  company_website TEXT DEFAULT '',
  job_url TEXT DEFAULT '',
  apply_url TEXT DEFAULT '',
  location TEXT DEFAULT '',
  is_remote BOOLEAN DEFAULT FALSE,
  job_type TEXT DEFAULT 'full_time',
  salary_min INTEGER DEFAULT 0,
  salary_max INTEGER DEFAULT 0,
  salary_currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'saved' CHECK (status IN ('saved', 'applied', 'interview', 'offer', 'rejected', 'archived')),
  applied_at TIMESTAMPTZ,
  deadline_at TIMESTAMPTZ,
  resume_id UUID,
  tailoring_session_id UUID,
  ai_prep_generated BOOLEAN DEFAULT FALSE,
  ai_interview_questions JSONB DEFAULT '[]'::jsonb,
  ai_salary_tips TEXT DEFAULT '',
  ai_career_suggestions TEXT DEFAULT '',
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  reminder_at TIMESTAMPTZ,
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can create own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can update own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can delete own applications" ON public.applications;
CREATE POLICY "Users can view own applications"   ON public.applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own applications" ON public.applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own applications" ON public.applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own applications" ON public.applications FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.application_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  note_type TEXT DEFAULT 'general' CHECK (note_type IN ('general', 'interview', 'follow_up', 'offer', 'rejection')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.application_notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own notes" ON public.application_notes;
DROP POLICY IF EXISTS "Users can create own notes" ON public.application_notes;
DROP POLICY IF EXISTS "Users can update own notes" ON public.application_notes;
DROP POLICY IF EXISTS "Users can delete own notes" ON public.application_notes;
CREATE POLICY "Users can view own notes"   ON public.application_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own notes" ON public.application_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON public.application_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON public.application_notes FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.interviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  interview_type TEXT DEFAULT 'phone' CHECK (interview_type IN ('phone', 'video', 'onsite', 'technical', 'behavioral', 'panel', 'final')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  location TEXT DEFAULT '',
  meeting_url TEXT DEFAULT '',
  interviewer_name TEXT DEFAULT '',
  interviewer_title TEXT DEFAULT '',
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  outcome TEXT DEFAULT '' CHECK (outcome IN ('', 'passed', 'failed', 'pending')),
  feedback TEXT DEFAULT '',
  prep_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own interviews" ON public.interviews;
DROP POLICY IF EXISTS "Users can create own interviews" ON public.interviews;
DROP POLICY IF EXISTS "Users can update own interviews" ON public.interviews;
DROP POLICY IF EXISTS "Users can delete own interviews" ON public.interviews;
CREATE POLICY "Users can view own interviews"   ON public.interviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own interviews" ON public.interviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own interviews" ON public.interviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own interviews" ON public.interviews FOR DELETE USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS update_applications_updated_at ON public.applications;
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_application_notes_updated_at ON public.application_notes;
CREATE TRIGGER update_application_notes_updated_at
  BEFORE UPDATE ON public.application_notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_interviews_updated_at ON public.interviews;
CREATE TRIGGER update_interviews_updated_at
  BEFORE UPDATE ON public.interviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_applied_at ON public.applications(applied_at DESC);
CREATE INDEX IF NOT EXISTS idx_application_notes_application_id ON public.application_notes(application_id);
CREATE INDEX IF NOT EXISTS idx_interviews_application_id ON public.interviews(application_id);
CREATE INDEX IF NOT EXISTS idx_interviews_scheduled_at ON public.interviews(scheduled_at);

-- ============================================================
-- PHASE 6 — Stripe Subscriptions
-- Note: uses "plan" column (not plan_id) to match stripe-actions.ts
-- ============================================================

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update own subscription" ON public.subscriptions;
CREATE POLICY "Users can view own subscription"   ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscription" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscription" ON public.subscriptions FOR UPDATE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  feature TEXT NOT NULL CHECK (feature IN ('tailoring', 'saved_jobs', 'ai_prep', 'export_pdf', 'export_docx')),
  used_at TIMESTAMPTZ DEFAULT NOW(),
  month_bucket TEXT
);

-- Populate month_bucket automatically on insert
CREATE OR REPLACE FUNCTION public.set_usage_log_month_bucket()
RETURNS TRIGGER AS $$
BEGIN
  NEW.month_bucket := TO_CHAR(COALESCE(NEW.used_at, NOW()), 'YYYY-MM');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_usage_log_month_bucket ON public.usage_logs;
CREATE TRIGGER set_usage_log_month_bucket
  BEFORE INSERT ON public.usage_logs
  FOR EACH ROW EXECUTE FUNCTION public.set_usage_log_month_bucket();

ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own usage" ON public.usage_logs;
DROP POLICY IF EXISTS "Users can insert own usage" ON public.usage_logs;
CREATE POLICY "Users can view own usage"   ON public.usage_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own usage" ON public.usage_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON public.subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_sub ON public.subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_feature_month ON public.usage_logs(user_id, feature, month_bucket);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON public.usage_logs(user_id);

-- Auto-create free subscription on user signup
CREATE OR REPLACE FUNCTION public.create_free_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, plan, status)
  VALUES (NEW.id, 'free', 'active')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;
CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_free_subscription();

-- ============================================================
-- PHASE 7 — Referrals
-- ============================================================

CREATE TABLE IF NOT EXISTS public.referral_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own referral code" ON public.referral_codes;
DROP POLICY IF EXISTS "Users can insert own referral code" ON public.referral_codes;
DROP POLICY IF EXISTS "Users can update own referral code" ON public.referral_codes;
CREATE POLICY "Users can view own referral code"   ON public.referral_codes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own referral code" ON public.referral_codes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own referral code" ON public.referral_codes FOR UPDATE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referred_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referred_email TEXT NOT NULL,
  code TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'signed_up', 'upgraded', 'credited')),
  credits_granted INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own referrals" ON public.referrals;
DROP POLICY IF EXISTS "Users can insert own referrals" ON public.referrals;
DROP POLICY IF EXISTS "Users can update own referrals" ON public.referrals;
CREATE POLICY "Users can view own referrals"   ON public.referrals FOR SELECT USING (auth.uid() = referrer_id);
CREATE POLICY "Users can insert own referrals" ON public.referrals FOR INSERT WITH CHECK (auth.uid() = referrer_id);
CREATE POLICY "Users can update own referrals" ON public.referrals FOR UPDATE USING (auth.uid() = referrer_id);

CREATE INDEX IF NOT EXISTS idx_referral_codes_user_id ON public.referral_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON public.referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_email ON public.referrals(referred_email);

DROP TRIGGER IF EXISTS update_referrals_updated_at ON public.referrals;
CREATE TRIGGER update_referrals_updated_at
  BEFORE UPDATE ON public.referrals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- PHASE 8 — Email Preferences
-- ============================================================

CREATE TABLE IF NOT EXISTS public.email_preferences (
  user_id        UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  weekly_digest  BOOLEAN NOT NULL DEFAULT TRUE,
  job_alerts     BOOLEAN NOT NULL DEFAULT TRUE,
  product_updates BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.email_preferences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own email preferences" ON public.email_preferences;
DROP POLICY IF EXISTS "Users can update own email preferences" ON public.email_preferences;
DROP POLICY IF EXISTS "Users can insert own email preferences" ON public.email_preferences;
CREATE POLICY "Users can view own email preferences"
  ON public.email_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own email preferences"
  ON public.email_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own email preferences"
  ON public.email_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.create_default_email_preferences()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.email_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_email_prefs ON auth.users;
CREATE TRIGGER on_auth_user_created_email_prefs
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_default_email_preferences();

DROP TRIGGER IF EXISTS email_preferences_updated_at ON public.email_preferences;
CREATE TRIGGER email_preferences_updated_at
  BEFORE UPDATE ON public.email_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- PHASE 9 — Referral Credits (usage_logs & referrals enhancements)
-- ============================================================

-- Enhance usage_logs with credits columns
ALTER TABLE public.usage_logs
  ADD COLUMN IF NOT EXISTS credits_granted INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Enhance referrals table with additional columns
ALTER TABLE public.referrals
  ADD COLUMN IF NOT EXISTS referred_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS referral_code TEXT;

CREATE INDEX IF NOT EXISTS idx_referrals_referred_user ON public.referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON public.referrals(code);

-- ============================================================
-- PHASE 10 — Job Alerts
-- ============================================================

CREATE TABLE IF NOT EXISTS public.job_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  job_types TEXT[] NOT NULL DEFAULT '{}',
  remote_only BOOLEAN NOT NULL DEFAULT FALSE,
  frequency TEXT NOT NULL DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_alerts_user_id ON public.job_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_job_alerts_active ON public.job_alerts(is_active, frequency, last_sent_at) WHERE is_active = TRUE;

ALTER TABLE public.job_alerts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own job alerts" ON public.job_alerts;
DROP POLICY IF EXISTS "Users can create job alerts" ON public.job_alerts;
DROP POLICY IF EXISTS "Users can update own job alerts" ON public.job_alerts;
DROP POLICY IF EXISTS "Users can delete own job alerts" ON public.job_alerts;
CREATE POLICY "Users can view own job alerts"   ON public.job_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create job alerts"     ON public.job_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own job alerts" ON public.job_alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own job alerts" ON public.job_alerts FOR DELETE USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS job_alerts_updated_at ON public.job_alerts;
CREATE TRIGGER job_alerts_updated_at
  BEFORE UPDATE ON public.job_alerts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- PHASE 11 — Analytics Events
-- ============================================================

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event      TEXT NOT NULL,
  properties JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS analytics_events_user_id_idx    ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS analytics_events_event_idx      ON public.analytics_events(event);
CREATE INDEX IF NOT EXISTS analytics_events_created_at_idx ON public.analytics_events(created_at DESC);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_insert_analytics" ON public.analytics_events;
DROP POLICY IF EXISTS "users_read_own_analytics" ON public.analytics_events;
DROP POLICY IF EXISTS "service_role_read_analytics" ON public.analytics_events;
CREATE POLICY "service_role_insert_analytics" ON public.analytics_events FOR INSERT TO service_role WITH CHECK (TRUE);
CREATE POLICY "users_read_own_analytics"      ON public.analytics_events FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "service_role_read_analytics"   ON public.analytics_events FOR SELECT TO service_role USING (TRUE);

-- ============================================================
-- PHASE 12 — Churn Reduction
-- ============================================================

CREATE TABLE IF NOT EXISTS public.cancel_surveys (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason     TEXT NOT NULL,
  feedback   TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS cancel_surveys_user_id_idx ON public.cancel_surveys(user_id);

ALTER TABLE public.cancel_surveys ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_manage_cancel_surveys" ON public.cancel_surveys;
DROP POLICY IF EXISTS "users_insert_own_cancel_survey" ON public.cancel_surveys;
CREATE POLICY "service_role_manage_cancel_surveys" ON public.cancel_surveys FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "users_insert_own_cancel_survey"     ON public.cancel_surveys FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Add pause/cancel columns to subscriptions (idempotent)
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS paused_at  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS resumes_at TIMESTAMPTZ;
-- cancel_at_period_end already exists from Phase 6

-- ============================================================
-- PHASE 13 — Teams & Enterprise Plans
-- ============================================================

CREATE TABLE IF NOT EXISTS public.teams (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                   TEXT NOT NULL,
  owner_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan                   TEXT NOT NULL DEFAULT 'team' CHECK (plan IN ('team', 'enterprise')),
  seat_count             INTEGER NOT NULL DEFAULT 3,
  stripe_subscription_id TEXT,
  stripe_customer_id     TEXT,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS teams_owner_id_idx ON public.teams(owner_id);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "team_members_read_team" ON public.teams;
DROP POLICY IF EXISTS "service_role_manage_teams" ON public.teams;
CREATE POLICY "team_members_read_team" ON public.teams FOR SELECT TO authenticated
  USING (id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid() AND accepted_at IS NOT NULL));
CREATE POLICY "service_role_manage_teams" ON public.teams FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

CREATE TABLE IF NOT EXISTS public.team_members (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id        UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  role           TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  invited_email  TEXT,
  accepted_at    TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS team_members_team_id_idx ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS team_members_user_id_idx ON public.team_members(user_id);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "team_members_read_own_team" ON public.team_members;
DROP POLICY IF EXISTS "service_role_manage_team_members" ON public.team_members;
CREATE POLICY "team_members_read_own_team" ON public.team_members FOR SELECT TO authenticated
  USING (team_id IN (SELECT team_id FROM public.team_members tm2 WHERE tm2.user_id = auth.uid() AND tm2.accepted_at IS NOT NULL));
CREATE POLICY "service_role_manage_team_members" ON public.team_members FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP TRIGGER IF EXISTS teams_updated_at ON public.teams;
CREATE TRIGGER teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- PHASE 14 — AI Response Cache
-- ============================================================

CREATE TABLE IF NOT EXISTS public.ai_cache (
  hash        TEXT PRIMARY KEY,
  cache_type  TEXT NOT NULL CHECK (cache_type IN ('tailoring', 'interview_prep', 'resume_parse')),
  response    TEXT NOT NULL,
  tokens_used INTEGER NOT NULL DEFAULT 0,
  hit_count   INTEGER NOT NULL DEFAULT 0,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ai_cache_type_idx       ON public.ai_cache(cache_type);
CREATE INDEX IF NOT EXISTS ai_cache_expires_at_idx ON public.ai_cache(expires_at);

ALTER TABLE public.ai_cache ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_manage_ai_cache" ON public.ai_cache;
CREATE POLICY "service_role_manage_ai_cache" ON public.ai_cache FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

-- ============================================================
-- PHASE 15 — PDF Cache
-- ============================================================

CREATE TABLE IF NOT EXISTS public.pdf_cache (
  hash         TEXT PRIMARY KEY,
  resume_id    UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  template_id  TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  expires_at   TIMESTAMPTZ NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS pdf_cache_resume_id_idx  ON public.pdf_cache(resume_id);
CREATE INDEX IF NOT EXISTS pdf_cache_expires_at_idx ON public.pdf_cache(expires_at);

ALTER TABLE public.pdf_cache ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_manage_pdf_cache" ON public.pdf_cache;
CREATE POLICY "service_role_manage_pdf_cache" ON public.pdf_cache FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

-- NOTE: Create the storage bucket in Supabase Dashboard > Storage:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('resume-pdfs', 'resume-pdfs', false);

-- ============================================================
-- PHASE 16 — Affiliate Program
-- ============================================================

CREATE TABLE IF NOT EXISTS public.affiliates (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code                  TEXT NOT NULL UNIQUE,
  status                TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  commission_rate       INTEGER NOT NULL DEFAULT 30,
  total_clicks          INTEGER NOT NULL DEFAULT 0,
  total_conversions     INTEGER NOT NULL DEFAULT 0,
  total_earnings_cents  INTEGER NOT NULL DEFAULT 0,
  paid_out_cents        INTEGER NOT NULL DEFAULT 0,
  paypal_email          TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  ip_address   TEXT,
  user_agent   TEXT,
  referrer     TEXT,
  landing_page TEXT,
  converted    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.affiliate_conversions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id     UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  click_id         UUID REFERENCES public.affiliate_clicks(id) ON DELETE SET NULL,
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id          TEXT NOT NULL,
  amount_cents     INTEGER NOT NULL,
  commission_cents INTEGER NOT NULL,
  status           TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid')),
  stripe_charge_id TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS affiliates_user_id_idx                ON public.affiliates(user_id);
CREATE INDEX IF NOT EXISTS affiliates_code_idx                   ON public.affiliates(code);
CREATE INDEX IF NOT EXISTS affiliate_clicks_affiliate_id_idx     ON public.affiliate_clicks(affiliate_id);
CREATE INDEX IF NOT EXISTS affiliate_clicks_created_at_idx       ON public.affiliate_clicks(created_at DESC);
CREATE INDEX IF NOT EXISTS affiliate_conversions_affiliate_id_idx ON public.affiliate_conversions(affiliate_id);
CREATE INDEX IF NOT EXISTS affiliate_conversions_user_id_idx     ON public.affiliate_conversions(user_id);

ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_conversions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "affiliates_select_own" ON public.affiliates;
DROP POLICY IF EXISTS "affiliates_insert_own" ON public.affiliates;
DROP POLICY IF EXISTS "affiliates_update_own" ON public.affiliates;
DROP POLICY IF EXISTS "affiliates_service_all" ON public.affiliates;
CREATE POLICY "affiliates_select_own" ON public.affiliates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "affiliates_insert_own" ON public.affiliates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "affiliates_update_own" ON public.affiliates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "affiliates_service_all" ON public.affiliates FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "affiliate_clicks_select_own" ON public.affiliate_clicks;
DROP POLICY IF EXISTS "affiliate_clicks_service_all" ON public.affiliate_clicks;
CREATE POLICY "affiliate_clicks_select_own" ON public.affiliate_clicks FOR SELECT
  USING (affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid()));
CREATE POLICY "affiliate_clicks_service_all" ON public.affiliate_clicks FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "affiliate_conversions_select_own" ON public.affiliate_conversions;
DROP POLICY IF EXISTS "affiliate_conversions_service_all" ON public.affiliate_conversions;
CREATE POLICY "affiliate_conversions_select_own" ON public.affiliate_conversions FOR SELECT
  USING (affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid()));
CREATE POLICY "affiliate_conversions_service_all" ON public.affiliate_conversions FOR ALL USING (auth.role() = 'service_role');

DROP TRIGGER IF EXISTS affiliates_updated_at ON public.affiliates;
CREATE TRIGGER affiliates_updated_at
  BEFORE UPDATE ON public.affiliates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.increment_affiliate_clicks(p_affiliate_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.affiliates
  SET total_clicks = total_clicks + 1, updated_at = NOW()
  WHERE id = p_affiliate_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.update_affiliate_totals(p_affiliate_id UUID, p_commission_cents INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE public.affiliates
  SET total_conversions    = total_conversions + 1,
      total_earnings_cents = total_earnings_cents + p_commission_cents,
      updated_at           = NOW()
  WHERE id = p_affiliate_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- PHASE 17 — Public API Keys
-- ============================================================

CREATE TABLE IF NOT EXISTS public.api_keys (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  key_prefix     TEXT NOT NULL,
  key_hash       TEXT NOT NULL UNIQUE,
  scopes         TEXT[] NOT NULL DEFAULT ARRAY['tailor', 'jobs'],
  last_used_at   TIMESTAMPTZ,
  requests_today INTEGER NOT NULL DEFAULT 0,
  requests_total INTEGER NOT NULL DEFAULT 0,
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at     TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS api_keys_user_id_idx  ON public.api_keys(user_id);
CREATE INDEX IF NOT EXISTS api_keys_key_hash_idx ON public.api_keys(key_hash);
CREATE INDEX IF NOT EXISTS api_keys_is_active_idx ON public.api_keys(is_active);

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "api_keys_select_own" ON public.api_keys;
DROP POLICY IF EXISTS "api_keys_insert_own" ON public.api_keys;
DROP POLICY IF EXISTS "api_keys_update_own" ON public.api_keys;
DROP POLICY IF EXISTS "api_keys_service_all" ON public.api_keys;
CREATE POLICY "api_keys_select_own"  ON public.api_keys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "api_keys_insert_own"  ON public.api_keys FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "api_keys_update_own"  ON public.api_keys FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "api_keys_service_all" ON public.api_keys FOR ALL USING (auth.role() = 'service_role');

CREATE OR REPLACE FUNCTION public.increment_api_key_requests(p_key_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.api_keys SET requests_total = requests_total + 1 WHERE id = p_key_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.reset_api_key_daily_counters()
RETURNS VOID AS $$
BEGIN
  UPDATE public.api_keys SET requests_today = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- END OF SCHEMA
-- All 17 phases complete. Run this file once in Supabase SQL Editor.
-- ============================================================