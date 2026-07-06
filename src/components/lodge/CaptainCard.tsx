import Image from "next/image";
import type { Captain } from "@/data/lodges";

export default function CaptainCard({
  captain,
  accent,
}: {
  captain: Captain;
  accent: string;
}) {
  const hasTelegram = captain.telegram && captain.telegram !== "tbc";
  return (
    <div className="flex flex-col items-center rounded-2xl border-2 border-pine-900/10 bg-cream-50 p-8 text-center">
      <div
        className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-pine-900/10"
        style={{ backgroundColor: accent }}
        aria-hidden
      >
        <Image
          src={captain.image}
          alt={`${captain.name} profile photo`}
          width={160}
          height={160}
          className="h-full w-full object-cover object-top"
        />
      </div>
      <h3 className="font-display mt-5 text-2xl text-pine-900">
        {captain.name}
      </h3>
      <p className="mt-1.5 text-base text-charcoal/80">{captain.detail}</p>
      {hasTelegram ? (
        <a
          href={`https://t.me/${captain.telegram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-base font-semibold text-teal-deep hover:underline"
        >
          @{captain.telegram}
        </a>
      ) : (
        <span className="mt-4 text-base text-charcoal/45">Telegram — TBC</span>
      )}
    </div>
  );
}
