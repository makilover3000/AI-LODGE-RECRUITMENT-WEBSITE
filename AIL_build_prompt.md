# AI Lodge (AIL) Recruitment Website — Build Brief

## Context
AI Lodge (AIL) is an 8-week AI/ML learning programme under SMU BIA, organized into small "lodges" of 8-12 students led by 3 lodge captains each. This is the recruitment/intro site for the upcoming cycle. It is a NEW visual identity, distinct from the parent BIA site (which uses a dark green/teal astronaut-cat mascot theme) — this site uses a retro forest-lodge/cabin illustration style, based on an existing recruitment poster that must be matched closely.

Tech stack: Next.js (App Router) + Tailwind CSS + GSAP (animation/ScrollTrigger) + SVG (illustration layers). No Three.js needed — the scene is 2D illustrated, not 3D modeled.

## Visual identity — MATCH THIS EXACTLY, do not reinterpret

**Style**: Flat vector illustration, retro National Park / camping-lodge travel poster aesthetic. Large simplified silhouette shapes, not outline-heavy. Slightly irregular/imperfect edges (hand-cut paper feel, not sterile geometric vector). Depth via layered silhouettes + value contrast (darkest in foreground, palest in background), NOT digital gradients. Flat color fills throughout. A subtle grain/noise texture overlay sits over the entire scene (feTurbulence SVG filter or noise PNG, low opacity, multiply blend) — this is essential, without it the design loses its poster charm and looks like a generic template.

**Color palette**:
- Sky: `#E7E4CB` (warm cream, not pure white)
- Ground/grass: `#C9B347`
- Trees (foreground → background, darkest to lightest): `#1F2B21` → `#2B482D` → `#4B6639` → `#627942`
- Distant mountain/mist: `#A6B6A1`, `#679D86`
- Cabin roof: `#A35A42`, roof shadow/outline: `#6F3C2A`, windows: `#27442D`, small highlight accent: `#C06B4D`
- Speech bubble/UI teal: fill `#3BB9AF`, border `#118676`, inner highlight `#5EBAAB`
- Text: charcoal `#3E3E3A` (titles), cream `#F2F0DD` (on teal/dark backgrounds)

**Typography**:
- Display/title font: Bebas Neue or Anton — bold, condensed, uppercase, heavy weight, letter-spacing ~0.04em
- Body/UI/bubble font: Barlow Condensed Bold or Oswald Bold — tight line-height (~0.9), condensed
- Accent script (for any "save the date"-style flourish text): Pacifico or Yellowtail

**Composition** (back to front):
1. Split background: cream sky top ~60%, yellow-grass ground bottom ~40%
2. Distant horizon: jagged tree-line silhouette in lightest green
3. Midground pine trees framing left/right of middle third
4. Cabin centered, lower-third, ~25-30% width / ~18-22% height of frame, with soft curved smoke trail rising from chimney through the speech-bubble zone
5. Foreground trees: massive, darkest green, cropped at frame edges, some extending past top edge — these frame the whole scene
6. Speech bubbles: irregular polygon signboards (use `clip-path: polygon(...)`), NOT rounded rectangles — thick teal border, turquoise fill, small triangular pointer, slight offset drop shadow
7. Title "AI LODGE" arced upward (convex), via SVG `<textPath>`, sitting in the cream sky/upper third

## Project setup
- `create-next-app` with TypeScript + Tailwind CSS + App Router, `src/` directory
- Package manager: npm
- Install GSAP (`gsap` package, including `ScrollTrigger`)
- Folder structure:
  - `src/app/page.tsx` — landing page (splash screen renders conditionally on top of this based on session logic below)
  - `src/app/lodges/[slug]/page.tsx` — shared lodge page template
  - `src/components/` — SplashScreen, Hero, TimelineSection, LodgeCard, LodgeGrid, AmbientLayer, etc.
  - `src/data/lodges.ts` — typed array of lodge data (placeholder entries for now, structured to receive real data later)
  - `public/textures/` — grain/noise overlay assets if using a PNG rather than pure SVG `feTurbulence`

## Site flow (in order)

