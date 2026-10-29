"use client";

import { useRef } from "react";
import Image from "next/image";
import { useParallax } from "./showpiece/useParallax";
import Particles from "./showpiece/Particles";

/**
 * S.P.I.C.E. Lodge's hero emblem: their watercolour chilli (logos/chilli v3.webp), lifted off
 * its painted checkerboard at build time (public/lodges/spice-chilli.webp) and set alight:
 *
 *   heat   — a chilli-red heat glow breathing behind the pepper             (depth 0.3)
 *   chilli — the splattered watercolour chilli, floating                    (depth 0.6)
 *   embers — glowing embers rising around it                               (depth 0.9)
 *
 * The ticker belt + card chip keep the flat skull-chilli stencil mark.
 */
export default function SpiceShowpiece({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useParallax(root);

  return (
    <div ref={root} aria-hidden className={`ail-show ${className}`}>
      {/* heat — breathing chilli-red glow behind the pepper's body */}
      <div data-depth="0.3" className="ail-show-layer">
        <div className="ail-spice-heat" />
      </div>

      {/* chilli — the watercolour pepper */}
      <div data-depth="0.6" className="ail-show-layer">
        <div className="ail-show-figure">
          <Image
            src="/lodges/spice-chilli.webp"
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 80vw, 460px"
            className="object-contain"
          />
        </div>
      </div>

      {/* embers — rising sparks */}
      <div data-depth="0.9" className="ail-show-layer">
        <Particles variant="ember" count={16} tones={3} />
      </div>
    </div>
  );
}
