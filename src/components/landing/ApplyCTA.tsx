import Link from "next/link";
import Fireplace from "./Fireplace";

export default function ApplyCTA() {
  return (
    <section
      id="apply"
      className="relative isolate overflow-hidden bg-pine-900 py-28 text-cream-50"
    >
      {/* cozy cabin fireplace, burning behind the copy */}
      <Fireplace />

      {/* light legibility veil — just enough contrast; fire stays present around the words */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-pine-900/45 via-pine-900/20 to-pine-900/45"
      />

      <div className="relative z-10 mx-auto max-w-2xl px-5 text-center sm:px-8">
        <h2 className="font-display text-display text-cream-50 [text-shadow:0_2px_14px_rgba(0,0,0,0.6),0_0_34px_rgba(255,150,60,0.45)]">
          Ready to join the lodge?
        </h2>
        <div className="mt-9 flex justify-center">
          <Link
            href="https://smu.opine.asia/survey?id=d9968e73-86c2-42e2-a2b9-fa7ef7289a3c"
            className="font-display rounded-full bg-glow-deep px-9 py-4 text-lg tracking-[0.06em] text-pine-900 shadow-[0_5px_0_#b97c2c] transition-transform hover:-translate-y-0.5"
          >
            Join us now →
          </Link>
        </div>
      </div>
    </section>
  );
}
