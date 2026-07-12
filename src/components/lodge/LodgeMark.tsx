import type { CSSProperties } from "react";

/**
 * Renders a lodge's REAL logo (public/logos/<slug>.png) painted in its accent
 * colour via CSS `mask-image`. Because the mask is the actual art, the shape is
 * pixel-accurate — this is the fix for the old hand-traced "neon" signs that
 * "looked nothing like the logos". Server component, zero JS.
 *
 *   emblem    — big hero statement: pulsing accent halo under a crisp lit core
 *   watermark — huge, faint, single-layer; sized/positioned/faded by the caller
 *   mini       — small card chip: crisp core + a small static glow
 *
 * Sizing/position come from `className` (the mask is `contain`, so give it a box).
 */
type Variant = "emblem" | "watermark" | "mini";

export default function LodgeMark({
  slug,
  color,
  variant = "emblem",
  className = "",
  style,
}: {
  slug: string;
  color: string;
  variant?: Variant;
  className?: string;
  style?: CSSProperties;
}) {
  const vars = {
    "--mk": `url(/logos/${slug}.png)`,
    "--c": color,
    ...style,
  } as CSSProperties;

  if (variant === "watermark") {
    return (
      <div
        aria-hidden
        className={`ail-mask ail-fill-accent ${className}`}
        style={vars}
      />
    );
  }

  if (variant === "mini") {
    return (
      <div aria-hidden className={`ail-mark-mini ${className}`} style={vars}>
        <span className="ail-mask ail-fill-core" />
      </div>
    );
  }

  // emblem
  return (
    <div aria-hidden className={`ail-emblem ${className}`} style={vars}>
      <div className="ail-emblem-halo">
        <span className="ail-mask ail-fill-accent" />
      </div>
      <div className="ail-emblem-core">
        <span className="ail-mask ail-fill-core" />
      </div>
    </div>
  );
}
