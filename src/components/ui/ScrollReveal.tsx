"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** stagger > 0 animates the wrapper's direct children in sequence */
  stagger?: number;
  y?: number;
  as?: "div" | "section" | "ul" | "ol";
};

export default function ScrollReveal({
  children,
  className,
  stagger = 0,
  y = 28,
  as = "div",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const targets = stagger > 0 ? Array.from(el.children) : el;
      gsap.from(targets, {
        opacity: 0,
        y,
        duration: 0.85,
        ease: "power3.out",
        stagger,
        scrollTrigger: { trigger: el, start: "top 84%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [stagger, y]);

  const Tag = as as React.ElementType;
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
