/**
 * AI Lodge — local asset generation via the Gemini image API (Nano Banana Pro).
 *
 * Generation tooling ONLY. Nothing here is imported by the live site. It writes
 * candidate PNGs into `asset-review/<folder>/` for human review; winners get
 * hand-wired later (see plan / asset_generation_prompt.md).
 *
 * Run:  npm run gen:assets   (loads GEMINI_API_KEY from .env.local via --env-file)
 *
 * The key is read from process.env only and is NEVER logged.
 */

import { GoogleGenAI } from "@google/genai";
import { mkdir, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const MODEL = "gemini-3-pro-image-preview"; // Nano Banana Pro — do not silently swap
const COUNT = Number(process.env.GEN_COUNT) || 3; // variations per asset
const ONLY = process.env.GEN_ONLY?.trim(); // optional: limit to one asset key (smoke test)
const MAX_RETRIES = 2;

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error(
    "✗ GEMINI_API_KEY is not set. Run via `npm run gen:assets` " +
      "(which loads .env.local through Node's --env-file).",
  );
  process.exit(1);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_ROOT = join(__dirname, "..", "asset-review");

const ai = new GoogleGenAI({ apiKey });

/**
 * Asset specs. `aspectRatio` is passed to the model's imageConfig where it
 * meaningfully helps the composition; omit to take the model default (≈1:1).
 *  - Cat A  = ship-as-is PNG
 *  - Cat B  = reference only → redrawn as SVG later
 *  - Cat C  = tileable texture fill
 */
const assets = [
  {
    key: "smoke-title",
    folder: "smoke-title",
    category: "A",
    aspectRatio: "16:9",
    prompt:
      'Puffy hand-drawn cloud-letter typography spelling "AI LODGE", each letter ' +
      "formed from overlapping cumulus cloud puffs like cartoon smoke clouds shaped " +
      "into bold block letters, thick black outline around each puff, white/cream fill, " +
      "flat illustration style with slightly imperfect hand-cut edges, isolated on a " +
      "plain transparent background, no other elements, centered composition, highly " +
      "legible lettering",
  },
  {
    key: "trees-reference",
    folder: "trees-reference",
    category: "B",
    aspectRatio: "4:3",
    prompt:
      "A cluster of organic, irregular pine trees in a flat vector retro travel-poster " +
      "illustration style, hand-cut paper silhouette feel, asymmetric branch shapes, " +
      "varied heights, not geometrically uniform, dark forest green tones, isolated on " +
      "plain background, side-on view suitable for tracing as clean vector shapes",
  },
  {
    key: "clouds-reference",
    folder: "clouds-reference",
    category: "B",
    aspectRatio: "16:9",
    prompt:
      "Soft, fluffy, painterly clouds in a flat vector illustration style with subtle " +
      "grain texture, warm cream and pale grey-green tones, retro travel-poster " +
      "aesthetic, gently irregular puffy edges, isolated on plain background, suitable " +
      "as a reference for vector cloud shapes",
  },
  {
    key: "cabin-log-texture",
    folder: "cabin-log-texture",
    category: "C",
    aspectRatio: "1:1",
    prompt:
      "Seamless tileable wood log texture, reddish-brown rustic cabin wood grain, flat " +
      "illustration style matching a retro National Park travel poster (not " +
      "photorealistic), subtle grain/noise texture, warm earthy tones matching hex " +
      "#A35A42 and #6F3C2A",
  },
  {
    key: "grain-texture",
    folder: "grain-texture",
    category: "C",
    aspectRatio: "1:1",
    prompt:
      "Seamless tileable fine-grain paper noise texture, subtle and low-contrast, warm " +
      "cream tone, suitable as a low-opacity multiply-blend overlay for a vintage poster " +
      "illustration",
  },
  {
    key: "spot-motifs",
    folder: "spot-motifs",
    category: "B",
    aspectRatio: "4:3",
    prompt:
      "A set of small camping and forest motifs — a lantern, a compass, a campfire, a " +
      "wooden trail signpost, a stacked woodpile, an axe in a stump — arranged as " +
      "separate isolated objects on a plain transparent background, flat vector retro " +
      "National Park travel-poster illustration style, hand-cut paper silhouette feel " +
      "with thick simplified shapes, slightly irregular edges, warm earthy and " +
      "forest-green tones, each object clearly separated for tracing as individual " +
      "vector icons",
  },
  {
    key: "og-card",
    folder: "og-card",
    category: "A",
    aspectRatio: "16:9",
    prompt:
      "A retro National Park travel-poster scene for AI Lodge: a log cabin in a pine " +
      "forest clearing under a warm cream sky, layered flat-vector pine silhouettes from " +
      "dark foreground to pale background, yellow-grass ground, soft curling chimney " +
      "smoke, subtle grain texture, hand-cut paper illustration style, wide landscape " +
      "composition with clear empty headroom in the upper third for a title. No text " +
      "anywhere in the image.",
  },
  {
    key: "foreground-enrichment",
    folder: "foreground-enrichment",
    category: "B",
    aspectRatio: "16:9",
    prompt:
      "A set of forest-floor foreground elements — mossy rocks, low bushes and shrubs, a " +
      "stacked woodpile, a worn dirt path — as separate isolated objects on a plain " +
      "transparent background, flat vector retro travel-poster silhouette style, " +
      "hand-cut paper feel, darkest-value forest-green and earthy tones, each element " +
      "separated for tracing as clean vector paths",
  },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const extOf = (mime) => (mime && mime.includes("jpeg") ? "jpg" : "png");

async function generateOne(asset, n) {
  const res = await ai.models.generateContent({
    model: MODEL,
    contents: asset.prompt,
    config: {
      responseModalities: ["Text", "Image"],
      ...(asset.aspectRatio
        ? { imageConfig: { aspectRatio: asset.aspectRatio } }
        : {}),
    },
  });

  const parts = res?.candidates?.[0]?.content?.parts ?? [];
  let saved = 0;
  for (const part of parts) {
    if (part.inlineData?.data) {
      const buf = Buffer.from(part.inlineData.data, "base64");
      const ext = extOf(part.inlineData.mimeType);
      const rel = `${asset.folder}/${asset.key}-${n}.${ext}`;
      await writeFile(join(OUT_ROOT, rel), buf);
      console.log(`    ✓ ${rel}  (${(buf.length / 1024).toFixed(0)} KB)`);
      saved++;
    } else if (part.text) {
      console.log(`    · note: ${part.text.trim().slice(0, 120)}`);
    }
  }

  if (saved === 0) {
    const reason =
      res?.promptFeedback?.blockReason ||
      res?.candidates?.[0]?.finishReason ||
      "unknown";
    throw new Error(`no image returned (reason: ${reason})`);
  }
}

async function withRetry(fn, label) {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const msg = String(err?.message ?? err);
      if (attempt === MAX_RETRIES) throw err;
      const wait = 1500 * (attempt + 1);
      console.log(`    ! ${label} failed (${msg.slice(0, 100)}) — retry in ${wait}ms`);
      await sleep(wait);
    }
  }
}

