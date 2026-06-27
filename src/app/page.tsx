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
