import { createClient } from '@supabase/supabase-js';

/**
 * Anon (publishable-key) client, used for public reads on the server.
 *
 * It is subject to Row Level Security, so it can only ever see what the public
 * policies allow: all trips, and reviews with status = 'approved'. It's the
 * safe client to reach for anywhere that isn't an authenticated admin action.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY',
    );
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
