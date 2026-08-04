import About from "@/components/About";
import Animations from "@/components/Animations";
import BackToTop from "@/components/BackToTop";
import Clients from "@/components/Clients";
import CustomCursor from "@/components/CustomCursor";
import Cycle from "@/components/Cycle";
import Ecosystem from "@/components/Ecosystem";
import Footer from "@/components/Footer";
import GlobalSection from "@/components/GlobalSection";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Preloader from "@/components/Preloader";
import Quote from "@/components/Quote";
import Statement from "@/components/Statement";

export default function Page() {
  return (
    <>
      <Preloader />
      <Nav />
      <Hero />
      <Statement />
      <Cycle />
      <About />
      <Ecosystem />
      <Clients />
      <Quote />
      <GlobalSection />
      <Footer />
      <Animations />
      <BackToTop />
      <CustomCursor />
    </>
  );
}
