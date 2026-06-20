import Reveal from "./Reveal";
import { APPLICATION_DATES } from "@/lib/site";

/** Key application dates, as an ordered flow. */
export default function ApplicationsBanner() {
  const stops = [
    { label: "Applications open", date: APPLICATION_DATES.open },
    { label: "Deadline", date: APPLICATION_DATES.deadline },
    { label: "Results", date: APPLICATION_DATES.results },
  ];
  return (
    <section className="bg-teal-deep py-12 text-cream">
      <h2 className="sr-only">Key application dates</h2>
      <Reveal
        className="mx-auto flex max-w-6xl flex-col items-stretch gap-4 px-5 sm:flex-row sm:items-center sm:justify-between"
        stagger={0.12}
      >
        {stops.map((s, i) => (
          <div key={s.label} className="flex items-center gap-4 sm:flex-col sm:items-start">
            <div>
              <p className="font-display text-sm tracking-[0.18em] text-cream/80">
                {s.label}
              </p>
              <p className="font-display text-3xl sm:text-4xl">{s.date}</p>
            </div>
            {i < stops.length - 1 && (
              <span
                aria-hidden="true"
                className="font-display ml-auto text-3xl text-cream/70 sm:ml-0 sm:mt-1"
              >
                →
              </span>
            )}
          </div>
        ))}
      </Reveal>
    </section>
  );
}
