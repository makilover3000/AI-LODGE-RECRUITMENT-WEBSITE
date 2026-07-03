import ScrollReveal from "@/components/ui/ScrollReveal";

const STAGES = [
  {
    n: 1,
    title: "Application form with task suite",
    body: "Submit your application form along with the required recruitment task suite.",
  },
  {
    n: 2,
    title: "Group interviews",
    body: "Short interviews with the captains of your first choice lodge.",
  },
  {
    n: 3,
    title: "Results & allocation",
    body: "Results are released and lodges are allocated (with potential reshuffling).",
  },
];

export default function ApplicationProcess() {
  return (
    <section id="process" className="bg-cream py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow text-teal-ink">How to join · three stages</p>
          <h2 className="font-display mt-3 text-pine-900 text-h1">
            Finding your way in
          </h2>
          <p className="mt-4 text-bodylg text-charcoal/80">
            The stages run in order — each one builds on the last.
          </p>
        </div>

        <ScrollReveal stagger={0.16} className="mt-14 space-y-5">
          {STAGES.map((s) => (
            <div
              key={s.n}
              className="flex items-start gap-5 rounded-2xl border-2 border-pine-900/10 bg-cream-50 p-6 sm:gap-7 sm:p-8"
            >
              <div className="font-display flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-roof text-2xl text-cream-50 shadow-[0_3px_0_var(--color-roof-dark)] sm:h-16 sm:w-16 sm:text-3xl">
                {s.n}
              </div>
              <div>
                <p className="eyebrow text-roof-dark">Stage {s.n}</p>
                <h3 className="font-display mt-1 text-h3 text-pine-900">
                  {s.title}
                </h3>
                <p className="mt-2 max-w-2xl text-charcoal/90">{s.body}</p>
              </div>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
