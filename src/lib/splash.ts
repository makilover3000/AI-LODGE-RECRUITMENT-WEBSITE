/** Splash/entry session gate + reduced-motion helpers. Client-only (touch window/sessionStorage). */

const SPLASH_KEY = "ail-splash-seen";

export function hasSeenSplash(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(SPLASH_KEY) === "1";
  } catch {
    return false;
  }
}

export function markSplashSeen(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(SPLASH_KEY, "1");
  } catch {
    /* sessionStorage unavailable (private mode, etc.) — fail open */
  }
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
