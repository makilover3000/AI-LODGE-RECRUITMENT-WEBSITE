import { lodges } from "@/data/lodges";
import LodgeCard from "./LodgeCard";
import Reveal from "./Reveal";

/** The lodge showcase grid. */
export default function LodgeGrid() {
  return (
    <section id="lodges" className="bg-ground py-20">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="font-display text-[clamp(2.2rem,6vw,4rem)] text-tree-1">
          Meet the lodges
        </h2>
        <p className="font-body mt-2 max-w-xl text-lg text-tree-1/75">
          Seven lodges, each with its own character and pace. Find the one that
          fits — you&rsquo;ll rank your interest when you apply.
        </p>

        <Reveal
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.1}
        >
          {lodges.map((lodge) => (
            <LodgeCard key={lodge.slug} lodge={lodge} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
