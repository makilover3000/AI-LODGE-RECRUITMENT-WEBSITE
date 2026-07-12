import { lodges, isClosed, type Lodge } from "@/data/lodges";
import LodgeCard from "./LodgeCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Treeline from "@/components/ui/Treeline";

// Cards run easy -> hard by skill level, with closed lodges (e.g. LLM) pinned
// last. Sort is stable, so lodges sharing a level keep their order in lodges.ts.
const LEVEL_RANK: Record<Lodge["level"], number> = {
  Beginner: 0,
  "Beginner–Intermediate": 1,
  Intermediate: 2,
};

const orderedLodges = [...lodges].sort((a, b) => {
  if (isClosed(a) !== isClosed(b)) return isClosed(a) ? 1 : -1;
  return LEVEL_RANK[a.level] - LEVEL_RANK[b.level];
});

export default function LodgeGrid() {
  return (
    <section id="lodges" className="relative bg-cream-100 pb-0 pt-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow text-teal-ink">The lodges</p>
          <h2 className="font-display mt-3 text-pine-900 text-h1">
            Pick the lodge that fits you
          </h2>
          <p className="mt-4 text-bodylg text-charcoal/90">
            Each lodge has its own focus, vibe, and captains — from total
            beginners to the frontier.
          </p>
        </div>

        <ScrollReveal
          stagger={0.1}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {orderedLodges.map((lodge) => (
            <LodgeCard key={lodge.slug} lodge={lodge} />
          ))}
        </ScrollReveal>
      </div>

      {/* pine treeline rising into the dark Apply band below */}
      <Treeline
        className="-mb-px mt-20 h-16 sm:h-24"
        back="var(--color-pine-700)"
        front="var(--color-pine-900)"
      />
    </section>
  );
}
