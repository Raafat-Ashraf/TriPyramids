import { createAdminClient } from '@/lib/supabase/admin';
import type { Trip } from '@/lib/types';
import { TripsManager } from '@/components/dashboard/TripsManager';

export const dynamic = 'force-dynamic';

export default async function DashboardTripsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('trips')
    .select('*')
    .order('created_at', { ascending: false });

  return <TripsManager trips={(data as Trip[] | null) ?? []} />;
}
