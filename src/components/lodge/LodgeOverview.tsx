import type { Lodge } from "@/data/lodges";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function LodgeOverview({ lodge }: { lodge: Lodge }) {
  return (
    <section className="bg-cream py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <ScrollReveal className="grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="eyebrow text-teal-ink">The overview</p>
            <h2 className="font-display mt-3 text-h2 text-pine-900">
              Who this lodge is for
            </h2>
            <p className="mt-4 text-bodylg text-charcoal/90">{lodge.forWho}</p>

            <h3 className="font-display mt-8 text-h3 text-pine-900">Why join</h3>
            <p className="mt-3 text-charcoal/90">{lodge.why}</p>

            {lodge.goals && lodge.goals.length > 0 && (
              <>
                <h3 className="font-display mt-8 text-h3 text-pine-900">
                  Goals of the programme
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {lodge.goals.map((g) => (
                    <li key={g} className="flex items-start gap-2.5 text-charcoal/90">
                      <span
                        className="mt-2 inline-block h-2 w-2 shrink-0 rounded-full"
                        style={{ background: lodge.accent }}
                      />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="rounded-2xl border-2 border-pine-900/10 bg-cream-50 p-6">
            <p className="eyebrow text-roof-dark">What you&apos;ll explore</p>
            <ul className="mt-4 space-y-2.5">
              {lodge.topics.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-pine-900">
                  <span
                    className="mt-2 inline-block h-2 w-2 shrink-0 rounded-full"
                    style={{ background: lodge.accent }}
                  />
                  <span className="font-semibold">{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 border-t border-pine-900/10 pt-4">
              <p className="text-sm text-charcoal/70">Skill level</p>
              <p className="font-display text-xl text-pine-900">{lodge.level}</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
