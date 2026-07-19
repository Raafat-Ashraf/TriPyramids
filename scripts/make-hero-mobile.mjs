/**
 * Derive the portrait hero image from the landscape one.
 *
 * The hero is art-directed: wide screens get `public/hero-giza.jpg`, phones get
 * `public/hero-giza-mobile.jpg`. A landscape frame can't just be `object-cover`
 * cropped on a portrait viewport — the plateau falls outside the crop — so this
 * produces a genuine 2:3 frame centred on the pyramids and the river.
 *
 * Run after replacing the desktop image:
 *   node scripts/make-hero-mobile.mjs
 *
 * Requires `sharp` (dev-only):  npm i -D sharp
 */
import sharp from 'sharp';
import { existsSync } from 'node:fs';

const SRC = 'public/hero-giza.jpg';
const OUT = 'public/hero-giza-mobile.jpg';

// Where the subject sits in the source, as fractions of width/height.
// 0.5 = dead centre. Nudge these if the crop misses the pyramids.
const FOCUS_X = 0.5;
const FOCUS_Y = 0.62;

const TARGET_W = 1200;
const TARGET_H = 1800; // 2:3

if (!existsSync(SRC)) {
  console.error(`Missing ${SRC} — drop the landscape hero image there first.`);
  process.exit(1);
}

const img = sharp(SRC);
const { width, height } = await img.metadata();

// Largest 2:3 window that fits inside the source.
let cropH = height;
let cropW = Math.round((cropH * TARGET_W) / TARGET_H);
if (cropW > width) {
  cropW = width;
  cropH = Math.round((cropW * TARGET_H) / TARGET_W);
}

const left = Math.max(0, Math.min(width - cropW, Math.round(width * FOCUS_X - cropW / 2)));
const top = Math.max(0, Math.min(height - cropH, Math.round(height * FOCUS_Y - cropH / 2)));

await img
  .extract({ left, top, width: cropW, height: cropH })
  .resize(TARGET_W, TARGET_H, { fit: 'cover' })
  .jpeg({ quality: 85, progressive: true, mozjpeg: true })
  .toFile(OUT);

console.log(`${OUT} ← ${cropW}×${cropH} @ (${left},${top}) from ${width}×${height}`);
