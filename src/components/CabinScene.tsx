/**
 * CabinScene — the AI Lodge illustrated world, as layered flat-fill SVG.
 *
 * Built back-to-front exactly per the poster composition:
 *   sky/ground split → distant mountain → jagged horizon tree-line →
 *   midground pines framing the sides → log cabin → curling chimney
 *   smoke → massive cropped foreground pines.
 *
 * No gradients: depth comes from layered silhouettes + value contrast
 * (darkest in front, palest behind). Edges carry a slight hand-cut jitter.
 *
 * A square (1000×1000) viewBox with `xMidYMid slice` keeps the *safe zone*
 * — title + cabin + door — visible across both landscape (desktop) and
 * portrait (mobile) crops. Foreground trees deliberately run off-frame.
 *
 * The arced "AI LODGE" title is NOT part of this sliced scene — it lives in
 * its own `meet`-scaled overlay (see SplashScreen) so portrait crops never
 * cut its sides.
 *
 * Reused in two modes:
 *   - splash    : door is interactive, smoke present, GSAP drives it
 *   - backdrop  : static world behind a lodge page (door inert)
 *
 * Door geometry (mirrored by SplashScreen's GSAP hinge):
 *   hinge x = 462, mid-y = 756  →  svgOrigin "462 756"
 *
 * Addressable hooks for GSAP (queried by id inside SplashScreen):
 *   #ail-smoke  #ail-door  #ail-door-cue  #ail-interior-glow
 */

type Props = {
  interactive?: boolean;
  onDoorActivate?: () => void;
  className?: string;
};

export default function CabinScene({
  interactive = false,
  onDoorActivate,
  className,
}: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="A log cabin in a pine forest clearing under a cream sky — the AI Lodge."
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ---------- 1. sky + ground split (slightly irregular seam) ---------- */}
      <rect x="0" y="0" width="1000" height="1000" fill="var(--color-sky)" />
      <path
        d="M0 612 L 110 606 L 250 616 L 400 604 L 560 618 L 720 606 L 870 616 L 1000 608 L 1000 1000 L 0 1000 Z"
        fill="var(--color-ground)"
      />

      {/* ---------- 2. distant mountain / mist ---------- */}
      <path
        d="M300 600 L 432 372 Q 500 320 572 376 L 720 600 Z"
        fill="var(--color-mist-1)"
      />
      <path
        d="M362 600 L 470 432 Q 502 405 536 434 L 648 600 Z"
        fill="var(--color-mist-2)"
        opacity="0.5"
      />

      {/* ---------- 3. jagged horizon tree-line (lightest greens) ---------- */}
      <JaggedTreeline y={566} fill="var(--color-tree-4)" />
      <JaggedTreeline y={592} fill="var(--color-tree-3)" opacity={0.85} />

      {/* ---------- 4. midground pines framing the sides ---------- */}
      <Pine x={86} baseY={700} h={470} w={196} fill="var(--color-tree-3)" />
      <Pine x={214} baseY={732} h={372} w={150} fill="var(--color-tree-2)" />
      <Pine x={812} baseY={706} h={486} w={206} fill="var(--color-tree-3)" />
      <Pine x={700} baseY={742} h={356} w={150} fill="var(--color-tree-2)" />

      {/* ---------- 5. the cabin ---------- */}
      <Cabin interactive={interactive} onDoorActivate={onDoorActivate} />

      {/* ---------- 6. chimney smoke (animated in splash) ---------- */}
      <path
        id="ail-smoke"
        d="M598 566 C 580 524 636 498 620 460 C 604 424 652 398 636 360 C 622 326 664 304 654 272"
        fill="none"
        stroke="var(--color-cream)"
        strokeWidth="15"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* ---------- 7. massive foreground pines, cropped at the edges ---------- */}
      <Pine x={-70} baseY={1000} h={1120} w={400} fill="var(--color-tree-1)" topY={-70} />
      <Pine x={690} baseY={1000} h={1160} w={420} fill="var(--color-tree-1)" topY={-100} />
      <Pine x={206} baseY={1000} h={210} w={120} fill="var(--color-tree-1)" />
      <Pine x={668} baseY={1000} h={184} w={108} fill="var(--color-tree-2)" />
    </svg>
  );
}

