import Link from "next/link";
import { currentLodges, pastLodges, isClosed, logoSrc, type Lodge } from "@/data/lodges";
import { LODGE_REVEAL, PAST_COHORT_LABEL } from "@/data/programme";
import LodgeCard from "./LodgeCard";
import LodgeMark from "@/components/lodge/LodgeMark";
import ScrollReveal from "@/components/ui/ScrollReveal";

// Cards run easy -> hard by skill level, with closed lodges pinned last and unannounced
// ("TBA") lodges after the announced ones. Sort is stable, so lodges sharing a level keep
// their order in lodges.ts.
const LEVEL_RANK: Record<Lodge["level"], number> = {
  Beginner: 0,
  "Beginner–Intermediate": 1,
  Intermediate: 2,
  TBA: 3,
};

const orderedLodges = [...currentLodges].sort((a, b) => {
  if (isClosed(a) !== isClosed(b)) return isClosed(a) ? 1 : -1;
  return LEVEL_RANK[a.level] - LEVEL_RANK[b.level];
});

/** Two-column tile that closes the grid and leads to the earlier cohort's lodges. */
function PreviousLodgesTile() {
  return (
    <Link
      href="/lodges/past"
      className="group relative isolate flex min-h-[17rem] flex-col justify-between overflow-hidden rounded-2xl border-2 border-pine-900/15 bg-pine-900 bg-cover bg-center p-7 text-cream-50 shadow-[0_12px_34px_-22px_rgba(31,43,33,0.7)] transition-transform hover:-translate-y-1.5 max-sm:order-first sm:col-span-2 sm:p-9"
      style={{ backgroundImage: "url('/textures/cabin-log.jpg')" }}
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-br from-pine-900/95 via-pine-900/85 to-roof-dark/80"
      />
      <div className="max-w-md">
        <p className="eyebrow text-glow">Previous lodges · {PAST_COHORT_LABEL}</p>
        <h3 className="font-display mt-2 text-h2 text-cream-50">
          Meet the lodges that came before
        </h3>
        <p className="mt-3 text-cream-50/80">
          {pastLodges.length} lodges, their captains, and the week-by-week trails
          they ran — a peek at what a lodge really looks like.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
        {/* the old lodges' own marks, lit in their colours */}
        <ul aria-hidden className="flex flex-wrap gap-3">
          {pastLodges.map((l) => (
            <li key={l.slug} className="relative h-10 w-10 sm:h-11 sm:w-11">
              <LodgeMark
                variant="mini"
                src={logoSrc(l)}
                color={l.neonColor ?? l.accent}
                className="absolute inset-0"
              />
            </li>
          ))}
        </ul>
        <span className="font-display inline-flex items-center gap-2 text-lg text-glow">
          See previous lodges
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}

export default function LodgeGrid() {
  return (
    <section id="lodges" className="relative bg-cream-100 pb-24 pt-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
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
          <p className="inline-flex items-center gap-2 self-start rounded-full bg-glow/60 px-4 py-2 text-sm font-semibold text-pine-900 lg:self-auto">
            <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-roof" />
            Full lodge details drop {LODGE_REVEAL}
          </p>
        </div>

        {/* 10 cards + the 2-wide tile fill the grid exactly: 3/3/3/1+2 at 3 cols,
            five full rows + a full-width tile at 2 cols */}
        <ScrollReveal
          stagger={0.06}
          className="mt-12 grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {orderedLodges.map((lodge) => (
            <LodgeCard key={lodge.slug} lodge={lodge} />
          ))}
          <PreviousLodgesTile />
        </ScrollReveal>
      </div>
    </section>
  );
}
