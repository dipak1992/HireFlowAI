-- ============================================================
-- Backfill: Create missing rows for users who signed up
-- before the schema was run.
-- Run this ONCE in Supabase SQL Editor.
-- ============================================================

-- 1. Create missing profiles rows
INSERT INTO public.profiles (id, email, full_name, avatar_url)
SELECT
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', ''),
  COALESCE(au.raw_user_meta_data->>'avatar_url', au.raw_user_meta_data->>'picture', '')
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = au.id
);

-- 2. Create missing subscriptions rows (free plan)
INSERT INTO public.subscriptions (user_id, plan, status)
SELECT au.id, 'free', 'active'
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.subscriptions s WHERE s.user_id = au.id
);

-- 3. Create missing email_preferences rows
INSERT INTO public.email_preferences (user_id)
SELECT au.id
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.email_preferences ep WHERE ep.user_id = au.id
)
ON CONFLICT (user_id) DO NOTHING;

-- Done. Existing users now have profile, subscription, and email_preferences rows.
