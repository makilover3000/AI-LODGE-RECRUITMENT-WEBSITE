/**
 * AI Lodge — one-off image edit via the Gemini image API (Nano Banana Pro).
 *
 * Feeds an existing image back to the model with an edit instruction (inpaint /
 * text-removal / background changes). Local tooling only; same key handling as
 * generate-assets.mjs (GEMINI_API_KEY from process.env, never logged).
 *
 * Usage:
 *   node --env-file=.env.local scripts/edit-asset.mjs <input> <output-basename> "<instruction>"
 *   (output extension is chosen from the returned image's mime type)
 */

import { GoogleGenAI } from "@google/genai";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, extname } from "node:path";

const MODEL = "gemini-3-pro-image-preview";

const [, , input, outBase, prompt] = process.argv;
if (!input || !outBase || !prompt) {
  console.error(
    'usage: edit-asset.mjs <input> <output-basename> "<instruction>"',
  );
  process.exit(1);
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("✗ GEMINI_API_KEY not set (run via --env-file=.env.local).");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const mimeOf = (p) =>
  ({ ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" })[
    extname(p).toLowerCase()
  ] || "image/png";
const extFor = (mime) => (mime && mime.includes("jpeg") ? "jpg" : "png");

const buf = await readFile(input);
const res = await ai.models.generateContent({
  model: MODEL,
  contents: [
    { inlineData: { data: buf.toString("base64"), mimeType: mimeOf(input) } },
    { text: prompt },
  ],
  config: { responseModalities: ["Text", "Image"] },
});

const parts = res?.candidates?.[0]?.content?.parts ?? [];
let wrote = null;
for (const part of parts) {
  if (part.inlineData?.data) {
    const out = `${outBase}.${extFor(part.inlineData.mimeType)}`;
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, Buffer.from(part.inlineData.data, "base64"));
    wrote = out;
    console.log(`✓ wrote ${out}`);
  } else if (part.text) {
    console.log(`· note: ${part.text.trim().slice(0, 160)}`);
  }
}

if (!wrote) {
  const reason =
    res?.promptFeedback?.blockReason || res?.candidates?.[0]?.finishReason || "unknown";
  console.error(`✗ no image returned (reason: ${reason})`);
  process.exit(1);
}
