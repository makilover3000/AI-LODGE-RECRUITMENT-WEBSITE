// One-off: prepare the lodge logo masks + past-moment photos for the web.
//
//  1. logos/<name>.png  ->  public/logos/<slug>.png
//     The source art is a solid BLACK silhouette on WHITE. We bake it into an
//     ALPHA MASK (transparent bg, opaque shape) so components can paint the shape
//     any colour via CSS `mask-image` (default alpha mode). This is what makes the
//     lodge emblems pixel-accurate — the shape IS the real logo, never re-drawn.
//
//  2. ai-lodge-past-images/<folder>/<file>.png  ->  public/moments/<name>.webp
//     Heavy PNG group/candid/project shots -> web-weight WebP for the landing belt
//     ("FROM THE LODGE"), the hero poster, and the Why-Join / Apply accents.
//
// Sources stay gitignored; only the optimized public/ outputs are committed.
// Run: node scripts/optimize-media.mjs
import sharp from "sharp";
import { mkdir, readdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const ROOT = new URL("../", import.meta.url);
const rp = (rel) => fileURLToPath(new URL(rel, ROOT));
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

// ---- logo masks --------------------------------------------------------------
// [source file in logos/, output slug in public/logos/]
const LOGO_JOBS = [
  ["vampire.png", "vampire"],
  ["hackstreet.png", "hackstreet-boys"],
  ["kag.png", "curiositymaxxer"], // KAG -> CuriosityMaxxer rename
  ["llm.png", "llm"],
  ["paiseh.png", "paiseh"],
  ["cjb.png", "cjb"],
  ["wss.png", "wss"],
];

const LOGO_WIDTH = 720; // plenty for the big hero emblem; masks stay a few KB

async function bakeMask(srcFile, slug) {
  const srcPath = rp(`logos/${srcFile}`);
  const outPath = rp(`public/logos/${slug}.png`);
  const before = (await stat(srcPath)).size;

  // alpha = negated luminance: black shape (0) -> opaque (255), white bg -> 0
  const { data: alpha, info } = await sharp(srcPath)
    .resize({ width: LOGO_WIDTH, withoutEnlargement: true })
    .flatten({ background: "#ffffff" }) // in case a source carries transparency
    .toColourspace("b-w") // single channel
    .negate()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // white RGB canvas + the shape as its alpha channel -> transparent PNG mask
  await sharp({
    create: {
      width: info.width,
      height: info.height,
      channels: 3,
      background: "#ffffff",
    },
  })
    .joinChannel(alpha, {
      raw: { width: info.width, height: info.height, channels: 1 },
    })
    .png({ compressionLevel: 9, palette: true })
    .toFile(outPath);

  const after = (await stat(outPath)).size;
  console.log(`logo  ${srcFile}  ${kb(before)} -> logos/${slug}.png  ${kb(after)}`);
}

// ---- past-moment photos ------------------------------------------------------
// [source folder, source file, output name] — all 13, descriptive names so the
// components can pick which is the hero / belt / accent without guessing.
const MOMENT_JOBS = [
  ["AWSome Lodge", "group-shot.png", "awsome-group"],
  ["AWSome Lodge", "group-shot-food-casual.png", "awsome-food"],
  ["demo-day", "candid-everyone-in-action.png", "demo-candid-action"],
  ["demo-day", "candid-group.png", "demo-candid-group"],
  ["demo-day", "show-project-1.png", "demo-project-1"],
  ["demo-day", "show-project-2.png", "demo-project-2"],
  ["demo-day", "show-project-3.png", "demo-project-3"],
  ["demo-day", "show-project-4.png", "demo-project-4"],
  ["demo-day", "show-project-5.png", "demo-project-5"],
  ["demo-day", "show-project-6.png", "demo-project-6"],
  ["JB Lodge", "group-shot.png", "jb-group"],
  ["JB Lodge", "group-shot-2.png", "jb-group-2"],
  ["Lodge LAB", "group-shot.png", "lab-group"],
];

const PHOTO_WIDTH = 1100;

async function optimizePhoto(folder, file, name) {
  const srcPath = rp(`ai-lodge-past-images/${folder}/${file}`);
  const outPath = rp(`public/moments/${name}.webp`);
  const before = (await stat(srcPath)).size;
  await sharp(srcPath)
    .resize({ width: PHOTO_WIDTH, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(outPath);
  const after = (await stat(outPath)).size;
  console.log(
    `photo ${folder}/${file}  ${kb(before)} -> moments/${name}.webp  ${kb(after)}  (${(100 - (after / before) * 100).toFixed(0)}% smaller)`,
  );
}

// ---- run ---------------------------------------------------------------------
await mkdir(rp("public/logos"), { recursive: true });
await mkdir(rp("public/moments"), { recursive: true });

console.log("== logo masks ==");
for (const [src, slug] of LOGO_JOBS) await bakeMask(src, slug);

console.log("\n== past-moment photos ==");
// tolerate missing sources (folders are gitignored / machine-local)
for (const [folder, file, name] of MOMENT_JOBS) {
  try {
    await optimizePhoto(folder, file, name);
  } catch (e) {
    console.warn(`skip ${folder}/${file}: ${e.message}`);
  }
}
