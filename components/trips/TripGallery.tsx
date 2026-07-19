'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';

/**
 * A simple, tidy gallery: one large viewer with a scrollable thumbnail strip.
 * Clicking a thumbnail swaps the main image.
 */
export function TripGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  if (images.length === 0) return null;

  return (
    <div className="max-w-2xl">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-pharaoh-gold/15 bg-pharaoh-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]}
          alt={title}
          className="size-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`${title} — ${index + 1}`}
              aria-current={index === active}
              className={cn(
                'relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pharaoh-gold',
                index === active
                  ? 'border-pharaoh-gold'
                  : 'border-transparent opacity-60 hover:opacity-100',
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
