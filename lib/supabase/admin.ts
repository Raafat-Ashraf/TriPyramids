import 'server-only';

import { createClient } from '@supabase/supabase-js';

/**
 * Service-role client for the admin dashboard.
 *
 * This key bypasses RLS entirely, so it is the ONLY thing that can update or
 * delete rows (there are deliberately no UPDATE/DELETE policies). The
 * `server-only` import guarantees a build error if this file is ever pulled
 * into a client bundle — the secret must never leave the server.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY',
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
