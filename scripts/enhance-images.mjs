// Aesthetic touch-up + web optimization for the gallery photos.
// Honest scope: this improves LIGHTING and COLOR (brightness, shadow lift,
// white balance, saturation, sharpening) and exports optimized WebP.
// It does NOT do content-aware removal of wall cracks/stains (that needs AI
// inpainting). The grading + tasteful sizing makes every shot read better.

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "..", "gallaery");
const OUT = path.join(__dirname, "..", "public", "gallery");

// slug, source file, brightness, saturation, gamma(shadow lift), contrast
const IMAGES = [
  { slug: "pool-dusk",      file: "WhatsApp Image 2026-06-24 at 11.43.49.jpeg",     b: 1.06, s: 1.14, g: 1.06, c: 1.05 },
  { slug: "room-green",     file: "WhatsApp Image 2026-06-24 at 11.43.49 (1).jpeg", b: 1.16, s: 1.12, g: 1.12, c: 1.04 },
  { slug: "lounge-1",       file: "WhatsApp Image 2026-06-24 at 11.43.50.jpeg",     b: 1.20, s: 1.10, g: 1.16, c: 1.05 },
  { slug: "lounge-2",       file: "WhatsApp Image 2026-06-24 at 11.43.50 (1).jpeg", b: 1.18, s: 1.10, g: 1.14, c: 1.05 },
  { slug: "mural",          file: "WhatsApp Image 2026-06-22 at 21.39.27.jpeg",     b: 1.05, s: 1.12, g: 1.04, c: 1.08 },
  { slug: "pool-day",       file: "WhatsApp Image 2026-05-31 at 23.16.19.jpeg",     b: 1.08, s: 1.20, g: 1.06, c: 1.10 },
  { slug: "pool-night",     file: "WhatsApp Image 2026-05-31 at 23.16.27.jpeg",     b: 1.12, s: 1.16, g: 1.10, c: 1.06 },
  { slug: "dining",         file: "WhatsApp Image 2026-05-31 at 23.16.30.jpeg",     b: 1.14, s: 1.12, g: 1.12, c: 1.05 },
  { slug: "pool-fairy-night", file: "WhatsApp Image 2026-06-24 at 14.08.37.jpeg",     b: 1.06, s: 1.12, g: 1.06, c: 1.05 },
  { slug: "pool-twilight",  file: "WhatsApp Image 2026-06-24 at 14.08.37 (1).jpeg", b: 1.05, s: 1.16, g: 1.05, c: 1.06 },
  { slug: "dining-nook",    file: "WhatsApp Image 2026-06-24 at 14.08.37 (2).jpeg", b: 1.08, s: 1.10, g: 1.08, c: 1.05 },
  { slug: "room-jungle",    file: "WhatsApp Image 2026-06-24 at 14.08.38.jpeg",     b: 1.07, s: 1.14, g: 1.06, c: 1.05 },
  { slug: "room-pink",      file: "WhatsApp Image 2026-06-24 at 14.08.38 (1).jpeg", b: 1.05, s: 1.10, g: 1.05, c: 1.04 },
  { slug: "lounge-3",       file: "WhatsApp Image 2026-06-24 at 14.08.39.jpeg",     b: 1.16, s: 1.10, g: 1.14, c: 1.05 },
];

const MAX_W = 1600;

function contrastLinear(c) {
  // out = a*in + b, pivot around mid-grey (128) so it doesn't shift exposure
  const a = c;
  const b = 128 * (1 - c);
  return { a, b };
}

async function run() {
  await mkdir(OUT, { recursive: true });
  for (const img of IMAGES) {
    const inPath = path.join(SRC, img.file);
    const outPath = path.join(OUT, `${img.slug}.webp`);
    const { a, b } = contrastLinear(img.c);
    try {
      await sharp(inPath)
        .rotate() // honour EXIF orientation
        .modulate({ brightness: img.b, saturation: img.s })
        .gamma(Math.min(3, Math.max(1, img.g))) // lift midtones/shadows
        .linear(a, b) // gentle contrast
        .sharpen({ sigma: 0.8 })
        .resize({ width: MAX_W, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(outPath);
      console.log(`  ok  ${img.slug}.webp`);
    } catch (err) {
      console.error(`  FAIL ${img.slug}:`, err.message);
      process.exitCode = 1;
    }
  }
  console.log("Done. Enhanced gallery written to public/gallery/");
}

run();
