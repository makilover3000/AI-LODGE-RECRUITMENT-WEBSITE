import Link from "next/link";
import { NAV_LINKS, APPLY_URL } from "@/lib/site";

/**
 * Sticky top navigation. Brand left-aligned (left-side attention bias),
 * anchor links inline on desktop, primary Apply action always visible.
 * `variant="lodge"` swaps the anchors for a single "back to lodges" link.
 */
export default function NavBar({ variant = "home" }: { variant?: "home" | "lodge" }) {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-tree-1/15 bg-sky/90 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link
          href="/"
          className="font-display text-2xl leading-none text-charcoal sm:text-3xl"
        >
          AI&nbsp;Lodge
        </Link>

        {variant === "home" ? (
          <ul className="font-display hidden items-center gap-7 text-charcoal/80 md:flex">
            {NAV_LINKS.slice(0, 4).map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="inline-block py-2 text-sm tracking-[0.12em] transition-colors hover:text-teal-text"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <Link
            href="/#lodges"
            className="font-display text-sm tracking-[0.12em] text-charcoal/80 transition-colors hover:text-teal-text"
          >
            ← Back to lodges
          </Link>
        )}

        <a
          href={APPLY_URL}
          className="font-display rounded-sm bg-teal-deep px-4 py-2.5 text-sm tracking-[0.14em] text-cream shadow-[3px_3px_0_var(--color-teal-border)] transition-transform hover:-translate-y-0.5"
        >
          Apply
        </a>
      </nav>
    </header>
  );
}
