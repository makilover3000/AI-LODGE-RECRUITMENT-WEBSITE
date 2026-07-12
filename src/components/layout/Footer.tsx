import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-pine-900 text-cream-50">
      {/* treeline cresting the top edge */}
      <div aria-hidden className="h-10 w-full bg-pine-700/40" />

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Image
            src="/smu-bia-logo.png"
            alt="SMU BIA"
            width={284}
            height={86}
            className="h-6 w-auto opacity-80 invert"
          />
          <Link
            href="https://smubia.com/Projects?badge=AI%20Lodge"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-cream-50/80 underline-offset-4 transition-colors hover:text-glow hover:underline"
          >
            View past projects
            <span aria-hidden className="transition-transform group-hover:translate-x-1">↗</span>
          </Link>
          <p className="text-sm text-cream-50/50">
            © {new Date().getFullYear()} AI Lodge · SMU Business Intelligence &amp;
            Analytics
          </p>
        </div>
      </div>
    </footer>
  );
}
