import type { CSSProperties, ReactNode } from "react";

/**
 * Despacito Lodge's belt: a string of papel picado (Mexican cut-paper bunting), drawn from
 * scratch — six original cut patterns in the classic tissue colours. Each banner is a small
 * SVG whose paper is masked, so every cut is a real see-through hole onto the pine band.
 *
 *   cord    — a drooping cream cord, pinned at each tile edge (periodic → seamless loop)
 *   banners — hang from the cord and sway gently, each on its own timing (transform only)
 *
 * Server component, zero JS. The track uses the shared seamless marquee (.ail-ticker-track):
 * two identical halves, each wider than any screen. Reduced motion freezes everything.
 */

const W = 64; // banner width (viewBox units = px at 1×)
const H = 84; // banner height incl. scalloped hem
const SCALE = 1.2; // on-screen size vs the 64×84 drawing
const TILE = 86; // banner + gap along the cord (px)
export const PAPEL_PER_HALF = 38; // 38 × 86px ≈ 3,270px per half

/** tissue colours (light → deep for a watercolour sheen) */
const COLOURS: [string, string][] = [
  ["#ff5a4f", "#d9241c"], // red
  ["#ffb04a", "#f07a12"], // orange
  ["#ffe066", "#f2b80f"], // yellow
  ["#7fd06a", "#3d9a3a"], // green
  ["#b28ce6", "#7a4fc4"], // purple
  ["#6fb1ff", "#2f6fd6"], // blue
  ["#ff8cc8", "#e0378f"], // pink
];

// ---- shape helpers (all in banner space) ----
const heart = (cx: number, cy: number, s: number) =>
  `M${cx} ${cy + 0.7 * s}C${cx - 1.25 * s} ${cy - 0.1 * s} ${cx - 0.62 * s} ${cy - 1.05 * s} ${cx} ${cy - 0.36 * s}C${cx + 0.62 * s} ${cy - 1.05 * s} ${cx + 1.25 * s} ${cy - 0.1 * s} ${cx} ${cy + 0.7 * s}Z`;

/** n petals (ellipses) around a centre */
const petals = (cx: number, cy: number, n: number, r: number, rx: number, ry: number, key: string, off = 0) =>
  Array.from({ length: n }, (_, i) => {
    const a = off + (360 / n) * i;
    return (
      <ellipse
        key={`${key}${i}`}
        cx={cx}
        cy={cy - r}
        rx={rx}
        ry={ry}
        transform={`rotate(${a} ${cx} ${cy})`}
      />
    );
  });

/** small round cuts in a row */
const dots = (y: number, x0: number, x1: number, step: number, r: number, key: string) =>
  Array.from({ length: Math.floor((x1 - x0) / step) + 1 }, (_, i) => (
    <circle key={`${key}${i}`} cx={x0 + i * step} cy={y} r={r} />
  ));

/** the paper silhouette: folded top band + body + scalloped hem */
const SCALLOPS = 8;
const PAPER = (() => {
  const top = 0, bodyBottom = 74, x0 = 1.5, x1 = W - 1.5;
  const step = (x1 - x0) / SCALLOPS;
  let d = `M${x0} ${top}H${x1}V${bodyBottom}`;
  for (let i = 0; i < SCALLOPS; i++) {
    const xa = x1 - i * step, xb = xa - step;
    d += `Q${(xa + xb) / 2} ${bodyBottom + 10} ${xb} ${bodyBottom}`;
  }
  return d + "Z";
})();

/** the shared frame cut into every banner: dotted top row, dashed hem line, scallop eyelets */
const frame = (k: string) => (
  <>
    {dots(13, 9, 55, 5.75, 1.1, `${k}d`)}
    <rect x="8" y="68" width="48" height="1.6" rx="0.8" />
    {Array.from({ length: SCALLOPS }, (_, i) => (
      <circle key={`${k}e${i}`} cx={1.5 + (W - 3) / SCALLOPS * (i + 0.5)} cy="77" r="1.7" />
    ))}
    <rect x="6" y="17" width="1.4" height="48" rx="0.7" />
    <rect x={W - 7.4} y="17" width="1.4" height="48" rx="0.7" />
  </>
);

