import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import Treeline from "@/components/ui/Treeline";

/**
 * "FROM THE LODGE" — a single seamless belt of past-lodge photos drifting across
 * a dark pine gallery band (so the photos pop). Pure-CSS marquee (zero JS): the
 * track is rendered twice and translated -50%; freezes under reduced-motion,
 * pauses on hover. Cream treelines top & bottom blend it into the cream sections
 * around it. Sits between Why Join and the lodge grid.
 */
type Moment = { src: string; alt: string; w: number; h: number };

const MOMENTS: Moment[] = [
  { src: "/moments/awsome-group.webp", alt: "A lodge gathered together for a group photo", w: 1100, h: 825 },
  { src: "/moments/demo-candid-action.webp", alt: "Lodgers heads-down building during a session", w: 1100, h: 1467 },
  { src: "/moments/jb-group-2.webp", alt: "A lodge posing together after a session", w: 1100, h: 825 },
  { src: "/moments/demo-project-1.webp", alt: "A team presenting their project on demo day", w: 1100, h: 1467 },
  { src: "/moments/lab-group.webp", alt: "Lodge members together at the lab", w: 960, h: 1280 },
  { src: "/moments/demo-candid-group.webp", alt: "The cohort together on demo day", w: 1100, h: 1467 },
  { src: "/moments/awsome-food.webp", alt: "A lodge hanging out over food", w: 1100, h: 1467 },
  { src: "/moments/demo-project-2.webp", alt: "A team showing off what they built", w: 1100, h: 1467 },
  { src: "/moments/jb-group.webp", alt: "A lodge group photo", w: 960, h: 1280 },
  { src: "/moments/demo-project-3.webp", alt: "Lodgers presenting their demo-day project", w: 1100, h: 1467 },
  { src: "/moments/demo-project-4.webp", alt: "A project demo in front of the room", w: 1100, h: 1467 },
  { src: "/moments/demo-project-5.webp", alt: "A team at the project exhibition", w: 1100, h: 1467 },
  { src: "/moments/demo-project-6.webp", alt: "Lodgers demoing their final build", w: 1100, h: 1467 },
];

function Row({ prefix }: { prefix: string }) {
  return (
    <>
      {MOMENTS.map((m, i) => (
        <div
          key={`${prefix}-${i}`}
          className="relative mx-2 h-[150px] shrink-0 overflow-hidden rounded-xl border border-cream-50/10 shadow-[0_16px_36px_-20px_rgba(0,0,0,0.75)] sm:mx-3 sm:h-[210px]"
          style={{ aspectRatio: `${m.w} / ${m.h}` }}
        >
          <Image
            src={m.src}
            alt={prefix === "a" ? m.alt : ""}
            aria-hidden={prefix !== "a"}
            fill
            loading="eager"
            sizes="(max-width: 640px) 40vw, 300px"
            className="object-cover"
          />
        </div>
      ))}
    </>
  );
}

export default function MomentsBelt() {
  return (
    <section className="relative overflow-hidden bg-pine-900 text-cream-50">
      {/* cream treeline descending from the Why-Join band above */}
      <Treeline
        flip
        className="h-10 sm:h-14"
        back="var(--color-cream)"
        front="var(--color-cream-100)"
      />

      <div className="py-12 sm:py-16">
        <div className="mx-auto mb-9 flex max-w-6xl flex-col gap-3 px-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <div>
            <p className="eyebrow text-glow">From the lodge</p>
            <h2 className="font-display mt-2 text-h1 text-cream-50">Past moments</h2>
          </div>
          <Link
            href="https://smubia.com/Projects?badge=AI%20Lodge"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 font-semibold text-glow underline-offset-4 hover:underline"
          >
            View past projects
            <span aria-hidden className="transition-transform group-hover:translate-x-1">↗</span>
          </Link>
        </div>

        {/* the belt */}
        <div className="relative">
          <div className="ail-belt overflow-hidden" style={{ "--belt-dur": "62s" } as CSSProperties}>
            <div className="ail-belt-track">
              <Row prefix="a" />
              <Row prefix="b" />
            </div>
          </div>
          {/* soft edges so tiles fade in/out instead of hard-clipping */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-pine-900 to-transparent sm:w-28" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-pine-900 to-transparent sm:w-28" />
        </div>
      </div>

      {/* cream treeline rising into the lodge grid below */}
      <Treeline
        className="-mb-px h-10 sm:h-14"
        back="var(--color-cream)"
        front="var(--color-cream-100)"
      />
    </section>
  );
}
