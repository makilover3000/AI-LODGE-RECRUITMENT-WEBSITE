import type { CSSProperties } from "react";

/**
 * A deterministic particle field for the hero showpieces (same output on server + client).
 *   petal   — marigold petals tumbling down        (Despacito)
 *   leaf    — slim leaves drifting down             (PandAI)
 *   firefly — warm glowing dots rising and blinking (BRYan)
 *   ember   — hot sparks rising and flickering       (S.P.I.C.E.)
 * Each particle animates transform/opacity only; the global reduced-motion rule freezes them.
 * Must sit inside an element with `container-type: size` (falls are measured in cqh).
 */
type Variant = "petal" | "leaf" | "firefly" | "ember";

export default function Particles({
  variant,
  count = 12,
  tones = 3,
}: {
  variant: Variant;
  count?: number;
  /** how many colour classes to cycle (ail-pt-<variant>-0..n) */
  tones?: number;
}) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const size = variant === "firefly" ? 4 + ((i * 3) % 4) : variant === "ember" ? 3 + ((i * 3) % 4) : 8 + ((i * 5) % 7);
        const style = {
          left: `${6 + ((i * 37) % 88)}%`,
          width: size,
          height: variant === "leaf" ? size * 2.2 : variant === "petal" ? size * 1.35 : size,
          animationDuration: `${(variant === "firefly" ? 7 : variant === "ember" ? 5 : 9) + ((i * 7) % 6)}s`,
          animationDelay: `${-((i * 1.37) % 11)}s`,
          "--drift": `${(i % 2 ? 1 : -1) * (14 + ((i * 11) % 26))}px`,
          "--spin": `${(i % 2 ? 1 : -1) * (variant === "leaf" ? 70 + ((i * 29) % 90) : 180 + ((i * 53) % 240))}deg`,
        } as CSSProperties;
        return <span key={i} className={`ail-pt ail-pt-${variant} ail-pt-${variant}-${i % tones}`} style={style} />;
      })}
    </>
  );
}
