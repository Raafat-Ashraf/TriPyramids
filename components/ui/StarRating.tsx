'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';

/** Read-only star display for an existing rating. */
export function StarRating({
  value,
  size = 16,
  className,
}: {
  value: number | null;
  size?: number;
  className?: string;
}) {
  const rating = value ?? 0;
  return (
    <span
      className={cn('inline-flex items-center gap-0.5', className)}
      role="img"
      aria-label={`${rating} / 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          width={size}
          height={size}
          className={
            star <= rating
              ? 'fill-pharaoh-gold text-pharaoh-gold'
              : 'fill-transparent text-pharaoh-gold/30'
          }
          strokeWidth={1.6}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

/** Interactive 1–5 star picker backed by a hidden input for form submission. */
export function StarRatingInput({
  name,
  defaultValue = 0,
  label,
}: {
  name: string;
  defaultValue?: number;
  label?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div>
      <input type="hidden" name={name} value={value} />
      <div
        className="inline-flex items-center gap-1.5"
        role="radiogroup"
        aria-label={label}
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} / 5`}
            onClick={() => setValue(star)}
            onMouseEnter={() => setHover(star)}
            onFocus={() => setHover(star)}
            onBlur={() => setHover(0)}
            className="rounded p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pharaoh-gold"
          >
            <Star
              width={30}
              height={30}
              className={
                star <= active
                  ? 'fill-pharaoh-gold text-pharaoh-gold'
                  : 'fill-transparent text-pharaoh-gold/35'
              }
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
