"use client";

import { useEffect, useRef } from "react";
import type { AmbientKind } from "@/data/lodges";

/**
 * Per-lodge ambient leaves drifting down the hero. Each lodge has its own leaf
 * shape (via `kind`), tinted by its accent `color` with a lighter rim + vein so
 * it reads against the dark hero. Vampire (`glow`) additionally gets a luminous
 * pale rim, a warm red halo, and a gentle pulse. Reduced-motion safe: renders a
 * static scatter with no animation.
 */
export default function AmbientLayer({
  kind,
  color,
  glow,
}: {
  kind: AmbientKind;
  color: string;
  /** per-lodge: luminous rim + red halo + pulse (Vampire) */
  glow?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 640;
    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    // lighten the accent toward white for the rim / vein
    const lighten = (hex: string, amt: number) => {
      const h = hex.replace("#", "");
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      const mix = (c: number) => Math.round(c + (255 - c) * amt);
      return `rgb(${mix(r)},${mix(g)},${mix(b)})`;
    };
    const rim = lighten(color, glow ? 0.82 : 0.5);

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const count = isMobile ? 16 : 28;

    type Leaf = {
      x: number; y: number; size: number; rot: number; rotSp: number;
      vy: number; swAmp: number; swFreq: number; ph: number;
    };
    const leaves: Leaf[] = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: rand(8, 15) * (isMobile ? 0.85 : 1),
      rot: Math.random() * Math.PI * 2,
      rotSp: rand(-0.012, 0.012),
      vy: rand(0.0006, 0.0016),
      swAmp: rand(0.0004, 0.0011),
      swFreq: rand(0.5, 1.4),
      ph: Math.random() * Math.PI * 2,
    }));

    // leaf silhouette, centred at origin, tip up
    const leafPath = (s: number) => {
      ctx.beginPath();
      switch (kind) {
        case "lance":
          ctx.moveTo(0, -s * 1.15);
          ctx.quadraticCurveTo(s * 0.3, 0, 0, s * 1.15);
          ctx.quadraticCurveTo(-s * 0.3, 0, 0, -s * 1.15);
          break;
        case "teardrop":
          ctx.moveTo(0, s);
          ctx.bezierCurveTo(s * 0.85, s * 0.15, s * 0.72, -s * 0.85, 0, -s);
          ctx.bezierCurveTo(-s * 0.72, -s * 0.85, -s * 0.85, s * 0.15, 0, s);
          break;
        case "heart":
          ctx.moveTo(0, s);
          ctx.bezierCurveTo(s * 0.95, s * 0.05, s * 0.78, -s * 0.8, 0, -s * 0.28);
          ctx.bezierCurveTo(-s * 0.78, -s * 0.8, -s * 0.95, s * 0.05, 0, s);
          break;
        case "round":
          ctx.moveTo(0, s);
          ctx.quadraticCurveTo(s * 0.95, s * 0.2, s * 0.72, -s * 0.5);
          ctx.quadraticCurveTo(0, -s * 1.08, -s * 0.72, -s * 0.5);
          ctx.quadraticCurveTo(-s * 0.95, s * 0.2, 0, s);
          break;
        case "maple": {
          const lobes = 5;
          const step = (Math.PI * 2) / (lobes * 2);
          for (let i = 0; i <= lobes * 2; i++) {
            const a = -Math.PI / 2 + i * step;
            const rr = s * (i % 2 === 0 ? 1.08 : 0.46);
            const x = Math.cos(a) * rr;
            const y = Math.sin(a) * rr;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          break;
        }
        case "oval":
          ctx.ellipse(0, 0, s * 0.58, s, 0, 0, Math.PI * 2);
          break;
        case "bat": {
          const wng = s * 1.6; // half wingspan
          const b = s * 0.95;
          ctx.moveTo(0, -b * 0.45); // neck, between the ears
          ctx.lineTo(-b * 0.15, -b); // left ear tip
          ctx.lineTo(-b * 0.32, -b * 0.5); // left shoulder
          ctx.quadraticCurveTo(-wng * 0.55, -b, -wng, -b * 0.45); // leading edge → left wing tip
          ctx.lineTo(-wng * 0.72, b * 0.15); // scalloped trailing edge…
          ctx.lineTo(-wng * 0.6, -b * 0.1);
          ctx.lineTo(-wng * 0.42, b * 0.2);
          ctx.lineTo(-wng * 0.3, -b * 0.05);
          ctx.lineTo(-wng * 0.14, b * 0.22);
          ctx.lineTo(0, b * 0.95); // tail point
          ctx.lineTo(wng * 0.14, b * 0.22);
          ctx.lineTo(wng * 0.3, -b * 0.05);
          ctx.lineTo(wng * 0.42, b * 0.2);
          ctx.lineTo(wng * 0.6, -b * 0.1);
          ctx.lineTo(wng * 0.72, b * 0.15);
          ctx.lineTo(wng, -b * 0.45); // right wing tip
          ctx.quadraticCurveTo(wng * 0.55, -b, b * 0.32, -b * 0.5);
          ctx.lineTo(b * 0.15, -b); // right ear tip
          ctx.lineTo(0, -b * 0.45);
          break;
        }
        case "pointed":
        default:
          ctx.moveTo(0, -s);
          ctx.quadraticCurveTo(s * 0.6, 0, 0, s);
          ctx.quadraticCurveTo(-s * 0.6, 0, 0, -s);
          break;
      }
      ctx.closePath();
    };
    const hasVein = kind !== "maple" && kind !== "round" && kind !== "bat";

    const drawLeaf = (lf: Leaf, alpha: number) => {
      ctx.save();
      ctx.translate(lf.x * w, lf.y * h);
      ctx.rotate(lf.rot);

      if (glow) {
        ctx.globalCompositeOperation = "lighter";
        const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, lf.size * 2.4);
        halo.addColorStop(0, `rgba(255,60,60,${0.5 * alpha})`);
        halo.addColorStop(1, "rgba(255,40,40,0)");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(0, 0, lf.size * 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      }

      leafPath(lf.size);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.fill();
      ctx.globalAlpha = Math.min(1, alpha + 0.15);
      ctx.lineWidth = glow ? 1.5 : 1;
      ctx.strokeStyle = rim;
      ctx.stroke();

      if (hasVein) {
        ctx.globalAlpha = alpha * 0.7;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, -lf.size * 0.85);
        ctx.lineTo(0, lf.size * 0.85);
        ctx.stroke();
      }
      ctx.restore();
    };

    if (reduce) {
      const renderStatic = () => {
        ctx.clearRect(0, 0, w, h);
        for (const lf of leaves) drawLeaf(lf, 0.82);
        ctx.globalAlpha = 1;
      };
      renderStatic();
      const onResize = () => {
        resize();
        renderStatic();
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    let raf = 0;
    let t = 0;
    let running = false;
    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      for (const lf of leaves) {
        lf.y += lf.vy;
        lf.x += Math.sin(t * lf.swFreq + lf.ph) * lf.swAmp;
        lf.rot += lf.rotSp;
        if (lf.y > 1.08) {
          lf.y = -0.08;
          lf.x = Math.random();
        }
        if (lf.x < -0.08) lf.x = 1.08;
        if (lf.x > 1.08) lf.x = -0.08;
        const shimmer = glow
          ? 0.6 + 0.34 * Math.sin(t * 1.6 + lf.ph)
          : 0.72 + 0.16 * Math.sin(t * 0.8 + lf.ph);
        drawLeaf(lf, shimmer);
      }
      ctx.globalAlpha = 1;
      if (running) raf = requestAnimationFrame(draw);
    };

    // only animate while the hero is on-screen and the tab is visible
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    let onScreen = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen && !document.hidden) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);
    const onVisibility = () => {
      if (onScreen && !document.hidden) start();
      else stop();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", resize);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
    };
  }, [kind, color, glow]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
