import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/features/hero/Hero";
import About from "@/features/about/About";
import Experience from "@/features/experience/Experience";
import TechStacks from "@/features/tech-stacks/TechStacks";
import Projects from "@/features/projects/Projects";
import Timeline from "@/features/timeline/Timeline";
import Contact from "@/features/contact/Contact";
import { applyHomePageSeo } from "@/services/seo";

interface HomePageProps {
  showTimeline: boolean;
  setShowTimeline: (show: boolean) => void;
}

const HomePage = ({ showTimeline, setShowTimeline }: HomePageProps) => {
  useEffect(() => {
    applyHomePageSeo();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="px-1 space-y-2 sm:px-0 sm:space-y-0">
        <Hero setShowTimeline={setShowTimeline} />
        <About />
        <Experience />
        <TechStacks />
        <Projects />
        <Timeline show={showTimeline} />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
