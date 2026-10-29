"use client";

import { useRef } from "react";
import Image from "next/image";
import { useParallax } from "./showpiece/useParallax";
import Particles from "./showpiece/Particles";

/**
 * BRYan Lodge's hero emblem: their night-forest badge (the cat in headphones with a racket,
 * logos/bryan.png) brought to life. The badge was lifted off its black ground at build time
 * with a soft mask that hugs the art (public/lodges/bryan-showpiece.webp):
 *
 *   stars    — a field of tiny stars twinkling out of step                 (depth 0.15)
 *   halo     — warm lantern-gold light breathing behind the ring           (depth 0.3)
 *   badge    — the medallion, floating                                     (depth 0.6)
 *   fireflies — warm glowing dots rising in front, like the badge's lantern (depth 0.9)
 *
 * The ticker belt + card chip keep the flat cat mark.
 */

// the badge's gold ring, measured on the cut-out's box
const RING = { cx: 48.6, cy: 49.6, d: 79.7 };

// deterministic star positions (server + client render alike)
const STARS = Array.from({ length: 40 }, (_, i) => ({
  left: (i * 41 + 7) % 100,
  top: (i * 23 + 11) % 92,
  size: 1.5 + ((i * 7) % 3),
  delay: -((i * 0.77) % 4),
  dur: 2.6 + ((i * 3) % 4) * 0.6,
}));

export default function BryanShowpiece({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useParallax(root);

  return (
    <div ref={root} aria-hidden className={`ail-show ${className}`}>
      {/* stars — tiny twinkles across the night behind the badge */}
      <div data-depth="0.15" className="ail-show-layer ail-bryan-sky">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="ail-bryan-star"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.dur}s`,
            }}
          />
        ))}
      </div>

      {/* halo — lantern-gold light behind the ring */}
      <div data-depth="0.3" className="ail-show-layer">
        <div
          className="ail-bryan-halo"
          style={{ left: `${RING.cx}%`, top: `${RING.cy}%`, width: `${RING.d}%` }}
        />
      </div>

      {/* badge — the medallion itself */}
      <div data-depth="0.6" className="ail-show-layer">
        <div className="ail-show-figure">
          <Image
            src="/lodges/bryan-showpiece.webp"
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 80vw, 460px"
            className="object-contain"
          />
        </div>
      </div>

      {/* fireflies — rising in front */}
      <div data-depth="0.9" className="ail-show-layer">
        <Particles variant="firefly" count={14} tones={2} />
      </div>
    </div>
  );
}
