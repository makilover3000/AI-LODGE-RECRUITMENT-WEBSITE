import { BIA_URL } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-tree-1 border-t-2 border-teal/30 py-10 text-cream/70">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-2xl text-cream">AI Lodge</p>
          <p className="font-body mt-1 text-sm">An SMU BIA learning programme.</p>
        </div>
        <a
          href={BIA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-sm underline-offset-4 hover:text-cream hover:underline"
        >
          SMU BIA ↗
        </a>
      </div>
    </footer>
  );
}
