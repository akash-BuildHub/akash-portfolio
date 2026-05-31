import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import TechStacks from "@/components/sections/TechStacks";
import Projects from "@/components/sections/Projects";
import Timeline from "@/components/sections/Timeline";
import Contact from "@/components/sections/Contact";
import {
  setCanonical,
  setJsonLd,
  setMetaName,
  setMetaProperty,
  setRobots,
} from "@/lib/seo";

interface IndexProps {
  showTimeline: boolean;
  setShowTimeline: (show: boolean) => void;
}

const Index = ({ showTimeline, setShowTimeline }: IndexProps) => {
  useEffect(() => {
    const title = "Akash - Portfolio \u272F";
    const description =
      "Akash portfolio showcasing AI development, Python projects, web solutions, and real-world engineering work.";
    const url = `${window.location.origin}/`;
    const image = `${window.location.origin}/akash_profile.jpeg`;

    document.title = title;
    setMetaName("description", description);
    setMetaName("author", "Akash");
    setMetaName(
      "keywords",
      "Akash, AI Developer, Python Developer, Portfolio, React, Machine Learning",
    );
    setMetaName("twitter:card", "summary_large_image");
    setMetaName("twitter:title", title);
    setMetaName("twitter:description", description);
    setMetaName("twitter:image", image);
    setMetaProperty("og:title", title);
    setMetaProperty("og:description", description);
    setMetaProperty("og:type", "website");
    setMetaProperty("og:url", url);
    setMetaProperty("og:image", image);
    setCanonical(url);
    setRobots("index, follow");

    setJsonLd("person", {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Akash",
      url,
      image,
      sameAs: [
        "https://www.linkedin.com/in/akash-rm",
        "https://github.com/akash-BuildHub",
      ],
      jobTitle: "AI Developer",
    });
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

export default Index;
