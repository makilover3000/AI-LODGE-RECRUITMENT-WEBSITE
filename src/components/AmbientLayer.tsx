import type { CSSProperties } from "react";
import type { AmbientType } from "@/data/lodges";

/**
 * Per-lodge ambient particle layer rendered over the shared cabin world.
 * Pure CSS animation, deterministic positions (seeded by lodge), so server
 * and client render identically (no hydration mismatch). prefers-reduced-
 * motion is honoured globally — particles simply hold still.
 */

type Variant = {
  count: number;
  color: string;
  size: [number, number]; // px
  anim: "ail-twinkle" | "ail-rise" | "ail-fall" | "ail-drift";
  duration: [number, number]; // s
  radius: string; // border-radius
  glow?: boolean;
};

const VARIANTS: Record<AmbientType, Variant> = {
  stars: { count: 46, color: "var(--color-cream)", size: [2, 5], anim: "ail-twinkle", duration: [2, 5], radius: "1px" },
  dots: { count: 40, color: "var(--color-teal-highlight)", size: [4, 9], anim: "ail-drift", duration: [6, 12], radius: "50%", glow: true },
  fireflies: { count: 28, color: "#dff09a", size: [3, 6], anim: "ail-rise", duration: [9, 16], radius: "50%", glow: true },
  embers: { count: 32, color: "var(--color-cabin-accent)", size: [3, 7], anim: "ail-rise", duration: [7, 13], radius: "50%", glow: true },
  leaves: { count: 26, color: "var(--color-tree-4)", size: [6, 12], anim: "ail-fall", duration: [9, 16], radius: "0 60% 0 60%" },
  snow: { count: 44, color: "#f4f6f0", size: [3, 7], anim: "ail-fall", duration: [10, 18], radius: "50%" },
  pollen: { count: 34, color: "#e6d77a", size: [2, 5], anim: "ail-drift", duration: [7, 14], radius: "50%", glow: true },
};

// tiny deterministic PRNG so positions are stable across SSR/CSR
function makeRng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function seedFrom(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h) || 1;
}

export default function AmbientLayer({
  type,
  seed = "ail",
  density = 1,
}: {
  type: AmbientType;
  seed?: string;
  /** scale particle count down in dense contexts (e.g. grid cards) to keep
   *  paint/INP cheap — animated glows are not GPU-composited. */
  density?: number;
}) {
  const v = VARIANTS[type];
  const rng = makeRng(seedFrom(seed + type));
  const count = Math.max(6, Math.round(v.count * density));

  const particles = Array.from({ length: count }, (_, i) => {
    const size = v.size[0] + rng() * (v.size[1] - v.size[0]);
    const left = rng() * 100;
    const top = rng() * 100;
    const dur = v.duration[0] + rng() * (v.duration[1] - v.duration[0]);
    const delay = -rng() * dur;
    const style: CSSProperties = {
      position: "absolute",
      left: `${left}%`,
      top: `${top}%`,
      width: `${size}px`,
      height: `${size}px`,
      background: v.color,
      borderRadius: v.radius,
      boxShadow: v.glow ? `0 0 ${size * 2.5}px ${v.color}` : undefined,
      animation: `${v.anim} ${dur}s linear ${delay}s infinite`,
      willChange: "transform, opacity",
    };
    return <span key={i} aria-hidden="true" style={style} />;
  });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles}
    </div>
  );
}
