"use client";

/**
 * WindSweep
 * ---------
 * A one-shot, full-viewport transition overlay: the VISIBLE WIND that shoves the
 * golden-hour cabin splash off to the right when the user clicks "Enter the
 * Lodge". It is mounted by the parent only when the transition begins, plays
 * exactly once, and then sits invisible/off-screen.
 *
 * This rebuild goes BIG, THICK and POWERFUL (the previous thin-stroke version
 * read as weak/weird):
 *   1. Three HUGE filled, heavily blurred crescent "arms" of wind. Each spans
 *      ~40-70% of the viewport height, is a soft cream/white filled SVG <path>,
 *      and is stretched on X for a motion-smear. They sweep fully across left ->
 *      right, staggered ~80-120ms apart so they read as 3 successive gusts that
 *      lead slightly ahead of the page (shoving it off).
 *   2. ~12 bold tumbling leaves (28-56px) in warm autumn + pine tones, riding
 *      the gusts across and exiting right.
 *
 * Performance contract (this replaces a janky transition, so this matters):
 *   - We animate ONLY `transform` (translate/rotate/scale) and `opacity`.
 *   - No layout-affecting properties, no per-frame JS — everything is pure CSS
 *     `@keyframes` with per-element inline `animationDelay`/`animationDuration`.
 *   - `animation-fill-mode: forwards` leaves every element at its end state
 *     (off-screen, invisible) so no cleanup loop is required.
 *   - All per-element values are index-derived (no Math.random) so SSR and CSR
 *     markup match exactly.
 *
 * The keyframes are emitted in a scoped <style> tag (class prefix `aws-`) so we
 * never touch globals.css.
 */

import type { CSSProperties } from "react";

// ---------------------------------------------------------------------------
// Tuning constants. The two worth touching:
//   SWEEP_MS   — overall gust duration in ms. Lower = faster/snappier gust.
//   LEAF_COUNT — how many leaves get blown across. Raise for a denser gust.
// ---------------------------------------------------------------------------

/** TUNE #1 — total sweep duration (ms). Keep ~800-950 for a quick, decisive gust. */
const SWEEP_MS = 880;
/** TUNE #2 — number of tumbling leaves. Spec range ~10-14 (fewer but bolder). */
const LEAF_COUNT = 12;

// Warm autumn + pine leaf palette.
const LEAF_COLORS = ["#A35A42", "#C06B4D", "#4B6639", "#627942", "#B8543C"];

// A bolder, fuller leaf silhouette drawn in a 24x24 viewBox. Reused for every
// leaf; we just tint, scale, position and tumble it via transform.
const LEAF_PATH =
  "M12 1.5C6 4 1.5 9 1.5 15.5c0 4.4 3.4 7 7.4 7 6.6 0 12.1-5.6 12.1-14 0-3.3-1-5.6-2.2-7-2.4 2.4-5.6 3.6-8.8 3.6z";
const LEAF_VEIN = "M12 4C10 9.5 7.5 14.5 5.5 20.5"; // central vein for detail

// ---------------------------------------------------------------------------
// Layer 1 — three HUGE filled wind arms (fat crescent / comma swooshes).
// Each path is a thick, closed crescent drawn in a wide 1000 x 600 viewBox so
// the filled body is genuinely big and soft. We stretch on X for the smear and
// translate it clear across the screen. Staggered delays = 3 successive gusts.
// ---------------------------------------------------------------------------

interface WindArm {
  /** Filled crescent/comma path in a 1000 x 600 viewBox. */
  d: string;
  /** vertical band on screen — top offset as a % of viewport height. */
  top: number;
  /** rendered height of the arm as a % of viewport height (40-70%). */
  heightVh: number;
  /** peak opacity of this arm. */
  opacity: number;
  /** stagger offset (ms) relative to the gust start — ~80-120ms apart. */
  delay: number;
  /** blur radius (px) — bigger arms get a softer edge. */
  blur: number;
  /** extra horizontal smear via scaleX at peak. */
  smear: number;
}

