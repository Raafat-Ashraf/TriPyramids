import { useTranslations } from 'next-intl';

import type { Trip } from '@/lib/types';
import { SectionHeading } from '@/components/SectionHeading';
import { TripCard } from './TripCard';

export function TripsSection({ trips }: { trips: Trip[] }) {
  const t = useTranslations('trips');

  return (
    <section
      id="trips"
      className="scroll-mt-24 bg-pharaoh-black py-20 sm:py-28"
    >
      <div className="shell">
        <SectionHeading
          eyebrow={t('sectionEyebrow')}
          title={t('sectionTitle')}
          subtitle={t('sectionSubtitle')}
        />

        {trips.length === 0 ? (
          <p className="mt-16 text-center text-pharaoh-cream/50">{t('empty')}</p>
        ) : (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
