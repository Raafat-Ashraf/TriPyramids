import { createAdminClient } from '@/lib/supabase/admin';
import type { ReviewWithTrip } from '@/lib/types';
import { ReviewsManager } from '@/components/dashboard/ReviewsManager';

export const dynamic = 'force-dynamic';

export default async function DashboardReviewsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('reviews')
    .select('*, trips(title_en, title_ar)')
    .order('created_at', { ascending: false });

  return <ReviewsManager reviews={(data as ReviewWithTrip[] | null) ?? []} />;
}
