import CabinScene from "./CabinScene";
import SpeechBubble from "./SpeechBubble";
import { APPLY_URL } from "@/lib/site";

/**
 * Landing hero — continues the cabin world you just walked into.
 * The illustrated scene sits behind, a cream fade keeps the copy legible,
 * and the AIL summary is delivered in a poster speech bubble.
 */
export default function Hero() {
  return (
    <section
      id="about"
      className="relative isolate flex min-h-[92svh] flex-col justify-end overflow-hidden"
    >
      <CabinScene className="absolute inset-0 -z-10 h-full w-full" />
      {/* legibility fade over the lower scene */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-2/3"
        style={{
          background:
            "linear-gradient(to top, var(--color-sky) 8%, color-mix(in srgb, var(--color-sky) 78%, transparent) 42%, transparent 100%)",
        }}
      />

      <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-28">
        <p className="font-display text-sm tracking-[0.3em] text-teal-text">
          SMU BIA · Pioneer Batch
        </p>
        <h1 className="font-display mt-2 text-[clamp(3.5rem,13vw,9rem)] text-charcoal">
          AI Lodge
        </h1>

        <div className="mt-4 max-w-2xl">
          <SpeechBubble pointer="bottom-left">
            <p className="text-[clamp(1.05rem,2.4vw,1.5rem)] font-semibold leading-tight">
              AI Lodge is a structured learning programme built around a
              community with a shared interest in AI. Designed for anyone curious
              about AI — regardless of technical background — emphasising peer
              learning and building real projects.
            </p>
          </SpeechBubble>
        </div>

        <div className="font-display mt-8 flex flex-wrap items-center gap-4">
          <a
            href={APPLY_URL}
            className="rounded-sm bg-roof px-7 py-3 text-lg tracking-[0.14em] text-cream shadow-[4px_4px_0_var(--color-roof-shadow)] transition-transform hover:-translate-y-0.5"
          >
            Apply now
          </a>
          <a
            href="#lodges"
            className="rounded-sm border-2 border-tree-1/40 px-7 py-3 text-lg tracking-[0.14em] text-charcoal transition-colors hover:border-teal-border hover:text-teal-text"
          >
            Explore the lodges
          </a>
        </div>
      </div>
    </section>
  );
}
