import Image from "next/image";
import CampIcon, { CampIconName } from "@/components/ui/CampIcon";
import ScrollReveal from "@/components/ui/ScrollReveal";

/** Drop a photo path here (e.g. "/moments/fall2026/OriPhoto.JPG") to replace the placeholder. */
const PHOTO: { src: string; alt: string } | null = {
  src: "/moments/fall2026/tencent-ai-safety-workshop.webp",
  alt: "AI Lodge lodgers and captains together at the Tencent × SCOGA AI Safety Workshop",
};

const REASONS: { icon: CampIconName; title: string; body: string }[] = [
  {
    icon: "tools",
    title: "Guided weekly projects",
    body: "Hands-on, project-first sessions every week. You learn by building, not just watching slides.",
  },
  {
    icon: "compass",
    title: "AI tools and foundations",
    body: "Exposure to the AI tools people actually use, plus the foundational technical knowledge underneath them.",
  },
  {
    icon: "lantern",
    title: "Build your own project",
    body: "Bring an idea to life with your lodge captains' support — and show it off at the exhibition.",
  },
  {
    icon: "signpost",
    title: "Compete in AI Lodge's hackathon",
    body: "Your final hackathon project can be that startup idea you've always wanted to build, with mentors supporting and guiding you, and experienced industry judges giving real feedback.",
  },
];

/** Polaroid-style frame: the real photo when PHOTO is set, otherwise a tidy placeholder. */
function PhotoFrame({ className = "" }: { className?: string }) {
  return (
    <figure
      className={`rounded-[14px] border-[6px] border-cream-50 bg-cream-50 shadow-[0_22px_50px_-22px_rgba(31,43,33,0.65)] ${className}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[8px]">
        {PHOTO ? (
          <Image
            src={PHOTO.src}
            alt={PHOTO.alt}
            fill
            sizes="(max-width: 1024px) 90vw, 420px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[8px] border-2 border-dashed border-pine-900/25 bg-cream-100 text-pine-900/75">
            <CampIcon name="lantern" className="h-12 w-12" />
            <p className="font-display text-xl tracking-[0.04em]">Lodge photo</p>
            <p className="text-sm font-semibold">Coming soon</p>
          </div>
        )}
      </div>
    </figure>
  );
}

export default function WhyJoin() {
  return (
    <section className="relative bg-cream-100 py-24 lg:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-14">
        {/* left: heading + the photo, held in view while the reasons scroll past */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow text-teal-ink">Why join a lodge</p>
            <h2 className="font-display mt-3 text-h1 text-pine-900">
              Why join AI Lodge?
            </h2>
            <p className="mt-5 max-w-md text-bodylg text-charcoal/85">
              Ten weeks of building with people as curious as you — and something
              real to show for it at the end.
            </p>
            <PhotoFrame className="mt-10 hidden lg:block" />
          </div>
        </div>

        {/* right: the four reasons, 2 × 2 */}
        <div className="lg:col-span-7">
          <ScrollReveal stagger={0.1} className="grid gap-6 sm:grid-cols-2">
            {REASONS.map((r, i) => (
              <article
                key={r.title}
                className="flex flex-col rounded-2xl border-2 border-pine-900/10 bg-cream-50 p-7 shadow-[0_10px_30px_-20px_rgba(31,43,33,0.6)] transition-transform hover:-translate-y-1 sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-pine-900 text-glow">
                    <CampIcon name={r.icon} className="h-8 w-8" />
                  </div>
                  <span
                    aria-hidden
                    className="font-display text-4xl leading-none text-pine-900/15"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-display mt-6 text-h3 text-pine-900">{r.title}</h3>
                <p className="mt-2.5 text-charcoal/90">{r.body}</p>
              </article>
            ))}
          </ScrollReveal>

          {/* phones/tablets: the photo follows the reasons, landscape so it doesn't tower */}
          <PhotoFrame className="mx-auto mt-12 max-w-xl lg:hidden" />
        </div>
      </div>
    </section>
  );
}
