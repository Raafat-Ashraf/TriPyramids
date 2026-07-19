'use server';

import { revalidatePath } from 'next/cache';

import { assertAdmin } from '@/lib/auth-guard';
import { createAdminClient } from '@/lib/supabase/admin';

export interface AdminActionResult {
  ok: boolean;
  error?: string;
}

/** Turn an empty string into null, otherwise trim. */
function optionalText(value: FormDataEntryValue | null): string | null {
  const text = String(value ?? '').trim();
  return text.length > 0 ? text : null;
}

function optionalNumber(value: FormDataEntryValue | null): number | null {
  const raw = String(value ?? '').trim();
  if (raw.length === 0) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function optionalInt(value: FormDataEntryValue | null): number | null {
  const parsed = optionalNumber(value);
  return parsed == null ? null : Math.round(parsed);
}

function parseTripForm(formData: FormData) {
  const titleEn = String(formData.get('title_en') ?? '').trim();
  const titleAr = String(formData.get('title_ar') ?? '').trim();

  if (!titleEn || !titleAr) {
    return { error: 'Both English and Arabic titles are required.' as const };
  }

  return {
    values: {
      title_en: titleEn,
      title_ar: titleAr,
      description_en: optionalText(formData.get('description_en')),
      description_ar: optionalText(formData.get('description_ar')),
      location: optionalText(formData.get('location')),
      price: optionalNumber(formData.get('price')),
      duration_days: optionalInt(formData.get('duration_days')),
      image_url: optionalText(formData.get('image_url')),
    },
  };
}

function revalidateTrips() {
  revalidatePath('/dashboard');
  revalidatePath('/ar');
  revalidatePath('/en');
}

export async function createTrip(formData: FormData): Promise<AdminActionResult> {
  await assertAdmin();

  const parsed = parseTripForm(formData);
  if ('error' in parsed) return { ok: false, error: parsed.error };

  const supabase = createAdminClient();
  const { error } = await supabase.from('trips').insert(parsed.values);
  if (error) return { ok: false, error: error.message };

  revalidateTrips();
  return { ok: true };
}

export async function updateTrip(formData: FormData): Promise<AdminActionResult> {
  await assertAdmin();

  const id = String(formData.get('id') ?? '').trim();
  if (!id) return { ok: false, error: 'Missing trip id.' };

  const parsed = parseTripForm(formData);
  if ('error' in parsed) return { ok: false, error: parsed.error };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('trips')
    .update(parsed.values)
    .eq('id', id);
  if (error) return { ok: false, error: error.message };

  revalidateTrips();
  return { ok: true };
}

export async function deleteTrip(formData: FormData): Promise<AdminActionResult> {
  await assertAdmin();

  const id = String(formData.get('id') ?? '').trim();
  if (!id) return { ok: false, error: 'Missing trip id.' };

  const supabase = createAdminClient();
  const { error } = await supabase.from('trips').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };

  revalidateTrips();
  return { ok: true };
}
