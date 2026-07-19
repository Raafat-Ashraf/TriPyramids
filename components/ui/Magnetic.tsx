'use client';

import { useRef, type ReactNode } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion';

interface MagneticProps {
  children: ReactNode;
  /** Max drift toward the cursor, in px. */
  strength?: number;
  className?: string;
}

/**
 * Drifts its child toward the cursor while hovered, then springs back.
 *
 * Skipped entirely on touch pointers and when the visitor prefers reduced
 * motion — in both cases it renders as a plain wrapper with no listeners.
 */
export function Magnetic({ children, strength = 12, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const config = { stiffness: 260, damping: 18, mass: 0.4 };
  const springX = useSpring(x, config);
  const springY = useSpring(y, config);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (prefersReduced || event.pointerType !== 'mouse' || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);
    x.set((offsetX / (rect.width / 2)) * strength);
    y.set((offsetY / (rect.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      {children}
    </motion.div>
  );
}
