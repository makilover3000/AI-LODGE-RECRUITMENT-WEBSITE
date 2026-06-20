# AI Lodge — AI-Generated Asset Pipeline (Nano Banana Pro)

## Context
The user has a funded Gemini API key (Google AI Studio billing already set up). Use it to generate decorative/illustrative assets for the site via the Gemini API (model: `gemini-3-pro-image-preview`, aka Nano Banana Pro). This is a generation task, not a live app feature — run scripts locally to produce files, do not wire live API calls into the deployed site.

## CRITICAL — what NOT to use image generation for
- **No text content as images.** Lodge names, lodge captain names/bios/faculty/telegram handles, week-by-week topics, any copy from the brief — all of this MUST remain real HTML text. It's placeholder data now and needs to stay swappable later without regenerating images. Never bake this into a generated graphic.
- **No "fonts" via image generation.** Site typography comes from real web fonts already specified in the main brief (Bebas Neue/Anton for display, Barlow Condensed/Oswald for body), loaded via next/font or Google Fonts — not AI-generated pictures of lettering. The ONE exception: the decorative chimney smoke-word title ("AI LODGE"), which is a single non-editable hero graphic, not body content or live text.

## Asset categories — handle each differently

### Category A — Ship directly as raster PNG (used as-is)
These are one-off decorative graphics, fine to drop in as transparent PNGs:
1. **Smoke-word title**: "AI LODGE" in puffy hand-drawn cloud-letter style (the chimney payoff moment)

### Category B — Style reference ONLY (redraw as SVG, do not use the raster output directly)
These exist in the scene as separate animatable depth layers (per the prior codebase audit) — generating them as flat images and dropping them in would break that architecture. Generate these to use as a *visual reference* for redrawing clean SVG paths/shapes with the same style:
1. **Reference pine trees** — organic, irregular, hand-cut silhouette style (less uniform/geometric than current trees), matching the poster's retro travel-poster look
2. **Reference clouds** — soft, fluffy, painterly clouds in the same flat-illustration-with-grain style, for the new cold-open cloud layer

### Category C — Texture/pattern fills (used as repeating/stretched fills within existing vector shapes)
These can be used directly as raster textures applied via SVG `<pattern>` or CSS `background-image` onto existing shapes — not replacing the shapes, just texturing them:
1. **Cabin log wood texture** — reddish-brown wood grain matching the cabin, for use on lodge page cards (giving each lodge card a "cut from the same cabin" feel)
2. **Refined grain/paper texture** — replacing/supplementing the placeholder grain overlay referenced in the original brief (`public/textures/` doesn't exist yet per the audit)

## Step 0 — Set up the API key safely
1. Check if `.env.local` exists in the project root. If not, create it.
2. Check if `.gitignore` already excludes `.env.local` (or `.env*`). If not, add it — do this BEFORE creating the file with the real key in it.
3. Ask the user for their Gemini API key directly in this chat, then write it into `.env.local` as: `GEMINI_API_KEY=their_key_here`
4. Confirm the key is NOT printed back in full in any later output/logs — treat it as a secret from this point on.

## Script requirements
- Node script using the `@google/genai` package, model `gemini-3-pro-image-preview`
- API key read from `process.env.GEMINI_API_KEY`, loaded via `.env.local` — **never hardcode the key, never commit `.env.local`**
- For each asset below, generate 3–4 variations per prompt and save them to a clearly organized review folder structure, e.g.:
  - `asset-review/smoke-title/`
  - `asset-review/trees-reference/`
  - `asset-review/clouds-reference/`
  - `asset-review/cabin-log-texture/`
  - `asset-review/grain-texture/`
- Do NOT auto-select or wire any asset into live components yet. After generating, look at the outputs yourself (you have vision — give an honest opinion on which variation best matches the brief: legibility for the smoke-text, irregularity for the trees, etc.) and present your recommendation, but wait for the user's confirmation before finalizing which asset gets used and how.

## Per-asset generation prompts

**Smoke-word title** (Category A):
> Puffy hand-drawn cloud-letter typography spelling "AI LODGE", each letter formed from overlapping cumulus cloud puffs like cartoon smoke clouds shaped into bold block letters, thick black outline around each puff, white/cream fill, flat illustration style with slightly imperfect hand-cut edges, isolated on a plain transparent background, no other elements, centered composition, highly legible lettering

**Reference pine trees** (Category B — reference only):
> A cluster of organic, irregular pine trees in a flat vector retro travel-poster illustration style, hand-cut paper silhouette feel, asymmetric branch shapes, varied heights, not geometrically uniform, dark forest green tones, isolated on plain background, side-on view suitable for tracing as clean vector shapes

**Reference clouds** (Category B — reference only):
> Soft, fluffy, painterly clouds in a flat vector illustration style with subtle grain texture, warm cream and pale grey-green tones, retro travel-poster aesthetic, gently irregular puffy edges, isolated on plain background, suitable as a reference for vector cloud shapes

**Cabin log wood texture** (Category C):
> Seamless tileable wood log texture, reddish-brown rustic cabin wood grain, flat illustration style matching a retro National Park travel poster (not photorealistic), subtle grain/noise texture, warm earthy tones matching hex #A35A42 and #6F3C2A

**Refined grain/paper texture** (Category C):
> Seamless tileable fine-grain paper noise texture, subtle and low-contrast, warm cream tone, suitable as a low-opacity multiply-blend overlay for a vintage poster illustration

## After generation
Once the user has reviewed and picked final assets:
- Smoke-word PNG → goes into `public/textures/`, wired in as an in-SVG `<image>` element anchored at the chimney coordinates `(605, 580)` in the 1000×1000 viewBox, synced into the GSAP push-in timeline (see main build brief / push-in sequence spec)
- Tree/cloud references → used as visual guides to hand-build new SVG paths for the cloud layer (net-new) and improved pine tree shapes (replacing the current uniform ones), kept as separate, independently animatable layers/groups per the audit's layer-grouping plan
- Cabin log texture → applied as a card background treatment on lodge pages via SVG `<pattern>` or CSS, not replacing existing card structure
- Grain texture → replaces/refines the existing `GrainOverlay.tsx` approach, ideally tested with reduced blend-mode cost per the audit's performance note (full-screen `mix-blend-multiply` recompositing every frame during the push-in animation was flagged as a risk)
