# AI Lodge — Project Bible (single source of truth)

> **Fresh chat? Read this whole file first.** It's the one doc for this project:
> what it is, how it's built *now*, how to run/deploy it, the design system, the
> final copy, the asset pipeline, and the hard-won gotchas. Last updated 2026-06-27.
>
> ⚠️ **Modified Next.js:** this repo runs a customized **Next 16.2.9** with breaking
> changes vs. stock. Before writing Next-specific code, read the relevant guide in
> `node_modules/next/dist/docs/` — don't assume training-data APIs. (Also in `AGENTS.md`.)

---

## 1. What this is
The **recruitment / intro site** for **AI Lodge (AIL)** — an 8-week AI/ML learning
programme under **SMU BIA**. Students join small "lodges" of **8–12** people led by
**3 lodge captains** each, learn through peer + hands-on weekly sessions, and finish
with a hackathon. This site exists to get people to **apply**.

Its identity is deliberately its **own**: a retro **forest-lodge / National-Park
travel-poster** world (warm, cozy-adventurous) — *not* the parent BIA dark-teal theme.
Audience: SMU students of **any background**, non-technical welcome.

The signature element is a cinematic **entry screen** that plays **once per session**,
then sweeps away to reveal the landing page.

---

## 2. Tech stack
- **Next.js 16.2.9** (App Router, **Turbopack**) — *modified build, see warning above*
- **React 19** · **TypeScript**
- **Tailwind CSS v4** (`@tailwindcss/postcss`; tokens in `globals.css` via `@theme`)
- **GSAP** — entry animation + scroll reveals
- **sharp** — local image optimization script only (not used at runtime)
- Fonts via `next/font/google`: **Anton** (display), **Barlow Condensed** (body),
  **Pacifico** (script accent)

### Run / build / deploy
```bash
npm install          # first time
npm run dev          # local dev (Turbopack) → http://localhost:3000
npm run build        # production build
npm run start        # serve the production build (run build first)
npm run lint         # eslint
```
- **Deploy target: Vercel.** Everything in `public/` is served as-is.
- **Always sanity-check the entry on a *production* build** (`build` + `start`), not
  `dev`. Dev re-optimizes images per request and is **not** representative of Vercel —
  this is exactly what masked/created the old startup glitch (see §6).
- The live app needs **no environment variables**. (`.env.local` holds an old
  `GEMINI_API_KEY` for the asset scripts only — gitignored, never commit/print it.)

---

## 3. Architecture & file map
Components are organized by **domain folder** (not flat):
```
src/
├─ app/
│  ├─ layout.tsx               # fonts, metadata/OG, GrainOverlay, pre-paint anti-FOUC script
│  ├─ page.tsx                 # composes EntryExperience + landing sections
│  ├─ globals.css              # @theme design tokens (colour/type/motion) + base styles
│  └─ lodges/[slug]/page.tsx   # per-lodge detail page (SSG via generateStaticParams)
├─ components/
│  ├─ entry/                   # the entry screen
│  │  ├─ EntryExperience.tsx   # phase machine + once-per-session gate + scroll/inert lock
│  │  ├─ EntryScene.tsx        # the painted scene, ambient FX, parallax, Enter→wind-sweep
│  │  ├─ WindSweep.tsx         # the gust (curve arms + leaves) shown only during exit
│  │  └─ blur.ts               # base64 blur placeholders (BLUR_DESKTOP / BLUR_PORTRAIT)
│  ├─ landing/                 # Hero, InfoStrip, WhyJoin, LodgeGrid, ProgrammeTimeline,
│  │                           #   ApplicationsBanner, ApplicationProcess, ApplyCTA, LodgeCard
│  ├─ layout/                  # NavBar, Footer, GrainOverlay
│  ├─ lodge/                   # LodgeHero, LodgeOverview, WeekList, CaptainCard, AmbientLayer
│  └─ ui/                      # ScrollReveal, SignBubble, Treeline, CampIcon
├─ data/
│  └─ lodges.ts                # typed lodge data + isClosed() / getLodge() helpers
└─ lib/
   └─ splash.ts                # hasSeenSplash/markSplashSeen (sessionStorage) + prefersReducedMotion
```

### Landing composition (`app/page.tsx`, current order)
`EntryExperience` → `#site` { `NavBar` → **Hero → InfoStrip → WhyJoin → LodgeGrid →
ProgrammeTimeline → ApplicationsBanner → ApplicationProcess → ApplyCTA** → `Footer` } .
> **LodgeGrid sits early** (right after WhyJoin) so the lodges are seen quickly. The
> **"View Lodges"** CTA (Hero/NavBar/Footer/ApplyCTA/lodge pages) jumps to
> `#lodges` on `LodgeGrid`; `globals.css` sets `scroll-padding-top` so the fixed nav
> doesn't cover the heading.

