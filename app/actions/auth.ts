'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import {
  SESSION_COOKIE,
  SESSION_TTL_MS,
  createSession,
  verifyPassword,
} from '@/lib/session';

export interface LoginResult {
  error: boolean;
}

/**
 * Password-only admin login. On success, sets a signed HTTP-only cookie and
 * redirects to the dashboard; on failure, returns an error for the form.
 */
export async function login(formData: FormData): Promise<LoginResult> {
  const password = String(formData.get('password') ?? '');

  if (!verifyPassword(password)) {
    return { error: true };
  }

  const token = await createSession();
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });

  redirect('/dashboard');
}

/** Clears the session cookie and returns to the login screen. */
export async function logout(): Promise<void> {
  cookies().delete(SESSION_COOKIE);
  redirect('/dashboard/login');
}
