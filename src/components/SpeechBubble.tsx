import type { ReactNode } from "react";

/**
 * Irregular polygon signboard — the poster's teal speech bubbles.
 * NOT a rounded rectangle: a hand-cut wobbly polygon with a triangular
 * pointer, a thick teal border, turquoise fill and an offset drop shadow.
 *
 * Border is faked by stacking two identically-clipped layers and scaling
 * the inner fill down slightly, leaving a ring (clip-path can't take a
 * normal border). The drop-shadow filter DOES follow the clip.
 */

type Pointer = "bottom-left" | "bottom-right" | "none";

const SHAPES: Record<Pointer, string> = {
  "bottom-left":
    "polygon(1% 10%, 22% 2%, 55% 7%, 84% 1%, 99% 12%, 97% 58%, 100% 80%, 24% 78%, 14% 100%, 9% 77%, 0% 72%)",
  "bottom-right":
    "polygon(1% 12%, 18% 1%, 47% 6%, 80% 2%, 99% 10%, 100% 72%, 92% 77%, 88% 100%, 78% 76%, 20% 80%, 2% 70%)",
  none: "polygon(1% 9%, 20% 1%, 52% 6%, 83% 0%, 99% 11%, 98% 62%, 100% 92%, 50% 96%, 18% 93%, 2% 88%)",
};

export default function SpeechBubble({
  children,
  pointer = "bottom-left",
  className = "",
}: {
  children: ReactNode;
  pointer?: Pointer;
  className?: string;
}) {
  const clip = SHAPES[pointer];
  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ filter: "drop-shadow(7px 8px 0 rgba(17,134,118,0.45))" }}
    >
      <div
        className="absolute inset-0 bg-teal"
        style={{ clipPath: clip }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-teal-deep"
        style={{ clipPath: clip, transform: "scale(0.95)" }}
        aria-hidden="true"
      />
      <div
        className="font-body relative px-7 py-5 text-cream"
        style={{
          paddingBottom: pointer === "none" ? "1.6rem" : "2.6rem",
        }}
      >
        {children}
      </div>
    </div>
  );
}
