-- ============================================================================
-- REQUIRED: run this ONCE in the Supabase SQL editor.
-- ============================================================================
--
-- The tables have RLS enabled and the three policies active, but the underlying
-- table GRANTs for the API roles (anon / service_role) are missing. An RLS
-- policy only decides WHICH rows a role may see — the role still needs a base
-- GRANT to touch the table at all. Without these grants every request fails
-- with:  42501  "permission denied for table ..."
--
-- Symptoms this fixes:
--   • Homepage trips/reviews always empty (anon SELECT denied)
--   • Review form submissions fail (anon INSERT denied)
--   • Admin dashboard create/edit/delete fail (service_role denied)
--
-- After running this, `npm run seed` and the whole app work.

grant usage on schema public to anon, authenticated, service_role;

-- Public site (anon / authenticated). RLS still governs which rows and actions
-- are allowed (public read trips, insert reviews, read only approved reviews).
grant select on public.trips to anon, authenticated;
grant select, insert on public.reviews to anon, authenticated;

-- Admin dashboard (service_role) — full access. service_role also bypasses RLS.
grant all on public.trips to service_role;
grant all on public.reviews to service_role;

-- Keep future tables working too (optional but recommended).
alter default privileges in schema public
  grant select on tables to anon, authenticated;
alter default privileges in schema public
  grant all on tables to service_role;
