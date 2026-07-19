'use server';

import { headers } from 'next/headers';

import { createPublicClient } from '@/lib/supabase/public';
import { checkRateLimit } from '@/lib/rate-limit';

export type ReviewSubmitStatus =
  | 'success'
  | 'validation'
  | 'rate'
  | 'error';

export interface ReviewResult {
  status: ReviewSubmitStatus;
}

function clientIp(): string {
  const h = headers();
  const forwarded = h.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return h.get('x-real-ip')?.trim() || 'unknown';
}

/**
 * Public review submission. No auth of any kind.
 *
 *  - A filled `website` honeypot field means a bot: we silently pretend success.
 *  - Submissions are rate-limited to 3 per IP per hour.
 *  - Everything is inserted with status 'pending' via the anon client, which
 *    RLS permits, and stays hidden until an admin approves it.
 */
export async function submitReview(formData: FormData): Promise<ReviewResult> {
  // Honeypot — a real person never fills a hidden field. Drop it, but report
  // success so the bot gets no signal that it was caught.
  if (String(formData.get('website') ?? '').trim() !== '') {
    return { status: 'success' };
  }

  const name = String(formData.get('name') ?? '').trim();
  const comment = String(formData.get('comment') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const rating = Number(formData.get('rating'));
  const tripIdRaw = String(formData.get('tripId') ?? '').trim();
  const tripId = tripIdRaw.length > 0 ? tripIdRaw : null;

  if (
    !name ||
    !comment ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return { status: 'validation' };
  }

  if (!checkRateLimit(clientIp()).allowed) {
    return { status: 'rate' };
  }

  const supabase = createPublicClient();
  const { error } = await supabase.from('reviews').insert({
    trip_id: tripId,
    name: name.slice(0, 120),
    email: email ? email.slice(0, 200) : null,
    rating,
    comment: comment.slice(0, 2000),
    status: 'pending',
  });

  if (error) {
    return { status: 'error' };
  }

  return { status: 'success' };
}
