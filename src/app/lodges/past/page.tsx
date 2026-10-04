import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { pastLodges } from "@/data/lodges";
import { APPLY_URL, LODGE_REVEAL, PAST_COHORT_LABEL } from "@/data/programme";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import LodgeCard from "@/components/landing/LodgeCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Treeline from "@/components/ui/Treeline";

export const metadata: Metadata = {
  title: "Previous lodges",
  description: `The ${PAST_COHORT_LABEL} AI Lodge lodges — their captains, focus and week-by-week trails.`,
};

export default function PastLodgesPage() {
  return (
    <>
      <NavBar />
      <main>
        {/* hero — same painted-cabin treatment as a lodge page */}
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

          <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-24">
            <Link
              href="/#lodges"
              className="eyebrow inline-flex items-center gap-2 text-cream-50/70 transition-colors hover:text-glow"
            >
              <span aria-hidden>←</span> This cohort&apos;s lodges
            </Link>
            <p className="eyebrow mt-8 text-glow">The lodges that came before</p>
            <h1 className="font-display mt-3 text-display text-cream-50">Previous lodges</h1>
            <p className="font-script mt-2 text-3xl text-glow sm:text-4xl">
              {PAST_COHORT_LABEL} cohort
            </p>
            <p className="mt-6 max-w-2xl text-bodylg text-cream-50/80">
              Every lodge from the last cohort, kept as it ran — the captains, the
              focus, and the week-by-week trail. A good look at what a lodge is
              really like before you pick yours.
            </p>
          </div>

          <Treeline
            className="relative -mb-px h-12 sm:h-16"
            back="var(--color-pine-700)"
            front="var(--color-cream-100)"
          />
        </section>

        <section className="bg-cream-100 pb-24 pt-14">
          <div className="mx-auto max-w-[78rem] px-3 sm:px-5">
            {/* one framed board holding an even grid: every card is the same fixed box
                (see LodgeCard), every row the same height (auto-rows-fr). 7 cards + the tile
                fill it exactly: 4 rows of 2, or 3/3/1+2 at 3 cols */}
            <div className="rounded-3xl border-2 border-pine-900/10 bg-cream-50/55 p-4 shadow-[0_18px_44px_-30px_rgba(31,43,33,0.5)] sm:p-7 lg:p-10">
              <h2 className="font-display mb-6 border-b-2 border-dashed border-pine-900/15 pb-5 text-h3 text-pine-900 lg:mb-8">
                {PAST_COHORT_LABEL} cohort
              </h2>
              <ScrollReveal stagger={0.06} className="grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pastLodges.map((lodge) => (
                  <LodgeCard key={lodge.slug} lodge={lodge} />
                ))}

                <div className="relative flex flex-col justify-center overflow-hidden rounded-2xl bg-teal-deep p-7 text-cream-50 shadow-[0_12px_34px_-22px_rgba(31,43,33,0.7)] sm:p-9 lg:col-span-2">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border-[32px] border-cream-50/5"
                  />
                  <div className="relative max-w-md">
                    <p className="font-script text-3xl text-glow">your turn</p>
                    <h2 className="font-display mt-2 text-h2 text-cream-50">
                      Join the next cohort
                    </h2>
                    <p className="mt-3 text-cream-50/80">
                      Applications are open now. This cohort&apos;s lodge details
                      drop {LODGE_REVEAL}.
                    </p>
                  </div>
                  <div className="relative mt-8 flex flex-wrap gap-4">
                    <Link
                      href={APPLY_URL}
                      className="font-display rounded-full bg-glow-deep px-8 py-3.5 text-base tracking-[0.06em] text-pine-900 shadow-[0_4px_0_#b97c2c] transition-transform hover:-translate-y-0.5"
                    >
                      Apply now →
                    </Link>
                    <Link
                      href="/#lodges"
                      className="font-display rounded-full border-2 border-cream-50/40 px-8 py-3.5 text-base tracking-[0.06em] text-cream-50 transition-colors hover:bg-cream-50/10"
                    >
                      See this cohort&apos;s lodges
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
