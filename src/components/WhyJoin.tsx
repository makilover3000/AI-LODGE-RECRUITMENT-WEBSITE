import Reveal from "./Reveal";
import { BIA_URL } from "@/lib/site";

const REASONS = [
  {
    title: "Guided, hands-on projects",
    body: "Guided hands-on weekly projects — you learn by building, not just watching.",
  },
  {
    title: "Tools + foundations",
    body: "Exposure to AI tools alongside the foundational technical knowledge to use them well.",
  },
  {
    title: "Build your own thing",
    body: "Build your own project with lodge captain support, all the way to demo day.",
  },
];

export default function WhyJoin() {
  return (
    <section id="why" className="bg-tree-2 py-20 text-cream">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="font-display text-[clamp(2.2rem,6vw,4rem)]">Why join us</h2>

        <Reveal className="mt-12 grid gap-6 md:grid-cols-3" stagger={0.14}>
          {REASONS.map((r) => (
            <div key={r.title} className="border-t-4 border-teal pt-5">
              <h3 className="font-display text-2xl text-teal-highlight">{r.title}</h3>
              <p className="font-body mt-2 text-lg leading-snug text-cream/85">
                {r.body}
              </p>
            </div>
          ))}
        </Reveal>

        <a
          href={BIA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-display mt-12 inline-flex items-center gap-2 rounded-sm border-2 border-teal px-6 py-3 text-base tracking-[0.14em] text-cream transition-colors hover:bg-teal-deep hover:text-cream"
        >
          See our lodgers&rsquo; past projects
          <span aria-hidden="true">↗</span>
        </a>
        <p className="font-body mt-2 text-sm text-cream/80">
          Past projects live on the SMU BIA site.
        </p>
      </div>
    </section>
  );
}
