"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import WindSweep from "./WindSweep";
import { BLUR_DESKTOP, BLUR_PORTRAIT } from "./blur";

/* --------------------------------------------------------------------------
   Art-directed entry. Idle = a calm, clear painting with gentle life (moving
   smoke title, drifting cloud-haze, dappled tree-light, fireflies, parallax).
   On "Enter the Lodge": a quick wind-sweep (3 big gust curves + leaves) blows
   across while the ENTIRE scene moves as one unit → reveals the landing.
   Positions are % of the viewport, tuned per composition — live-tune below.
   -------------------------------------------------------------------------- */
type Tune = {
  focus: { x: number; y: number }; // cabin windows (glow)
  chimney: { x: number; y: number }; // smoke plume origin
  sun: { x: number; y: number };
  titleMaskStop: number; // % — bottom of the warped smoke-title band
};

const TUNE_DESKTOP: Tune = {
  focus: { x: 50, y: 50 },
  chimney: { x: 50, y: 40 },
  sun: { x: 50, y: 32 },
  titleMaskStop: 33,
};
const TUNE_MOBILE: Tune = {
  focus: { x: 50, y: 55 },
  chimney: { x: 50, y: 41 },
  sun: { x: 50, y: 33 },
  titleMaskStop: 37,
};

export default function EntryScene({
  onEntered,
  onEnterStart,
  reducedMotion,
}: {
  onEntered: () => void;
  onEnterStart?: () => void;
  reducedMotion: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const enteringRef = useRef(false);
  const smokeRaf = useRef(0);
  const [entering, setEntering] = useState(false);
  // the sharp painting eases in over its own blur underlay (focus-pull) instead
  // of next/image's abrupt blur→sharp snap — no jarring "pop" on first paint
  const [baseLoaded, setBaseLoaded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = () => setIsDesktop(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const T = isDesktop ? TUNE_DESKTOP : TUNE_MOBILE;
  const webSrc = isDesktop ? "/entry/entry-web.jpg" : "/entry/entry-web-portrait.jpg";

  // ambient: evolving smoke turbulence + mouse parallax
  useEffect(() => {
    if (reducedMotion) return;
    const turb = root.current?.querySelector<SVGFETurbulenceElement>(
      "#ail-smoke-svg feTurbulence",
    );
    // Throttle the seed churn to ~24fps. The full-viewport feDisplacementMap
    // re-rasterizes whenever `seed` changes, so updating it every frame (60fps)
    // is the heaviest ongoing cost — and pure stutter on weak laptops. The SMIL
    // <animate> on baseFrequency keeps the smoke evolving smoothly between ticks.
    let seed = 2;
    let last = 0;
    const tick = (now: number) => {
      if (now - last >= 42) {
        seed += 0.024;
        turb?.setAttribute("seed", seed.toFixed(3));
        last = now;
      }
      smokeRaf.current = requestAnimationFrame(tick);
    };
    if (turb) smokeRaf.current = requestAnimationFrame(tick);

    const el = root.current;
    const onMove = (e: MouseEvent) => {
      if (enteringRef.current || !el) return;
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      el.querySelectorAll<HTMLElement>("[data-parallax]").forEach((node) => {
        const d = parseFloat(node.dataset.parallax || "1");
        gsap.to(node, { x: x * 26 * d, y: y * 18 * d, duration: 0.7, ease: "power2.out" });
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(smokeRaf.current);
      window.removeEventListener("mousemove", onMove);
    };
  }, [reducedMotion]);

  // orchestrated load-in
  useEffect(() => {
    if (reducedMotion) return;
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      // NOTE: never fade `.ail-world` opacity on load — with the opaque backdrop
      // behind it that reads as a ghostly semi-transparent screen. Solid from
      // frame one (blur placeholder shows instantly); only a subtle scale settle.
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".ail-world", { scale: 1.04, duration: 1.0 })
        .from(".ail-enter-ui", { opacity: 0, y: 20, duration: 0.8 }, "-=0.5");
    }, el);
    return () => ctx.revert();
  }, [reducedMotion]);

  const handleEnter = () => {
    if (enteringRef.current) return;
    enteringRef.current = true;
    const el = root.current;
    if (!el) return;

    // reveal the landing (it was hidden until now) + clear the backdrop entirely
    // (colour + blur image) so the slide uncovers the real page
    onEnterStart?.();
    el.style.background = "transparent";

    if (reducedMotion) {
      gsap.to(".ail-world", { autoAlpha: 0, duration: 0.45, onComplete: onEntered });
      return;
    }

    // free the GPU for a smooth gust: stop the smoke filter + seed loop
    cancelAnimationFrame(smokeRaf.current);
    const titleFx = el.querySelector<HTMLElement>(".ail-title-fx");
    if (titleFx) titleFx.style.filter = "none";

    // mount the wind-sweep (big gust arms + leaves) only now
    setEntering(true);

    // The wind shoves the WHOLE page off as one aligned block (slideshow push)
    gsap
      .timeline({ onComplete: onEntered })
      .to(".ail-enter-ui", { opacity: 0, duration: 0.2 })
      .to(
        ".ail-world",
        { xPercent: 115, duration: 0.8, ease: "power2.in" },
        0.18,
      );
  };

  const maskTop = T.titleMaskStop - 14;

  return (
    <div
      ref={root}
      className="fixed inset-0 overflow-hidden"
      style={{
        // same blurred-painting backdrop as the deciding cover, so the cover→scene
        // hand-off never shows a bare green frame; cleared to transparent on Enter
        backgroundColor: "#1f2b21",
        backgroundImage: `url(${isDesktop ? BLUR_DESKTOP : BLUR_PORTRAIT})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* THE WORLD — everything in here moves together; slides off to reveal the landing */}
      <div
        className={`ail-world absolute inset-0 bg-pine-900 will-change-transform${
          entering ? " ail-frozen" : ""
        }`}
      >
        {/* base painting (optimized). The blur preview is its own underlay so the
            sharp image can fade in OVER it (smooth focus-pull, no snap). The blur
            and sharp share this parallax layer, so they stay perfectly aligned. */}
        <div className="absolute inset-0 overflow-hidden" data-parallax="0.2">
          {/* blur underlay as its own layer so it can carry a CSS blur() —
              the tiny placeholder upscales as soft focus, not JPEG blocks */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${isDesktop ? BLUR_DESKTOP : BLUR_PORTRAIT})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(10px)",
              transform: "scale(1.06)",
            }}
          />
          {/* Native <picture>: the browser fetches ONLY the right orientation at
              parse time (no JS swap, no SSR portrait→landscape refetch/remount),
              served as the raw already-optimized jpg (no /_next/image cold-optimize
              on Vercel). Sharp image fades in over its blur underlay (focus-pull). */}
          <picture>
            <source media="(min-width: 1024px)" srcSet="/entry/entry-hd.jpg" />
            <img
              src="/entry/entry-hd-portrait.jpg"
              alt="A log cabin glowing on a forested peak at golden hour, with 'AI Lodge' written in chimney smoke."
              onLoad={() => setBaseLoaded(true)}
              decoding="async"
              fetchPriority="high"
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ease-out ${
                baseLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </picture>
        </div>

        {/* drifting cloud-haze across the sky */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[44%]"
          data-parallax="0.6"
          aria-hidden
        >
          {[
            { left: "12%", top: "30%", w: "30vmax", dur: "30s", delay: "0s", o: 0.5 },
            { left: "60%", top: "16%", w: "26vmax", dur: "38s", delay: "-12s", o: 0.42 },
            { left: "38%", top: "44%", w: "22vmax", dur: "34s", delay: "-6s", o: 0.32 },
          ].map((c, i) => (
            <span
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                left: c.left,
                top: c.top,
                width: c.w,
                height: c.w,
                opacity: c.o,
                background:
                  "radial-gradient(closest-side, rgba(255,253,247,0.9), rgba(255,253,247,0) 70%)",
                filter: "blur(14px)",
                mixBlendMode: "screen",
                animation: reducedMotion
                  ? undefined
                  : `ail-cloud-drift ${c.dur} ease-in-out ${c.delay} infinite alternate`,
              }}
            />
          ))}
        </div>

        {/* soft sky sun glow */}
        <div
          data-parallax="0.4"
          aria-hidden
          className="pointer-events-none absolute h-[50vmax] w-[50vmax] -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${T.sun.x}%`,
            top: `${T.sun.y}%`,
            background:
              "radial-gradient(circle, rgba(255,238,200,0.35), rgba(255,224,160,0.1) 34%, transparent 62%)",
            mixBlendMode: "screen",
          }}
        />

        {/* warm window glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute h-[11vmax] w-[11vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: `${T.focus.x}%`,
            top: `${T.focus.y}%`,
            background: "radial-gradient(circle, rgba(255,196,110,0.45), transparent 65%)",
            mixBlendMode: "screen",
            animation: reducedMotion ? undefined : "ail-flicker 3.6s ease-in-out infinite",
          }}
        />

        {/* chimney plume — soft puffs rising toward the title */}
        {!reducedMotion && (
          <div
            aria-hidden
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${T.chimney.x}%`, top: `${T.chimney.y}%` }}
            data-parallax="0.5"
          >
            {[0, 1.6, 3.2, 4.8].map((delay, i) => (
              <span
                key={i}
                className="absolute left-1/2 h-[1.6vmax] w-[1.6vmax] -translate-x-1/2 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(245,242,232,0.8), transparent 70%)",
                  filter: "blur(4px)",
                  animation: `ail-rise 6s ease-in ${delay}s infinite`,
                }}
              />
            ))}
          </div>
        )}

        {/* animated smoke-title: duplicate of the painting (light web jpg), top band only, warped */}
        <div
          className="ail-title-fx pointer-events-none absolute inset-0 will-change-transform"
          data-parallax="0.8"
          style={{
            backgroundImage: `url('${webSrc}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: reducedMotion ? undefined : "url(#ail-smoke)",
            WebkitMaskImage: `linear-gradient(to bottom, #000 0%, #000 ${maskTop}%, transparent ${T.titleMaskStop}%)`,
            maskImage: `linear-gradient(to bottom, #000 0%, #000 ${maskTop}%, transparent ${T.titleMaskStop}%)`,
          }}
        />

        {/* dappled tree-light over the lower treeline */}
        <div
          aria-hidden
          data-parallax="0.7"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%]"
          style={{
            background:
              "radial-gradient(50px 70px at 18% 40%, rgba(255,240,200,0.5), transparent 60%)," +
              "radial-gradient(70px 90px at 72% 55%, rgba(255,240,200,0.42), transparent 60%)," +
              "radial-gradient(60px 80px at 45% 70%, rgba(255,240,200,0.4), transparent 60%)," +
              "radial-gradient(80px 60px at 88% 32%, rgba(255,240,200,0.36), transparent 60%)",
            mixBlendMode: "soft-light",
            animation: reducedMotion ? undefined : "ail-dapple 9s ease-in-out infinite",
          }}
        />

        {/* edge vignette */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 95% at 50% 46%, transparent 66%, rgba(13,30,20,0.3) 100%)",
          }}
        />

        {/* fireflies — inside the world so they ride the gust too */}
        {!reducedMotion && <Fireflies stop={entering} />}
      </div>

      {/* the wind-sweep gust (only during the transition) */}
      {entering && <WindSweep reducedMotion={reducedMotion} />}

      {/* ENTER UI */}
      <div className="ail-enter-ui absolute inset-x-0 bottom-[7%] z-10 flex flex-col items-center gap-3 px-6 text-center">
        <button
          type="button"
          onClick={handleEnter}
          className="font-display rounded-full bg-glow-deep px-10 py-4 text-lg tracking-[0.12em] text-pine-900 shadow-[0_5px_0_#b97c2c] transition-transform hover:-translate-y-0.5"
          style={{ animation: reducedMotion ? undefined : "ail-float 3.4s ease-in-out infinite" }}
        >
          Enter the Lodge
        </button>
        <span className="eyebrow text-cream-50/85 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
          a cozy corner of SMU BIA
        </span>
      </div>

      {/* smoke displacement filter */}
      <svg id="ail-smoke-svg" width="0" height="0" aria-hidden className="absolute">
        <filter id="ail-smoke" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.02"
            numOctaves={2}
            seed={2}
            result="n"
          >
            <animate
              attributeName="baseFrequency"
              dur="18s"
              values="0.012 0.02; 0.02 0.012; 0.012 0.02"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="8"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
    </div>
  );
}

