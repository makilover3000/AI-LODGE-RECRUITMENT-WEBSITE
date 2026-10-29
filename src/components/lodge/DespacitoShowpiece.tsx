"use client";

import { useRef } from "react";
import Image from "next/image";
import { useParallax } from "./showpiece/useParallax";
import Particles from "./showpiece/Particles";

/**
 * Despacito Lodge's hero emblem: their Día de los Muertos poster (logos/despacitov3.jpg),
 * rebuilt as a living retro sunset. The illustration's own cream ground and coral sun were
 * cut away at build time (public/lodges/despacito-showpiece.webp) so each piece can move:
 *
 *   rays   — a marigold sunburst turning very slowly behind everything      (depth 0.15)
 *   sun    — the coral disc, re-drawn with retro sunset stripes + a soft breathing glow (0.3)
 *   figure — the skeleton in his sombrero, floating gently                   (depth 0.6)
 *   petals — marigold petals drifting down in front                          (depth 0.9)
 *
 * Shared kit: `useParallax` (pointer depth) + `Particles`. The ticker belt + card chip keep
 * the neon skull.
 */

// the sun disc as measured on the figure's box (see the build-time cutout)
const SUN = { cx: 49.9, cy: 16.45, d: 61.8 }; // % of width / % of height / diameter as % of width

export default function DespacitoShowpiece({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useParallax(root);

  const sunStyle = { left: `${SUN.cx}%`, top: `${SUN.cy}%`, width: `${SUN.d}%` };

  return (
    <div ref={root} aria-hidden className={`ail-show ${className}`}>
      {/* rays — slow marigold sunburst, centred on the sun */}
      <div data-depth="0.15" className="ail-show-layer">
        <div className="ail-desp-rays" style={{ ...sunStyle, width: `${SUN.d * 2.6}%` }} />
      </div>

      {/* sun — coral disc with retro sunset stripes and a breathing glow */}
      <div data-depth="0.3" className="ail-show-layer">
        <div className="ail-desp-glow" style={sunStyle} />
        <div className="ail-desp-sun" style={sunStyle} />
      </div>

      {/* figure — the poster's skeleton, cut from its ground */}
      <div data-depth="0.6" className="ail-show-layer">
        <div className="ail-show-figure">
          <Image
            src="/lodges/despacito-showpiece.webp"
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 70vw, 400px"
            className="object-contain"
          />
        </div>
      </div>

      {/* petals — marigold petals drifting down in front */}
      <div data-depth="0.9" className="ail-show-layer">
        <Particles variant="petal" />
      </div>
    </div>
  );
}
