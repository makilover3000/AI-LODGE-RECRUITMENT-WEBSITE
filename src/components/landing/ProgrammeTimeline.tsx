import Treeline from "@/components/ui/Treeline";
import CampIcon, { CampIconName } from "@/components/ui/CampIcon";
import ScrollReveal from "@/components/ui/ScrollReveal";

type Stop = {
  marker: string;
  title: string;
  body: string;
  icon: CampIconName;
};

const STOPS: Stop[] = [
  {
    marker: "Weeks 1–8",
    title: "Lodge sessions",
    body: "Weekly hands-on sessions with your lodge — guided projects, building intuition and skills together.",
    icon: "signpost",
  },
  {
    marker: "Recess week",
    title: "Lodge hack day",
    body: "A full day to get hands dirty — your lodge hacks together on something real.",
    icon: "campfire",
  },
  {
    marker: "Week 10",
    title: "Finals & exhibition",
    body: "Hackathon finals and a project exhibition day — show what your lodge built.",
    icon: "tools",
  },
];

export default function ProgrammeTimeline() {
  return (
    <section id="programme" className="relative bg-cream pb-24">
      {/* pine treeline descending from the band above into the clearing */}
      <Treeline
        flip
        className="-mt-px mb-16 h-14 sm:h-20"
        back="var(--color-pine-500)"
        front="var(--color-pine-900)"
      />

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow text-teal-ink">The trail · 10 weeks</p>
          <h2 className="font-display mt-3 text-pine-900 text-h1">
            The programme, week by week
          </h2>
        </div>

        <ScrollReveal
          stagger={0.15}
          className="relative mt-14 grid gap-12 md:grid-cols-3 md:gap-8"
        >
          {/* dashed trail behind the stops (desktop) */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-7 hidden border-t-[3px] border-dashed border-roof/50 md:block"
          />
          {STOPS.map((stop) => (
            <div key={stop.marker} className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-roof bg-cream text-roof shadow-[0_3px_0_var(--color-roof-dark)]">
                <CampIcon name={stop.icon} className="h-8 w-8" />
              </div>
              <p className="eyebrow mt-5 text-roof-dark">{stop.marker}</p>
              <h3 className="font-display mt-1 text-h3 text-pine-900">
                {stop.title}
              </h3>
              <p className="mt-2 text-charcoal/90">{stop.body}</p>
            </div>
          ))}
        </ScrollReveal>

        <p className="mt-12 inline-flex items-center gap-2 rounded-full bg-ground/30 px-4 py-2 text-sm font-semibold text-pine-900">
          <span className="inline-block h-2 w-2 rounded-full bg-roof" />
          Exact session day &amp; time confirmed after applications close — TBC.
        </p>
      </div>
    </section>
  );
}
