import Link from "next/link";
import { isClosed, type Lodge } from "@/data/lodges";

const LEVEL_STYLES: Record<Lodge["level"], string> = {
  Beginner: "bg-mist-deep text-pine-900",
  "Beginner–Intermediate": "bg-ground-deep text-pine-900",
  Intermediate: "bg-roof-dark text-cream-50",
};

const BADGE =
  "inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-[0.7rem] font-bold uppercase leading-none tracking-[0.14em]";

export default function LodgeCard({ lodge }: { lodge: Lodge }) {
  const closed = isClosed(lodge);
  return (
    <Link
      href={`/lodges/${lodge.slug}`}
      aria-label={closed ? `${lodge.name} — not open for applications` : lodge.name}
      className={`group flex flex-col overflow-hidden rounded-2xl border-2 border-pine-900/15 bg-cream-50 shadow-[0_12px_34px_-22px_rgba(31,43,33,0.7)] transition-transform hover:-translate-y-1.5 ${
        closed ? "opacity-75 grayscale-[35%] hover:opacity-100" : ""
      }`}
    >
      {/* log-wall header */}
      <div
        className="relative h-32 bg-cover bg-center"
        style={{ backgroundImage: "url('/textures/cabin-log.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-roof-dark/95 via-roof-dark/45 to-roof-dark/10" />
        {/* glowing window accent per lodge */}
        <span
          className="absolute right-4 top-4 h-5 w-5 rounded-[3px] shadow-[0_0_16px_4px] "
          style={{ background: lodge.accent, color: lodge.accent }}
        />
        {closed && (
          <span className="eyebrow absolute left-4 top-4 rounded-full bg-pine-900/85 px-3 py-1 text-cream-50">
            Closed
          </span>
        )}
        <h3 className="font-display absolute bottom-3 left-5 text-3xl text-cream-50 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]">
          {lodge.name}
        </h3>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-6">
        <span className={`${BADGE} self-start ${LEVEL_STYLES[lodge.level]}`}>
          {lodge.level}
        </span>
        <p className="mt-3 text-bodylg text-pine-900">{lodge.tagline}</p>
        <p className="mt-2 text-sm text-charcoal/90">
          {lodge.forWhoCard ?? lodge.forWho}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {(lodge.cardTags ?? lodge.topics.slice(0, 3)).map((t) => (
            <span
              key={t}
              className="rounded-full bg-pine-900/10 px-2.5 py-1 text-xs font-semibold text-pine-700"
            >
              {t}
            </span>
          ))}
        </div>

        <span className="font-display mt-6 inline-flex items-center gap-2 text-teal-deep">
          {closed ? "View the lodge" : "Meet the lodge"}
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}
