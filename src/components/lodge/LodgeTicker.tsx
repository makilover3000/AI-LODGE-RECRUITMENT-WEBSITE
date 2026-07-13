import type { CSSProperties } from "react";
import type { Lodge } from "@/data/lodges";
import Treeline from "@/components/ui/Treeline";
import GuitarNeon from "@/components/lodge/GuitarNeon";

/**
 * A fast ribbon of the lodge's OWN logo, repeated tiny and streaming past — a
 * playful signature strip unique to each lodge (guitars for HackStreet, hearts
 * for Paiseh…). Same mask trick as LodgeMark, in the lodge accent + a gentle
 * shimmer. Pure CSS marquee (zero JS); freezes under prefers-reduced-motion.
 * Sits on the pine band between the hero and the (cream) overview.
 */
const PER_HALF = 16; // tiles per half; the track is duplicated for a seamless loop

export default function LodgeTicker({ lodge }: { lodge: Lodge }) {
  const accent = lodge.neonColor ?? lodge.accent;
  const isGuitar = lodge.slug === "hackstreet-boys";
  const vars = {
    "--mk": `url(/logos/${lodge.slug}.png)`,
    "--c": accent,
    "--belt-dur": isGuitar ? "24s" : "16s",
  } as CSSProperties;

  const half = (prefix: string) =>
    Array.from({ length: PER_HALF }).map((_, i) =>
      isGuitar ? (
        // HackStreet: tiny glowing neon guitars streaming past
        <GuitarNeon
          key={`${prefix}-${i}`}
          variant="ticker"
          color={accent}
          className="mx-3 w-14 shrink-0 aspect-[1292/959]"
          style={{ animationDelay: `${(i % 5) * 0.45}s` }}
        />
      ) : (
        <span
          key={`${prefix}-${i}`}
          className="ail-mask ail-ticker-mark mx-3.5 h-7 w-9 shrink-0 sm:mx-4 sm:h-8 sm:w-11"
          style={{ animationDelay: `${(i % 5) * 0.45}s` }}
        />
      )
    );

  return (
    <div className="relative bg-pine-900">
      <div
        className="ail-belt overflow-hidden py-4"
        style={vars}
        aria-hidden
      >
        <div className="ail-ticker-track items-center">
          {half("a")}
          {half("b")}
        </div>
      </div>

      {/* edge fades so tiles enter/exit softly instead of hard-clipping */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-pine-900 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-pine-900 to-transparent" />

      <Treeline
        className="-mb-px h-10 sm:h-14"
        back="var(--color-pine-700)"
        front="var(--color-cream)"
      />
    </div>
  );
}
