import Reveal from "./Reveal";

/**
 * Programme timeline. Exact session day/time is confirmed only after
 * applications close — shown as TBC, per the brief.
 */
const STEPS = [
  {
    when: "Weeks 1–8",
    title: "Lodge sessions",
    body: "Weekly hands-on sessions with your lodge and captains. Exact session day & time confirmed after applications close.",
    tbc: true,
  },
  {
    when: "Recess week",
    title: "Hack day",
    body: "A focused day to push your project forward with your lodge.",
  },
  {
    when: "Week 10",
    title: "Hackathon finals & exhibition",
    body: "Hackathon finals and a project exhibition day to showcase what every lodge built.",
  },
];

export default function TimelineSection() {
  return (
    <section id="timeline" className="bg-sky py-20">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="font-display text-[clamp(2.2rem,6vw,4rem)] text-charcoal">
          The Programme
        </h2>
        <p className="font-body mt-2 max-w-xl text-lg text-charcoal/70">
          Eight weeks together, building toward a finale.
        </p>

        <Reveal className="mt-12 grid gap-6 md:grid-cols-3" stagger={0.16}>
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className="relative rounded-sm border-2 border-tree-1/15 bg-cream p-6 shadow-[5px_6px_0_rgba(31,43,33,0.12)]"
            >
              <span className="font-display absolute -top-4 left-5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-tree-2 text-cream">
                {i + 1}
              </span>
              <p className="font-display mt-3 text-sm tracking-[0.18em] text-teal-text">
                {s.when}
              </p>
              <h3 className="font-display mt-1 text-2xl text-charcoal">
                {s.title}
                {s.tbc && (
                  <span className="font-body ml-2 align-middle rounded-sm bg-roof px-2 py-0.5 text-xs tracking-wide text-cream">
                    TBC
                  </span>
                )}
              </h3>
              <p className="font-body mt-3 text-base leading-snug text-charcoal/75">
                {s.body}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
