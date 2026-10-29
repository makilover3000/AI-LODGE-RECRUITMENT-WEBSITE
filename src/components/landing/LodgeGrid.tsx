import Link from "next/link";
import { currentLodges, pastLodges, logoSrc } from "@/data/lodges";
import { PAST_COHORT_LABEL } from "@/data/programme";
import LodgeCard from "./LodgeCard";
import LodgeMark from "@/components/lodge/LodgeMark";
import ScrollReveal from "@/components/ui/ScrollReveal";

// This cohort's lodges are open to anyone, so cards run A→Z by name, with any lodge whose
// details haven't dropped yet (e.g. Spice) placed last.
const orderedLodges = [...currentLodges].sort(
  (a, b) =>
    Number(!!a.placeholder) - Number(!!b.placeholder) ||
    a.name.localeCompare(b.name, "en", { sensitivity: "base" })
);

/** Tile leading to the earlier cohort's lodges: the 10th grid cell at 1–2 columns, a
 *  full-width banner under the 3-column grid (`banner`). */
function PreviousLodgesTile({ banner = false }: { banner?: boolean }) {
  return (
    <Link
      href="/lodges/past"
      className={`group relative isolate flex overflow-hidden rounded-2xl border-2 border-pine-900/15 bg-pine-900 bg-cover bg-center p-7 text-cream-50 shadow-[0_12px_34px_-22px_rgba(31,43,33,0.7)] transition-transform hover:-translate-y-1.5 sm:p-9 ${
        banner
          ? "flex-row items-center justify-between gap-10"
          : "min-h-[17rem] flex-col justify-between max-sm:order-first lg:hidden"
      }`}
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

      <div
        className={
          banner
            ? "flex shrink-0 flex-col items-end gap-5"
            : "mt-8 flex flex-wrap items-end justify-between gap-6"
        }
      >
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
        </div>

        {/* 9 lodges fill the grid exactly: 3 full rows at 3 cols (the previous-lodges banner
            sits underneath), or 9 cards + the tile = 5 full rows at 2 cols */}
        <ScrollReveal
          stagger={0.06}
          className="mt-12 grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {orderedLodges.map((lodge) => (
            <LodgeCard key={lodge.slug} lodge={lodge} />
          ))}
          <PreviousLodgesTile />
        </ScrollReveal>
        <ScrollReveal className="mt-6 hidden lg:block">
          <PreviousLodgesTile banner />
        </ScrollReveal>
      </div>
    </section>
  );
}
