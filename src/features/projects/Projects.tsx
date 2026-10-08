import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/motion';
import ProjectCard from './ProjectCard';
import ProjectGallery from './ProjectGallery';
import { projects, type Project } from './projects.data';

gsap.registerPlugin(ScrollTrigger);

// From xl up the grid has 8 tracks and each card spans 2 (four per row). A
// last row holding fewer than four cards is shifted right so it sits centered.
const GRID_PLACEMENT =
  'xl:col-span-2 xl:[&:nth-child(4n+1):nth-last-child(3)]:col-start-2 xl:[&:nth-child(4n+1):nth-last-child(2)]:col-start-3 xl:[&:nth-child(4n+1):last-child]:col-start-4';

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  // The card under the pointer (or keyboard focus) turns gold; none otherwise.
  const [active, setActive] = useState<number | null>(null);
  const [galleryProject, setGalleryProject] = useState<Project | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.projects-heading',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '.projects-heading',
            start: 'top 90%',
            end: 'top 65%',
            scrub: 1,
          },
        }
      );

      // Cards rise in a row at a time as they scroll into view.
      gsap.set('.project-card', { opacity: 0, y: 60 });
      ScrollTrigger.batch('.project-card', {
        start: 'top 90%',
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.12,
            overwrite: true,
          }),
        onLeaveBack: (batch) =>
          gsap.to(batch, { opacity: 0, y: 60, duration: 0.4, ease: 'power2.in', overwrite: true }),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative overflow-hidden pb-12 pt-6 sm:pb-16 sm:pt-10 md:pb-32 md:pt-24"
    >
      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        {/* Heading: two-tone title and a short intro above a full-width rule */}
        <div className="projects-heading">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12">
            <h2 className="text-3xl font-extrabold uppercase leading-[0.95] tracking-[0.04em] text-white sm:text-4xl md:text-5xl">
              My <span className="text-primary">Projects</span>
            </h2>
            <p className="max-w-sm text-justify text-sm leading-[1.8] tracking-wide text-foreground/55">
              Real-time computer vision systems, AI-powered tools and full-stack
              business applications, built end to end.
            </p>
          </div>
          <div className="mt-8 h-px w-full bg-white/10 sm:mt-10" />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 md:grid-cols-2 xl:grid-cols-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              isActive={active === index}
              onActivate={() => setActive(index)}
              onDeactivate={() => setActive((current) => (current === index ? null : current))}
              onOpenGallery={() => setGalleryProject(project)}
              className={GRID_PLACEMENT}
            />
          ))}
        </div>
      </div>

      <ProjectGallery project={galleryProject} onClose={() => setGalleryProject(null)} />
    </section>
  );
};

export default Projects;