---

## 4. The entry screen (how it works *now*)
The earlier hand-drawn SVG cabin + door-swing was **replaced** by a single **painted
golden-hour cabin image** (ChatGPT-generated) with a parallax/atmosphere layer and a
GSAP **wind-sweep** exit. Key pieces:

- **Anti-FOUC:** an inline `<script>` in `layout.tsx` runs *before first paint* and, if
  the splash will play this session, sets `html[data-splash="1"]` → `globals.css` hides
  `#site` (`visibility:hidden`) so the landing never flashes behind the entry.
- **Phase machine** (`EntryExperience.tsx`): `deciding → scene → done`. The one-tick
  client decision shows a **blurred painting cover** (not a flat colour) so the hand-off
  into the scene is seamless. Skips to `done` if `hasSeenSplash()` or `?nosplash`.
  Locks scroll + `inert`s `#site` while active; reveals `#site` exactly when the sweep
  begins (`onEnterStart` removes `data-splash`).
- **Session gate** (`lib/splash.ts`): `sessionStorage` key `ail-splash-seen` — plays
  once per session, **not** every reload/in-session nav; deep-links to `/lodges/[slug]`
  never trigger it. `?nosplash` previews the landing directly.
- **Scene** (`EntryScene.tsx`): blur underlay → sharp image fades in over it (focus-pull,
  no pop). Ambient: throttled (~24fps) `feTurbulence`/`feDisplacementMap` smoke on a
  duplicated top-band "AI LODGE" smoke-title layer, drifting cloud-haze, sun glow,
  flickering window, rising chimney puffs, dappled tree-light, vignette, firefly
  `<canvas>`, mouse parallax (`data-parallax` depths). **Enter** = mount `WindSweep` +
  slide the whole `.ail-world` off (`xPercent:115`) to uncover the landing.
- **Per-composition tuning:** `TUNE_DESKTOP` / `TUNE_MOBILE` in `EntryScene.tsx`
  (`focus` = window glow, `chimney` = plume origin, `sun`, `titleMaskStop` = bottom of
  the smoke-title band). Adjust these if the art is swapped.
- **Reduced motion:** `prefersReducedMotion()` branch skips ambient + sweep → static
  scene with a simple fade. Respect it.

---

## 5. Design system
**Aesthetic:** flat-vector retro National-Park / camping poster — layered silhouettes,
value contrast for depth (darkest front → palest back), flat fills, slight hand-cut
irregular edges (`.edge-rough`), and a subtle **grain overlay** (`GrainOverlay`, ~0.16
opacity, multiply — *essential*; without it the page reads like a generic template).

**Palette** (canonical = `globals.css @theme`; hex for reference):
- Sky/cream `#E7E4CB` · cream-50 `#F2F0DD` · ground `#C9B347`
- Trees (front→back) `#1F2B21` `#2B482D` `#4B6639` `#627942` · mist `#A6B6A1` `#679D86`
- Cabin: roof `#A35A42`, roof-dark `#6F3C2A`, window `#27442D`, accent `#C06B4D`,
  log `#B07A4E`, log-dark `#8A5C36`
- Teal UI: `#3BB9AF` · deep `#0D6F62` · ink `#0A5F54` · border `#118676` · hi `#5EBAAB`
- Ink charcoal `#3E3E3A` · warm glow `#FFCF87` / `#FFB24D`

**Type:** display **Anton** (uppercase, condensed, tracking ~0.035em), body **Barlow
Condensed**, script accent **Pacifico**. Fluid `clamp()` scale lives in `@theme`.
Keep these characterful choices (per the frontend-design skill — avoid generic fonts).

---

## 6. Performance gotchas (hard-won — don't regress these)
- **The startup "glitch" was a 14 MB `entry-hd.png`** that Next re-optimized on every
  request → multi-second freeze. **Fix:** `scripts/optimize-entry.mjs` (sharp) shrinks
  the oversized AI PNGs into web-weight JPGs, and the code loads the **`.jpg`**
  (`entry-hd.jpg` ≈ 539 KB). Never point the scene at the raw PNG.
- **Heavy PNG source originals are gitignored** (`public/entry/*.png`). They stay on
  disk so you can re-run the optimize script, but only the optimized **`.jpg`** is
  committed/served. To regenerate: `node scripts/optimize-entry.mjs`.
- **`.gitignore` has no inline comments** — a trailing `# ...` becomes part of the
  pattern. Keep comments on their own lines.
