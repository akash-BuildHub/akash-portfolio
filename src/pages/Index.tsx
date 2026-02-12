import { useEffect } from 'react';
import Navbar from '@/components/portfolio/Navbar';
import Hero from '@/components/portfolio/Hero';
import About from '@/components/portfolio/About';
import Experience from '@/components/portfolio/Experience';
import Projects from '@/components/portfolio/Projects';
import Timeline from '@/components/portfolio/Timeline';
import Contact from '@/components/portfolio/Contact';
import Footer from '@/components/portfolio/Footer';
import { setCanonical, setJsonLd, setMetaName, setMetaProperty, setRobots } from '@/lib/seo';

interface IndexProps {
  showTimeline: boolean;
  setShowTimeline: (show: boolean) => void;
}

const Index = ({ showTimeline, setShowTimeline }: IndexProps) => {
  useEffect(() => {
    const title = 'Akash | Portfolio ✯';
    const description =
      'Akash portfolio showcasing AI development, Python projects, web solutions, and real-world engineering work.';
    const url = `${window.location.origin}/`;
    const image = `${window.location.origin}/ak-profile.png`;

    document.title = title;
    setMetaName('description', description);
    setMetaName('author', 'Akash');
    setMetaName('keywords', 'Akash, AI Developer, Python Developer, Portfolio, React, Machine Learning');
    setMetaName('twitter:card', 'summary_large_image');
    setMetaName('twitter:title', title);
    setMetaName('twitter:description', description);
    setMetaName('twitter:image', image);
    setMetaProperty('og:title', title);
    setMetaProperty('og:description', description);
    setMetaProperty('og:type', 'website');
    setMetaProperty('og:url', url);
    setMetaProperty('og:image', image);
    setCanonical(url);
    setRobots('index, follow');

    setJsonLd('person', {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Akash',
      url,
      image,
      sameAs: [
        'https://www.linkedin.com/in/akash-rm',
        'https://github.com/akash-BuildHub',
      ],
      jobTitle: 'AI Developer',
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero setShowTimeline={setShowTimeline} />
      <About />
      <Experience />
      <Projects />
      <Timeline show={showTimeline} />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
