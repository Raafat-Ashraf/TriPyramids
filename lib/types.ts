export type ReviewStatus = 'pending' | 'approved' | 'rejected';

/**
 * A trip row, mirroring the `trips` table in supabase/schema.sql.
 *
 * `title_ar`/`title_en` are required (the original two-language schema);
 * `title_ru`/`title_it` are optional add-ons (see supabase/add-ru-it-columns.sql)
 * — a trip not yet translated into Russian/Italian falls back to English via
 * lib/trip-i18n.ts. They're typed as possibly `undefined` too, not just
 * `null`, because a `select('*')` against a database that hasn't run that
 * migration yet simply omits the columns rather than returning null.
 */
export interface Trip {
  id: string;
  title_ar: string;
  title_en: string;
  title_ru?: string | null;
  title_it?: string | null;
  description_ar: string | null;
  description_en: string | null;
  description_ru?: string | null;
  description_it?: string | null;
  location: string | null;
  price: number | null;
  duration_days: number | null;
  image_url: string | null;
  created_at: string;
}

/** A review row, mirroring the `reviews` table in supabase/schema.sql. */
export interface Review {
  id: string;
  trip_id: string | null;
  name: string;
  email: string | null;
  rating: number | null;
  comment: string;
  status: ReviewStatus;
  created_at: string;
}

/** A review joined with its trip's titles, for the moderation table. */
export interface ReviewWithTrip extends Review {
  trips: Pick<Trip, 'title_en' | 'title_ar' | 'title_ru' | 'title_it'> | null;
}