- Smoke `feTurbulence` re-rasterizes the viewport; it's throttled to ~24fps and the
  seed loop is cancelled on Enter to free the GPU for a smooth sweep. Keep it throttled.
- After big refactors, restart dev + clear `.next` if Turbopack acts up.
- React 19 + `eslint-config-next` is strict: imperative GSAP/canvas trips
  `react-hooks/*` rules — scope a per-line/file disable with a comment where the code is
  genuinely imperative (e.g. the post-mount `sessionStorage`/`matchMedia` reads).

---

## 7. Content & copy
Programme copy lives in the **components**; lodge data is in **`src/data/lodges.ts`**.

**Status:** lodge **names are forest placeholders** (Cedar, Birch, Aspen, Maple, Willow,
Hemlock) + one **LLM Lodge** (`status:"closed"`). Captains/week topics are placeholders.
**Naming rule: show each lodge's own name only — never "X's lodge".** Real names/captains
swap into `lodges.ts` without touching layout.

Lodge intent baked into the data (from Sonya): **Cedar** = beginner / non-technical
(applied AI, latest tools, tech news) · **Aspen** = most technical (ML/AI theory,
nets-from-scratch, transformers) · **LLM Lodge** = closed, shown with goals + session
length · others span product/data/agents at mixed levels.

**Canonical programme facts:**
- Small lodges of **8–12**, **3 captains** each.
- Timeline: Week 1–8 sessions → **Recess** hack day → **Week 10** hackathon finals &
  project exhibition. Exact day/time **TBC** until applications close.
- Applications: **Open 13 Jul → Deadline 2 Aug 23:59 → Results 11 Aug**.
- Application process (order matters): Stage 1 recruitment task suite → Stage 2 solo
  interviews with indicated lodges' captains → Stage 3 results + lodge allocation.
- **Why join** includes the **startup/IIE angle**: the final hackathon project can be a
  real startup idea, with mentor support and external judges giving investor-style
  feedback — a low-stakes way to test an idea (see `landing/WhyJoin.tsx`).

**Sem-2 idea (not built):** a personality/fit quiz (Chris's "task suite") that suggests
lodges based on learning style/background — possible future addition to the info site.

---

## 8. Assets
- `public/entry/*.jpg` — the optimized scene/landing images actually used
  (`entry-hd`, `entry-hd-portrait`, `entry-web`, `entry-web-portrait`, `close-desktop`,
  `hero-poster`). `*.png` = gitignored sources (§6).
- `public/textures/` — `grain.jpg` (overlay), `cabin-log.jpg`, smoke-title PNGs.
- `public/og.jpg` (social card), `public/smu-bia-logo.png`.
- `asset-review/` + `asset-review/SELECTIONS.md` — the Nano Banana Pro generation review
  set and the locked picks (reference record; not all wired).
- **Gen tooling:** images came from **Gemini "Nano Banana Pro"** (~$0.13/img). It's
  expensive and the account hit a spend cap — **preview cheap (1 img) before batch runs**,
  and chroma-key/crop locally with `sharp` (free). Returned JPEGs had a *painted*
  checkerboard, not real alpha — anything needing transparency must be keyed.

---

## 9. Pitfalls to avoid (the entry-screen saga, distilled)
Four entry approaches were tried; the honest record so nobody repeats the dead ends:
1. **Flat hand-drawn SVG splash** → looked flat/amateur (craft too low).
2. **Real 3D (react-three-fiber)** → untextured primitives looked like a toy; heavy on phones.
3. **Drawn silhouettes over real golden-hour video** → cabin always "floated" (drawn art
   never matches a photo's ground plane/light); 4K video also huge + brightness swings.
4. **✅ Single cohesive painted scene + parallax/atmosphere + GSAP sweep** (current) — no
   floating because the cabin is *in* the art; light, phone-friendly.

**Lessons (keep forever):** Cohesion > realism. Never composite hand-made art onto
photos/video. Untextured 3D = toy. Don't chase photorealism for a phone-first recruit
site — stylized + cohesive + atmospheric wins. Avoid big 4K video heroes. Don't blast
Gemini batches. Don't trust headless screenshots for *motion* (GSAP/canvas don't advance
under virtual-time — use `--force-prefers-reduced-motion` for layout shots, judge motion
live in a real browser).

---

## 10. Working preferences (this user)
- SMU student; values **quality** but dislikes wasted overhead. Budget-aware on Gemini
  credit **and** Claude usage.
- **Don't spawn subagents unless asked.** **Commit/push only when asked** — confirm
  before big or hard-to-reverse moves. Use the project's `.claude` skills/agents
  (frontend-design + ui-ux-designer review) for real frontend/design work.
- Verify changes on a **production build** before declaring the entry glitch-free.
