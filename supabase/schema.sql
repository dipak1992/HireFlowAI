-- HireFlow AI - Phase 1 Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  phone text,
  location text,
  bio text,
  headline text,
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ============================================
-- PREFERENCES TABLE
-- ============================================
create table public.preferences (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  goal text check (goal in ('need_work_fast', 'grow_career')),
  location text,
  desired_pay_min integer,
  desired_pay_max integer,
  pay_type text check (pay_type in ('hourly', 'salary')),
  job_category text,
  remote_preference text check (remote_preference in ('remote', 'hybrid', 'onsite', 'any')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.preferences enable row level security;

-- Policies
create policy "Users can view own preferences"
  on public.preferences for select
  using (auth.uid() = user_id);

create policy "Users can update own preferences"
  on public.preferences for update
  using (auth.uid() = user_id);

create policy "Users can insert own preferences"
  on public.preferences for insert
  with check (auth.uid() = user_id);

-- ============================================
-- AUTH PROVIDERS TABLE
-- ============================================
create table public.auth_providers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  provider text not null check (provider in ('google', 'linkedin', 'email')),
  provider_user_id text,
  provider_email text,
  connected_at timestamptz default now()
);

-- Enable RLS
alter table public.auth_providers enable row level security;

-- Policies
create policy "Users can view own auth providers"
  on public.auth_providers for select
  using (auth.uid() = user_id);

create policy "Users can insert own auth providers"
  on public.auth_providers for insert
  with check (auth.uid() = user_id);

-- ============================================
-- LINKEDIN IMPORTS TABLE
-- ============================================
create table public.linkedin_imports (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  consent_given boolean default false,
  consent_date timestamptz,
  profile_data jsonb,
  import_status text check (import_status in ('pending', 'imported', 'skipped', 'failed')) default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.linkedin_imports enable row level security;

-- Policies
create policy "Users can view own linkedin imports"
  on public.linkedin_imports for select
  using (auth.uid() = user_id);

create policy "Users can update own linkedin imports"
  on public.linkedin_imports for update
  using (auth.uid() = user_id);

create policy "Users can insert own linkedin imports"
  on public.linkedin_imports for insert
  with check (auth.uid() = user_id);

-- ============================================
-- FUNCTION: Auto-create profile on signup
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- INDEXES
-- ============================================
create index idx_preferences_user_id on public.preferences(user_id);
create index idx_auth_providers_user_id on public.auth_providers(user_id);
create index idx_linkedin_imports_user_id on public.linkedin_imports(user_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at_column();

create trigger update_preferences_updated_at
  before update on public.preferences
  for each row execute procedure public.update_updated_at_column();

create trigger update_linkedin_imports_updated_at
  before update on public.linkedin_imports
  for each row execute procedure public.update_updated_at_column();
