import type { CSSProperties } from "react";
import { BAT_VIEWBOX, BAT_DETAIL_D, BAT_OUTLINE_D } from "./batPaths";

/**
 * Vampire Lodge's signature: a gothic ornate neon-sign bat, traced from the real
 * logo art (logos/vamp.jpg) and rendered as glowing glass tubes. Server component,
 * zero JS.
 *
 * A deliberate ONE-OFF showpiece — sibling of HackStreet's GuitarNeon and
 * CuriosityMaxxer's ShipNeon. Every other lodge uses the flat, floating `LodgeMark`.
 * The neon is scoped to this component + its `ail-bat*` CSS so it never leaks onto
 * the other marks. Following the repo's hard-won neon lesson: the glow filter is
 * STATIC drop-shadow and only *opacity* animates (breathe/flicker), so weak phones
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

export default function BatNeon({
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
  const d = variant === "ticker" ? BAT_OUTLINE_D : BAT_DETAIL_D;
  const vars = { "--c": color, ...style } as CSSProperties;

  return (
    <div
      aria-hidden
      className={`ail-bat ail-bat-${variant} ${className}`}
      style={vars}
    >
      <svg
        className="ail-bat-svg"
        viewBox={BAT_VIEWBOX}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* the lit run — flicker/breathe target */}
        <g className="ail-bat-lit">
          <path className="ail-bat-halo" d={d} />
          <path className="ail-bat-unlit" d={d} />
          <path className="ail-bat-tube" d={d} />
          <path className="ail-bat-core" d={d} />
        </g>
      </svg>
    </div>
  );
}
