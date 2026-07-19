-- TriPyramids database schema.
--
-- NOTE: This SQL has ALREADY been executed against the live Supabase project and
-- verified (both tables exist, RLS is enabled, the three policies below are
-- active). It is kept here for documentation and version control only — do NOT
-- re-run it as a pending setup step.

create extension if not exists pgcrypto;

create table trips (
  id uuid primary key default gen_random_uuid(),
  title_ar text not null,
  title_en text not null,
  description_ar text,
  description_en text,
  location text,
  price numeric,
  duration_days int,
  image_url text,
  created_at timestamptz default now()
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete set null,
  name text not null,
  email text,
  rating int check (rating >= 1 and rating <= 5),
  comment text not null,
  status text default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz default now()
);

alter table trips enable row level security;
alter table reviews enable row level security;

create policy "public read trips" on trips
  for select using (true);

create policy "public insert reviews" on reviews
  for insert with check (true);

create policy "public read approved reviews" on reviews
  for select using (status = 'approved');

-- There are deliberately NO update/delete policies. The admin dashboard performs
-- those server-side with SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS entirely.

-- IMPORTANT: RLS policies require underlying table GRANTs to the API roles, or
-- every request fails with 42501 "permission denied for table". See grants.sql
-- and run it once in the Supabase SQL editor.
