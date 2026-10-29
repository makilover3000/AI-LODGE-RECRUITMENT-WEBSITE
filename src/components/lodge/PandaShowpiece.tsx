"use client";

import { useRef } from "react";
import Image from "next/image";
import { useParallax } from "./showpiece/useParallax";
import Particles from "./showpiece/Particles";

/**
 * PandAI Lodge's hero emblem: their engraved panda, cut out on its own
 * (public/lodges/pandai-panda.webp — silhouette closed from the ink, interior filled so the
 * white fur survives, then eroded back to the fur edge; natural black-and-white, never tinted).
 * Layers:
 *
 *   bamboo — moonlit bamboo silhouettes swaying gently behind              (depth 0.15)
 *   glow   — soft moonlight breathing behind the panda                   (depth 0.3)
 *   panda  — the panda, floating                                          (depth 0.6)
 *   leaves — slim bamboo leaves drifting down in front                    (depth 0.9)
 *
 * Bamboo + leaves are warm cream/gold (moonlight), never green. The ticker belt + card chip
 * keep the flat panda mark.
 */

/** one bamboo stalk: jointed cane (swollen nodes) + lance-leaf sprigs, in a 80×400 box */
function Stalk({ className, style, flip = false }: { className: string; style: React.CSSProperties; flip?: boolean }) {
  // a lance leaf from (x,y), pointing out to one side
  const leaf = (x: number, y: number, dir: 1 | -1, len: number, droop: number) =>
    `M${x} ${y} C ${x + dir * len * 0.35} ${y - 7}, ${x + dir * len * 0.75} ${y + droop - 4}, ${x + dir * len} ${y + droop} C ${x + dir * len * 0.7} ${y + droop + 3}, ${x + dir * len * 0.3} ${y + 6}, ${x} ${y + 2} Z`;
  return (
    <svg
      viewBox="0 0 80 400"
      className={className}
      style={{ ...style, scale: flip ? "-1 1" : undefined }}
      preserveAspectRatio="xMidYMax meet"
    >
      <g fill="currentColor">
        {/* cane segments, each a touch narrower toward the top */}
        {[0, 1, 2, 3, 4, 5, 6].map((k) => {
          const w = 15 - k * 0.9;
          return <rect key={k} x={40 - w / 2} y={k * 56 + 10} width={w} height="52" rx={w / 2.6} />;
        })}
        {/* swollen nodes between segments */}
        {[1, 2, 3, 4, 5, 6].map((k) => {
          const w = 18 - k * 0.9;
          return <rect key={`n${k}`} x={40 - w / 2} y={k * 56 + 6} width={w} height="6" rx="3" />;
        })}
        {/* leaf sprigs off a few nodes */}
        <path d={leaf(44, 70, 1, 34, 12)} />
        <path d={leaf(44, 74, 1, 26, 22)} />
        <path d={leaf(36, 186, -1, 34, 10)} />
        <path d={leaf(36, 190, -1, 26, 20)} />
        <path d={leaf(44, 298, 1, 30, 14)} />
      </g>
    </svg>
  );
}

export default function PandaShowpiece({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useParallax(root);

  return (
    <div ref={root} aria-hidden className={`ail-show ${className}`}>
      {/* bamboo — moonlit silhouettes either side, swaying out of step */}
      <div data-depth="0.15" className="ail-show-layer">
        <Stalk className="ail-panda-stalk" style={{ left: "-14%", height: "112%", animationDelay: "-1s" }} />
        <Stalk className="ail-panda-stalk" style={{ left: "-2%", height: "88%", animationDelay: "-3s", opacity: 0.6 }} flip />
        <Stalk className="ail-panda-stalk" style={{ right: "-14%", height: "116%", animationDelay: "-2s" }} flip />
        <Stalk className="ail-panda-stalk" style={{ right: "-1%", height: "84%", animationDelay: "-4.5s", opacity: 0.55 }} />
      </div>

      {/* glow — soft moonlight behind the panda */}
      <div data-depth="0.3" className="ail-show-layer">
        <div className="ail-panda-glow" />
      </div>

      {/* panda — just the panda */}
      <div data-depth="0.6" className="ail-show-layer">
        <div className="ail-show-figure">
          <Image
            src="/lodges/pandai-panda.webp"
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 70vw, 400px"
            className="object-contain"
          />
        </div>
      </div>

      {/* leaves — drifting down in front */}
      <div data-depth="0.9" className="ail-show-layer">
        <Particles variant="leaf" count={10} tones={2} />
      </div>
    </div>
  );
}
