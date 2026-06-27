// One-off: shrink the oversized AI-generated PNGs into web-weight JPGs.
// The 4K entry painting (~14 MB) was the cause of the multi-second splash freeze
// — Next re-optimizes the source on every dev request. These light sources let
// next/image serve appropriately-sized AVIF/WebP without the giant decode.
// Run: node scripts/optimize-entry.mjs   (originals are left untouched.)
import sharp from "sharp";
import { stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const PUB = new URL("../public/", import.meta.url);
const path = (rel) => fileURLToPath(new URL(rel, PUB));

// [source, output, target width, quality]
const JOBS = [
  // entry/splash backgrounds — the actual freeze
  ["entry/entry-hd.png", "entry/entry-hd.jpg", 2560, 85],
  ["entry/entry-hd-portrait.png", "entry/entry-hd-portrait.jpg", 1440, 85],
  // other heavy landing PNGs (§5 — overall "heaviness" win)
  ["entry/close-desktop.png", "entry/close-desktop.jpg", 1672, 85],
  ["entry/wide-desktop.png", "entry/wide-desktop.jpg", 1672, 85],
  ["entry/hero.png", "entry/hero.jpg", 941, 88],
  ["entry/hero-poster.png", "entry/hero-poster.jpg", 820, 88],
];

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

for (const [src, out, width, quality] of JOBS) {
  const srcPath = path(src);
  const outPath = path(out);
  const before = (await stat(srcPath)).size;
  await sharp(srcPath)
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true })
    .toFile(outPath);
  const after = (await stat(outPath)).size;
  console.log(
    `${src}  ${kb(before)} -> ${out}  ${kb(after)}  (${(100 - (after / before) * 100).toFixed(0)}% smaller)`,
  );
}
