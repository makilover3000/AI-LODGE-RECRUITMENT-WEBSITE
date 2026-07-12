import Image from "next/image";
import CampIcon, { CampIconName } from "@/components/ui/CampIcon";
import ScrollReveal from "@/components/ui/ScrollReveal";

const REASONS: { icon: CampIconName; title: string; body: string }[] = [
  {
    icon: "tools",
    title: "Guided weekly projects",
    body: "Hands-on, project-first sessions every week. You learn by building, not just watching slides.",
  },
  {
    icon: "compass",
    title: "AI tools + foundations",
    body: "Exposure to the AI tools people actually use, plus the foundational technical knowledge underneath them.",
  },
  {
    icon: "lantern",
    title: "Build your own project",
    body: "Bring an idea to life with your lodge captains' support — and show it off at the exhibition.",
  },
  {
    icon: "signpost",
    title: "Test a startup idea, for real",
    body: "Your final hackathon project can be that startup idea you've always wanted to build — with mentors backing you, and external judges giving real feedback, like pitching to investors. A low-stakes way to test an idea, not just a coding exercise.",
  },
];

export default function WhyJoin() {
  return (
    <section className="relative bg-cream-100 py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow text-teal-ink">Why join a lodge</p>
            <h2 className="font-display mt-3 text-pine-900 text-h1">
              Learn AI the cozy way — together
            </h2>
          </div>
          {/* a warm candid from a past lodge — desktop-only accent */}
          <div className="relative hidden aspect-[4/3] rotate-[-1.5deg] overflow-hidden rounded-2xl border-4 border-cream-50 shadow-[0_18px_44px_-22px_rgba(31,43,33,0.7)] lg:block">
            <Image
              src="/moments/awsome-group.webp"
              alt="Members of a past AI Lodge together"
              fill
              sizes="380px"
              className="object-cover"
            />
          </div>
        </div>

        <ScrollReveal stagger={0.14} className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((r) => (
            <article
              key={r.title}
              className="rounded-2xl border-2 border-pine-900/10 bg-cream-50 p-7 shadow-[0_10px_30px_-20px_rgba(31,43,33,0.6)] transition-transform hover:-translate-y-1"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-pine-900 text-glow">
                <CampIcon name={r.icon} className="h-8 w-8" />
              </div>
              <h3 className="font-display mt-5 text-h3 text-pine-900">
                {r.title}
              </h3>
              <p className="mt-2 text-charcoal/90">{r.body}</p>
            </article>
          ))}
        </ScrollReveal>

        <ScrollReveal className="mt-10">
          <a
            href="https://smubia.com/Projects?badge=AI%20Lodge"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 font-semibold text-teal-deep underline-offset-4 hover:underline"
          >
            See our lodgers&apos; past projects on the SMU BIA site
            <span className="transition-transform group-hover:translate-x-1">↗</span>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
