import type { Lodge } from "@/data/lodges";
import CaptainCard from "./CaptainCard";
import ScrollReveal from "@/components/ui/ScrollReveal";

const COUNT_WORDS = ["", "One", "Two", "Three", "Four", "Five"];

export default function WeekList({ lodge }: { lodge: Lodge }) {
  const captainCount = lodge.captains.length;
  const countWord = COUNT_WORDS[captainCount] ?? String(captainCount);
  return (
    <section className="bg-cream-100 py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        {/* captains */}
        <p className="eyebrow text-teal-ink">Your captains</p>
        <h2 className="font-display mt-3 text-h2 text-pine-900">
          {countWord} captains, one lodge
        </h2>
        <ScrollReveal
          stagger={0.1}
          className={`mt-8 grid gap-5 ${
            captainCount === 2
              ? "mx-auto max-w-2xl sm:grid-cols-2"
              : "sm:grid-cols-3"
          }`}
        >
          {lodge.captains.map((c, i) => (
            <CaptainCard key={i} captain={c} accent={lodge.accent} />
          ))}
        </ScrollReveal>
        <p className="mt-4 text-sm text-charcoal/60">
          Captain details are being finalised and will be updated here.
        </p>

        {/* weekly trail */}
        <div className="mt-16">
          <p className="eyebrow text-roof-dark">Week by week</p>
          <h2 className="font-display mt-3 text-h2 text-pine-900">
            The route through the woods
          </h2>
          {lodge.sessionLength && (
            <p className="mt-2 text-sm font-semibold text-charcoal/70">
              {lodge.sessionLength}
            </p>
          )}

          <ScrollReveal stagger={0.06} className="mt-8 space-y-px">
            {lodge.weeks.map((w) => (
              <div
                key={w.label}
                className="flex flex-wrap items-center gap-x-5 gap-y-1 rounded-xl bg-cream-50 px-5 py-4 sm:gap-x-7"
              >
                {/* full-width on mobile so the label sits on its own line ABOVE the
                    topic (single column); reverts to an inline w-24 column at sm+ */}
                <span
                  className="font-display w-full shrink-0 text-lg sm:w-24"
                  style={{ color: lodge.accent === "#FFCF87" ? "#9a6b1f" : lodge.accent }}
                >
                  {w.label}
                </span>
                <span className="font-semibold text-pine-900">{w.topic}</span>
                {w.tag && (
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${
                      w.tag === "mandatory"
                        ? "bg-roof-dark/15 text-roof-dark"
                        : "bg-pine-900/10 text-pine-700"
                    }`}
                  >
                    {w.tag}
                  </span>
                )}
                {w.note && (
                  <span className="w-full pl-0 text-sm text-charcoal/70 sm:pl-[7.75rem]">
                    {w.note}
                  </span>
                )}
              </div>
            ))}
          </ScrollReveal>
          <p className="mt-4 text-sm text-charcoal/60">
            Weekly topics are indicative and may shift to fit the lodge.
          </p>
        </div>
      </div>
    </section>
  );
}
