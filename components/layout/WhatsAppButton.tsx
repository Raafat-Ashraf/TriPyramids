'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';

import { WHATSAPP_NUMBER } from '@/lib/whatsapp';

/**
 * Floating WhatsApp contact button.
 *
 * It reacts to scrolling rather than sitting inert: it stays tucked away at the
 * very top of the page (where the hero CTA already covers intent), slides in
 * once the visitor starts reading, and compacts to a bare icon while they are
 * actively scrolling — expanding back to icon + label the moment they settle.
 * That keeps it out of the way during motion without ever leaving the screen.
 *
 * Everything animates on `transform`/`opacity` only, and the whole behaviour
 * collapses to a static button under `prefers-reduced-motion`.
 */

export function WhatsAppButton() {
  const t = useTranslations('common');
  const prefersReduced = useReducedMotion();

  const [visible, setVisible] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 240);
      setScrolling(true);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      // Settle back to the expanded state shortly after scrolling stops.
      idleTimer.current = setTimeout(() => setScrolling(false), 550);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  const message = t('whatsapp.message');
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const label = t('whatsapp.label');

  // Reduced motion: a plain, always-present button with no entrance or pulse.
  const animate = prefersReduced
    ? { opacity: 1, y: 0, scale: 1 }
    : visible
      ? { opacity: 1, y: 0, scale: 1 }
      : { opacity: 0, y: 24, scale: 0.9 };

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      initial={prefersReduced ? false : { opacity: 0, y: 24, scale: 0.9 }}
      animate={animate}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={prefersReduced ? undefined : { pointerEvents: visible ? 'auto' : 'none' }}
      className="group fixed bottom-5 end-5 z-40 flex items-center gap-2.5 rounded-full bg-[#25D366] py-3 ps-3 pe-3 text-pharaoh-black shadow-[0_14px_38px_-10px_rgba(37,211,102,0.65)] transition-[padding,box-shadow] duration-300 hover:shadow-[0_18px_46px_-10px_rgba(37,211,102,0.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pharaoh-gold focus-visible:ring-offset-2 focus-visible:ring-offset-pharaoh-black motion-reduce:transition-none sm:bottom-7 sm:end-7"
    >
      {/* Idle halo — a slow pulse that draws the eye once the page is still. */}
      {!prefersReduced && !scrolling && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 -z-10 rounded-full bg-[#25D366]"
          initial={{ opacity: 0.45, scale: 1 }}
          animate={{ opacity: 0, scale: 1.45 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
        />
      )}

      <WhatsAppGlyph className="size-6 shrink-0" />

      {/* The label collapses away while the visitor is actively scrolling. */}
      <motion.span
        className="overflow-hidden whitespace-nowrap text-sm font-semibold"
        initial={false}
        animate={
          prefersReduced
            ? { width: 'auto', opacity: 1 }
            : scrolling
              ? { width: 0, opacity: 0 }
              : { width: 'auto', opacity: 1 }
        }
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        {label}
      </motion.span>
    </motion.a>
  );
}

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.41a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.03s.87 2.35.99 2.51c.12.16 1.72 2.62 4.16 3.67.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}
