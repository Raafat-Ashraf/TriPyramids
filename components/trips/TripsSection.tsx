import { useTranslations } from 'next-intl';
import { Compass } from 'lucide-react';

import type { Trip } from '@/lib/types';
import { SectionHeading } from '@/components/SectionHeading';
import { GlyphDivider } from '@/components/Glyphs';
import { EmptyState } from '@/components/EmptyState';
import { TripCard } from './TripCard';

export function TripsSection({ trips }: { trips: Trip[] }) {
  const t = useTranslations('trips');
  const nav = useTranslations('common.nav');

  return (
    <section id="trips" className="scroll-mt-24 bg-pharaoh-black py-20 md:py-28">
      <div className="shell">
        {/* The one full hieroglyph trio: the hero-to-content transition. */}
        <GlyphDivider className="mb-14" />

        <SectionHeading
          eyebrow={t('sectionEyebrow')}
          title={t('sectionTitle')}
          subtitle={t('sectionSubtitle')}
        />

        {trips.length === 0 ? (
          <EmptyState
            icon={<Compass className="size-7" />}
            title={t('emptyTitle')}
            description={t('empty')}
            ctaLabel={nav('contact')}
            ctaHref="/#contact"
          />
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
