import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/motion';
import ProjectCard from './ProjectCard';
import { projects } from './projects.data';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 90%',
            end: 'top 65%',
            scrub: 1,
          },
        }
      );
    }, headingRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" className="relative overflow-hidden pb-12 pt-6 sm:pb-16 sm:pt-10 md:pb-32 md:pt-24">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div ref={headingRef} className="mx-auto mb-8 flex max-w-6xl items-center gap-4 sm:mb-10">
          <span className="h-px w-10 bg-primary" />
          <span className="shimmer-text text-base font-semibold uppercase tracking-[0.4em] sm:text-lg md:text-xl">
            Projects
          </span>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
