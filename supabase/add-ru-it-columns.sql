-- ============================================================================
-- REQUIRED (once) to fully support Russian and Italian trip content.
-- ============================================================================
--
-- The site's interface (nav, buttons, forms, dashboard) now ships in four
-- languages: Arabic, English, Russian, Italian. Trip content (title/
-- description) is admin-authored per trip, and the original schema only had
-- columns for Arabic and English. This adds the Russian/Italian equivalents,
-- all nullable — a trip left untranslated in ru/it simply falls back to its
-- English text on the site (see lib/trip-i18n.ts), so this is safe to run at
-- any time without breaking existing trips.
--
-- Run this ONCE in the Supabase SQL editor.

alter table public.trips
  add column if not exists title_ru text,
  add column if not exists title_it text,
  add column if not exists description_ru text,
  add column if not exists description_it text;
