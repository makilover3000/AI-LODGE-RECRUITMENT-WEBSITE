import type { CSSProperties } from "react";
import { GUITAR_VIEWBOX, GUITAR_DETAIL_D, GUITAR_OUTLINE_D } from "./guitarPaths";

/**
 * HackStreet Boys' signature: a vintage neon-sign Stratocaster, traced from the
 * real logo art (logos/hackstreet.png) and rendered as glowing glass tubes.
 * Server component, zero JS.
 *
 * This is a deliberate ONE-OFF showpiece — every other lodge uses the flat,
 * floating `LodgeMark`. The neon is scoped to this component + its `ail-guitar*`
 * CSS so it never leaks onto the other marks (whose glow was intentionally
 * removed). Following the repo's hard-won neon lesson: the glow filter is STATIC
 * drop-shadow and only *opacity* animates (breathe/flicker), so weak phones
 * composite it cheaply and the tube never re-rasterizes.
 *
 * Layers (back → front), all the same path so the tube reads as one continuous
 * bent glass run:
 *   halo  — soft accent glow (drop-shadow); its opacity breathes
 *   unlit — dark "glass" underlay so the tube has body where the glow is faint
 *   tube  — the accent-lit outer stroke
 *   core  — the near-white hot inner filament
 *
 *   emblem — hero showpiece: switch-on flicker on load → settles into a slow breathe
 *   mini   — landing card chip: crisp, gentle glow, re-ignites on card hover
 *   ticker — tiny streaming mark: simplified outline + gentle glow, opacity shimmer
 */
type Variant = "emblem" | "mini" | "ticker";

export default function GuitarNeon({
  color,
  variant = "emblem",
  className = "",
  style,
}: {
  color: string;
  variant?: Variant;
  className?: string;
  style?: CSSProperties;
}) {
  const d = variant === "ticker" ? GUITAR_OUTLINE_D : GUITAR_DETAIL_D;
  const vars = { "--c": color, ...style } as CSSProperties;

  return (
    <div
      aria-hidden
      className={`ail-guitar ail-guitar-${variant} ${className}`}
      style={vars}
    >
      <svg
        className="ail-guitar-svg"
        viewBox={GUITAR_VIEWBOX}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* the lit run — flicker/breathe target */}
        <g className="ail-guitar-lit">
          <path className="ail-guitar-halo" d={d} />
          <path className="ail-guitar-unlit" d={d} />
          <path className="ail-guitar-tube" d={d} />
          <path className="ail-guitar-core" d={d} />
        </g>
      </svg>
    </div>
  );
}
