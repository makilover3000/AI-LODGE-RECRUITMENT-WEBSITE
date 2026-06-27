/** Layered flat pine treeline divider (poster silhouette). Sits on a section edge. */

type Props = {
  className?: string;
  /** point trees downward (for the top edge of a section) */
  flip?: boolean;
  back?: string; // back layer color
  front?: string; // front layer color
};

function pines(count: number, base: number, minH: number, maxH: number, seedShift: number) {
  const step = 1200 / count;
  let d = `M0 ${base}`;
  for (let i = 0; i < count; i++) {
    const cx = i * step + step / 2;
    const h = minH + ((Math.sin(i * 1.7 + seedShift) + 1) / 2) * (maxH - minH);
    const halfW = step * 0.62;
    d += ` L${cx - halfW} ${base} L${cx} ${base - h} L${cx + halfW} ${base}`;
  }
  d += ` L1200 ${base} L1200 140 L0 140 Z`;
  return d;
}

export default function Treeline({
  className = "",
  flip = false,
  back = "var(--color-pine-500)",
  front = "var(--color-pine-900)",
}: Props) {
  return (
    <svg
      viewBox="0 0 1200 140"
      preserveAspectRatio="none"
      aria-hidden
      className={`block w-full ${className}`}
      style={flip ? { transform: "scaleY(-1)" } : undefined}
    >
      <path d={pines(9, 96, 40, 84, 0.6)} fill={back} />
      <path d={pines(13, 120, 30, 70, 2.3)} fill={front} />
    </svg>
  );
}
