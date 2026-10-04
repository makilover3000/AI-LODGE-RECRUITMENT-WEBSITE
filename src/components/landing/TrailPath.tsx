"use client";

import { useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * The dashed hiking trail behind the programme stops. It measures every
 * `[data-trail-marker]` inside its (positioned) parent and threads one smooth path
 * through their centres: a gently winding trail across the level desktop row (each hop
 * swings the opposite way, like a footpath) and a straight trail down the phone column.
 * On first view the trail "walks" in (a mask stroke drawn by GSAP); under reduced motion
 * it's simply there.
 */
type Pt = { x: number; y: number };

/** marker centre relative to `root`, from offsets — ignores the ScrollReveal transforms */
function centreWithin(el: HTMLElement, root: HTMLElement): Pt {
  let x = el.offsetWidth / 2;
  let y = el.offsetHeight / 2;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

/** px the trail swings off the straight line between two level markers */
const SWAY = 26;

/** sideways hops wind (alternating up/down); vertical hops run straight */
function buildPath(pts: Pt[]) {
  if (pts.length < 2) return "";
  let d = `M${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const dx = b.x - a.x;
    if (Math.abs(dx) > Math.abs(b.y - a.y)) {
      const s = i % 2 ? SWAY : -SWAY;
      d += ` C${a.x + dx / 3} ${a.y + s} ${a.x + (2 * dx) / 3} ${b.y + s} ${b.x} ${b.y}`;
    } else {
      d += ` L${b.x} ${b.y}`;
    }
  }
  return d;
}

export default function TrailPath() {
  const svgRef = useRef<SVGSVGElement>(null);
  const drawRef = useRef<SVGPathElement>(null);
  const [geo, setGeo] = useState<{ w: number; h: number; d: string } | null>(null);
  const maskId = `trail-${useId().replace(/:/g, "")}`;

  // measure on mount + whenever the layout changes size
  useEffect(() => {
    const root = svgRef.current?.parentElement;
    if (!root) return;
    const measure = () => {
      const markers = Array.from(
        root.querySelectorAll<HTMLElement>("[data-trail-marker]")
      );
      setGeo({
        w: root.offsetWidth,
        h: root.offsetHeight,
        d: buildPath(markers.map((m) => centreWithin(m, root))),
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  // walk the trail in once, the first time it scrolls into view
  const hasPath = Boolean(geo?.d);
  useEffect(() => {
    const path = drawRef.current;
    if (!hasPath || !path) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const len = path.getTotalLength();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        path,
        { strokeDasharray: len, strokeDashoffset: len },
        {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: "power2.inOut",
          scrollTrigger: { trigger: svgRef.current, start: "top 78%", once: true },
          // drop the dash so a later resize (new path length) can't leave it half-drawn
          onComplete: () => gsap.set(path, { clearProps: "strokeDasharray,strokeDashoffset" }),
        }
      );
    });
    return () => ctx.revert();
  }, [hasPath]);

  return (
    <svg
      ref={svgRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      viewBox={geo ? `0 0 ${geo.w} ${geo.h}` : undefined}
    >
      {geo?.d && (
        <>
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse">
              <path ref={drawRef} d={geo.d} fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" />
            </mask>
          </defs>
          <path
            d={geo.d}
            fill="none"
            mask={`url(#${maskId})`}
            strokeWidth="3"
            strokeDasharray="9 9"
            strokeLinecap="round"
            className="stroke-roof/60"
          />
        </>
      )}
    </svg>
  );
}
