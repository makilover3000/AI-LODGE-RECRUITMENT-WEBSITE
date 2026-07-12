import Image from "next/image";
import Link from "next/link";
import { isClosed, type Lodge } from "@/data/lodges";
import LodgeMark from "./LodgeMark";

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
  const closed = isClosed(lodge);
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
      <LodgeMark
        variant="watermark"
        slug={lodge.slug}
        color={accent}
        className="pointer-events-none absolute -right-[10%] top-1/2 h-[150%] w-[68%] -translate-y-1/2 opacity-[0.12] sm:opacity-[0.14]"
      />
      {/* scrim: keep the left text column clean over the watermark */}
      <div className="absolute inset-0 bg-gradient-to-r from-pine-900/85 via-pine-900/35 to-transparent" />

      <div className="relative mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-28">
        <Link
          href="/#lodges"
          className="eyebrow inline-flex items-center gap-2 text-cream-50/70 transition-colors hover:text-glow"
        >
          <span aria-hidden>←</span> Back to all lodges
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span
            className={BADGE}
            style={{ background: lodge.accent, color: readableOn(lodge.accent) }}
          >
            {lodge.level}
          </span>
          {closed && (
            <span className={`${BADGE} gap-2 border border-cream-50/30 bg-cream-50/10 text-cream-50`}>
              <span aria-hidden>●</span> Not open for applications
            </span>
          )}
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-14">
          <div className="min-w-0">
            <h1 className="font-display mt-4 text-display text-cream-50">{lodge.name}</h1>
            <p
              className="font-script mt-1 text-3xl sm:text-4xl"
              style={{ color: accent }}
            >
              {lodge.tagline}
            </p>
          </div>

          {/* the lodge's crisp lit emblem — the REAL logo, glowing in its accent */}
          <div className="relative shrink-0 self-center lg:mr-2 lg:self-auto">
            <LodgeMark
              slug={lodge.slug}
              color={accent}
              className="h-[clamp(180px,26vw,290px)] w-[clamp(180px,26vw,290px)]"
              style={{ rotate: "-2deg" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
