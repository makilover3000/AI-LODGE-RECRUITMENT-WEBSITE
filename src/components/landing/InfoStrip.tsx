import ScrollReveal from "@/components/ui/ScrollReveal";

/* ---- the campfire circle: one lodge, drawn ------------------------------------------
   13 seats round a fire — 3 captains (big, lit) spaced evenly between 10 lodgers. Pure
   SVG, server-rendered, zero JS; the only motion is the existing ail-flicker on the fire
   (collapsed by the global reduced-motion rule). */
const SEATS = 13;
const CAPTAIN_SEATS = new Set([0, 4, 9]); // ~120° apart round the ring
const CX = 200;
const CY = 200;
const R = 138;

const seats = Array.from({ length: SEATS }, (_, i) => {
  const a = (i / SEATS) * Math.PI * 2 - Math.PI / 2; // start at 12 o'clock
  return {
    x: +(CX + R * Math.cos(a)).toFixed(1),
    y: +(CY + R * Math.sin(a)).toFixed(1),
    captain: CAPTAIN_SEATS.has(i),
  };
});

/** a seated figure (head + shoulders), centred on its seat */
function Figure({ x, y, captain }: { x: number; y: number; captain: boolean }) {
  const s = captain ? 1.35 : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {captain && <circle r="24" className="fill-glow/15" />}
      <circle cy="-7" r="7.5" className={captain ? "fill-glow" : "fill-cream-50/75"} />
      <path
        d="M-12 13c0-7.5 5.4-12 12-12s12 4.5 12 12z"
        className={captain ? "fill-glow" : "fill-cream-50/75"}
      />
    </g>
  );
}

function CampfireCircle() {
  return (
    <svg
      viewBox="0 0 400 400"
      role="img"
      aria-label="A lodge drawn as a campfire circle: three lodge captains and ten lodgers seated around one fire."
      className="h-auto w-full max-w-[26rem]"
    >
      <defs>
        <radialGradient id="ail-fireglow">
          <stop offset="0%" stopColor="#FFCF87" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#FFB24D" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#FFB24D" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* warm light pooling on the ground */}
      <circle cx={CX} cy={CY} r="170" fill="url(#ail-fireglow)" />
      {/* the circle they sit in */}
      <circle
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        strokeWidth="2"
        strokeDasharray="2 9"
        strokeLinecap="round"
        className="stroke-cream-50/25"
      />

      {/* the fire: crossed logs + flame */}
      <g transform={`translate(${CX - 36} ${CY - 40}) scale(1.5)`}>
        <path
          d="M10 41.5 38 32.5M38 41.5 10 32.5"
          strokeWidth="4.5"
          strokeLinecap="round"
          className="stroke-log"
        />
        <path
          d="M24 4c5.5 6.5 8 10.5 8 15.5a8 8 0 1 1-16 0c0-2.7 1-5.2 3-8 .6 2.6 2 4 3.6 4.4C21.8 12 22.4 8.4 24 4Z"
          className="fill-glow-deep"
          style={{ animation: "ail-flicker 2.6s ease-in-out infinite" }}
        />
      </g>

      {seats.map((p, i) => (
        <Figure key={i} {...p} />
      ))}
    </svg>
  );
}

export default function InfoStrip() {
  return (
    <section id="about" className="relative overflow-hidden bg-pine-900 text-cream-50">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:py-28">
        <ScrollReveal>
          <p className="eyebrow text-glow">How a lodge works</p>
          <h2 className="font-display mt-4 text-h1 text-cream-50">
            Small lodges, by design.
          </h2>
          <p className="mt-6 max-w-xl text-bodylg text-cream-50/80">
            Every lodge is{" "}
            <strong className="font-bold text-glow">8–10 lodgers</strong> guided by{" "}
            <strong className="font-bold text-glow">3 lodge captains</strong>. Small
            groups create the space for deeper connections and better
            collaboration.
          </p>

          {/* legend for the drawing — words, not just colour */}
          <ul className="mt-9 flex flex-wrap gap-x-8 gap-y-3 text-base font-semibold text-cream-50/85">
            <li className="flex items-center gap-2.5">
              <span aria-hidden className="h-3.5 w-3.5 rounded-full bg-glow" />
              Lodge captains
            </li>
            <li className="flex items-center gap-2.5">
              <span aria-hidden className="h-3 w-3 rounded-full bg-cream-50/75" />
              Lodgers
            </li>
          </ul>
        </ScrollReveal>

        <ScrollReveal className="flex justify-center lg:justify-end">
          <CampfireCircle />
        </ScrollReveal>
      </div>
    </section>
  );
}
