/**
 * A trip can have several images. To avoid a schema change, they're stored
 * newline-delimited in the existing `image_url` text column — a single URL
 * (the old format) parses to a one-item list, so everything stays backward
 * compatible.
 */

/** Split the stored `image_url` value into a list of image URLs. */
export function parseTripImages(
  imageUrl: string | null | undefined,
): string[] {
  if (!imageUrl) return [];
  return imageUrl
    .split('\n')
    .map((url) => url.trim())
    .filter(Boolean);
}

/** The first image, used for cards, banners and thumbnails. */
export function firstTripImage(
  imageUrl: string | null | undefined,
): string | null {
  return parseTripImages(imageUrl)[0] ?? null;
}

/** Join a list of image URLs back into the stored `image_url` value. */
export function joinTripImages(urls: string[]): string | null {
  const cleaned = urls.map((url) => url.trim()).filter(Boolean);
  return cleaned.length > 0 ? cleaned.join('\n') : null;
}
