-- Teens Connect Africa
-- Admin security foundation
-- Run this in Supabase SQL Editor.

create or replace function public.is_active_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where auth_user_id = auth.uid()
      and role = 'admin'
      and status = 'active'
  );
$$;

revoke all on function public.is_active_admin() from public;
grant execute on function public.is_active_admin() to authenticated;

create table if not exists public.admin_security_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  actor_user_id uuid null,
  actor_email text null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_security_events_created_at_idx
  on public.admin_security_events (created_at desc);

create index if not exists admin_security_events_actor_user_id_idx
  on public.admin_security_events (actor_user_id);

alter table public.admin_security_events enable row level security;

drop policy if exists "Active admins can view security events"
on public.admin_security_events;

create policy "Active admins can view security events"
on public.admin_security_events
for select
to authenticated
using (public.is_active_admin());

-- No INSERT/UPDATE/DELETE policy is intentionally created for normal
-- authenticated users. The server-side Edge Function uses the service
-- role to write security events.
