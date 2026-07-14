import type { CSSProperties } from "react";
import { SHIP_VIEWBOX, SHIP_DETAIL_D, SHIP_OUTLINE_D } from "./shipPaths";

/**
 * CuriosityMaxxer's signature: a neon-sign medieval tall ship, traced from the
 * real logo art (logos/curisoty.png) and rendered as glowing glass tubes.
 * Server component, zero JS.
 *
 * A deliberate ONE-OFF showpiece — the sibling of HackStreet's GuitarNeon. Every
 * other lodge uses the flat, floating `LodgeMark`. The neon is scoped to this
 * component + its `ail-ship*` CSS so it never leaks onto the other marks (whose
 * glow was intentionally removed). Following the repo's hard-won neon lesson: the
 * glow filter is STATIC drop-shadow and only *opacity* animates (breathe/flicker),
 * so weak phones composite it cheaply and the tube never re-rasterizes.
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

export default function ShipNeon({
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
  const d = variant === "ticker" ? SHIP_OUTLINE_D : SHIP_DETAIL_D;
  const vars = { "--c": color, ...style } as CSSProperties;

  return (
    <div
      aria-hidden
      className={`ail-ship ail-ship-${variant} ${className}`}
      style={vars}
    >
      <svg
        className="ail-ship-svg"
        viewBox={SHIP_VIEWBOX}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* the lit run — flicker/breathe target */}
        <g className="ail-ship-lit">
          <path className="ail-ship-halo" d={d} />
          <path className="ail-ship-unlit" d={d} />
          <path className="ail-ship-tube" d={d} />
          <path className="ail-ship-core" d={d} />
        </g>
      </svg>
    </div>
  );
}
