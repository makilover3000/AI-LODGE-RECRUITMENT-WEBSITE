import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-pine-900 text-cream-50">
      {/* treeline cresting the top edge */}
      <div aria-hidden className="h-10 w-full bg-pine-700/40" />

      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-3xl tracking-[0.04em] text-cream-50">
              Be part of the pioneer batch.
            </p>
            <p className="mt-3 text-cream-50/70">
              AI Lodge is a structured AI/ML learning programme under SMU BIA —
              small lodges, peer learning, real projects.
            </p>
            <Link
              href="/#apply"
              className="font-display mt-6 inline-block rounded-full bg-teal px-6 py-2.5 text-sm tracking-[0.08em] text-pine-900 shadow-[0_3px_0_var(--color-teal-ink)] transition-transform hover:-translate-y-0.5"
            >
              Apply now
            </Link>
          </div>

          <nav className="grid grid-cols-2 gap-x-12 gap-y-2 text-cream-50/80">
            <Link href="/#about" className="py-1 hover:text-teal-hi">About</Link>
            <Link href="/#programme" className="py-1 hover:text-teal-hi">Programme</Link>
            <Link href="/#lodges" className="py-1 hover:text-teal-hi">Lodges</Link>
            <Link href="/#process" className="py-1 hover:text-teal-hi">How to join</Link>
            <a
              href="https://smubia.org"
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-2 py-1 hover:text-teal-hi"
            >
              Past projects → SMU BIA ↗
            </a>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-start gap-4 border-t border-cream-50/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Image
            src="/smu-bia-logo.png"
            alt="SMU BIA"
            width={284}
            height={86}
            className="h-6 w-auto opacity-80 invert"
          />
          <p className="text-sm text-cream-50/50">
            © {new Date().getFullYear()} AI Lodge · SMU Business Intelligence &amp;
            Analytics
          </p>
        </div>
      </div>
    </footer>
  );
}
