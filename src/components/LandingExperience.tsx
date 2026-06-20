"use client";

import { useEffect, useState, type ReactNode } from "react";
import SplashScreen from "./SplashScreen";
import { hasSeenSplash } from "@/lib/splash";

/**
 * Decides whether the door-swing splash plays before showing the landing.
 * - Fresh landing on `/` this session → splash.
 * - Already entered this session (reload / in-session nav) → straight to landing.
 *
 * A brief cream cover prevents any flash of either state during the
 * one-tick client decision (sessionStorage can't be read on the server).
 */
export default function LandingExperience({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<"loading" | "splash" | "landing">("loading");

  useEffect(() => {
    // Deliberate post-mount read of a client-only source (sessionStorage):
    // it can't be read during SSR, so we render a neutral "loading" cover on
    // the server/first paint and resolve the real phase here. This avoids a
    // hydration mismatch and is a legitimate external-system sync.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPhase(hasSeenSplash() ? "landing" : "splash");
  }, []);

  // lock scroll while the splash owns the screen
  useEffect(() => {
    const lock = phase === "splash" || phase === "loading";
    document.body.style.overflow = lock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  // while the splash/loading cover owns the screen, take the landing out of
  // the tab order + accessibility tree so keyboard/SR users can't wander into
  // controls hidden behind the overlay (WCAG 2.4.3 Focus Order, 2.4.11).
  const landingHidden = phase !== "landing";

  return (
    <>
      <div inert={landingHidden}>{children}</div>

      {phase === "splash" && (
        <SplashScreen onEntered={() => setPhase("landing")} />
      )}

      {phase === "loading" && (
        <div className="fixed inset-0 z-50 bg-sky" aria-hidden="true" />
      )}
    </>
  );
}
