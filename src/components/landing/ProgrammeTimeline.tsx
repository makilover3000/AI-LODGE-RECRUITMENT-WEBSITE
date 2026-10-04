import CampIcon, { CampIconName } from "@/components/ui/CampIcon";
import ScrollReveal from "@/components/ui/ScrollReveal";
import TrailPath from "./TrailPath";

type Stop = {
  marker: string;
  title: string;
  body: string;
  icon: CampIconName;
  /** "detour" = a side trail that happens alongside the main route (not a new phase);
   *  "finish" = the end of the trail */
  kind?: "detour" | "finish";
};

const STOPS: Stop[] = [
  {
    marker: "Weeks 1–7",
    title: "Lodge sessions",
    body: "Weekly hands-on sessions with your lodge — guided projects, building intuition and skills together.",
    icon: "signpost",
  },
  {
    marker: "Week 5",
    title: "Industry workshops",
    body: "AI Lodge-exclusive workshops run by industry partners and experienced seniors — AI skills, tools, and more.",
    icon: "lantern",
    kind: "detour",
  },
  {
    marker: "Recess week",
    title: "Lodge hack day",
    body: "A full day to get your hands dirty — your lodge hacks together on something real.",
    icon: "campfire",
  },
  {
    marker: "Week 10",
    title: "Finals & exhibition",
    body: "Hackathon finals and a project exhibition day — show what your lodge built.",
    icon: "flag",
    kind: "finish",
  },
];

const MARKER_STYLES: Record<"default" | "detour" | "finish", string> = {
  default: "border-[3px] border-roof bg-cream text-roof shadow-[0_3px_0_var(--color-roof-dark)]",
  detour: "border-[3px] border-dashed border-glow-deep bg-glow/45 text-roof-dark",
  finish: "border-[3px] border-roof-dark bg-roof text-cream-50 shadow-[0_3px_0_var(--color-roof-dark)]",
};

export default function ProgrammeTimeline() {
  return (
    <section id="programme" className="relative bg-cream-100 pb-24 lg:pb-28">
      {/* a dashed trail-edge marks where the lodge grid's clearing ends */}
      <div aria-hidden className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="border-t-[3px] border-dashed border-roof/30" />
      </div>

      <div className="mx-auto max-w-6xl px-5 pt-20 sm:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow text-teal-ink">The trail · 10 weeks</p>
          <h2 className="font-display mt-3 text-pine-900 text-h1">
            The programme, week by week
          </h2>
        </div>

        {/* the trail threads every marker: winding across the level row on desktop,
            straight down the column on phones */}
        <div className="relative mt-14 lg:mt-16">
          <TrailPath />
          <ScrollReveal
            as="ol"
            stagger={0.15}
            className="relative grid gap-12 lg:grid-cols-4 lg:gap-8"
          >
            {STOPS.map((stop) => (
              <li
                key={stop.marker}
                className="relative flex gap-5 lg:flex-col lg:gap-0"
              >
                <div
                  data-trail-marker
                  className={`relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${
                    MARKER_STYLES[stop.kind ?? "default"]
                  }`}
                >
                  <CampIcon name={stop.icon} className="h-8 w-8" />
                </div>
                <div className="min-w-0 pt-1 lg:pt-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 lg:mt-5">
                    <p className="eyebrow text-roof-dark">{stop.marker}</p>
                    {stop.kind === "detour" && (
                      <span className="rounded-full bg-glow/60 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.12em] text-roof-dark">
                        Side trail
                      </span>
                    )}
                  </div>
                  <h3 className="font-display mt-1 text-h3 text-pine-900">
                    {stop.title}
                  </h3>
                  <p className="mt-2 max-w-sm text-charcoal/90">{stop.body}</p>
                </div>
              </li>
            ))}
          </ScrollReveal>
        </div>

        <p className="mt-14 inline-flex items-center gap-2 rounded-full bg-ground/30 px-4 py-2 text-sm font-semibold text-pine-900">
          <span className="inline-block h-2 w-2 rounded-full bg-roof" />
          Exact session day &amp; time confirmed after applications close — TBC.
        </p>
      </div>
    </section>
  );
}
