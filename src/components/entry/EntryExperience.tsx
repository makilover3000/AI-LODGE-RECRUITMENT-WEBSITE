"use client";

import { useEffect, useState } from "react";
import EntryScene from "./EntryScene";
import { BLUR_DESKTOP } from "./blur";
import { hasSeenSplash, markSplashSeen, prefersReducedMotion } from "@/lib/splash";

type Phase = "deciding" | "scene" | "done";

/**
 * Owns the once-per-session splash gate. Renders a neutral cream cover for the
 * one-tick client decision (no hydration flash of the landing), then either the
 * cinematic scene (fresh visit) or nothing (already seen / returning in-session).
 */
export default function EntryExperience() {
  const [phase, setPhase] = useState<Phase>("deciding");

  useEffect(() => {
    // `?nosplash` lets us preview/share the landing directly (skips the entry)
    const skip =
      hasSeenSplash() ||
      new URLSearchParams(window.location.search).has("nosplash");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPhase(skip ? "done" : "scene");
  }, []);

  // lock + inert the landing while the splash owns the screen (a11y + no scroll)
  useEffect(() => {
    const site = document.getElementById("site");
    const active = phase !== "done";
    if (site) {
      if (active) site.setAttribute("inert", "");
      else site.removeAttribute("inert");
    }
    document.body.style.overflow = active ? "hidden" : "";
    // when the splash is over, ensure the landing is shown again
    if (!active) document.documentElement.removeAttribute("data-splash");
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  if (phase === "done") return null;

  if (phase === "deciding") {
    // show the blurred painting (not flat green) so the hand-off into the scene
    // is seamless — no colour flash during the one-tick client decision
    return (
      <div
        className="fixed inset-0 z-[80]"
        aria-hidden
        style={{
          backgroundColor: "#1f2b21",
          backgroundImage: `url(${BLUR_DESKTOP})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 z-[80]"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to AI Lodge"
    >
      <EntryScene
        reducedMotion={prefersReducedMotion()}
        // reveal the (until-now hidden) landing exactly when the slide begins,
        // so the wind-sweep uncovers the real page — never visible before that
        onEnterStart={() => document.documentElement.removeAttribute("data-splash")}
        onEntered={() => {
          markSplashSeen();
          setPhase("done");
        }}
      />
    </div>
  );
}
