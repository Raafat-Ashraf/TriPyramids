# TriPyramids

> Travel . Explore . Experience Egypt

A four‑language (Arabic, English, Russian, Italian) marketing site for
**TriPyramids**, an Egyptian luxury‑travel brand. Built with Next.js 14 (App
Router), TypeScript, Tailwind CSS and Supabase, with a GSAP‑animated pyramid
hero and a password‑protected admin dashboard for managing trips and
moderating reviews.

---

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** — custom `pharaoh.*` gold‑on‑black palette
- **Supabase** (Postgres) via `@supabase/supabase-js`
- **Server Actions** for every form submission (no separate REST layer)
- **GSAP** — the self‑assembling three‑pyramid hero scene (looping `.from()`
  timeline, no ScrollTrigger, no paid plugins)
- **Framer Motion** — the hero's three‑plane scroll parallax
- **next-intl** — `/ar`, `/en`, `/ru` and `/it` routing, defaulting to Arabic

---

## The database is already provisioned

The Supabase project is **live** and the schema in
[`supabase/schema.sql`](./supabase/schema.sql) has **already been executed and
verified**: both tables (`trips`, `reviews`) exist, Row Level Security is
enabled, and three policies are active:

- anon can `SELECT` all `trips`
- anon can `INSERT` into `reviews`
- anon can `SELECT` from `reviews` **only** where `status = 'approved'`

There are **no** `UPDATE`/`DELETE` policies — the dashboard performs those
server‑side with the service‑role key, which bypasses RLS. The `schema.sql`
file is kept in the repo for documentation/version control only; **do not
re‑run it**.

### ⚠️ Required one‑time step: table GRANTs

The tables have RLS enabled and the policies active, but the underlying **table
GRANTs to the API roles were missing**, so every request failed with
`42501 permission denied for table …` (blank trips/reviews, review form errors,
admin writes failing). An RLS policy only decides *which rows* a role sees — the
role still needs a base GRANT to touch the table at all.

Run [`supabase/grants.sql`](./supabase/grants.sql) **once** in the Supabase SQL
editor. After that the whole data layer works.

### ⚠️ Required one‑time step: Russian/Italian trip columns

The site's interface ships in four languages, but trip content (title/
description) is admin‑authored per trip, and the original `trips` table only
had Arabic/English columns. [`supabase/add-ru-it-columns.sql`](./supabase/add-ru-it-columns.sql)
adds nullable `title_ru` / `title_it` / `description_ru` / `description_it`
columns. Run it **once** in the Supabase SQL editor.

This is optional in the sense that the app degrades gracefully without it —
saving a trip with Russian/Italian text returns a clear inline error telling
you to run the migration, and any trip not yet translated into Russian/Italian
simply shows its English text on the site (see [`lib/trip-i18n.ts`](./lib/trip-i18n.ts)) —
but you need it to actually store Russian/Italian trip content.

### Seed sample content

Once the grants (and ideally the ru/it columns) are in place, populate the
site with 6 sample trips — each with Arabic, English, Russian and Italian
copy — and 4 approved reviews:

```bash
npm run seed
```

---

## Environment variables

