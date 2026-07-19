/**
 * Admin session token — a tiny signed cookie, no database, no user accounts.
 *
 * The token is `base64url(payload).base64url(HMAC-SHA256(payload))`, signed with
 * a key derived from ADMIN_PASSWORD. Everything here uses the Web Crypto API and
 * `btoa`/`atob` so it runs unchanged in BOTH the edge middleware and Node server
 * actions — no Node-only `crypto` module, which the edge runtime doesn't have.
 */

export const SESSION_COOKIE = 'tp_admin';
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function base64url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

function getSecret(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error('ADMIN_PASSWORD is not set');
  // Namespaced so the signing key is never the raw password itself.
  return `${password}::tripyramids-admin-session-v1`;
}

async function sign(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return base64url(new Uint8Array(signature));
}

/** Mint a fresh signed session token valid for SESSION_TTL_MS. */
export async function createSession(): Promise<string> {
  const payload = JSON.stringify({ exp: Date.now() + SESSION_TTL_MS });
  const body = base64url(encoder.encode(payload));
  const signature = await sign(body);
  return `${body}.${signature}`;
}

/** True only for an untampered, unexpired token. */
export async function verifySession(token: string): Promise<boolean> {
  const [body, signature] = token.split('.');
  if (!body || !signature) return false;

  const expected = await sign(body);
  if (!timingSafeEqual(signature, expected)) return false;

  try {
    const payload = JSON.parse(decoder.decode(fromBase64url(body))) as {
      exp?: number;
    };
    return typeof payload.exp === 'number' && payload.exp > Date.now();
  } catch {
    return false;
  }
}

/** Constant-time check of a submitted password against ADMIN_PASSWORD. */
export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? '';
  if (!expected) return false;
  return timingSafeEqual(input, expected);
}
