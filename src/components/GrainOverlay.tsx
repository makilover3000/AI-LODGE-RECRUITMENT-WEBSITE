/**
 * Global grain/noise texture sitting over the whole page.
 * SVG feTurbulence at low opacity, multiply blend — this is what
 * gives the scene its hand-printed poster charm. Without it the
 * flat fills read like a generic template. Non-interactive + fixed.
 */
export default function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] mix-blend-multiply opacity-[0.18]"
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="ail-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#ail-grain)" />
      </svg>
    </div>
  );
}