/** six original cut patterns: black = cut away, white = paper kept (for inner details) */
const MOTIFS: ((k: string) => ReactNode)[] = [
  // 0 — marigold: eight petals, ringed centre, corner teardrops
  (k) => (
    <>
      {petals(32, 41, 8, 9, 2.6, 5.6, `${k}p`)}
      <circle cx="32" cy="41" r="3.2" />
      <circle cx="32" cy="41" r="1.3" fill="#fff" />
      {[[13, 22, 40], [51, 22, -40], [13, 60, 140], [51, 60, -140]].map(([x, y, a], i) => (
        <ellipse key={`${k}t${i}`} cx={x} cy={y} rx="2" ry="4" transform={`rotate(${a} ${x} ${y})`} />
      ))}
    </>
  ),
  // 1 — tree of hearts with side blossoms
  (k) => (
    <>
      {[[32, 24, 4.6], [32, 35, 5.4], [32, 47, 6.2], [32, 59, 3.4]].map(([x, y, s], i) => (
        <path key={`${k}h${i}`} d={heart(x, y, s)} />
      ))}
      {petals(15, 40, 5, 4, 1.9, 3.2, `${k}a`)}
      {petals(49, 40, 5, 4, 1.9, 3.2, `${k}b`)}
      <circle cx="15" cy="40" r="1.4" fill="#fff" />
      <circle cx="49" cy="40" r="1.4" fill="#fff" />
    </>
  ),
  // 2 — twin flowers + a little calavera
  (k) => (
    <>
      {petals(16, 30, 5, 4.6, 2.1, 3.6, `${k}a`)}
      {petals(48, 30, 5, 4.6, 2.1, 3.6, `${k}b`)}
      <circle cx="16" cy="30" r="1.6" fill="#fff" />
      <circle cx="48" cy="30" r="1.6" fill="#fff" />
      <path d="M32 40c-6 0-9.5 4-9.5 8.6 0 3 1.6 5 3.8 6v3.4h11.4v-3.4c2.2-1 3.8-3 3.8-6C41.5 44 38 40 32 40Z" />
      <circle cx="28.2" cy="48.4" r="2.3" fill="#fff" />
      <circle cx="35.8" cy="48.4" r="2.3" fill="#fff" />
      <path d="M32 51.2l-1.4 2.6h2.8Z" fill="#fff" />
      <rect x="28.4" y="56.4" width="7.2" height="1" fill="#fff" />
      {[16, 48].map((x, i) => (
        <path key={`${k}v${i}`} d={`M${x - 6} 52q6 5 12 0`} fill="none" stroke="#000" strokeWidth="1.6" strokeLinecap="round" />
      ))}
    </>
  ),
  // 3 — rosette: ring of beads around a six-petal star
  (k) => (
    <>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 12;
        return <circle key={`${k}r${i}`} cx={32 + 15 * Math.cos(a)} cy={41 + 15 * Math.sin(a)} r="1.9" />;
      })}
      {petals(32, 41, 6, 6.5, 2.3, 4.6, `${k}p`, 30)}
      <circle cx="32" cy="41" r="2.2" />
      {[[12, 22], [52, 22], [12, 61], [52, 61]].map(([x, y], i) => (
        <path key={`${k}c${i}`} d={heart(x, y, 3)} />
      ))}
    </>
  ),
  // 4 — sugar skull with flower eyes
  (k) => (
    <>
      <path d="M32 20c-10.5 0-16.5 7-16.5 15.5 0 5.6 3 9.6 7.2 11.4V54h18.6v-7.1c4.2-1.8 7.2-5.8 7.2-11.4C48.5 27 42.5 20 32 20Z" />
      <g fill="#fff">
        {petals(25.6, 36, 6, 3, 1.5, 2.2, `${k}l`)}
        {petals(38.4, 36, 6, 3, 1.5, 2.2, `${k}r`)}
      </g>
      <circle cx="25.6" cy="36" r="1" />
      <circle cx="38.4" cy="36" r="1" />
      <path d={heart(32, 44, 2)} fill="#fff" />
      <rect x="25" y="49" width="14" height="1.3" fill="#fff" />
      {[27.5, 30.5, 33.5, 36.5].map((x, i) => (
        <rect key={`${k}t${i}`} x={x} y="47.6" width="1" height="4" fill="#fff" />
      ))}
      <g fill="#fff">{petals(32, 26, 5, 2.2, 1.1, 1.7, `${k}f`)}</g>
      <circle cx="32" cy="26" r="0.9" />
    </>
  ),
  // 5 — el sol: rayed sun with swirls
  (k) => (
    <>
      <circle cx="32" cy="41" r="7.5" />
      <circle cx="32" cy="41" r="4.4" fill="#fff" />
      <circle cx="32" cy="41" r="2" />
      {Array.from({ length: 12 }, (_, i) => (
        <path
          key={`${k}s${i}`}
          d="M32 30.5l-1.9 -7.5h3.8Z"
          transform={`rotate(${i * 30} 32 41)`}
        />
      ))}
      {[[13, 24, 1], [51, 24, -1], [13, 59, 1], [51, 59, -1]].map(([x, y, f], i) => (
        <path
          key={`${k}w${i}`}
          d={`M${x} ${y}m-3.2 0a3.2 3.2 0 1 1 3.2 3.2a1.8 1.8 0 1 1 1.8-1.8`}
          fill="none"
          stroke="#000"
          strokeWidth="1.5"
          strokeLinecap="round"
          transform={f < 0 ? `scale(-1 1) translate(${-2 * x} 0)` : undefined}
        />
      ))}
    </>
  ),
];

