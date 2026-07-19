import 'server-only';

import { cookies } from 'next/headers';

import { SESSION_COOKIE, verifySession } from './session';

/**
 * Defense-in-depth for admin server actions.
 *
 * The middleware already guards `/dashboard/*` page loads, but a Server Action
 * is a POST that a determined caller could invoke directly, so every mutating
 * admin action re-checks the session here before touching the service client.
 */
export async function assertAdmin(): Promise<void> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token || !(await verifySession(token))) {
    throw new Error('Unauthorized');
  }
}
