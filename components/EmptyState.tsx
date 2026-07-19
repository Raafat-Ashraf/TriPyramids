import type { ReactNode } from 'react';

import { ButtonLink } from '@/components/ui/Button';

/**
 * A deliberate empty state: a bordered card with a centered icon, a headline,
 * one line of explanatory copy, and a call to action — rather than bare muted
 * text floating in space.
 */
export function EmptyState({
  icon,
  title,
  description,
  ctaLabel,
  ctaHref,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <div className="mx-auto mt-12 flex max-w-xl flex-col items-center rounded-3xl border border-pharaoh-gold/20 bg-pharaoh-gold/[0.04] px-6 py-12 text-center sm:px-10 sm:py-14">
      <span className="flex size-16 items-center justify-center rounded-full border border-pharaoh-gold/30 bg-pharaoh-black text-pharaoh-gold">
        {icon}
      </span>
      <h3 className="mt-6 font-display text-2xl font-bold text-pharaoh-cream">
        {title}
      </h3>
      <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-pharaoh-cream/75">
        {description}
      </p>
      <div className="mt-7">
        <ButtonLink href={ctaHref}>{ctaLabel}</ButtonLink>
      </div>
    </div>
  );
}
