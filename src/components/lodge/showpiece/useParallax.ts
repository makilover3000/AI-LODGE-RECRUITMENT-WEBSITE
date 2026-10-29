"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";

/**
 * Pointer parallax for a hero showpiece: every `[data-depth]` layer inside `root` drifts by
 * its depth as the pointer moves (up to 22px × depth sideways, 14px × depth vertically).
 * Off on touch screens and under prefers-reduced-motion. Only `transform` is touched.
 */
export function useParallax(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;
    const layers = Array.from(el.querySelectorAll<HTMLElement>("[data-depth]")).map((node) => ({
      depth: Number(node.dataset.depth),
      x: gsap.quickTo(node, "x", { duration: 0.9, ease: "power3.out" }),
      y: gsap.quickTo(node, "y", { duration: 0.9, ease: "power3.out" }),
    }));
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      for (const l of layers) {
        l.x(nx * 22 * l.depth);
        l.y(ny * 14 * l.depth);
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [root]);
}
