import Animations from "@/components/Animations";
import Clients from "@/components/Clients";
import Cycle from "@/components/Cycle";
import FeatureGrid from "@/components/FeatureGrid";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import GlobalBall from "@/components/GlobalBall";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Preloader from "@/components/Preloader";
import Quote from "@/components/Quote";
import Reframe from "@/components/Reframe";
import TechDetails from "@/components/TechDetails";
import Trial from "@/components/Trial";

export default function Page() {
  return (
    <>
      <Preloader />
      <Nav />
      <Hero />
      <Reframe />
      <Cycle />
      <FeatureGrid />
      <Trial />
      <Clients />
      <Quote />
      <TechDetails />
      <FinalCTA />
      <Footer />
      <GlobalBall />
      <Animations />
    </>
  );
}
