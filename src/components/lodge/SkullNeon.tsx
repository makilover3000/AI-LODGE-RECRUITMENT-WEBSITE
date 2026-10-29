import type { CSSProperties } from "react";
import { SKULL_VIEWBOX, SKULL_PINK_D, SKULL_CYAN_D } from "./skullPaths";

/**
 * Despacito Lodge's signature: a neon sugar skull, traced from the real logo art
 * (logos/despacito.png) and rendered as glowing glass tubes. Server component, zero JS.
 *
 * A one-off showpiece like HackStreet's guitar, CuriosityMaxxer's ship and Vampire's bat,
 * with one twist: it's TWO-TONE, like the source sign. The skull, sockets, heart and teeth
 * run in the lodge colour (`color`, hot pink); the flower, eyes and cheek curls run in a
 * second tube (`color2`, cyan). Same neon rules as its siblings: the glow filter is STATIC
 * drop-shadow and only *opacity* animates, so phones composite it cheaply.
 *
 * Layers per tube (back → front): halo (breathing glow) · unlit glass · lit tube · white core.
 *   emblem — hero showpiece: switch-on flicker on load → slow breathe
 *   mini   — landing card chip: crisp, gentle glow, re-ignites on card hover
 *   ticker — tiny streaming mark: thinner tubes + shimmer
 */
type Variant = "emblem" | "mini" | "ticker";

export default function SkullNeon({
  color,
  color2 = "#3FE6E0",
  variant = "emblem",
  className = "",
  style,
}: {
  color: string;
  color2?: string;
  variant?: Variant;
  className?: string;
  style?: CSSProperties;
}) {
  const vars = { "--c": color, "--c2": color2, ...style } as CSSProperties;
  const tube = (d: string, tone: "pink" | "cyan") => (
    <g className={`ail-skull-${tone}`}>
      <path className="ail-skull-halo" d={d} />
      <path className="ail-skull-unlit" d={d} />
      <path className="ail-skull-tube" d={d} />
      <path className="ail-skull-core" d={d} />
    </g>
  );

  return (
    <div aria-hidden className={`ail-skull ail-skull-${variant} ${className}`} style={vars}>
      <svg
        className="ail-skull-svg"
        viewBox={SKULL_VIEWBOX}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* the lit run — flicker/breathe target */}
        <g className="ail-skull-lit">
          {tube(SKULL_PINK_D, "pink")}
          {tube(SKULL_CYAN_D, "cyan")}
        </g>
      </svg>
    </div>
  );
}
