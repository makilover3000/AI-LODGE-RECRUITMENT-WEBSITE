import Image from "next/image";
import Link from "next/link";
import SignBubble from "@/components/ui/SignBubble";
import Treeline from "@/components/ui/Treeline";

export default function Hero() {
  return (
    <section className="paper-vignette relative overflow-hidden bg-cream pt-16">
      {/* faint sun glow top-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 h-[36rem] w-[36rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,207,135,0.55), rgba(255,207,135,0) 65%)",
        }}
      />

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        {/* copy */}
        <div className="relative z-10">
          <p className="eyebrow text-teal-ink">SMU BIA · 8-week programme</p>
          <h1 className="font-display mt-4 text-pine-900 text-hero">
            AI&nbsp;Lodge
          </h1>
          <p className="mt-6 max-w-xl text-bodylg text-charcoal/85">
            A structured AI/ML learning programme built around a community with a
            shared interest in AI — designed for anyone curious, regardless of
            technical background. Peer learning, real projects, cozy lodges.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="https://smu.opine.asia/survey?id=d9968e73-86c2-42e2-a2b9-fa7ef7289a3c"
              className="font-display rounded-full bg-teal-deep px-8 py-3.5 text-base tracking-[0.08em] text-cream-50 shadow-[0_4px_0_var(--color-teal-ink)] transition-transform hover:-translate-y-0.5"
            >
              Apply now
            </Link>
            <Link
              href="/#lodges"
              className="font-display rounded-full border-2 border-pine-900/40 px-8 py-3.5 text-base tracking-[0.08em] text-pine-900 transition-colors hover:border-pine-900/70"
            >
              View Lodges
            </Link>
          </div>

          <dl className="mt-10 flex flex-wrap gap-y-4 [&>div+div]:ml-7 [&>div+div]:border-l [&>div+div]:border-pine-900/20 [&>div+div]:pl-7">
            <div>
              <dt className="font-display text-3xl text-pine-900">10</dt>
              <dd className="text-sm font-semibold text-pine-900/75">max lodgers / lodge</dd>
            </div>
            <div>
              <dt className="font-display text-3xl text-pine-900">3</dt>
              <dd className="text-sm font-semibold text-pine-900/75">lodge captains</dd>
            </div>
            <div>
              <dt className="font-display text-3xl text-pine-900">10</dt>
              <dd className="text-sm font-semibold text-pine-900/75">weeks to a project</dd>
            </div>
          </dl>
        </div>

        {/* framed painted poster */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative rotate-[1.4deg] rounded-[14px] border-[6px] border-cream-50 bg-cream-50 shadow-[0_22px_50px_-18px_rgba(31,43,33,0.6)]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[8px] border border-pine-900/15">
              <Image
                src="/moments/jb-group-2.webp"
                alt="A past AI Lodge group together after a session."
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 460px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="absolute -bottom-6 -left-4 rotate-[-3deg] sm:-left-10">
            <SignBubble tail="bl" className="max-w-[15rem]">
              Curious about AI but don&apos;t know where to begin?
            </SignBubble>
          </div>
        </div>
      </div>

      {/* green treeline rising into the cream — leads into the pine band below */}
      <Treeline
        className="-mb-px h-14 sm:h-20"
        back="var(--color-pine-500)"
        front="var(--color-pine-900)"
      />
    </section>
  );
}
