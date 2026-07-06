import Image from "next/image";

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
          <p className="text-sm text-cream-50/50">
            © {new Date().getFullYear()} AI Lodge · SMU Business Intelligence &amp;
            Analytics
          </p>
        </div>
      </div>
    </footer>
  );
}
