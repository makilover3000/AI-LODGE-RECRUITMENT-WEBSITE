"use client";

import { useEffect, useRef } from "react";

/**
 * Canvas particle fire — a real per-particle system (no gradient/box-shadow fakery).
 *
 * Each flame particle spawns along the hearth base, rises with buoyant drift +
 * sway, is pulled gently toward centre (so the plume is wide at the base and
 * tapers to flickering tips), shrinks, and shifts colour over its life:
 * white/gold core → amber → orange → deep red → transparent. A slower stream of
 * ember sparks breaks off near the top of the plume and drifts higher than the
 * flames, fading out before it reaches the copy.
 *
 * Additive ("lighter") compositing fuses the translucent particles into a warm,
 * glowing flame body. Sits behind the CTA copy (pointer-events:none, aria-hidden).
 * prefers-reduced-motion → a single static warm glow, no motion.
 */
export default function Fireplace() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 640;
    const rand = (a: number, b: number) => a + Math.random() * (b - a);

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

    // ---------- reduced motion: single static warm glow, no particles ----------
    const drawStaticGlow = () => {
      ctx.clearRect(0, 0, w, h);
      const g = ctx.createRadialGradient(
        w / 2, h, 0, w / 2, h, Math.min(w * 0.6, h * 1.1),
      );
      g.addColorStop(0, "rgba(255,182,92,0.55)");
      g.addColorStop(0.35, "rgba(226,112,40,0.34)");
      g.addColorStop(0.7, "rgba(150,52,18,0.16)");
      g.addColorStop(1, "rgba(40,16,6,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    };
    if (reduce) {
      drawStaticGlow();
      const onResize = () => {
        resize();
        drawStaticGlow();
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    // ---------- particle fire ----------
    type Flame = {
      x: number; y: number; vx: number; vy: number;
      age: number; life: number; r0: number; sway: number; ph: number;
    };
    type Ember = {
      x: number; y: number; vx: number; vy: number;
      age: number; life: number; r: number; ph: number;
    };
    const flames: Flame[] = [];
    const embers: Ember[] = [];

    const baseW = () => w; // flame base spans the full section width
    // sum-of-uniforms ≈ gaussian → denser toward the centre, so the plume tapers
    const centreBias = () => (Math.random() + Math.random() + Math.random()) / 3 - 0.5;

    const spawnFlame = () => {
      const b = centreBias(); // -0.5..0.5
      const central = 1 - Math.min(1, Math.abs(b) * 2); // 0 at edge → 1 at centre
      const life = rand(0.7, 1.05) + central * rand(0.6, 1.1);
      // constant-velocity peak height = vy*life; tallest flames fill the section
      const peak = h * (0.6 + 0.45 * central);
      flames.push({
        x: w / 2 + b * baseW(),
        y: h - rand(0, 12),
        vx: rand(-16, 16),
        vy: -peak / life,
        age: 0,
        life,
        r0: rand(13, 28) * (0.72 + 0.55 * central),
        sway: rand(14, 34),
        ph: Math.random() * Math.PI * 2,
      });
    };

    const spawnEmber = () => {
      embers.push({
        x: w / 2 + rand(-baseW() * 0.42, baseW() * 0.42),
        y: h - rand(0, 24),
        vx: rand(-26, 26),
        vy: -rand(140, 240), // fast enough to climb past the copy to the top
        age: 0,
        life: rand(1.6, 3),
        r: rand(1.1, 2.8),
        ph: Math.random() * Math.PI * 2,
      });
    };

    // colour ramp over normalized age: white/gold → amber → orange → deep red
    const colourAt = (t: number): [number, number, number] => {
      if (t < 0.15) return [255, 250, 210];
      if (t < 0.4) {
        const k = (t - 0.15) / 0.25;
        return [255, 236 - 56 * k, 150 - 92 * k];
      }
      if (t < 0.75) {
        const k = (t - 0.4) / 0.35;
        return [255 - 70 * k, 144 - 92 * k, 58 - 34 * k];
      }
      const k = (t - 0.75) / 0.25;
      return [185 - 55 * k, 52 - 34 * k, 24 - 18 * k];
    };

    const flameRate = isMobile ? 400 : 580; // particles / second — dense, full body
    const emberRate = isMobile ? 12 : 20;

    let raf = 0;
    let last = 0;
    let flameAcc = 0;
    let emberAcc = 0;
    let running = false;

    const frame = (now: number) => {
      const t = now / 1000;
      const dt = last ? Math.min(0.04, (now - last) / 1000) : 0.016;
      last = now;

      flameAcc += flameRate * dt;
      while (flameAcc >= 1) { spawnFlame(); flameAcc -= 1; }
      emberAcc += emberRate * dt;
      while (emberAcc >= 1) { spawnEmber(); emberAcc -= 1; }

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      const cx = w / 2;

      for (let i = flames.length - 1; i >= 0; i--) {
        const p = flames[i];
        p.age += dt;
        const n = p.age / p.life;
        if (n >= 1) { flames.splice(i, 1); continue; }

        p.x += (p.vx + Math.sin(t * 3 + p.ph) * p.sway) * dt + (cx - p.x) * 0.3 * dt;
        p.y += p.vy * dt;

        const [r, g, b] = colourAt(n);
        const fadeIn = n < 0.1 ? n / 0.1 : 1;
        const alpha = fadeIn * (1 - n) * 0.34;
        const rad = Math.max(0.5, p.r0 * (1 - 0.72 * n));
        ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${alpha * 0.5})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad * 1.9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.age += dt;
        const n = e.age / e.life;
        if (n >= 1) { embers.splice(i, 1); continue; }
        e.x += (e.vx + Math.sin(t * 5 + e.ph) * 16) * dt;
        e.y += e.vy * dt;
        const flick = 0.5 + 0.5 * Math.sin(t * 18 + e.ph);
        const alpha = (1 - n) * (0.55 + 0.45 * flick);
        const rad = e.r * (1 - 0.3 * n);
        ctx.fillStyle = `rgba(255,${(180 + 45 * flick) | 0},${(70 * (1 - n)) | 0},${alpha})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, rad * 1.9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255,244,196,${alpha})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, rad * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      if (running) raf = requestAnimationFrame(frame);
    };

    // only burn CPU while the fire is actually on-screen and the tab is visible
    const start = () => {
      if (running) return;
      running = true;
      last = 0; // reset the frame-time baseline so dt doesn't jump on resume
      raf = requestAnimationFrame(frame);
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
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}
