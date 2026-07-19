export type ReviewStatus = 'pending' | 'approved' | 'rejected';

/** A trip row, mirroring the `trips` table in supabase/schema.sql. */
export interface Trip {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string | null;
  description_en: string | null;
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
  trips: Pick<Trip, 'title_en' | 'title_ar'> | null;
}
