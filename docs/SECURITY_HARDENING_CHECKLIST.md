# TCA security hardening: deployment checklist

This repository change adds baseline HTTP security headers to both the public and admin Vercel applications. It does not by itself complete the security programme.

## Supabase project settings that require dashboard access

- Set the production Site URL to the canonical TCA domain.
- Allow only the exact production callback/reset URLs and explicitly required preview URLs. Remove obsolete Vercel domains.
- Review Supabase Auth email confirmation, password policy, MFA policy and Auth rate limits. Do not impose an MFA database policy on ordinary member inserts unless the product deliberately requires MFA.
- Configure CAPTCHA for public sign-up and other abuse-prone Auth endpoints where supported.
- Keep service-role keys only in server-side secrets. Never expose them through VITE_ variables or browser bundles.
- Review RLS policies table by table, including SELECT, INSERT, UPDATE and DELETE. Test as anonymous, member A, member B and active admin.

## Rate limiting

The browser must not be treated as a trusted rate limiter. Apply limits at the edge/server boundary or through a trusted backend for registration, login-related custom endpoints, contact submissions and other expensive actions. Supabase Auth has its own configurable rate limits; review those separately. Do not rely on a client-side counter.

## Input validation, SQL injection and XSS

- Keep using Supabase query-builder parameters; never concatenate user input into raw SQL.
- Validate and constrain input on the server or database boundary, not only in React forms.
- Render user content as text. Avoid dangerouslySetInnerHTML; if rich HTML is ever required, sanitize it with a maintained allowlist sanitizer.
- Validate uploaded file type, size and ownership. Do not trust filename extensions or browser MIME types.

## Database performance

The companion SQL migration adds indexes for the profile and progress-history access patterns visible in the application. Review the live schema and query plans before applying it. Indexes improve reads but add write and storage overhead.

## Logging and monitoring

- Enable and review Supabase Auth, Postgres and Edge Function logs.
- Monitor Vercel runtime/build logs and configure an error-monitoring service with alerting.
- Do not log passwords, access tokens, reset links, service-role keys or unnecessary personal data.
- Retain admin security events with a documented retention period and restricted access.

## Backups and deployment recovery

- Confirm Supabase backup/PITR availability for the project's plan and test a restore to a separate project.
- Keep Vercel production deployments immutable; verify the previous known-good deployment can be promoted/rolled back.
- Use preview deployments and build checks before production promotion.
- Database migrations need their own rollback or forward-fix plan. A Vercel rollback does not reverse database changes.
- Blue-green releases require two compatible application deployments and a controlled traffic switch. Do not claim blue-green recovery until this has been exercised.

## Verification still required

The repository alone cannot prove the live Supabase Auth settings, RLS state, database indexes, edge rate limits, backup status, load capacity or Vercel production/rollback configuration. Verify those in the provider dashboards and run tests against a staging project before calling TCA production-hardened.
