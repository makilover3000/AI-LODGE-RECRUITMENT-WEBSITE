import { lodges } from "@/data/lodges";
import LodgeCard from "./LodgeCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Treeline from "@/components/ui/Treeline";

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
            beginners to the frontier. Lodge names and details are being
            finalised.
          </p>
        </div>

        <ScrollReveal
          stagger={0.1}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {lodges.map((lodge) => (
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