Create a `.env.local` in the project root (already present in this repo; also
see [`.env.example`](./.env.example)):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://ljevhkjqdqpfhwrnewcu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ijQnbIv31YohqQUuUAK8pw_L8jb0gG3
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...          # server-only, never exposed
ADMIN_PASSWORD=change-me                          # the single admin password
```

Notes:

- The keys use Supabase's newer `sb_publishable_...` / `sb_secret_...` format;
  they work identically to the legacy JWT‑style anon/service_role keys.
- **`SUPABASE_SERVICE_ROLE_KEY` is server‑only.** It is used exclusively inside
  Server Actions and route handlers ([`lib/supabase/admin.ts`](./lib/supabase/admin.ts)
  is marked `server-only`), and is never logged, printed, or shipped to the
  client.
- **`ADMIN_PASSWORD`** is not a Supabase value — the site owner picks it. It
  guards `/dashboard`. **Change it from the placeholder before going live.**
- `.env.local` is git‑ignored, so secrets are never committed.

---

## Run locally

```bash
npm install
npm run dev
```

Then open <http://localhost:3000> — it redirects to `/ar`. Switch language with
the globe dropdown in the header (العربية / English / Русский / Italiano).

- Public site: `/ar`, `/en`, `/ru`, `/it`, and trip pages like `/ar/trips/<id>`.
- Admin dashboard: `/dashboard` (redirects to `/dashboard/login`). Sign in with
  `ADMIN_PASSWORD`.

Build and run the production bundle:

```bash
npm run build
npm run start
```

---

## How it works

### Public site (no login anywhere)

- **Home** (`/[locale]`) — the animated hero, a grid of trips from the `trips`
  table, and a section of approved reviews.
- **Trip detail** (`/[locale]/trips/[id]`) — trip info, its approved reviews,
  and a review form.
- **Review submission** is a Server Action ([`app/actions/reviews.ts`](./app/actions/reviews.ts)):
  inserts with `status = 'pending'`, drops bot submissions via a hidden
  `website` honeypot, and rate‑limits to **3 per IP per hour**
  ([`lib/rate-limit.ts`](./lib/rate-limit.ts) — in‑memory; swap for a
  Supabase‑backed counter if you need cross‑instance limits).

### Admin dashboard (`/dashboard`)

- Guarded by a single shared password (no user accounts). Login sets a signed,
  HTTP‑only cookie ([`lib/session.ts`](./lib/session.ts), HMAC via Web Crypto so
  it verifies in both edge middleware and Node actions).
  [`middleware.ts`](./middleware.ts) redirects any `/dashboard/*` route except
  `/dashboard/login` to login when the cookie is missing or invalid.
- **Trips management** — create / edit / delete, with title & description in
  up to four languages (Arabic/English required, Russian/Italian optional —
  see the migration note above), a language‑tabbed form
  ([`components/dashboard/TripForm.tsx`](./components/dashboard/TripForm.tsx)),
  location, duration, and photos uploaded straight from your device (camera or
  gallery) to Supabase Storage — no image‑URL pasting.
- **Reviews** — public submissions publish immediately (no approval step); the
  dashboard here is for removing anything inappropriate.
- The dashboard is four‑language too (stored in a `dash_locale` cookie) and is
  intentionally scoped to exactly these two areas.

### The hero (`components/hero/`)

- [`Hero.tsx`](./components/hero/Hero.tsx) — three depth planes (sky, scene,
  copy) driven by Framer Motion `useScroll → useTransform → useSpring`, moving
  by `transform` only. Respects `prefers-reduced-motion`.
- [`PyramidScene.tsx`](./components/hero/PyramidScene.tsx) — an SVG of the three
  Giza pyramids that assembles itself tier by tier on a looping GSAP timeline.
  Every build tween is a `.from()`, so the resting markup **is** the finished
  scene: no‑JS, failed hydration, and reduced‑motion all land on three complete
  pyramids. Tune the pace with the `BUILD_SPEED` constant at the top.

---

## Deploy to Vercel

1. Push the repo to GitHub and import it into Vercel (framework auto‑detected as
   Next.js).
2. In **Project Settings → Environment Variables**, add the same four variables
   from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD`
3. Deploy. No build configuration changes are required.

---

## Project structure

```
app/
  [locale]/            Public site (ar/en/ru/it) — home, trips/[id], layout, not-found
  dashboard/           Admin area (separate <html> root)
    login/             Password login
    (panel)/           Guarded panel: trips (/) + reviews (/reviews)
  actions/             Server Actions (auth, reviews, admin-trips, admin-reviews)
  fonts.ts             Shared next/font instances (Cairo/Poppins/Inter + Playfair)
components/
  hero/                Hero + PyramidScene
  layout/              Header, Footer, LocaleSwitcher (4-language dropdown)
  trips/ reviews/      Public cards, sections, forms, trip detail + gallery
  dashboard/           Shell, managers, forms (language-tabbed trip form)
  ui/                  Button, Magnetic, Counter, StarRating
  Glyphs.tsx           Hieroglyph accent set + section divider
i18n/                  next-intl routing (ar/en/ru/it), navigation, request config
lib/                   supabase clients, session, rate-limit, types, utils,
                        trip-i18n.ts (per-locale title/description with
                        English fallback), trip-images.ts (multi-image storage)
messages/              ar.json, en.json, ru.json, it.json — kept in key parity
supabase/
  schema.sql            Reference schema (already applied)
  grants.sql             One-time table GRANTs (required)
  add-ru-it-columns.sql  One-time ru/it trip columns (required for ru/it trip content)
```
