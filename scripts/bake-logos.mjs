// Bake the Spring-2027 lodges' logos into alpha masks: logos/<file> -> public/logos/<slug>.png
//
// Same contract as the older masks from optimize-media.mjs: a transparent PNG whose ALPHA is
// the logo's shape, painted any colour by CSS `mask-image` (LodgeMark / LodgeTicker). The new
// sources aren't all black-on-white, so each job picks an extraction mode:
//   dark      black art on a light ground (alpha = how dark)          — MIT, PandAI, HawKins, IDW, Boliao
//   colour    any colourful art on white (alpha = how far from white)  — Spice chilli
//   alpha     art that already has transparency                        — Despacito neon
//   edges     sobel line-art, for dark-on-dark full-colour scenes      — BRYan cat badge
//   emblem    filled silhouette minus its yellow field + black recesses — Superpower 3D shield
// Optional `clean` (blur radius) re-thresholds to drop specks; optional `trace` runs potrace to
// smooth the result into vector curves. Output is trimmed to the art with 3% padding.
//
// Sources in logos/ are gitignored; only public/logos/*.png is committed.
// Run: node scripts/bake-logos.mjs   (or: node scripts/bake-logos.mjs superpower bryan)
import sharp from "sharp";
import potrace from "potrace";
import { fileURLToPath } from "node:url";

const ROOT = new URL("../", import.meta.url);
const rp = (rel) => fileURLToPath(new URL(rel, ROOT));
const clamp = (v) => Math.max(0, Math.min(1, v));
const L = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;
// each fn: (r,g,b,a) -> alpha 0..1
const MODES = {
  dark: ({ lo, hi }) => (r, g, b) => clamp((hi - L(r, g, b)) / (hi - lo)),
  bright: ({ lo, hi }) => (r, g, b) => clamp((L(r, g, b) - lo) / (hi - lo)),
  red: ({ lo, hi }) => (r, g, b) => (r > 90 ? clamp((r - Math.max(g, b) - lo) / (hi - lo)) : 0),
  colour: ({ lo, hi }) => (r, g, b) => clamp((hi - Math.min(r, g, b)) / (hi - lo)),
  alpha: ({ lo, hi }) => (r, g, b, a) => clamp((a - lo) / (hi - lo)),
  // stencil: the COLOURED parts become the mark and black ink + white ground are cut out,
  // so dark facial features (eye sockets, mouth) read as holes; yellow hues are lighter
  stencil: ({ lo = 60, hi = 130, yellow = 0.5 }) => (r, g, b) => {
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), chroma = mx - mn;
    const base = clamp((chroma - lo) / (hi - lo));
    const isYellow = r > 180 && g > 130 && b < 120;
    return base * (isYellow ? yellow : 1);
  },
  // "everything that isn't the dark background and isn't yellow": a 3D red-and-yellow
  // emblem flattens to its red parts (border + letter), with the yellow field cut out
  // red hue at any lightness (dark maroon bevels to bright faces) + white specular glints;
  // yellow fill and black recesses fall away -> the flat two-part emblem (border + letter)
  redHue: ({ ratio = 1.7, minR = 55, glint = 215 }) => (r, g, b) => {
    if (r > glint && g > glint * 0.8 && b > glint * 0.8) return 1;
    return r >= minR && r > g * ratio && r > b * ratio ? 1 : 0;
  },
  notYellow: ({ dark = 45, yg = 0.62 }) => (r, g, b) => {
    const lum = L(r, g, b);
    if (lum < dark) return 0;
    const yellow = r > 130 && g / r > yg && b < g * 0.75;
    return yellow ? 0 : 1;
  },
};
// sobel edge magnitude on luminance -> line art (for dark-on-dark colour art)
async function edges(src, W, { lo, hi, pre = 1.2 }) {
  const { data, info } = await sharp(src).resize({ width: W, withoutEnlargement: true }).flatten({ background: "#000" }).toColourspace("b-w").blur(pre).raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height, out = Buffer.alloc(w * h);
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const i = y * w + x, p = (dx, dy) => data[i + dy * w + dx];
    const gx = -p(-1,-1) - 2*p(-1,0) - p(-1,1) + p(1,-1) + 2*p(1,0) + p(1,1);
    const gy = -p(-1,-1) - 2*p(0,-1) - p(1,-1) + p(-1,1) + 2*p(0,1) + p(1,1);
    out[i] = Math.round(255 * clamp((Math.hypot(gx, gy) - lo) / (hi - lo)));
  }
  return { a: out, info };
}
const JOBS = [
  ["mit.jpg", "mit", "dark", { lo: 60, hi: 170 }],
  ["pandAI.png", "pandai", "dark", { lo: 70, hi: 200 }],
  ["hawkins.png", "hawkins", "dark", { lo: 70, hi: 200 }],
  ["idw.png", "idw", "dark", { lo: 60, hi: 190 }],
  ["bryan.png", "bryan", "edges", { lo: 55, hi: 130, pre: 1.6, clean: 1.3, cut: 118, trace: { turdSize: 25, alphaMax: 1.0, optTolerance: 0.3 } }],
  ["superpower.jpg", "superpower", "emblem", { bgMax: 50, yRatio: 24, clean: 1.6, cut: 128, trace: { turdSize: 60, alphaMax: 1.1, optTolerance: 0.4 } }],
  ["boliao.jpg", "boliao", "dark", { lo: 70, hi: 120 }],
  ["spice.jpg", "spice", "colour", { lo: 225, hi: 245, clean: 1.5, cut: 128 }],
  // v2: flaming skull-chilli as a stencil — chilli/flames/stem are the mark, black ink
  // (eyes, mouth, outlines) is cut out so the skull face reads; flames at half strength
  ["spicev2 logo.jpg", "spice-2", "stencil", { lo: 30, hi: 85, yellow: 0.55 }],
  ["despacito.png", "despacito", "alpha", { lo: 150, hi: 220 }],
];
// filled emblem silhouette minus its yellow field and neutral-black recesses
async function emblem(src, W, { bgMax = 50, yRatio = 0.5 }) {
  const { data, info } = await sharp(src).resize({ width: W, withoutEnlargement: true }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height, n = w * h;
  const px = (i) => [data[i * 3], data[i * 3 + 1], data[i * 3 + 2]];
  const isRed = (r, g, b) => r > 50 && r > g * 1.9 && r > b * 1.9;
  // background = non-red dark pixels connected to the image border (flood fill)
  const bg = new Uint8Array(n), stack = [];
  const isBgLike = (i) => { const [r, g, b] = px(i); return !isRed(r, g, b) && Math.max(r, g, b) < bgMax + 30; };
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
  while (stack.length) {
    const i = stack.pop();
    if (bg[i] || !isBgLike(i)) continue;
    bg[i] = 1;
    const x = i % w, y = (i / w) | 0;
    if (x > 0) stack.push(i - 1); if (x < w - 1) stack.push(i + 1);
    if (y > 0) stack.push(i - w); if (y < h - 1) stack.push(i + w);
  }
  const a = Buffer.alloc(n);
  for (let i = 0; i < n; i++) {
    if (bg[i]) continue;
    const [r, g, b] = px(i);
    // hue test: the yellow field shades through orange toward the red bevels, so split
    // by hue angle (yellow/orange >= hueCut degrees; red faces and bevels below it)
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), sat = mx ? (mx - mn) / mx : 0;
    const hue = mx === mn ? 0 : mx === r ? (60 * ((g - b) / (mx - mn)) + 360) % 360 : mx === g ? 60 * ((b - r) / (mx - mn)) + 120 : 60 * ((r - g) / (mx - mn)) + 240;
    const yellow = sat > 0.55 && mx > 120 && hue >= yRatio && hue < 80;
    const recess = !isRed(r, g, b) && Math.max(r, g, b) < bgMax + 20;
    a[i] = yellow || recess ? 0 : 255;
  }
  return { a, info };
}