const WIND_ARMS: WindArm[] = [
  {
    // Lead arm: a broad high crescent, the first decisive shove.
    d:
      "M-120 80 C 260 -10, 720 30, 1120 170 C 760 150, 420 230, 60 420 " +
      "C 250 300, 220 200, -120 240 Z",
    top: 6,
    heightVh: 66,
    opacity: 0.5,
    delay: 0,
    blur: 26,
    smear: 1.6,
  },
  {
    // Body arm: the fattest, lowest-contrast mass — the bulk of the gust.
    d:
      "M-160 120 C 200 60, 760 120, 1160 300 C 720 300, 360 360, -60 520 " +
      "C 200 380, 160 280, -160 320 Z",
    top: 30,
    heightVh: 70,
    opacity: 0.42,
    delay: 95,
    blur: 36,
    smear: 1.85,
  },
  {
    // Trailing arm: a tighter, faster comma curl that whips out last.
    d:
      "M-100 60 C 220 20, 620 60, 980 200 C 640 180, 360 250, 40 400 " +
      "C 240 290, 200 180, -100 200 Z",
    top: 46,
    heightVh: 52,
    opacity: 0.46,
    delay: 200,
    blur: 22,
    smear: 1.5,
  },
];

// ---------------------------------------------------------------------------
// Layer 2 — bold tumbling leaves. Deterministic per-leaf parameters (no
// Math.random) so SSR/CSR markup matches and nothing varies at render.
// ---------------------------------------------------------------------------

interface LeafSpec {
  top: number; // vertical start, % of viewport height
  size: number; // px box size (28-56)
  delay: number; // ms, staggered entry across the gust window
  duration: number; // ms, this leaf's flight time
  rotate: number; // total tumble in degrees over the flight
  drift: number; // net vertical drift in vh (can be +/-)
  color: string;
  sway: number; // mid-flight vertical wobble in vh
}

function buildLeaves(count: number): LeafSpec[] {
  const out: LeafSpec[] = [];
  for (let i = 0; i < count; i++) {
    const f = i / Math.max(1, count - 1); // 0..1
    const jitter = (i * 137.508) % 100; // stable pseudo-spread 0..100
    out.push({
      top: 8 + ((jitter * 0.8) % 80), // 8%..88%
      size: 28 + ((i * 5) % 8) * 4, // 28..56 px in steps
      delay: Math.round(f * (SWEEP_MS * 0.4)), // entry spread across ~40% of gust
      duration: SWEEP_MS - 110 + ((i * 53) % 220), // ~770..990ms
      rotate: (i % 2 === 0 ? 1 : -1) * (320 + ((i * 47) % 320)), // dir + amount
      drift: ((i % 3) - 1) * (5 + ((i * 11) % 9)), // ~ -13..+13 vh
      color: LEAF_COLORS[i % LEAF_COLORS.length],
      sway: 4 + ((i * 13) % 8), // 4..11 vh wobble
    });
  }
  return out;
}

const LEAVES = buildLeaves(LEAF_COUNT);

// Allow custom CSS vars in inline style objects without `any`.
type Vars = CSSProperties & Record<`--${string}`, string | number>;