/**
 * The arced "AI LODGE" title as a standalone, never-cropped overlay.
 * Its own viewBox + `meet` scaling means it always fits its container,
 * so it stays whole on portrait splashes. #ail-title-shine is swept by
 * GSAP for the shimmer.
 */
export function LodgeTitle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 820 250"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <path id="ail-title-arc" d="M40 210 Q 410 64 780 210" fill="none" />
        <linearGradient id="ail-title-shine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-charcoal)" />
          <stop offset="42%" stopColor="var(--color-charcoal)" />
          <stop offset="50%" stopColor="#807f74" />
          <stop offset="58%" stopColor="var(--color-charcoal)" />
          <stop offset="100%" stopColor="var(--color-charcoal)" />
        </linearGradient>
      </defs>
      <text
        fill="url(#ail-title-shine)"
        fontSize="150"
        fontFamily="var(--font-display), Impact, sans-serif"
        fontWeight="400"
        letterSpacing="4"
      >
        <textPath href="#ail-title-arc" startOffset="50%" textAnchor="middle">
          AI LODGE
        </textPath>
      </text>
    </svg>
  );
}

/* ============================================================
   Sub-shapes
   ============================================================ */

function JaggedTreeline({
  y,
  fill,
  opacity = 1,
}: {
  y: number;
  fill: string;
  opacity?: number;
}) {
  const tips: string[] = [`M0 ${y + 55}`];
  const step = 24;
  for (let x = 0; x <= 1000; x += step) {
    const h = 16 + ((x * 7) % 20);
    tips.push(`L ${x} ${y - h} L ${x + step / 2} ${y + 8}`);
  }
  tips.push(`L 1000 ${y + 55} Z`);
  return <path d={tips.join(" ")} fill={fill} opacity={opacity} />;
}

function Pine({
  x,
  baseY,
  h,
  w,
  fill,
  topY,
}: {
  x: number;
  baseY: number;
  h: number;
  w: number;
  fill: string;
  topY?: number;
}) {
  const cx = x + w / 2;
  const top = topY ?? baseY - h;
  const tiers = 4;
  const parts: string[] = [];
  // trunk
  parts.push(
    `M${cx - w * 0.05} ${baseY} L ${cx - w * 0.05} ${baseY - h * 0.12} L ${
      cx + w * 0.05
    } ${baseY - h * 0.12} L ${cx + w * 0.05} ${baseY} Z`,
  );
  // stacked, slightly irregular foliage tiers
  for (let i = 0; i < tiers; i++) {
    const tierTop = top + ((baseY - h * 0.1 - top) * i) / tiers;
    const tierBottom = top + ((baseY - h * 0.1 - top) * (i + 1.25)) / tiers;
    const tierW = (w * (i + 1.4)) / (tiers + 0.4);
    const jitter = i % 2 === 0 ? 4 : -3;
    parts.push(
      `M${cx} ${tierTop} L ${cx + tierW / 2 + jitter} ${tierBottom} L ${
        cx - 6
      } ${tierBottom - 6} L ${cx - tierW / 2 + jitter} ${tierBottom} Z`,
    );
  }
  return <path d={parts.join(" ")} fill={fill} />;
}