async function main() {
  const queue = ONLY ? assets.filter((a) => a.key === ONLY) : assets;
  if (ONLY && queue.length === 0) {
    console.error(`✗ GEN_ONLY="${ONLY}" matched no asset key.`);
    process.exit(1);
  }
  console.log(
    `AI Lodge asset generation · model ${MODEL} · ${COUNT}/asset` +
      (ONLY ? ` · ONLY=${ONLY}` : "") +
      "\n",
  );

  // create output folders up front
  for (const a of queue) {
    await mkdir(join(OUT_ROOT, a.folder), { recursive: true });
  }

  let ok = 0;
  let fail = 0;
  for (const asset of queue) {
    console.log(`▶ ${asset.key} (Cat ${asset.category})`);
    for (let n = 1; n <= COUNT; n++) {
      try {
        await withRetry(() => generateOne(asset, n), `${asset.key}-${n}`);
        ok++;
      } catch (err) {
        fail++;
        console.error(`    ✗ ${asset.key}-${n}: ${String(err?.message ?? err).slice(0, 160)}`);
      }
      await sleep(600); // gentle pacing between calls
    }
  }

  console.log(`\nDone. ${ok} image(s) saved, ${fail} failure(s).`);
  console.log(`Review them in: asset-review/`);
  if (fail > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error("Fatal:", String(err?.message ?? err));
  process.exit(1);
});
