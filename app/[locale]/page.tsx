import { createPublicClient } from '@/lib/supabase/public';
import type { Review, Trip } from '@/lib/types';
import { Hero } from '@/components/hero/Hero';
import { TripsSection } from '@/components/trips/TripsSection';
import { ReviewsSection } from '@/components/reviews/ReviewsSection';

// Always reflect the latest trips and freshly-approved reviews.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = createPublicClient();

  const [tripsResult, reviewsResult] = await Promise.all([
    supabase.from('trips').select('*').order('created_at', { ascending: false }),
    supabase
      .from('reviews')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(9),
  ]);

  const trips = (tripsResult.data as Trip[] | null) ?? [];
  const reviews = (reviewsResult.data as Review[] | null) ?? [];

  return (
    <>
      <Hero />
      <TripsSection trips={trips} />
      <ReviewsSection reviews={reviews} />
    </>
  );
}
