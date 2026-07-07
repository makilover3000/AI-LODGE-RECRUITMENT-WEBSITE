import EntryExperience from "@/components/entry/EntryExperience";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import InfoStrip from "@/components/landing/InfoStrip";
import ProgrammeTimeline from "@/components/landing/ProgrammeTimeline";
import WhyJoin from "@/components/landing/WhyJoin";
import ApplicationsBanner from "@/components/landing/ApplicationsBanner";
import ApplicationProcess from "@/components/landing/ApplicationProcess";
import LodgeGrid from "@/components/landing/LodgeGrid";
import ApplyCTA from "@/components/landing/ApplyCTA";

export default function Home() {
  return (
    <>
      {/* Preload the correct-orientation entry painting at HTML parse (home page
          only — React hoists these into <head>) so the sharp image is ready when
          the splash mounts. Raw jpgs (EntryScene serves them unoptimized) so the
          preload URL matches the actual fetch and there is no double download. */}
      <link
        rel="preload"
        as="image"
        href="/entry/entry-hd.jpg"
        media="(min-width: 1024px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href="/entry/entry-hd-portrait.jpg"
        media="(max-width: 1023px)"
        fetchPriority="high"
      />
      <EntryExperience />
      <div id="site">
        <NavBar />
        <main>
          <Hero />
          <InfoStrip />
          <WhyJoin />
          <LodgeGrid />
          <ProgrammeTimeline />
          <ApplicationsBanner />
          <ApplicationProcess />
          <ApplyCTA />
        </main>
        <Footer />
      </div>
    </>
  );
}
