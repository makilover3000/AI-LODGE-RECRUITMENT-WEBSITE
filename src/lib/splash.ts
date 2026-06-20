/**
 * Splash session logic.
 *
 * The door-swing entry plays once per *session* — not per load.
 * We use sessionStorage (clears when the tab closes) so a fresh
 * visit tomorrow replays it, but reloads / in-session navigation
 * within the same visit do not. Anyone landing directly on a
 * /lodges/[slug] URL never sees the splash regardless of state.
 */
const SPLASH_KEY = "ail_splash_seen";

export function hasSeenSplash(): boolean {
  if (typeof window === "undefined") return true; // SSR: assume seen, never flash splash on server
  try {
    return window.sessionStorage.getItem(SPLASH_KEY) === "1";
  } catch {
    return true; // storage blocked → don't trap the user behind a door
  }
}

export function markSplashSeen(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(SPLASH_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
