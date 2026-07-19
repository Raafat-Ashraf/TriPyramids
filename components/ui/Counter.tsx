'use client';

import { useEffect, useRef, useState } from 'react';
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
 * Counts from zero up to `value` the first time it scrolls into view.
 *
 * Uses an IntersectionObserver so the animation fires when the number is
 * actually seen (not on mount), and runs once. The final value is rendered
 * server-side, so it's correct with JS off and for crawlers; under
 * prefers-reduced-motion the count is skipped and the final value stands.
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
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || started) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) return; // leave the server-rendered final value

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    const element = ref.current;
    if (!element || !started) return;

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
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${prefix}${formatter.format(value * eased)}${suffix}`;
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    element.textContent = `${prefix}${formatter.format(0)}${suffix}`;
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, value, decimals, prefix, suffix, duration, locale]);

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