1. **Land on splash screen** (`/`, first visit this session) — full cabin/forest scene, fixed full-screen, no scroll. Smoke loops continuously, title shimmers softly. Door has a subtle interactive cue (glow/pulse) so it reads as clickable, not just decoration.
2. **Click the door** — door swings open on its hinge with eased anticipation (not a linear snap) → transitions into the landing page. This is the signature moment.
3. **Landing page content**, in scroll order: hero/AIL summary → basic info strip → programme timeline → why join us (+ link out to BIA site for past projects) → applications timeline banner → lodge showcase grid → apply CTA.
4. **Click a lodge card** → navigates to `/lodges/[slug]`. Same shared template, with that lodge's own ambient particle layer (stars/fireflies/dots/etc.) over the same cabin-world background. Shows lodge name, 3 capt cards, lodge overview, week-by-week list.
5. **Application process** — shown as an ordered sequence (Stage 1 → 2 → 3), since order carries real information here. Either its own anchor on the landing page or its own section near the bottom.
6. **Back navigation** from any lodge page returns to the landing page / lodge grid (nav bar or "back to lodges" link) — does NOT replay the door-swing splash.

### Splash screen session logic
The door-swing splash plays **once per session**, not on every load:
- On successfully opening the door, set a flag in `sessionStorage` (NOT `localStorage` — should clear when the tab closes, so it replays on a fresh visit tomorrow, just not on every reload/navigation within one visit).
- On landing page load, check this flag — if already set, skip the splash and render the landing page directly (no need to fake-replay the animation).
- **Anyone landing directly on a `/lodges/[slug]` URL** (e.g. from a shared Telegram/social link) skips the splash entirely regardless of session state — they didn't enter through the front door, don't force them through it. Splash only ever triggers from a fresh landing on `/`.

## Site scope: recruitment intro site ONLY (no past-projects archive — that lives on the BIA site, link out to it)

### Pages
1. **Splash/entry screen** — full cabin scene as described above. Door is clickable/tappable; on interaction, door swings open (CSS 3D transform, `perspective` + `rotateY`, with eased timing — anticipation before the swing, not a linear snap) and transitions into the Landing Page. Smoke animates continuously (subtle, looping). Title text has a slow shimmer/gradient sweep.

2. **Landing page** (`/`)
   - Hero: AIL summary — "AI Lodge is a structured learning programme built around a community with a shared interest in AI. Designed for anyone curious about AI regardless of technical background, emphasising peer learning and building real projects."
   - Basic info: small lodges of 8-12 pax, led by 3 lodge captains
   - Programme timeline: Week 1-8 lodge sessions → Recess week hack day → Week 10 hackathon finals & project exhibition day (note: exact session day/time confirmed after applications close — show as TBC)
   - Why join us: guided hands-on weekly projects · exposure to AI tools + foundational technical knowledge · build your own project with lodge capt support · link out: "See our lodgers' past projects" → BIA site
   - Applications timeline: Open 13 July → Deadline 2 Aug, 23:59 → Results 11 Aug
   - Lodge showcase grid: card per lodge, links to its page
   - Apply CTA

3. **Lodge pages** (`/lodges/[slug]`) — ONE shared template, used for 7-8 lodges
   - Lodge name (placeholder until confirmed)
   - 3 lodge captain cards: photo + name + faculty/year + telegram handle (placeholder data for now — structure must be ready to receive real data from a Google Sheet later)
   - Lodge overview: required skill level (beginner/intermediate), highlight topics, who this lodge is for, why join (incl. coding/math level expected), week-by-week topic list
   - Per-lodge ambient background variation: same cabin/forest template, but each lodge gets a distinct subtle particle/ambient layer (e.g. lodge A = soft drifting stars, lodge B = shiny floating dots, lodge C = fireflies, etc.) — small personality differentiator, not a different illustration style

4. **Application process** (section on landing page or its own anchor)
   - Stage 1: standardised recruitment task suite
   - Stage 2: solo interviews with lodge capts from all indicated-interest lodges
   - Stage 3: results release + lodge allocation/reshuffling per schedule

## Placeholder data policy
All copy above is real and final — use it as-is. Lodge names, lodge capt details (photos/names/faculty/telegram), and week-by-week topic lists are NOT final — build the structure/components to receive this data cleanly (e.g. a typed lodge data file/array) so it can be swapped in later without touching layout code.

## Build approach
- SVG for the full illustration (sky, mountain, trees, cabin, smoke)
- `clip-path: polygon()` for speech bubbles
- SVG `<textPath>` for the arced title
- GSAP for: door swing-open sequence (with easing/anticipation, not linear), continuous smoke loop, title shimmer loop, scroll-triggered reveals on the landing page
- Grain overlay via SVG `feTurbulence` filter, low opacity, applied globally
- Fully responsive down to mobile; respect `prefers-reduced-motion` (disable/simplify door swing + shimmer if set)
- Use the frontend-design skill's process: lock token system (color/type/layout/signature) before writing code — in this case the signature element is the door-swing-into-cabin-world entry sequence