async function bake(src, mode, p, W = 720) {
  let a, info;
  if (mode === "edges") ({ a, info } = await edges(src, W, p));
  else if (mode === "emblem") ({ a, info } = await emblem(src, W, p));
  else {
    const r = await sharp(src).resize({ width: W, withoutEnlargement: true }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    info = r.info; const f = MODES[mode](p), n = info.width * info.height; a = Buffer.alloc(n);
    for (let i = 0; i < n; i++) a[i] = Math.round(255 * f(r.data[i * 4], r.data[i * 4 + 1], r.data[i * 4 + 2], r.data[i * 4 + 3]));
  }
  // optional cleanup: soften then re-threshold -> crisp flat shapes, specks removed
  if (p.clean) {
    const b = await sharp(a, { raw: { width: info.width, height: info.height, channels: 1 } }).blur(p.clean).extractChannel(0).raw().toBuffer();
    for (let i = 0; i < b.length; i++) a[i] = Math.round(255 * clamp((b[i] - (p.cut ?? 128) + 24) / 48));
  }
  const n = info.width * info.height;
  let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
  for (let i = 0; i < n; i++) {
    const v = a[i];
    if (v > 40) { const x = i % info.width, y = (i / info.width) | 0; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  const pad = Math.round(Math.max(x1 - x0, y1 - y0) * 0.03);
  const L0 = Math.max(0, x0 - pad), T0 = Math.max(0, y0 - pad);
  const w = Math.min(info.width - L0, x1 - x0 + 2 * pad), h = Math.min(info.height - T0, y1 - y0 + 2 * pad);
  const alpha = await sharp(a, { raw: { width: info.width, height: info.height, channels: 1 } }).extract({ left: L0, top: T0, width: w, height: h }).extractChannel(0).raw().toBuffer();
  return sharp({ create: { width: w, height: h, channels: 3, background: "#ffffff" } }).joinChannel(alpha, { raw: { width: w, height: h, channels: 1 } }).png({ compressionLevel: 9, palette: true });
}

/** potrace a mask into smooth curves, rasterised back to a W-wide alpha mask */
async function smooth(maskPng, opts, W = 720) {
  const ink = await sharp(maskPng).ensureAlpha().extractChannel(3).negate().png().toBuffer();
  const svg = await new Promise((res, rej) =>
    potrace.trace(ink, { threshold: 128, color: "#000", background: "transparent", ...opts }, (e, out) => (e ? rej(e) : res(out))),
  );
  const { data, info } = await sharp(Buffer.from(svg)).resize({ width: W }).ensureAlpha().extractChannel(3).raw().toBuffer({ resolveWithObject: true });
  return sharp({ create: { width: info.width, height: info.height, channels: 3, background: "#ffffff" } })
    .joinChannel(data, { raw: { width: info.width, height: info.height, channels: 1 } })
    .png({ compressionLevel: 9, palette: true });
}

const only = process.argv.slice(2);
for (const [file, slug, mode, p] of JOBS) {
  if (only.length && !only.includes(slug)) continue;
  let img = await bake(rp(`logos/${file}`), mode, p);
  if (p.trace) img = await smooth(await img.toBuffer(), p.trace);
  const out = rp(`public/logos/${slug}.png`);
  const { size } = await img.toFile(out);
  console.log(`logo  ${file.padEnd(15)} -> logos/${slug}.png  ${(size / 1024).toFixed(0)} KB  (${mode})`);
}
