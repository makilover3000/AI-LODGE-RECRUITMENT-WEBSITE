import LandingExperience from "@/components/LandingExperience";
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import InfoStrip from "@/components/InfoStrip";
import TimelineSection from "@/components/TimelineSection";
import WhyJoin from "@/components/WhyJoin";
import ApplicationsBanner from "@/components/ApplicationsBanner";
import ApplicationProcess from "@/components/ApplicationProcess";
import LodgeGrid from "@/components/LodgeGrid";
import ApplyCTA from "@/components/ApplyCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <LandingExperience>
      <NavBar />
      <main id="main">
        <Hero />
        <InfoStrip />
        <TimelineSection />
        <WhyJoin />
        <ApplicationsBanner />
        <ApplicationProcess />
        <LodgeGrid />
        <ApplyCTA />
      </main>
      <Footer />
    </LandingExperience>
  );
}
