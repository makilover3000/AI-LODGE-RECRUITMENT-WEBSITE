"use client";

import { useEffect } from "react";
import { markSplashSeen } from "@/lib/splash";

/**
 * Rendered on lodge pages. Anyone here arrived via a shared link or by
 * walking deeper into the site — either way they're past the front door,
 * so mark the splash seen. This guarantees that navigating *back* to the
 * landing never replays the door-swing entry.
 */
export default function MarkSplashSeen() {
  useEffect(() => {
    markSplashSeen();
  }, []);
  return null;
}
