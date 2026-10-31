-- Remove only the three approved AAL2 SELECT restrictions and grant
-- active-admin SELECT access on the same three review tables.
-- Existing member ownership policies and all other RLS policies are preserved.
-- Idempotent: safe if the corresponding SQL was already run manually.

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

DROP POLICY IF EXISTS
  "Active admins can view all achievement reviews"
  ON public.achievement_reviews;

DROP POLICY IF EXISTS
  "Active admins can view all awards"
  ON public.awards;

DROP POLICY IF EXISTS
  "Active admins can view all quarterly reviews"
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