export default function WindSweep({
  reducedMotion,
  className,
}: {
  reducedMotion?: boolean;
  className?: string;
}): React.JSX.Element | null {
  // Honour reduced-motion: render nothing at all.
  if (reducedMotion) return null;

  return (
    <div
      aria-hidden
      className={`aws-root pointer-events-none fixed inset-0 overflow-hidden${
        className ? ` ${className}` : ""
      }`}
    >
      {/* Scoped keyframes — no globals.css dependency. */}
      <style>{`
        /* Big wind arm: enters far off-screen left, peaks mid-screen while
           stretched (smear), then shoves fully off to the right ahead of the
           page. Only transform + opacity animate. */
        @keyframes aws-arm {
          0% {
            transform: translate3d(-150%, 0, 0) scaleX(1.15);
            opacity: 0;
          }
          14% { opacity: var(--aws-op); }
          50% {
            transform: translate3d(0%, -2%, 0) scaleX(var(--aws-smear));
            opacity: var(--aws-op);
          }
          72% { opacity: var(--aws-op); }
          100% {
            transform: translate3d(165%, -6%, 0) scaleX(1.2);
            opacity: 0;
          }
        }
        /* Leaf flight: blown rightward, with a mid-flight wobble + tumble. */
        @keyframes aws-leaf {
          0% {
            transform: translate3d(-14vw, 0, 0) rotate(0deg);
            opacity: 0;
          }
          12% { opacity: 1; }
          45% {
            transform:
              translate3d(46vw, calc(var(--aws-sway) * -1), 0)
              rotate(calc(var(--aws-rot) * 0.45));
          }
          85% { opacity: 1; }
          100% {
            transform:
              translate3d(122vw, var(--aws-drift), 0)
              rotate(var(--aws-rot));
            opacity: 0;
          }
        }
        /* Respect OS-level reduced motion even if the prop wasn't passed. */
        @media (prefers-reduced-motion: reduce) {
          .aws-root { display: none; }
        }
      `}</style>

      {/* ---- Layer 1: three HUGE filled, blurred wind arms ---- */}
      {WIND_ARMS.map((arm, i) => {
        const style: Vars = {
          top: `${arm.top}%`,
          height: `${arm.heightVh}vh`,
          // Energetic ease: fast acceleration across, settling out the far side.
          animation: `aws-arm ${SWEEP_MS}ms cubic-bezier(0.16, 0.7, 0.3, 1) ${arm.delay}ms 1 both`,
          filter: `blur(${arm.blur}px)`,
          willChange: "transform, opacity",
          "--aws-op": arm.opacity,
          "--aws-smear": arm.smear,
        };
        return (
          <svg
            key={`arm-${i}`}
            className="aws-arm absolute left-0 w-[160vw]"
            viewBox="0 0 1000 600"
            fill="none"
            preserveAspectRatio="none"
            style={style}
          >
            <defs>
              {/* Long horizontal soft gradient = built-in motion smear + soft
                  warm-tinted cream that fades toward the trailing edge. */}
              <linearGradient
                id={`aws-arm-grad-${i}`}
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0" stopColor="rgba(255,250,235,0)" />
                <stop offset="0.35" stopColor="rgba(255,250,235,0.55)" />
                <stop offset="0.7" stopColor="rgba(255,248,228,1)" />
                <stop offset="1" stopColor="rgba(255,245,222,0.85)" />
              </linearGradient>
            </defs>
            <path d={arm.d} fill={`url(#aws-arm-grad-${i})`} />
          </svg>
        );
      })}

      {/* ---- Layer 2: bold tumbling leaves ---- */}
      {LEAVES.map((leaf, i) => {
        const style: Vars = {
          top: `${leaf.top}%`,
          width: `${leaf.size}px`,
          height: `${leaf.size}px`,
          animation: `aws-leaf ${leaf.duration}ms cubic-bezier(0.22, 0.6, 0.36, 1) ${leaf.delay}ms 1 both`,
          willChange: "transform, opacity",
          "--aws-rot": `${leaf.rotate}deg`,
          "--aws-drift": `${leaf.drift}vh`,
          "--aws-sway": `${leaf.sway}vh`,
        };
        return (
          <svg
            key={`leaf-${i}`}
            className="aws-leaf absolute left-0"
            viewBox="0 0 24 24"
            fill="none"
            style={style}
          >
            <path d={LEAF_PATH} fill={leaf.color} opacity={0.94} />
            <path
              d={LEAF_VEIN}
              stroke="rgba(0,0,0,0.2)"
              strokeWidth={1.1}
              strokeLinecap="round"
            />
          </svg>
        );
      })}
    </div>
  );
}
