"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#programme", label: "Programme" },
  { href: "/#lodges", label: "Lodges" },
  { href: "/#process", label: "How to join" },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled
          ? "bg-cream/90 shadow-[0_2px_0_var(--color-pine-900)] backdrop-blur-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label="AI Lodge home">
          <Image
            src="/smu-bia-logo.png"
            alt="SMU BIA"
            width={284}
            height={86}
            className="h-7 w-auto invert"
            priority
          />
          <span className="font-display text-pine-900 text-lg leading-none tracking-[0.06em]">
            AI&nbsp;Lodge
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="eyebrow text-pine-900/80 transition-colors hover:text-teal-deep"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="https://smu.opine.asia/survey?id=d9968e73-86c2-42e2-a2b9-fa7ef7289a3c"
            className="font-display rounded-full bg-teal-deep px-5 py-2 text-sm tracking-[0.08em] text-cream-50 shadow-[0_3px_0_var(--color-teal-ink)] transition-transform hover:-translate-y-0.5"
          >
            Apply
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-md text-pine-900 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 block h-0.5 w-6 bg-current transition-transform duration-300 ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 block h-0.5 w-6 bg-current transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-6 bg-current transition-transform duration-300 ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </nav>

      {/* mobile panel */}
      <div
        className={`overflow-hidden border-pine-900/10 bg-cream/95 backdrop-blur-sm transition-[max-height] duration-300 md:hidden ${
          open ? "max-h-80 border-t" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-5 py-3">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-display py-2 text-xl tracking-[0.04em] text-pine-900"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="https://smu.opine.asia/survey?id=d9968e73-86c2-42e2-a2b9-fa7ef7289a3c"
            onClick={() => setOpen(false)}
            className="font-display mt-2 rounded-full bg-teal-deep px-5 py-2.5 text-center text-base tracking-[0.08em] text-cream-50"
          >
            Apply now
          </Link>
        </div>
      </div>
    </header>
  );
}
