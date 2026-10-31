# Administrator password-recovery configuration

The admin application now builds its password-reset redirect from
`VITE_ADMIN_APP_URL` when that variable is configured. The value must be
the origin of the deployed **admin application**, not the public TCA website.

## Vercel

In the Vercel project that deploys the admin application, add:

- Variable: `VITE_ADMIN_APP_URL`
- Value: the exact HTTPS origin assigned to the admin application
- Environments: Production, and Preview only if password recovery is tested on previews

Example shape (replace with the actual admin origin):

```text
VITE_ADMIN_APP_URL=https://<actual-admin-origin>
```

Do not include a trailing path. The application appends `/reset-password`.

## Supabase Auth URL Configuration

In Supabase Dashboard, open Authentication → URL Configuration.

Add this exact redirect URL:

```text
https://<actual-admin-origin>/reset-password
```

Keep the canonical Site URL set to the actual canonical site already in use.
Do not add a wildcard for all domains. Add a preview redirect only when a
specific preview deployment needs password-recovery testing, and remove it
when no longer needed.

## Verification

1. Redeploy the admin Vercel project after setting the environment variable.
2. Request a password reset from the admin login page.
3. Confirm the email link returns to the admin application's
   `/reset-password` route.
4. Confirm an expired or malformed link is rejected.
5. Confirm visiting `/reset-password` while signed in normally does not
   reveal the password-change form.
6. Complete a reset using a dedicated test administrator account and confirm
   the new password works.
7. Confirm the admin login and AdminGuard behavior remain unchanged.

The actual admin origin must be copied from the admin Vercel project's Domains
settings. It is intentionally not guessed in this document.
