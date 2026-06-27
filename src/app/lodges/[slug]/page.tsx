import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { lodges, getLodge, isClosed } from "@/data/lodges";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import LodgeHero from "@/components/lodge/LodgeHero";
import LodgeOverview from "@/components/lodge/LodgeOverview";
import WeekList from "@/components/lodge/WeekList";
import ApplyCTA from "@/components/landing/ApplyCTA";

export function generateStaticParams() {
  return lodges.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lodge = getLodge(slug);
  if (!lodge) return { title: "Lodge not found" };
  return {
    title: lodge.name,
    description: `${lodge.tagline} — ${lodge.forWho}`,
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
      <NavBar />
      <main>
        <LodgeHero lodge={lodge} />
        <LodgeOverview lodge={lodge} />
        <WeekList lodge={lodge} />
        {isClosed(lodge) ? (
          <section className="bg-pine-900 py-20 text-center text-cream-50">
            <div className="mx-auto max-w-2xl px-5 sm:px-8">
              <p className="font-script text-3xl text-glow sm:text-4xl">
                this lodge is resting
              </p>
              <h2 className="font-display mt-3 text-display text-cream-50">
                Not open for applications
              </h2>
              <p className="mt-5 text-bodylg text-cream-50/85">
                {lodge.name} isn&apos;t accepting applications this cycle. It&apos;s
                here so you can see what&apos;s ahead — explore the other lodges to
                find one that&apos;s open.
              </p>
              <div className="mt-9">
                <Link
                  href="/#lodges"
                  className="font-display rounded-full border-2 border-cream-50/40 px-9 py-4 text-lg tracking-[0.06em] text-cream-50 transition-colors hover:bg-cream-50/10"
                >
                  Browse open lodges
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <ApplyCTA />
        )}
      </main>
      <Footer />
    </>
  );
}
