# Administrator password-recovery configuration

The confirmed admin portal URL is:

```text
https://teens-connect-admin1-git-admin-obizechinelo39-1243s-projects.vercel.app
```

The password-reset route is:

```text
https://teens-connect-admin1-git-admin-obizechinelo39-1243s-projects.vercel.app/reset-password
```

## Vercel

In the Vercel project `teens-connect-admin1`, add this environment variable:

- Variable: `VITE_ADMIN_APP_URL`
- Value: `https://teens-connect-admin1-git-admin-obizechinelo39-1243s-projects.vercel.app`
- Environments: enable the environment that serves this admin deployment (Preview for a branch deployment; Production too only if this same origin is used for Production).

Do not include `/admin/dashboard`, `/reset-password`, or a trailing slash in the variable value. The application appends `/reset-password`.

After saving the variable, redeploy the admin project so the Vite build receives it.

## Supabase Auth URL Configuration

In Supabase Dashboard, open Authentication → URL Configuration and add this exact entry to the Redirect URLs allowlist:

```text
https://teens-connect-admin1-git-admin-obizechinelo39-1243s-projects.vercel.app/reset-password
```

Keep the existing canonical Site URL unchanged. Do not add a wildcard for all Vercel domains.

## Verification

1. Confirm the admin deployment is available at the confirmed origin above.
2. Request a password reset from the admin login page.
3. Confirm the email link returns to the exact `/reset-password` route above.
4. Confirm an expired or malformed link is rejected.
5. Confirm visiting `/reset-password` while signed in normally does not reveal the password-change form.
6. Complete a reset using a dedicated test administrator account and confirm the new password works.
7. Confirm the admin login and AdminGuard behavior remain unchanged.

The code changes have been merged, and both Vercel checks for the merge commit passed. Vercel environment variables and Supabase Auth URL allowlists still have to be configured in their respective dashboards; merging this document does not change those dashboard settings.