function Fireflies({ stop }: { stop: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const stopRef = useRef(false);
  useEffect(() => {
    stopRef.current = stop;
  }, [stop]);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    const n = window.innerWidth < 640 ? 22 : 42;
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const ps = Array.from({ length: n }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: rand(0.7, 1.9),
      ph: Math.random() * 6.28,
      sp: rand(0.6, 1.8),
      vy: rand(-0.02, -0.005) / 100,
      vx: rand(-0.01, 0.01) / 100,
    }));
    let raf = 0;
    let t = 0;
    const draw = () => {
      if (stopRef.current) return; // stop the loop on Enter — free the GPU for the sweep
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.y += p.vy;
        p.x += p.vx + Math.sin(t * 0.5 + p.ph) * 0.0002;
        if (p.y < -0.03) {
          p.y = 1.03;
          p.x = Math.random();
        }
        const a = 0.35 + 0.55 * Math.abs(Math.sin(t * p.sp + p.ph));
        const px = p.x * w;
        const py = p.y * h;
        const rad = p.r * 5;
        const g = ctx.createRadialGradient(px, py, 0, px, py, rad);
        g.addColorStop(0, "rgba(255,224,150,1)");
        g.addColorStop(1, "rgba(255,224,150,0)");
        ctx.globalAlpha = a;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, rad, 0, 6.28);
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
  }, []);
  return (
    <canvas ref={ref} aria-hidden className="ail-fireflies pointer-events-none absolute inset-0" />
  );
}
