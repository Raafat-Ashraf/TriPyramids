/**
 * A minimal in-memory, per-IP rate limiter for public review submissions.
 *
 * Scope and trade-off: this lives in module memory, so it is per-server-instance
 * and resets on redeploy/cold start. For a low-traffic marketing site that's a
 * reasonable spam speed-bump; a Supabase-backed counter could replace it later
 * without touching callers. Max 3 submissions per IP per rolling hour.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_WINDOW = 3;

const buckets = new Map<string, Bucket>();

export function checkRateLimit(ip: string): { allowed: boolean } {
  const now = Date.now();
  const bucket = buckets.get(ip);

  // Opportunistically sweep expired buckets so the map can't grow unbounded.
  if (buckets.size > 5000) {
    for (const [key, value] of buckets) {
      if (value.resetAt <= now) buckets.delete(key);
    }
  }

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (bucket.count >= MAX_PER_WINDOW) {
    return { allowed: false };
  }

  bucket.count += 1;
  return { allowed: true };
}
