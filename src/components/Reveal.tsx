"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-triggered reveal. Fades + lifts its direct children into view with
 * a slight stagger when the block enters the viewport. Honours
 * prefers-reduced-motion by rendering everything visible, unanimated.
 *
 * Robustness: content must NEVER stay stuck at opacity 0. If the trigger
 * hasn't fired shortly (e.g. a deep-link hash jump to a section that's
 * already scrolled past, where ScrollTrigger evaluates before the browser
 * applies the scroll), a fallback force-reveals everything.
 */
export default function Reveal({
  children,
  className = "",
  stagger = 0.12,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = el.children.length ? Array.from(el.children) : [el];
    let revealed = false;
    const markRevealed = () => {
      revealed = true;
    };

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        opacity: 0,
        y,
        duration: 0.7,
        ease: "power3.out",
        stagger,
        onStart: markRevealed,
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
          once: true,
          onEnter: markRevealed,
        },
      });
    }, el);

    // re-measure once layout settles (covers fonts loading / hash jumps)
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    // safety net: never leave content invisible
    const fallback = window.setTimeout(() => {
      if (!revealed) gsap.set(targets, { opacity: 1, y: 0, clearProps: "transform" });
    }, 1600);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
      ctx.revert();
    };
  }, [stagger, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