function Cabin({
  interactive,
  onDoorActivate,
}: {
  interactive: boolean;
  onDoorActivate?: () => void;
}) {
  // cabin body centred, sitting on the grass
  const bodyLeft = 372;
  const bodyRight = 628;
  const bodyTop = 662;
  const baseY = 800;
  const doorLeft = 462;
  const doorRight = 538;
  const doorTop = 712;
  const doorMidY = (doorTop + baseY) / 2;

  return (
    <g>
      {/* body — stacked logs */}
      <rect
        x={bodyLeft}
        y={bodyTop}
        width={bodyRight - bodyLeft}
        height={baseY - bodyTop}
        fill="var(--color-log)"
      />
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1={bodyLeft}
          x2={bodyRight}
          y1={bodyTop + 14 + i * 27}
          y2={bodyTop + 14 + i * 27}
          stroke="var(--color-log-shadow)"
          strokeWidth="3.5"
          opacity="0.6"
        />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <circle
          key={`c${i}`}
          cx={bodyLeft - 2}
          cy={bodyTop + 14 + i * 27}
          r="8"
          fill="var(--color-log-shadow)"
        />
      ))}

      {/* roof — irregular hand-cut overhang */}
      <path
        d={`M${bodyLeft - 38} ${bodyTop + 6} L 502 588 L 504 588 L ${
          bodyRight + 38
        } ${bodyTop + 6} L ${bodyRight + 20} ${bodyTop + 24} L ${
          bodyLeft - 20
        } ${bodyTop + 24} Z`}
        fill="var(--color-roof)"
      />
      <path
        d={`M${bodyLeft - 38} ${bodyTop + 6} L ${bodyLeft - 20} ${
          bodyTop + 24
        } L ${bodyRight + 20} ${bodyTop + 24} L ${bodyRight + 38} ${bodyTop + 6}`}
        fill="none"
        stroke="var(--color-roof-shadow)"
        strokeWidth="6"
      />

      {/* chimney */}
      <rect x="590" y="592" width="30" height="56" fill="var(--color-roof-shadow)" />
      <rect x="586" y="586" width="38" height="13" fill="var(--color-cabin-accent)" />

      {/* windows */}
      <rect x={bodyLeft + 22} y={700} width="54" height="54" fill="var(--color-window)" />
      <rect x={bodyRight - 76} y={700} width="54" height="54" fill="var(--color-window)" />
      <line
        x1={bodyLeft + 49}
        x2={bodyLeft + 49}
        y1={700}
        y2={754}
        stroke="var(--color-cabin-accent)"
        strokeWidth="4"
      />
      <line
        x1={bodyRight - 49}
        x2={bodyRight - 49}
        y1={700}
        y2={754}
        stroke="var(--color-cabin-accent)"
        strokeWidth="4"
      />

      {/* doorway opening + warm interior revealed as the door swings */}
      <rect
        x={doorLeft}
        y={doorTop}
        width={doorRight - doorLeft}
        height={baseY - doorTop}
        fill="var(--color-tree-1)"
      />
      <rect
        id="ail-interior-glow"
        x={doorLeft + 6}
        y={doorTop + 8}
        width={doorRight - doorLeft - 12}
        height={baseY - doorTop - 10}
        fill="var(--color-cabin-accent)"
        opacity="0"
      />

      {/* the door panel — hinged on its left edge */}
      <g
        id="ail-door"
        className={interactive ? "ail-door" : undefined}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-label={interactive ? "Open the cabin door to enter" : undefined}
        style={{
          transformOrigin: `${doorLeft}px ${doorMidY}px`,
          cursor: interactive ? "pointer" : "default",
        }}
        onClick={interactive ? onDoorActivate : undefined}
        onKeyDown={
          interactive
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onDoorActivate?.();
                }
              }
            : undefined
        }
      >
        <rect
          x={doorLeft}
          y={doorTop}
          width={doorRight - doorLeft}
          height={baseY - doorTop}
          fill="var(--color-roof)"
          stroke="var(--color-roof-shadow)"
          strokeWidth="5"
        />
        <line
          x1={doorLeft + 25}
          x2={doorLeft + 25}
          y1={doorTop + 4}
          y2={baseY - 4}
          stroke="var(--color-roof-shadow)"
          strokeWidth="3"
          opacity="0.6"
        />
        <line
          x1={doorLeft + 50}
          x2={doorLeft + 50}
          y1={doorTop + 4}
          y2={baseY - 4}
          stroke="var(--color-roof-shadow)"
          strokeWidth="3"
          opacity="0.6"
        />
        <circle cx={doorRight - 13} cy={doorMidY} r="6" fill="var(--color-cabin-accent)" />
        {/* glow cue ring — pulses on the splash to read as clickable */}
        <rect
          id="ail-door-cue"
          x={doorLeft - 8}
          y={doorTop - 8}
          width={doorRight - doorLeft + 16}
          height={baseY - doorTop + 16}
          fill="none"
          stroke="var(--color-teal-highlight)"
          strokeWidth="6"
          opacity="0"
        />
      </g>
    </g>
  );
}
