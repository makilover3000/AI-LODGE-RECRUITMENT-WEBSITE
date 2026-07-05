import Image from "next/image";
import Link from "next/link";

export default function ApplyCTA() {
  return (
    <section id="apply" className="relative overflow-hidden bg-pine-900 py-28 text-cream-50">
      {/* painted cabin glowing in the dark, faint */}
      <Image
        src="/entry/close-desktop.jpg"
        alt=""
        fill
        quality={90}
        sizes="100vw"
        className="object-cover object-center opacity-20"
      />
      <div className="absolute inset-0 bg-pine-900/60" />
      {/* warm window glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,178,77,0.28), rgba(255,178,77,0) 65%)",
        }}
      />

      <div className="relative mx-auto max-w-2xl px-5 text-center sm:px-8">
        <p className="font-script text-3xl text-glow sm:text-4xl">
          the fire&apos;s lit, the door&apos;s open
        </p>
        <h2 className="font-display mt-3 text-display text-cream-50">
          Be part of the pioneer batch
        </h2>
        <p className="mt-5 text-bodylg text-cream-50/85">
          Join AI Lodge&apos;s first cycle — small lodges, real projects, and a
          community that learns AI together. No background required.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link
            href="https://smu.opine.asia/survey?id=d9968e73-86c2-42e2-a2b9-fa7ef7289a3c"
            className="font-display rounded-full bg-glow-deep px-9 py-4 text-lg tracking-[0.06em] text-pine-900 shadow-[0_5px_0_#b97c2c] transition-transform hover:-translate-y-0.5"
          >
            Apply now
          </Link>
          <Link
            href="/#lodges"
            className="font-display rounded-full border-2 border-cream-50/40 px-9 py-4 text-lg tracking-[0.06em] text-cream-50 transition-colors hover:bg-cream-50/10"
          >
            Browse the lodges
          </Link>
        </div>
        <p className="mt-6 text-sm text-cream-50/75">
          Applications are open NOW!
        </p>
      </div>
    </section>
  );
}
