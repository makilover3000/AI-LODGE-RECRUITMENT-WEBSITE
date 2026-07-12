import SignBubble from "@/components/ui/SignBubble";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function InfoStrip() {
  return (
    <section id="about" className="relative bg-pine-900 text-cream-50">
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-16 sm:px-8">
        <ScrollReveal stagger={0.12} className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-start">
          <SignBubble className="rotate-[-1.5deg]">
            Overwhelmed by AI advancements?
          </SignBubble>
          <SignBubble tail="br" className="rotate-[1.5deg] sm:mt-8">
            Wanna learn, but don&apos;t know where to begin?
          </SignBubble>
        </ScrollReveal>

        <ScrollReveal className="mt-12 max-w-3xl">
          <h2 className="font-display text-h1 text-cream-50">
            That&apos;s exactly what the lodge is for.
          </h2>
          <p className="mt-5 text-bodylg text-cream-50/80">
            AI Lodge gathers small groups of curious students into cozy
            &ldquo;lodges&rdquo; — <strong className="text-cream-50">up to 10 lodgers</strong>{" "}
            guided by <strong className="text-cream-50">3 captains</strong> — to
            learn AI together, hands-on, over eight weeks. No prior experience
            required. Just bring your curiosity.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
