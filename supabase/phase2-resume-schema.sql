-- HireFlow AI - Phase 2: Resume Studio Schema
-- Run this in your Supabase SQL Editor after Phase 1 schema

-- ============================================
-- RESUMES TABLE
-- ============================================
create table public.resumes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null default 'Untitled Resume',
  template text not null default 'ats' check (template in ('ats', 'professional', 'fast_apply')),
  source text check (source in ('scratch', 'upload', 'linkedin')) default 'scratch',
  is_primary boolean default false,

  -- Contact Info
  contact_name text,
  contact_email text,
  contact_phone text,
  contact_location text,
  contact_website text,
  contact_linkedin text,

  -- Summary
  summary text,

  -- Structured Data (JSON)
  experience jsonb default '[]'::jsonb,
  education jsonb default '[]'::jsonb,
  skills jsonb default '[]'::jsonb,
  certifications jsonb default '[]'::jsonb,
  projects jsonb default '[]'::jsonb,

  -- Metadata
  ats_score integer,
  last_exported_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.resumes enable row level security;

-- Policies
create policy "Users can view own resumes"
  on public.resumes for select
  using (auth.uid() = user_id);

create policy "Users can insert own resumes"
  on public.resumes for insert
  with check (auth.uid() = user_id);

create policy "Users can update own resumes"
  on public.resumes for update
  using (auth.uid() = user_id);

create policy "Users can delete own resumes"
  on public.resumes for delete
  using (auth.uid() = user_id);

-- ============================================
-- RESUME VERSIONS TABLE
-- ============================================
create table public.resume_versions (
  id uuid default uuid_generate_v4() primary key,
  resume_id uuid references public.resumes(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  version_number integer not null default 1,
  version_name text,
  snapshot jsonb not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.resume_versions enable row level security;

-- Policies
create policy "Users can view own resume versions"
  on public.resume_versions for select
  using (auth.uid() = user_id);

create policy "Users can insert own resume versions"
  on public.resume_versions for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own resume versions"
  on public.resume_versions for delete
  using (auth.uid() = user_id);

-- ============================================
-- INDEXES
-- ============================================
create index idx_resumes_user_id on public.resumes(user_id);
create index idx_resume_versions_resume_id on public.resume_versions(resume_id);
create index idx_resume_versions_user_id on public.resume_versions(user_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
create trigger update_resumes_updated_at
  before update on public.resumes
  for each row execute procedure public.update_updated_at_column();
