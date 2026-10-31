-- Restore intended member ownership reads and active-admin review access.
-- This migration is intentionally limited to the three review tables.
-- Existing member SELECT policies are preserved.
-- Apply through the normal Supabase migration process after reviewing the live schema.

BEGIN;

DROP POLICY IF EXISTS
  "Require MFA for achievement reviews"
  ON public.achievement_reviews;

DROP POLICY IF EXISTS
  "Require MFA for awards"
  ON public.awards;

DROP POLICY IF EXISTS
  "Require MFA for quarterly reviews"
  ON public.quarterly_reviews;

CREATE POLICY "Active admins can view all achievement reviews"
ON public.achievement_reviews
FOR SELECT
TO authenticated
USING (public.is_active_admin());

CREATE POLICY "Active admins can view all awards"
ON public.awards
FOR SELECT
TO authenticated
USING (public.is_active_admin());

CREATE POLICY "Active admins can view all quarterly reviews"
ON public.quarterly_reviews
FOR SELECT
TO authenticated
USING (public.is_active_admin());

COMMIT;
