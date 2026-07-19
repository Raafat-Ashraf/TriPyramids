'use client';

import { useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';

import { cn } from '@/lib/utils';

interface CounterProps {
  value: number;
  /** Decimal places to hold while counting. */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Count-up duration in ms. */
  duration?: number;
  className?: string;
}

/**
 * Counts from zero up to `value` when the component mounts.
 *
 * Deliberately NOT scroll-triggered (the hero has no ScrollTrigger anywhere) —
 * it runs once on mount via requestAnimationFrame. The final value is rendered
 * server-side, so it's correct with JS off and for crawlers; the animation only
 * takes over once mounted, and is skipped under prefers-reduced-motion.
 */
export function Counter({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1600,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const locale = useLocale();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) return;

    const formatter = new Intl.NumberFormat(
      locale === 'ar' ? 'ar-EG' : 'en-US',
      {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        numberingSystem: 'latn',
      },
    );

    let raf = 0;
    let start: number | null = null;

    const tick = (now: number) => {
      if (start === null) start = now;
      const progress = Math.min((now - start) / duration, 1);
      // easeOutCubic for a lively-then-settling count.
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${prefix}${formatter.format(value * eased)}${suffix}`;
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    element.textContent = `${prefix}${formatter.format(0)}${suffix}`;
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [value, decimals, prefix, suffix, duration, locale]);

  const initial = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    numberingSystem: 'latn',
  }).format(value);

  return (
    <span ref={ref} className={cn('numeric inline-block tabular-nums', className)}>
      {`${prefix}${initial}${suffix}`}
    </span>
  );
}
