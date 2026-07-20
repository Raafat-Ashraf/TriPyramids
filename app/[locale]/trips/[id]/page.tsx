import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { createPublicClient } from '@/lib/supabase/public';
import type { Locale } from '@/i18n/routing';
import type { Review, Trip } from '@/lib/types';
import { getTripTitle } from '@/lib/trip-i18n';
import { TripDetail } from '@/components/trips/TripDetail';

export const dynamic = 'force-dynamic';

async function getTrip(id: string): Promise<Trip | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error || !data) return null;
  return data as Trip;
}

export async function generateMetadata({
  params: { id, locale },
}: {
  params: { id: string; locale: string };
}): Promise<Metadata> {
  const trip = await getTrip(id);
  if (!trip) return {};
  return { title: getTripTitle(trip, locale as Locale) };
}

export default async function TripPage({
  params: { id },
}: {
  params: { id: string; locale: string };
}) {
  const trip = await getTrip(id);
  if (!trip) notFound();

  const supabase = createPublicClient();
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('trip_id', id)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  return <TripDetail trip={trip} reviews={(reviews as Review[] | null) ?? []} />;
}
