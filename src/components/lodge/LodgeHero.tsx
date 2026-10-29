import Image from "next/image";
import Link from "next/link";
import { isClosed, isPast, logoSrc, type Lodge } from "@/data/lodges";
import { LODGE_REVEAL, PAST_COHORT_LABEL } from "@/data/programme";
import LodgeMark from "./LodgeMark";
import GuitarNeon from "./GuitarNeon";
import ShipNeon from "./ShipNeon";
import BatNeon from "./BatNeon";
import DespacitoShowpiece from "./DespacitoShowpiece";
import BryanShowpiece from "./BryanShowpiece";
import PandaShowpiece from "./PandaShowpiece";

/** lodges whose hero emblem is a full layered showpiece (no faint watermark, tighter bottom) */
const SHOWPIECES = new Set(["despacito", "bryan", "pandai"]);

/** Pick a legible text colour (pine-900 or cream-50) for a given accent background. */
function readableOn(hex: string) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.55 ? "#1F2B21" : "#F2F0DD";
}

const BADGE =
  "inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-[0.7rem] font-bold uppercase leading-none tracking-[0.14em]";

export default function LodgeHero({ lodge }: { lodge: Lodge }) {
  const past = isPast(lodge);
  const closed = isClosed(lodge) && !past; // a past lodge says so itself — no second "closed" chip
  const accent = lodge.neonColor ?? lodge.accent;

  return (
    <section className="relative overflow-hidden bg-pine-900 pt-16 text-cream-50">
      <Image
        src="/entry/close-desktop.jpg"
        alt=""
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover object-center opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-pine-900/70 via-pine-900/80 to-pine-900" />

      {/* the same logo, blown up and faint, bleeding off the right edge — reads the
          shape a second time at a different scale, giving the hero real depth */}
      {/* (showpiece lodges skip it: their emblem brings its own backdrop) */}
      {!SHOWPIECES.has(lodge.slug) && (
        <LodgeMark
          variant="watermark"
          src={logoSrc(lodge)}
          color={accent}
          className="pointer-events-none absolute -right-[10%] top-1/2 h-[150%] w-[68%] -translate-y-1/2 opacity-[0.12] sm:opacity-[0.14]"
        />
      )}
      {/* scrim: keep the left text column clean over the watermark */}
      <div className="absolute inset-0 bg-gradient-to-r from-pine-900/85 via-pine-900/35 to-transparent" />

      {/* a showpiece fills the band itself, so a tighter bottom lets its belt sit closer
          (still clear of the art) */}
      <div
        className={`relative mx-auto max-w-6xl px-5 pt-12 sm:px-8 sm:pt-28 ${
          SHOWPIECES.has(lodge.slug) ? "pb-6 sm:pb-10" : "pb-12 sm:pb-28"
        }`}
      >
        <Link
          href={past ? "/lodges/past" : "/#lodges"}
          className="eyebrow inline-flex items-center gap-2 text-cream-50/70 transition-colors hover:text-glow"
        >
          <span aria-hidden>←</span> {past ? "Back to previous lodges" : "Back to all lodges"}
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {lodge.placeholder ? (
            <span className={`${BADGE} gap-2 bg-glow text-pine-900`}>
              <span aria-hidden>●</span> Details drop {LODGE_REVEAL}
            </span>
          ) : (
            <span
              className={BADGE}
              style={{ background: lodge.accent, color: readableOn(lodge.accent) }}
            >
              {/* this cohort shows no difficulty: anyone can join */}
              {past ? lodge.level : "Open to all"}
            </span>
          )}
          {lodge.schedule && (
            <span className={`${BADGE} gap-2 border border-cream-50/30 bg-cream-50/10 text-cream-50`}>
              <span aria-hidden style={{ color: accent }}>●</span> {lodge.schedule} · tentative
            </span>
          )}
          {past && (
            <span className={`${BADGE} border border-cream-50/30 bg-cream-50/10 text-cream-50`}>
              Past lodge · {PAST_COHORT_LABEL}
            </span>
          )}
          {closed && (
            <span className={`${BADGE} gap-2 border border-cream-50/30 bg-cream-50/10 text-cream-50`}>
              <span aria-hidden>●</span> Not open for applications
            </span>
          )}
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-14">
          {/* title sits above the emblem (z-10) so a long name like
              "CURIOSITYMAXXER" reads in front of the neon sign, never behind it */}
          <div className="relative z-10 min-w-0">
            <h1 className="font-display mt-4 text-display text-cream-50">{lodge.name}</h1>
            {lodge.subtitle && (
              <p className="eyebrow mt-2 text-cream-50/75">&ldquo;{lodge.subtitle}&rdquo;</p>
            )}
            <p
              className="font-script mt-1 max-w-[22ch] text-balance text-3xl sm:max-w-[26ch] sm:text-4xl"
              style={{ color: accent }}
            >
              {lodge.tagline}
            </p>
          </div>

          {/* the lodge's crisp lit emblem — the REAL logo. HackStreet gets its
              one-off neon-guitar showpiece, CuriosityMaxxer its neon ship, and
              Vampire its neon bat; every other lodge floats flat. */}
          <div className="relative shrink-0 self-center lg:mr-2 lg:self-auto">
            {lodge.slug === "hackstreet-boys" ? (
              <GuitarNeon
                variant="emblem"
                color={accent}
                className="w-[clamp(250px,44vw,470px)] aspect-[1292/959]"
              />
            ) : lodge.slug === "vampire" ? (
              <BatNeon
                variant="emblem"
                color={accent}
                /* wide mark (~1.9:1) sized by WIDTH in vw so it scales down on small
                   phones and never overflows the content column (checked at 320px) */
                className="w-[clamp(200px,74vw,440px)] aspect-[1080/559]"
              />
            ) : lodge.slug === "despacito" ? (
              /* the lodge's poster as a living retro sunset — sized by HEIGHT (portrait art) */
              <DespacitoShowpiece className="mt-10 h-[clamp(320px,38vw,500px)] aspect-[663/845] lg:mt-0" />
            ) : lodge.slug === "bryan" ? (
              /* the night badge — wide-ish art, sized by height to hold the same band */
              <BryanShowpiece className="mt-6 h-[clamp(300px,36vw,490px)] aspect-[900/839] lg:mt-0" />
            ) : lodge.slug === "pandai" ? (
              /* just the panda — portrait art, sized by height like Despacito */
              <PandaShowpiece className="mt-8 h-[clamp(310px,36vw,480px)] aspect-[1053/1290] lg:mt-0" />
            ) : lodge.slug === "curiositymaxxer" ? (
              <ShipNeon
                variant="emblem"
                color={accent}
                /* sized by HEIGHT to the ~250-300px desktop band; the ship art is
                   wider than the guitar, so height (not width) governs its footprint */
                className="h-[clamp(190px,24vw,296px)] aspect-[1317/1085]"
              />
            ) : (
              <LodgeMark
                src={logoSrc(lodge)}
                color={accent}
                className="h-[clamp(180px,26vw,290px)] w-[clamp(180px,26vw,290px)]"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
