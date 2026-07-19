'use server';

import { revalidatePath } from 'next/cache';

import { assertAdmin } from '@/lib/auth-guard';
import { createAdminClient } from '@/lib/supabase/admin';
import type { ReviewStatus } from '@/lib/types';

export interface AdminActionResult {
  ok: boolean;
  error?: string;
}

const VALID_STATUS: ReviewStatus[] = ['pending', 'approved', 'rejected'];

function revalidateReviews() {
  revalidatePath('/dashboard/reviews');
  // Approved reviews surface publicly, so refresh those views too.
  revalidatePath('/ar');
  revalidatePath('/en');
}

/** Approve or reject a review by setting its moderation status. */
export async function setReviewStatus(
  formData: FormData,
): Promise<AdminActionResult> {
  await assertAdmin();

  const id = String(formData.get('id') ?? '').trim();
  const status = String(formData.get('status') ?? '').trim() as ReviewStatus;

  if (!id) return { ok: false, error: 'Missing review id.' };
  if (!VALID_STATUS.includes(status)) {
    return { ok: false, error: 'Invalid status.' };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('reviews')
    .update({ status })
    .eq('id', id);
  if (error) return { ok: false, error: error.message };

  revalidateReviews();
  return { ok: true };
}

export async function deleteReview(
  formData: FormData,
): Promise<AdminActionResult> {
  await assertAdmin();

  const id = String(formData.get('id') ?? '').trim();
  if (!id) return { ok: false, error: 'Missing review id.' };

  const supabase = createAdminClient();
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };

  revalidateReviews();
  return { ok: true };
}
