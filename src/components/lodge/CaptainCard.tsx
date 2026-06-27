import type { Captain } from "@/data/lodges";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}

export default function CaptainCard({
  captain,
  accent,
}: {
  captain: Captain;
  accent: string;
}) {
  const hasTelegram = captain.telegram && captain.telegram !== "tbc";
  return (
    <div className="flex flex-col items-center rounded-2xl border-2 border-pine-900/10 bg-cream-50 p-6 text-center">
      <div
        className="font-display flex h-20 w-20 items-center justify-center rounded-full text-2xl text-pine-900 uppercase"
        style={{ background: accent }}
        aria-hidden
      >
        {initials(captain.name)}
      </div>
      <h3 className="font-display mt-4 text-xl text-pine-900">{captain.name}</h3>
      <p className="mt-1 text-sm text-charcoal/80">{captain.detail}</p>
      {hasTelegram ? (
        <a
          href={`https://t.me/${captain.telegram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 text-sm font-semibold text-teal-deep hover:underline"
        >
          @{captain.telegram}
        </a>
      ) : (
        <span className="mt-3 text-sm text-charcoal/45">Telegram — TBC</span>
      )}
    </div>
  );
}
