import { createNavigation } from 'next-intl/navigation';

import { routing } from './routing';

/**
 * Locale-aware navigation helpers. `<Link>` automatically carries the active
 * locale prefix, so links are written without it (`href="/trips/123"`).
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
