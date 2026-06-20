import Reveal from "./Reveal";

/**
 * The application process is an ordered sequence — order carries real
 * information, so it's shown as Stage 1 → 2 → 3.
 */
const STAGES = [
  {
    n: 1,
    title: "Recruitment task",
    body: "A standardised recruitment task suite — the same for everyone.",
  },
  {
    n: 2,
    title: "Interviews",
    body: "Solo interviews with lodge captains from every lodge you indicated interest in.",
  },
  {
    n: 3,
    title: "Results & allocation",
    body: "Results release, then lodge allocation and reshuffling per the schedule.",
  },
];

export default function ApplicationProcess() {
  return (
    <section id="process" className="bg-sky py-20">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="font-display text-[clamp(2.2rem,6vw,4rem)] text-charcoal">
          How to get in
        </h2>
        <p className="font-body mt-2 max-w-xl text-lg text-charcoal/70">
          Three stages, in order.
        </p>

        <Reveal className="mt-12 grid gap-6 md:grid-cols-3" stagger={0.16}>
          {STAGES.map((s) => (
            <div
              key={s.n}
              className="relative overflow-hidden rounded-sm bg-tree-1 p-7 text-cream"
            >
              <span className="font-display absolute -right-3 -top-6 text-[7rem] leading-none text-teal/25">
                {s.n}
              </span>
              <p className="font-display text-sm tracking-[0.2em] text-teal-highlight">
                Stage {s.n}
              </p>
              <h3 className="font-display mt-1 text-2xl">{s.title}</h3>
              <p className="font-body relative mt-3 text-base leading-snug text-cream/85">
                {s.body}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
