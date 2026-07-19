'use server';

import { revalidatePath } from 'next/cache';
import type { SupabaseClient } from '@supabase/supabase-js';

import { assertAdmin } from '@/lib/auth-guard';
import { createAdminClient } from '@/lib/supabase/admin';
import { joinTripImages } from '@/lib/trip-images';

export interface AdminActionResult {
  ok: boolean;
  error?: string;
}

const BUCKET = 'trip-images';
const MAX_IMAGES = 8;

function optionalText(value: FormDataEntryValue | null): string | null {
  const text = String(value ?? '').trim();
  return text.length > 0 ? text : null;
}

function optionalInt(value: FormDataEntryValue | null): number | null {
  const raw = String(value ?? '').trim();
  if (raw.length === 0) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? Math.round(parsed) : null;
}

/** Upload each newly-picked image file to storage and return its public URL. */
async function uploadImages(
  supabase: SupabaseClient,
  files: FormDataEntryValue[],
): Promise<string[]> {
  const urls: string[] = [];
  for (const entry of files) {
    if (!(entry instanceof File) || entry.size === 0) continue;
    if (!entry.type.startsWith('image/')) continue;

    const ext =
      (entry.name.split('.').pop() ?? 'jpg')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '') || 'jpg';
    const path = `${crypto.randomUUID()}.${ext}`;
    const buffer = Buffer.from(await entry.arrayBuffer());

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, { contentType: entry.type, upsert: false });
    if (error) throw new Error(error.message);

    urls.push(supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
  }
  return urls;
}

/**
 * Build the row to write. Combines the existing images the admin kept with any
 * newly uploaded files (upload happens here), storing them newline-delimited in
 * `image_url`. Price is intentionally left untouched — it was removed from the
 * product.
 */
async function buildTripValues(formData: FormData, supabase: SupabaseClient) {
  const titleEn = String(formData.get('title_en') ?? '').trim();
  const titleAr = String(formData.get('title_ar') ?? '').trim();
  if (!titleEn || !titleAr) {
    return { error: 'Both English and Arabic titles are required.' as const };
  }

  const kept = formData
    .getAll('existing_images')
    .map((v) => String(v).trim())
    .filter(Boolean);
  const uploaded = await uploadImages(supabase, formData.getAll('images'));
  const images = [...kept, ...uploaded].slice(0, MAX_IMAGES);

  return {
    values: {
      title_en: titleEn,
      title_ar: titleAr,
      description_en: optionalText(formData.get('description_en')),
      description_ar: optionalText(formData.get('description_ar')),
      location: optionalText(formData.get('location')),
      duration_days: optionalInt(formData.get('duration_days')),
      image_url: joinTripImages(images),
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
  const supabase = createAdminClient();

  let parsed: Awaited<ReturnType<typeof buildTripValues>>;
  try {
    parsed = await buildTripValues(formData, supabase);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Upload failed.' };
  }
  if ('error' in parsed) return { ok: false, error: parsed.error };

  const { error } = await supabase.from('trips').insert(parsed.values);
  if (error) return { ok: false, error: error.message };

  revalidateTrips();
  return { ok: true };
}

export async function updateTrip(formData: FormData): Promise<AdminActionResult> {
  await assertAdmin();

  const id = String(formData.get('id') ?? '').trim();
  if (!id) return { ok: false, error: 'Missing trip id.' };

  const supabase = createAdminClient();
  let parsed: Awaited<ReturnType<typeof buildTripValues>>;
  try {
    parsed = await buildTripValues(formData, supabase);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Upload failed.' };
  }
  if ('error' in parsed) return { ok: false, error: parsed.error };

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
