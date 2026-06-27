import Image from "next/image";
import Link from "next/link";
import { isClosed, type Lodge } from "@/data/lodges";
import AmbientLayer from "./AmbientLayer";
import Treeline from "@/components/ui/Treeline";

export default function LodgeHero({ lodge }: { lodge: Lodge }) {
  const closed = isClosed(lodge);
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
      <AmbientLayer kind={lodge.ambient} color={lodge.accent} />

      <div className="relative mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
        <Link
          href="/#lodges"
          className="eyebrow inline-flex items-center gap-2 text-cream-50/70 transition-colors hover:text-glow"
        >
          <span aria-hidden>←</span> Back to all lodges
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span
            className="eyebrow inline-block rounded-full px-3 py-1 text-pine-900"
            style={{ background: lodge.accent }}
          >
            {lodge.level}
          </span>
          {closed && (
            <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-cream-50/30 bg-cream-50/10 px-3 py-1 text-cream-50">
              <span aria-hidden>●</span> Not open for applications
            </span>
          )}
        </div>

        <h1 className="font-display mt-4 text-display text-cream-50">{lodge.name}</h1>
        <p className="font-script mt-1 text-3xl sm:text-4xl" style={{ color: lodge.accent }}>
          {lodge.tagline}
        </p>
      </div>

      <Treeline
        className="-mb-px h-12 sm:h-16"
        back="var(--color-pine-700)"
        front="var(--color-cream)"
      />
    </section>
  );
}
