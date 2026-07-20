import { createAdminClient } from '@/lib/supabase/admin';
import type { ReviewWithTrip } from '@/lib/types';
import { ReviewsManager } from '@/components/dashboard/ReviewsManager';

export const dynamic = 'force-dynamic';

export default async function DashboardReviewsPage() {
  const supabase = createAdminClient();
  let { data, error } = await supabase
    .from('reviews')
    .select('*, trips(title_en, title_ar, title_ru, title_it)')
    .order('created_at', { ascending: false });

  // title_ru/title_it are an optional migration (supabase/add-ru-it-columns.sql).
  // If it hasn't run yet that select 400s on the unknown columns — retry with
  // just the original two rather than showing an empty reviews list.
  if (error) {
    ({ data } = await supabase
      .from('reviews')
      .select('*, trips(title_en, title_ar)')
      .order('created_at', { ascending: false }));
  }

  return <ReviewsManager reviews={(data as ReviewWithTrip[] | null) ?? []} />;
}
