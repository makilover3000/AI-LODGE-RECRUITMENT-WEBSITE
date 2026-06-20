import Reveal from "./Reveal";

/** Quick "what a lodge is" facts, straight from the brief. */
export default function InfoStrip() {
  const facts = [
    { big: "8–12", label: "students per lodge — small enough to actually know everyone" },
    { big: "3", label: "lodge captains leading each lodge" },
    { big: "8", label: "weeks of guided, hands-on sessions" },
  ];
  return (
    <section className="bg-tree-1 py-14 text-cream">
      <Reveal className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-5 sm:grid-cols-3">
        {facts.map((f) => (
          <div key={f.label} className="border-l-4 border-teal pl-5">
            <div className="font-display text-6xl text-teal-highlight">{f.big}</div>
            <p className="font-body mt-2 text-lg leading-snug text-cream/85">
              {f.label}
            </p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
