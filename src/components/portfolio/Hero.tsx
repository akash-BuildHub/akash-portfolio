import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ChevronRight, Heart } from 'lucide-react';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 100, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power4.out', delay: 0.3 }
      );

      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.8 }
      );

      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 1.3 }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToTimeline = () => {
    const timelineSection = document.getElementById('timeline');
    if (timelineSection) {
      timelineSection.classList.remove('hidden');
      timelineSection.classList.add('block');
      setTimeout(() => {
        timelineSection.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card" />
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Title */}
        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-10 opacity-0"
        >
          <span className="text-foreground">Welcome to </span>
          <span className="gradient-text">Akash Portfolio</span>
          <Heart className="inline-block ml-2 text-red-500 animate-pulse" size={40} />
        </h1>

        {/* Tagline */}
        <div ref={subtitleRef} className="max-w-xl mx-auto mt-6 mb-16 opacity-0">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            AI Developer
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground italic tracking-wide">
            think it, let the AI do it
          </p>
        </div>

        {/* CTA Button */}
        <div ref={ctaRef} className="opacity-0">
          <button
            onClick={scrollToTimeline}
            className="relative px-8 py-4 rounded-full bg-card/80 border border-primary/30 text-foreground font-medium text-lg transition-all duration-300 hover:border-primary hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:scale-105 group"
          >
            <span className="flex items-center gap-2">
              <ChevronRight className="w-5 h-5 text-primary" />
              Click here
              <span className="text-muted-foreground">→</span>
              to explore more
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;