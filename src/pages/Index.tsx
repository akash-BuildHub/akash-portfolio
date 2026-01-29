import Navbar from '@/components/portfolio/Navbar';
import Hero from '@/components/portfolio/Hero';
import About from '@/components/portfolio/About';
import Experience from '@/components/portfolio/Experience';
import Projects from '@/components/portfolio/Projects';
import Timeline from '@/components/portfolio/Timeline';
import Contact from '@/components/portfolio/Contact';
import Footer from '@/components/portfolio/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Timeline />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;