/** one hidden SVG holding the gradients + the six banner masks (referenced by every banner) */
function PapelDefs() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute" style={{ position: "absolute" }}>
      <defs>
        {COLOURS.map(([a, b], i) => (
          <linearGradient key={i} id={`pp-g${i}`} x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0%" stopColor={a} />
            <stop offset="100%" stopColor={b} />
          </linearGradient>
        ))}
        {MOTIFS.map((motif, i) => (
          <mask key={i} id={`pp-m${i}`} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
            <path d={PAPER} fill="#fff" />
            <g fill="#000">
              {frame(`f${i}`)}
              {/* motifs drawn a size up so the lace fills the paper like real papel picado */}
              <g transform="translate(32 42) scale(1.22) translate(-32 -42)">{motif(`m${i}`)}</g>
            </g>
          </mask>
        ))}
      </defs>
    </svg>
  );
}

/** a cord segment pinned at both tile edges, sagging in the middle (periodic) */
const CORD_D = `M0 5Q${TILE / 2} 13 ${TILE} 5`;

function Banner({ i }: { i: number }) {
  const c = i % COLOURS.length;
  const m = (i * 5) % MOTIFS.length;
  const sway = {
    animationDuration: `${3.2 + ((i * 7) % 5) * 0.45}s`,
    animationDelay: `${-((i * 1.3) % 4)}s`,
  } as CSSProperties;
  return (
    <div className="ail-papel-tile" style={{ width: TILE }}>
      <svg className="ail-papel-cord" viewBox={`0 0 ${TILE} 16`} width={TILE} height="16" aria-hidden>
        <path d={CORD_D} />
      </svg>
      <div className="ail-papel-hang" style={sway}>
        <svg viewBox={`0 0 ${W} ${H}`} width={W * SCALE} height={H * SCALE} aria-hidden>
          <rect width={W} height={H} fill={`url(#pp-g${c})`} mask={`url(#pp-m${m})`} />
          {/* folded band where the paper wraps over the cord */}
          <rect width={W} height="7" fill="#000" opacity="0.16" mask={`url(#pp-m${m})`} />
        </svg>
      </div>
    </div>
  );
}

export default function PapelPicadoBelt() {
  const half = (p: string) =>
    Array.from({ length: PAPEL_PER_HALF }, (_, i) => <Banner key={`${p}${i}`} i={i} />);
  return (
    <>
      <PapelDefs />
      <div className="ail-ticker-track ail-papel-track">
        {half("a")}
        {half("b")}
      </div>
    </>
  );
}
