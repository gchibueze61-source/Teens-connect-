-- Enforce upload restrictions at the Supabase Storage bucket level.
-- This migration changes only file size and MIME-type constraints.
-- It intentionally preserves each bucket's existing public/private setting
-- and all existing Storage RLS policies.

BEGIN;

DO $$
DECLARE
  missing_buckets text;
BEGIN
  SELECT string_agg(expected.id, ', ')
  INTO missing_buckets
  FROM unnest(ARRAY[
    'blog-images',
    'program-images',
    'gallery-images',
    'event-fliers',
    'board-member-photos'
  ]) AS expected(id)
  LEFT JOIN storage.buckets AS actual
    ON actual.id = expected.id
  WHERE actual.id IS NULL;

  IF missing_buckets IS NOT NULL THEN
    RAISE EXCEPTION
      'Storage hardening stopped. These expected buckets were not found: %',
      missing_buckets;
  END IF;
END;
$$;

UPDATE storage.buckets
SET
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp'
  ]::text[]
WHERE id IN (
  'blog-images',
  'program-images',
  'gallery-images',
  'event-fliers',
  'board-member-photos'
);

COMMIT;

-- Verification: expect five rows, each with a 5 MB limit and
-- the three allowed image MIME types. The public column is shown
-- so existing bucket visibility can be checked and confirmed unchanged.
SELECT
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE id IN (
  'blog-images',
  'program-images',
  'gallery-images',
  'event-fliers',
  'board-member-photos'
)
ORDER BY id;
