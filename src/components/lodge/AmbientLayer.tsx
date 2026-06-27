"use client";

import { useEffect, useRef } from "react";
import type { AmbientKind } from "@/data/lodges";

/** Per-lodge ambient particle canvas (stars / fireflies / dots / embers). Reduced-motion safe. */
export default function AmbientLayer({
  kind,
  color,
}: {
  kind: AmbientKind;
  color: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 640;
    const count =
      (kind === "stars" ? 70 : kind === "dots" ? 45 : 55) * (isMobile ? 0.5 : 1);

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    type P = { x: number; y: number; r: number; vx: number; vy: number; ph: number; sp: number };
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const rises = kind === "fireflies" || kind === "embers";
    const particles: P[] = Array.from({ length: Math.round(count) }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: kind === "embers" ? rand(0.6, 1.8) : rand(0.7, 2.2),
      vx: rand(-0.02, 0.02) / 100,
      vy: (rises ? rand(-0.06, -0.02) : rand(-0.01, 0.01)) / 100,
      ph: Math.random() * Math.PI * 2,
      sp: rand(0.6, 2.2),
    }));

    let raf = 0;
    let t = 0;
    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx + (rises ? Math.sin(t * 0.4 + p.ph) * 0.0003 : 0);
        p.y += p.vy;
        if (p.y < -0.03) {
          p.y = 1.03;
          p.x = Math.random();
        }
        if (p.y > 1.05) p.y = -0.03;
        if (p.x < -0.03) p.x = 1.03;
        if (p.x > 1.05) p.x = -0.03;

        const twinkle =
          kind === "dots" ? 0.7 : 0.45 + 0.55 * Math.abs(Math.sin(t * p.sp + p.ph));
        const px = p.x * w;
        const py = p.y * h;
        const rad = p.r * (rises ? 5 : 3.2);
        const g = ctx.createRadialGradient(px, py, 0, px, py, rad);
        g.addColorStop(0, color);
        g.addColorStop(1, "transparent");
        ctx.globalAlpha = twinkle;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [kind, color]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
