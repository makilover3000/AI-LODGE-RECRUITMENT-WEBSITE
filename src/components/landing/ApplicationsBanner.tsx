import { Fragment } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const DATES = [
  { label: "Applications open", date: "13 Jul" },
  { label: "Deadline", date: "2 Aug" },
  { label: "Results", date: "11 Aug" },
];

export default function ApplicationsBanner() {
  return (
    <section className="relative overflow-hidden bg-teal-deep py-20 text-cream-50">
      {/* faint topographic-style rings */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border-[40px] border-cream-50/5"
      />
      <div className="mx-auto max-w-6xl px-5 text-center sm:px-8">
        <p className="font-script text-3xl text-glow sm:text-4xl">Save the dates!</p>
        <h2 className="font-display mt-2 text-h1 text-cream-50">
          Applications timeline
        </h2>

        <ScrollReveal
          stagger={0.12}
          className="mx-auto mt-12 flex max-w-3xl flex-col items-center justify-center gap-4 sm:flex-row sm:items-stretch"
        >
          {DATES.map((d, i) => (
            <Fragment key={d.label}>
              <div className="flex w-full max-w-xs flex-col justify-center rounded-2xl border-2 border-cream-50/25 bg-cream-50/5 px-7 py-6 sm:w-auto sm:flex-1">
                <p className="eyebrow text-glow">{d.label}</p>
                <p className="font-display mt-1 text-3xl text-cream-50 sm:text-[2rem]">
                  {d.date}
                </p>
              </div>
              {i < DATES.length - 1 && (
                <span
                  aria-hidden
                  className="font-display shrink-0 rotate-90 self-center text-3xl text-glow sm:rotate-0"
                >
                  →
                </span>
              )}
            </Fragment>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
