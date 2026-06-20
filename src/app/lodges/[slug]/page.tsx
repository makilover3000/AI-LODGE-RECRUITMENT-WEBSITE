import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CabinScene from "@/components/CabinScene";
import AmbientLayer from "@/components/AmbientLayer";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import MarkSplashSeen from "@/components/MarkSplashSeen";
import { getLodge, lodgeSlugs, type Captain } from "@/data/lodges";

/** Pre-render every lodge at build time. */
export function generateStaticParams() {
  return lodgeSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lodge = getLodge(slug);
  if (!lodge) return { title: "Lodge not found — AI Lodge" };
  return {
    title: `${lodge.name} — AI Lodge`,
    description: lodge.tagline,
  };
}

export default async function LodgePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lodge = getLodge(slug);
  if (!lodge) notFound();

  return (
    <>
      {/* deep-link / back-nav: never force the splash from here */}
      <MarkSplashSeen />
      <NavBar variant="lodge" />

      <main id="main">
        {/* ---------- hero band: shared world + this lodge's ambient layer ---------- */}
        <section className="relative isolate flex min-h-[58svh] flex-col justify-end overflow-hidden">
          <CabinScene className="absolute inset-0 -z-10 h-full w-full" />
          <AmbientLayer type={lodge.ambient} seed={lodge.slug} />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 -z-10 h-2/3"
            style={{
              background:
                "linear-gradient(to top, var(--color-tree-1) 6%, color-mix(in srgb, var(--color-tree-1) 70%, transparent) 45%, transparent 100%)",
            }}
          />
          <div className="mx-auto w-full max-w-5xl px-5 pb-14 pt-28 text-cream">
            <span className="font-body inline-block rounded-sm bg-teal-deep px-3 py-1 text-sm font-semibold tracking-wide">
              {lodge.level} · {lodge.ambient}
            </span>
            <h1 className="font-display mt-3 text-[clamp(3rem,11vw,7rem)] leading-[0.9]">
              {lodge.name}
            </h1>
            <p className="font-body mt-2 max-w-xl text-xl text-cream/85">
              {lodge.tagline}
            </p>
          </div>
        </section>

        {/* ---------- overview ---------- */}
        <section className="bg-sky py-16">
          <Reveal className="mx-auto grid max-w-5xl gap-8 px-5 md:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl text-charcoal">Who this lodge is for</h2>
              <p className="font-body mt-3 text-lg leading-snug text-charcoal/80">
                {lodge.whoFor}
              </p>
              <h2 className="font-display mt-8 text-3xl text-charcoal">Why join</h2>
              <p className="font-body mt-3 text-lg leading-snug text-charcoal/80">
                {lodge.whyJoin}
              </p>
            </div>
            <div className="rounded-sm border-2 border-tree-1/15 bg-cream p-6">
              <h3 className="font-display text-2xl text-teal-text">Highlight topics</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {lodge.topics.map((t) => (
                  <li
                    key={t}
                    className="font-body rounded-sm bg-tree-3/15 px-3 py-1.5 text-sm font-semibold text-tree-2"
                  >
                    {t}
                  </li>
                ))}
              </ul>
              <p className="font-body mt-5 text-sm text-charcoal/75">
                Skill level: <span className="font-semibold text-charcoal">{lodge.level}</span>
              </p>
            </div>
          </Reveal>
        </section>

        {/* ---------- captains ---------- */}
        <section className="bg-tree-2 py-16 text-cream">
          <div className="mx-auto max-w-5xl px-5">
            <h2 className="font-display text-3xl">Your lodge captains</h2>
            <Reveal className="mt-8 grid gap-6 sm:grid-cols-3" stagger={0.12}>
              {lodge.captains.map((c, i) => (
                <CaptainCard key={i} captain={c} />
              ))}
            </Reveal>
          </div>
        </section>

        {/* ---------- week by week ---------- */}
        <section className="bg-sky py-16">
          <div className="mx-auto max-w-5xl px-5">
            <h2 className="font-display text-3xl text-charcoal">Week by week</h2>
            <Reveal className="mt-8 space-y-3" stagger={0.06}>
              {lodge.weeks.map((w) => (
                <div
                  key={w.week}
                  className="flex items-center gap-5 rounded-sm border-l-4 border-teal bg-cream px-5 py-4"
                >
                  <span className="font-display w-20 shrink-0 text-2xl text-teal-text">
                    Wk {w.week}
                  </span>
                  <span className="font-body text-lg text-charcoal/85">{w.topic}</span>
                </div>
              ))}
            </Reveal>
            <p className="font-body mt-6 text-sm text-charcoal/70">
              Topics are indicative and finalised with your captains.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function CaptainCard({ captain }: { captain: Captain }) {
  const initials = captain.name
    .replace(/^Capt\.?\s*/i, "")
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="rounded-sm bg-cream p-5 text-charcoal">
      <div className="flex items-center gap-4">
        <div className="font-display flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-tree-3 text-2xl text-cream">
          {initials}
        </div>
        <div>
          <p className="font-display text-xl leading-tight">{captain.name}</p>
          <p className="font-body text-sm text-charcoal/70">
            {captain.faculty} · {captain.year}
          </p>
        </div>
      </div>
      <a
        href={`https://t.me/${captain.telegram}`}
        target="_blank"
        rel="noopener noreferrer"
        className="font-body mt-4 inline-flex items-center gap-1.5 rounded-sm bg-teal-deep px-3 py-2 text-sm text-cream transition-transform hover:-translate-y-0.5"
      >
        @{captain.telegram} ↗
      </a>
    </div>
  );
}
