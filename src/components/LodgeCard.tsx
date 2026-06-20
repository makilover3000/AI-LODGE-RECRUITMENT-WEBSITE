import Link from "next/link";
import type { Lodge } from "@/data/lodges";
import AmbientLayer from "./AmbientLayer";

/** A single lodge in the showcase grid — links to its page. */
export default function LodgeCard({ lodge }: { lodge: Lodge }) {
  return (
    <Link
      href={`/lodges/${lodge.slug}`}
      className="group block overflow-hidden rounded-sm border-2 border-tree-1/15 bg-cream shadow-[5px_6px_0_rgba(31,43,33,0.12)] transition-transform hover:-translate-y-1"
    >
      {/* illustrated header carrying this lodge's own ambient layer */}
      <div className="relative h-32 overflow-hidden bg-tree-2">
        <div className="absolute inset-0 bg-tree-1/30" aria-hidden="true" />
        <AmbientLayer type={lodge.ambient} seed={lodge.slug} density={0.3} />
        <span className="font-body absolute right-3 top-3 rounded-sm bg-cream/90 px-2 py-0.5 text-xs font-semibold tracking-wide text-charcoal">
          {lodge.level}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-display text-2xl text-charcoal transition-colors group-hover:text-teal-text">
          {lodge.name}
        </h3>
        <p className="font-body mt-1 text-base text-charcoal/70">{lodge.tagline}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {lodge.topics.map((t) => (
            <li
              key={t}
              className="font-body rounded-sm bg-tree-3/15 px-2 py-1 text-xs font-semibold text-tree-2"
            >
              {t}
            </li>
          ))}
        </ul>
        <span className="font-display mt-4 inline-flex items-center gap-1 text-sm tracking-[0.12em] text-teal-text">
          Enter lodge <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
