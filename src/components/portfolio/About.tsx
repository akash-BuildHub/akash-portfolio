import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Eye, Cpu, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 50%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const highlights = [
    { icon: Cpu, label: 'AI Development' },
    { icon: Eye, label: 'Computer Vision' },
    { icon: TrendingUp, label: 'Technical Growth' },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 md:py-32 relative"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div ref={contentRef} className="max-w-6xl mx-auto text-center">
          <h2 className="section-title">About Me</h2>
          
          <div className="glass-card p-8 md:p-12 glow-hover transition-all duration-500">
            <p className="text-lg md:text-xl text-foreground/90 leading-[1.7] md:leading-[1.9] text-justify mb-8">
  I’m <span className="text-primary font-semibold">Akash</span>, an{' '}
  <span className="gradient-text font-semibold">AI Developer</span> specializing in 
  machine learning, deep learning, and computer vision, with hands-on experience in 
  designing, building, and deploying intelligent systems for real-world applications. 
  I focus on writing clean, scalable, and production-ready code while transforming 
  complex datasets into meaningful insights and developing end-to-end AI pipelines 
  optimized for performance and accuracy. Driven by innovation and problem-solving, 
  I’m passionate about creating impactful, data-driven AI solutions that bridge 
  cutting-edge research with practical applications.
</p>

            <div className="flex flex-wrap justify-center gap-6">
              {highlights.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 px-6 py-3 rounded-full bg-secondary/50 border border-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-105"
                >
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="text-foreground/90">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;