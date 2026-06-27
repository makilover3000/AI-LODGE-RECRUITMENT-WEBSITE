# AI Lodge — Recruitment Site

The recruitment intro site for **AI Lodge (AIL)**, an 8-week AI/ML learning
programme under **SMU BIA**. It has its own identity — a retro **forest-lodge /
National-Park travel-poster** look (deliberately *not* the parent BIA theme).

The signature element is a cinematic **entry splash** (a painted golden-hour cabin
scene that sweeps away) which plays once per browser session, then reveals the
landing page.

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **Tailwind CSS v4** (via `@tailwindcss/postcss`)
- **GSAP** for the entry / splash animation
- **TypeScript**
- Hand-built **SVG illustration** for the lodge scenes

> ⚠️ **Note:** this repo uses a modified Next.js with some breaking changes vs.
> stock Next. Before changing Next-specific code, read the relevant guide in
> `node_modules/next/dist/docs/` rather than assuming the usual APIs. See
> `AGENTS.md`.

## Prerequisites

- **Node.js 20+** (developed on Node 24)
- **npm** (comes with Node)

## Getting started

From the project root:

```bash
# 1. Install dependencies (first time only)
npm install

# 2. Start the dev server
npm run dev
```

Then open **http://localhost:3000** in your browser.

The dev server hot-reloads on file changes. To replay the entry splash, open a
fresh tab or an incognito window (it's gated by `sessionStorage`).

### Available scripts

| Command         | What it does                                        |
| --------------- | --------------------------------------------------- |
| `npm run dev`   | Start the local dev server (Turbopack) on port 3000 |
| `npm run build` | Production build                                     |
| `npm run start` | Serve the production build (run `build` first)       |
| `npm run lint`  | Run ESLint                                           |

## Project structure

```
src/
├─ app/
│  ├─ layout.tsx              # Root layout: fonts + global grain overlay
│  ├─ page.tsx               # Home: entry splash + landing sections
│  ├─ globals.css            # Design tokens (colour / type / motion)
│  └─ lodges/[slug]/page.tsx # Individual lodge detail pages
├─ components/
│  ├─ entry/                 # Entry/splash experience (GSAP) + scene
│  ├─ landing/               # Hero, timeline, why-join, lodge grid, CTAs…
│  ├─ layout/                # NavBar, Footer, GrainOverlay
│  ├─ lodge/                 # Lodge detail UI (hero, captain, week list…)
│  └─ ui/                    # Shared bits (icons, scroll reveal, treeline…)
├─ data/
│  └─ lodges.ts              # Typed lodge data (names/captains are placeholders)
└─ lib/
   └─ splash.ts              # Session gate + reduced-motion helpers
```

## How the page is composed

`src/app/page.tsx` renders the entry experience, then the landing page:

```
<EntryExperience />        ← entry splash, plays once per session
<NavBar />
Hero → InfoStrip → WhyJoin → LodgeGrid → ProgrammeTimeline
     → ApplicationsBanner → ApplicationProcess → ApplyCTA
<Footer />
```

## Content

Lodge names, captains, and week topics in `src/data/lodges.ts` are **placeholders**
— swap them for the final content when it's confirmed.

## Notes

- `.env.local` (gitignored) holds a `GEMINI_API_KEY` that was used by the old
  local asset-generation scripts. The **live app does not need it** — you can run
  the site without any environment variables.
- Accessibility: the entry animation respects `prefers-reduced-motion` (it skips
  the cinematic push-in and shows the resolved scene).
