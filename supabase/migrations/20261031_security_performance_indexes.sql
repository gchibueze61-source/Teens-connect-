-- TCA database performance indexes
-- Review against the live schema before applying in Supabase SQL Editor.
-- These indexes support the profile ownership lookups and member/admin
-- progress-history queries used by the application.

CREATE INDEX IF NOT EXISTS profiles_auth_user_id_idx
  ON public.profiles (auth_user_id);

CREATE INDEX IF NOT EXISTS teen_growth_records_profile_created_idx
  ON public.teen_growth_records (profile_id, created_at DESC);

CREATE INDEX IF NOT EXISTS achievements_profile_submitted_idx
  ON public.achievements (profile_id, submitted_at DESC);

CREATE INDEX IF NOT EXISTS quarterly_reviews_profile_period_idx
  ON public.quarterly_reviews (profile_id, year DESC, quarter DESC);

CREATE INDEX IF NOT EXISTS awards_profile_award_date_idx
  ON public.awards (profile_id, award_date DESC);
