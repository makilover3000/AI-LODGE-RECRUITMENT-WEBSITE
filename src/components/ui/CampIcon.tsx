/** Flat camping spot-motifs traced as inline SVG (poster style). Single accent color via `currentColor`. */

export type CampIconName =
  | "pine"
  | "campfire"
  | "compass"
  | "lantern"
  | "signpost"
  | "logs"
  | "axe"
  | "tools";

export default function CampIcon({
  name,
  className = "",
  title,
}: {
  name: CampIconName;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="none"
    >
      {title ? <title>{title}</title> : null}
      {ICONS[name]}
    </svg>
  );
}

const s = { stroke: "currentColor", strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const ICONS: Record<CampIconName, React.ReactNode> = {
  pine: (
    <g {...s}>
      <path d="M24 6 14 20h6L11 33h11v9h4v-9h11L33 20h6L24 6Z" fill="currentColor" fillOpacity="0.12" />
    </g>
  ),
  campfire: (
    <g {...s}>
      <path d="M24 8c4 5 6 8 6 12a6 6 0 1 1-12 0c0-3 2-6 6-12Z" fill="currentColor" fillOpacity="0.12" />
      <path d="M12 38l24-8M36 38l-24-8" />
    </g>
  ),
  compass: (
    <g {...s}>
      <circle cx="24" cy="24" r="16" />
      <path d="M30 18l-4 12-8 4 4-12 8-4Z" fill="currentColor" fillOpacity="0.14" />
    </g>
  ),
  lantern: (
    <g {...s}>
      <path d="M18 16h12v18a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V16Z" fill="currentColor" fillOpacity="0.12" />
      <path d="M20 10h8M24 6v4M16 16h16M22 22h4v8h-4z" />
    </g>
  ),
  signpost: (
    <g {...s}>
      <path d="M24 6v36" />
      <path d="M10 13h20l4 4-4 4H10z" fill="currentColor" fillOpacity="0.12" />
      <path d="M38 25H18l-4 4 4 4h20z" fill="currentColor" fillOpacity="0.12" />
    </g>
  ),
  logs: (
    <g {...s}>
      <rect x="8" y="26" width="32" height="9" rx="3" fill="currentColor" fillOpacity="0.12" />
      <rect x="12" y="15" width="24" height="9" rx="3" fill="currentColor" fillOpacity="0.12" />
      <circle cx="15" cy="30.5" r="2" /><circle cx="33" cy="30.5" r="2" />
    </g>
  ),
  axe: (
    <g {...s}>
      <path d="M14 40 34 12" />
      <path d="M30 8c5 1 9 5 8 11-5 1-9-1-12-4l4-7Z" fill="currentColor" fillOpacity="0.14" />
    </g>
  ),
  tools: (
    <g {...s}>
      <path d="M14 8a8 8 0 0 0 10 11l13 13-3 3-13-13A8 8 0 0 1 10 12l4 4 4-4-4-4Z" fill="currentColor" fillOpacity="0.12" />
    </g>
  ),
};
