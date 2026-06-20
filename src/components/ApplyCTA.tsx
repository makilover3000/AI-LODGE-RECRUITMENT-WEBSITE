import SpeechBubble from "./SpeechBubble";
import { APPLY_URL, APPLICATION_DATES } from "@/lib/site";

/** Final call to action. */
export default function ApplyCTA() {
  return (
    <section id="apply" className="relative overflow-hidden bg-tree-1 py-24 text-cream">
      <div className="mx-auto max-w-4xl px-5 text-center">
        <div className="flex justify-center">
          <SpeechBubble pointer="none">
            <p className="font-display text-2xl tracking-[0.06em] sm:text-3xl">
              Be part of the pioneer batch
            </p>
          </SpeechBubble>
        </div>

        <h2 className="font-display mt-8 text-[clamp(2.6rem,9vw,6rem)] leading-[0.9]">
          Pull up a chair
          <br /> by the fire
        </h2>
        <p className="font-body mx-auto mt-5 max-w-xl text-lg text-cream/80">
          No technical background needed — just curiosity. Applications open{" "}
          {APPLICATION_DATES.open} and close {APPLICATION_DATES.deadline}.
        </p>

        <a
          href={APPLY_URL}
          className="font-display mt-9 inline-block rounded-sm bg-roof px-10 py-4 text-xl tracking-[0.14em] text-cream shadow-[5px_5px_0_var(--color-roof-shadow)] transition-transform hover:-translate-y-1"
        >
          Apply to AI Lodge
        </a>
      </div>
    </section>
  );
}
