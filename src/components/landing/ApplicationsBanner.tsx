import ScrollReveal from "@/components/ui/ScrollReveal";
import { KEY_DATES, type KeyDate } from "@/data/programme";

/** One date as a torn-off ticket: big date stub | perforation | what happens. */
function DateTicket({ d, step }: { d: KeyDate; step: number }) {
  const hot = d.deadline;
  return (
    <li
      className={`relative flex overflow-hidden rounded-2xl text-left ${
        hot
          ? "bg-glow text-pine-900 shadow-[0_18px_40px_-22px_rgba(0,0,0,0.6)]"
          : "bg-cream-50/[0.07] text-cream-50"
      }`}
    >
      {/* stub: the date */}
      <div className="flex w-28 shrink-0 flex-col items-center justify-center px-4 py-6 sm:w-32">
        <span className="font-display text-6xl leading-none sm:text-7xl">{d.day}</span>
        <span
          className={`mt-1.5 text-sm font-bold uppercase tracking-[0.2em] ${
            hot ? "text-pine-900/80" : "text-cream-50"
          }`}
        >
          {d.month}
          {d.year ? ` ${d.year}` : ""}
        </span>
      </div>

      {/* perforation, with a notch bitten out top and bottom */}
      <div
        aria-hidden
        className={`relative my-4 border-l-2 border-dashed ${
          hot ? "border-pine-900/25" : "border-cream-50/25"
        }`}
      >
        <span className="absolute -top-7 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-teal-deep" />
        <span className="absolute -bottom-7 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-teal-deep" />
      </div>

      {/* what happens */}
      <div className="flex min-w-0 flex-1 flex-col justify-center px-5 py-6 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-sm font-bold tracking-[0.14em] ${
              hot ? "text-pine-900/80" : "text-cream-50"
            }`}
          >
            {String(step).padStart(2, "0")}
          </span>
          {hot && (
            <span className="rounded-full bg-pine-900 px-2.5 py-0.5 text-xs font-bold uppercase tracking-[0.14em] text-glow">
              Deadline
            </span>
          )}
        </div>
        <h3 className="font-display mt-1 text-2xl leading-tight sm:text-[1.7rem]">{d.label}</h3>
        <p className={`mt-1.5 text-base ${hot ? "text-pine-900/80" : "text-cream-50"}`}>
          {d.note}
        </p>
      </div>
    </li>
  );
}

export default function ApplicationsBanner() {
  return (
    <section className="relative overflow-hidden bg-teal-deep py-20 text-cream-50 lg:py-24">
      {/* faint topographic-style rings */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border-[40px] border-cream-50/5"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full border-[32px] border-cream-50/[0.04]"
      />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="text-center">
          <p className="font-script text-3xl text-glow sm:text-4xl">Save the dates!</p>
          <h2 className="font-display mt-2 text-h1 text-cream-50">
            Applications timeline
          </h2>
        </div>

        {/* two rows of two, read left→right then down (numbered 01–04) */}
        <ScrollReveal
          as="ol"
          stagger={0.1}
          className="mx-auto mt-12 grid max-w-md gap-5 sm:max-w-4xl sm:grid-cols-2 sm:gap-6"
        >
          {KEY_DATES.map((d, i) => (
            <DateTicket key={d.label} d={d} step={i + 1} />
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
