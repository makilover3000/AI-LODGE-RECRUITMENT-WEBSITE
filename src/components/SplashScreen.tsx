"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import CabinScene, { LodgeTitle } from "./CabinScene";
import { markSplashSeen, prefersReducedMotion } from "@/lib/splash";

/**
 * The signature entry. A full-screen, non-scrolling cabin scene.
 * Smoke loops, the title shimmers, the door pulses to read as clickable.
 * Clicking the door swings it open with eased anticipation (not a linear
 * snap), a warm interior glows through, a cream wipe carries you inside,
 * and the splash unmounts to reveal the landing page beneath it.
 *
 * Door geometry mirrors CabinScene's <Cabin/>: hinge at x=462, mid-y=756.
 */
export default function SplashScreen({ onEntered }: { onEntered: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const wipe = useRef<HTMLDivElement>(null);
  const [opening, setOpening] = useState(false);
  const reduced = useRef(false);

  // ambient loops (smoke / shimmer / door cue)
  useEffect(() => {
    reduced.current = prefersReducedMotion();
    if (reduced.current) return;

    const ctx = gsap.context(() => {
      gsap.to("#ail-smoke", {
        y: -14,
        scaleX: 1.06,
        opacity: 0.55,
        transformOrigin: "center bottom",
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.fromTo(
        "#ail-title-shine",
        { attr: { x1: -1, x2: 0 } },
        {
          attr: { x1: 1.4, x2: 2.4 },
          duration: 2.4,
          repeat: -1,
          repeatDelay: 2,
          ease: "none",
        },
      );
      gsap.to("#ail-door-cue", {
        opacity: 0.85,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, root);

    return () => ctx.revert();
  }, []);

  // move focus into the dialog (onto the door) so keyboard/SR users start
  // on the one control that matters — the way in.
  useEffect(() => {
    const id = window.setTimeout(() => {
      document.getElementById("ail-door")?.focus();
    }, 50);
    return () => clearTimeout(id);
  }, []);

  const enter = () => {
    if (opening) return;
    setOpening(true);

    // lock the door cue + body scroll already locked via fixed overlay
    gsap.killTweensOf("#ail-door-cue");
    gsap.set("#ail-door-cue", { opacity: 0 });

    const finish = () => {
      markSplashSeen();
      onEntered();
    };

    if (reduced.current) {
      // simplified: warm glow + quick wipe, no swing
      gsap
        .timeline({ onComplete: finish })
        .to("#ail-interior-glow", { opacity: 0.9, duration: 0.2 })
        .to(wipe.current, { opacity: 1, duration: 0.25 }, 0);
      return;
    }

    // hinge the door on its left edge (SVG user-space origin)
    gsap.set("#ail-door", { svgOrigin: "462 756" });

    gsap
      .timeline({ onComplete: finish })
      // anticipation: door leans toward you before swinging
      .to("#ail-door", { scaleX: 1.06, duration: 0.18, ease: "power2.in" })
      // warm interior brightens through the widening gap
      .to("#ail-interior-glow", { opacity: 0.92, duration: 0.5 }, ">-0.05")
      // the swing — eased open, anchored on the hinge
      .to(
        "#ail-door",
        { scaleX: 0.06, duration: 0.62, ease: "power3.out" },
        "<",
      )
      // cream wipe carries us inside
      .to(wipe.current, { opacity: 1, duration: 0.45, ease: "power2.in" }, ">-0.28");
  };

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label="Enter the AI Lodge"
      className="fixed inset-0 z-50 overflow-hidden bg-sky select-none"
    >
      <CabinScene
        interactive
        onDoorActivate={enter}
        className="absolute inset-0 h-full w-full"
      />

      {/* arced title — own overlay so portrait crops never cut it */}
      <LodgeTitle className="pointer-events-none absolute left-1/2 top-[5%] h-auto w-[88%] max-w-[680px] -translate-x-1/2" />

      {/* conventional entry: a real, labelled control alongside the door —
          the only fully keyboard-/SR-obvious way in. */}
      <div className="absolute inset-x-0 bottom-[5%] flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={enter}
          disabled={opening}
          className="font-display rounded-sm bg-roof px-7 py-3 text-base tracking-[0.18em] text-cream shadow-[4px_4px_0_var(--color-roof-shadow)] transition-transform hover:-translate-y-0.5 disabled:opacity-70"
        >
          {opening ? "Welcome in…" : "Enter the lodge"}
        </button>
        <p className="font-display text-[clamp(0.8rem,2vw,1.1rem)] tracking-[0.22em] text-charcoal/70">
          or open the cabin door
        </p>
      </div>

      {/* cream transition wipe */}
      <div
        ref={wipe}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cream opacity-0"
      />
    </div>
  );
}
