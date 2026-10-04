import Link from "next/link";
import { isClosed, isPast, logoSrc, type Lodge } from "@/data/lodges";
import { LODGE_REVEAL } from "@/data/programme";
import LodgeMark from "@/components/lodge/LodgeMark";
import GuitarNeon from "@/components/lodge/GuitarNeon";
import ShipNeon from "@/components/lodge/ShipNeon";
import BatNeon from "@/components/lodge/BatNeon";

/** The mark hung on the card's log wall. Every card gives it the same slot — top-right,
 *  64px tall, right edges flush — so marks line up across a row whatever their shape.
 *  Three lodges get a one-off neon showpiece; every other lodge floats its flat logo. */
function CardMark({ lodge }: { lodge: Lodge }) {
  const color = lodge.neonColor ?? lodge.accent;
  let mark;
  if (lodge.slug === "hackstreet-boys") {
    mark = <GuitarNeon variant="mini" color={color} className="relative h-full aspect-[1292/959]" />;
  } else if (lodge.slug === "vampire") {
    mark = <BatNeon variant="mini" color={color} className="relative w-full aspect-[1080/559]" />;
  } else if (lodge.slug === "curiositymaxxer") {
    mark = <ShipNeon variant="mini" color={color} className="relative h-full aspect-[1317/1085]" />;
  } else {
    mark = <LodgeMark variant="mini" src={logoSrc(lodge)} color={color} className="relative h-14 w-14" />;
  }
  return (
    <div className="absolute right-4 top-3 flex h-16 w-[104px] items-center justify-end">
      {mark}
    </div>
  );
}

const LEVEL_STYLES: Record<Lodge["level"], string> = {
  Beginner: "bg-mist-deep text-pine-900",
  "Beginner–Intermediate": "bg-ground-deep text-pine-900",
  Intermediate: "bg-roof-dark text-cream-50",
  TBA: "bg-glow text-pine-900",
};

const BADGE =
  "inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-[0.7rem] font-bold uppercase leading-none tracking-[0.14em]";

export default function LodgeCard({ lodge }: { lodge: Lodge }) {
  // on the past-lodges page every lodge is "over", so the closed treatment only applies to a
  // current lodge that sits out the cycle
  const closed = isClosed(lodge) && !isPast(lodge);
  // fixed slot heights keep real lodges' varied copy lined up; placeholder cards all carry
  // the same short copy, so they skip the reserved space instead of looking hollow
  const slot = (cls: string) => (lodge.placeholder ? "" : cls);
  return (
    <Link
      href={`/lodges/${lodge.slug}`}
      aria-label={
        lodge.placeholder
          ? `${lodge.name} — details drop ${LODGE_REVEAL}`
          : closed
            ? `${lodge.name} — not open for applications`
            : lodge.name
      }
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
        {/* the lodge's logo mark, hung on the log wall (top-right). HackStreet's
            neon guitar and CuriosityMaxxer's neon ship are wider one-offs with
            their own sizing; see CardMark. */}
        <CardMark lodge={lodge} />
        {closed && (
          <span className="eyebrow absolute left-4 top-4 rounded-full bg-pine-900/85 px-3 py-1 text-cream-50">
            Closed
          </span>
        )}
        {/* one line under the logo slot; long names (e.g. CuriosityMaxxer) step down a size
            so they never wrap up into the mark */}
        <h3
          className={`font-display absolute bottom-3 left-5 right-5 truncate leading-none ${
            lodge.name.length > 16 ? "text-[1.4rem]" : "text-3xl"
          } text-cream-50 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]`}
        >
          {lodge.name}
        </h3>
      </div>

      {/* body — a fixed template: every slot reserves the same height on every card, so
          cards are identical boxes and their contents line up like table cells */}
      <div className="flex flex-1 flex-col p-6">
        <span
          className={`${BADGE} gap-2 self-start ${
            LEVEL_STYLES[lodge.placeholder ? "TBA" : lodge.level]
          }`}
        >
          {lodge.placeholder ? (
            <>
              <span aria-hidden>●</span> Reveals {LODGE_REVEAL}
            </>
          ) : (
            lodge.level
          )}
        </span>
        {/* tagline: 3-line slot on narrower cards, 2-line slot on wide (xl) cards */}
        <p className={`mt-3 line-clamp-3 text-lg leading-[1.5] text-pine-900 ${slot("min-h-[4.5em] xl:min-h-[3em]")}`}>
          {lodge.placeholder ? "A brand-new lodge for this cohort." : lodge.tagline}
        </p>
        {/* who it's for: up to 3 lines, always 3 lines tall */}
        <p className={`mt-2 line-clamp-3 text-sm leading-[1.5] text-charcoal/90 ${slot("min-h-[4.5em]")}`}>
          {lodge.forWhoCard ?? lodge.forWho}
        </p>
        {/* tags: room for two rows */}
        <div className={`mt-4 flex flex-wrap content-start gap-2 ${slot("min-h-[3.75rem]")}`}>
          {lodge.placeholder
            ? ["w-20", "w-24", "w-16"].map((w) => (
                // dashed "unwritten" tags — the shape of what's coming, without inventing it
                <span
                  key={w}
                  aria-hidden
                  className={`${w} h-6 rounded-full border-2 border-dashed border-pine-900/35`}
                />
              ))
            : (lodge.cardTags ?? lodge.topics.slice(0, 3)).map((t) => (
                <span
                  key={t}
                  className="h-6 rounded-full bg-pine-900/10 px-2.5 text-xs font-semibold leading-6 text-pine-700"
                >
                  {t}
                </span>
              ))}
        </div>
        <span className="font-display mt-auto inline-flex items-center gap-2 pt-5 text-teal-deep">
          {lodge.placeholder ? "Peek inside" : closed ? "View the lodge" : "Meet the lodge"}
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}
