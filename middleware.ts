import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';

import { routing } from './i18n/routing';
import { verifySession, SESSION_COOKIE } from './lib/session';

const intlMiddleware = createMiddleware(routing);

/**
 * One middleware, two responsibilities:
 *
 *  1. `/dashboard/*` — admin guard. Every route except `/dashboard/login` needs
 *     a valid signed session cookie; without it the visitor is bounced to the
 *     login page. These routes are deliberately NOT locale-prefixed.
 *  2. Everything else — next-intl locale routing (`/` → `/ar`, etc.).
 */
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/dashboard')) {
    if (pathname === '/dashboard/login') {
      return NextResponse.next();
    }

    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const valid = token ? await verifySession(token) : false;

    if (!valid) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/dashboard/login';
      loginUrl.search = '';
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  // Run on the admin area and on all public paths, skipping Next internals,
  // API routes and anything with a file extension (static assets).
  matcher: ['/dashboard/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
