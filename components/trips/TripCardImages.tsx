'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

/**
 * Auto-cycling cover for a trip card. When a trip has more than one photo the
 * images cross-fade on a timer (paused under prefers-reduced-motion), with a
 * small dot indicator. A single photo renders as a plain image.
 */
export function TripCardImages({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const hasMany = images.length > 1;

  useEffect(() => {
    if (!hasMany) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      3500,
    );
    return () => window.clearInterval(id);
  }, [hasMany, images.length]);

  return (
    <>
      {images.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={i === 0 ? alt : ''}
          loading="lazy"
          aria-hidden={i === index ? undefined : true}
          className={cn(
            'absolute inset-0 size-full object-cover transition-[opacity,transform] duration-700 ease-out group-hover:scale-105',
            i === index ? 'opacity-100' : 'opacity-0',
          )}
        />
      ))}

      {hasMany && (
        <div className="absolute bottom-3 end-3 z-10 flex gap-1.5">
          {images.map((src, i) => (
            <span
              key={src}
              className={cn(
                'size-1.5 rounded-full transition-colors',
                i === index ? 'bg-pharaoh-gold' : 'bg-pharaoh-cream/45',
              )}
            />
          ))}
        </div>
      )}
    </>
  );
}
