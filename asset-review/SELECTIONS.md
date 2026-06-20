# AI Lodge — Selected Assets (review pass, 2026-06-21)

User-confirmed picks from the Nano Banana Pro review set. Nothing here is wired
into the live site yet — this is the manifest for the downstream wiring/SVG phase.

| Category | Pick | Use | Notes |
|---|---|---|---|
| Smoke-word title | `smoke-title/smoke-title-1.jpg` | Cat A — ship-as-is | Stacked, billowing "AI / LODGE". Needs **true alpha** at wiring time (chroma-key or targeted regen — current bg is painted checkerboard). #2 is the single-line fallback. |
| Trees | `trees-reference/trees-reference-3.jpg` | Cat B — reference → SVG | Two-tone (dark + olive) depth; redraw as separable midground/foreground pine groups. |
| Clouds | `clouds-reference/clouds-reference-3-clean.jpg` | Cat B — reference → SVG | Title text removed via Gemini edit; 4 cloud shapes intact. Source: `clouds-reference-3.jpg`. |
| Cabin-log texture | `cabin-log-texture/cabin-log-texture-3.jpg` | Cat C — card bg fill | Horizontal log wall. **Verify seamless tiling** before applying via `<pattern>`/CSS. |
| Grain texture | `grain-texture/grain-texture-1.jpg` | Cat C — overlay | Subtle paper. A/B at low opacity vs current `GrainOverlay.tsx` digital noise before swapping. |
| Camping spot-motifs | `spot-motifs/spot-motifs-2.jpg` | Cat B — reference → SVG icons | Flat (no sticker border); trace individual icons, drop signpost text. |
| OG / social card | `og-card/og-card-1.jpg` | Cat A — ship-as-is | Final = scene + chosen smoke-word composited; crop to 1200×630; add to page metadata. |
| Foreground enrichment | `foreground-enrichment/foreground-enrichment-1.jpg` | Cat B — reference → SVG | More detailed (rocks/ferns/woodpile/path). |

## Deferred
- Per-lodge emblems — gated on final lodge names; add optional `emblem?` field to `Lodge` in `src/data/lodges.ts` when revisited.

## Downstream wiring (next phase, on user go-ahead)
- Smoke-word → true-alpha PNG → `public/textures/` → in-SVG `<image>` at chimney `(605, 580)` → GSAP push-in timeline.
- Trees/clouds/motifs/foreground → hand-redrawn SVG (use `frontend-design` skill), kept as independently animatable layers/groups per the layer-grouping plan.
- Cabin-log → lodge card background; grain → refine `GrainOverlay.tsx`; OG → metadata.
