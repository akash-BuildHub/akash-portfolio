import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/motion';
import ProjectCard from './ProjectCard';
import ProjectGallery from './ProjectGallery';
import { projects, type Project } from './projects.data';

gsap.registerPlugin(ScrollTrigger);

// How fast the row drifts, in pixels per second.
const DRIFT_SPEED = 45;

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [still] = useState(prefersReducedMotion);
  // The card under the pointer (or keyboard focus) turns gold; none otherwise.
  const [active, setActive] = useState<number | null>(null);
  const [galleryProject, setGalleryProject] = useState<Project | null>(null);

  // The moving row holds the list twice so it can loop; the second copy is
  // hidden from screen readers and the keyboard. With reduced motion the row
  // stays put and scrolls sideways instead.
  const rowItems = [
    ...projects.map((project) => ({ project, clone: false })),
    ...(still ? [] : projects.map((project) => ({ project, clone: true }))),
  ];

  useEffect(() => {
    const row = rowRef.current;
    const track = trackRef.current;
    if (still || !row || !track) return;

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

      // The row slides in from the left as it scrolls into view.
      gsap.from(row, {
        xPercent: -12,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: row, start: 'top 88%', toggleActions: 'play none none reverse' },
      });

      // Endless left-to-right drift: shifting the track by half its width (one
      // copy of the list) lands it back where it started, so the loop is seamless.
      const drift = gsap.fromTo(
        track,
        { xPercent: -50 },
        { xPercent: 0, ease: 'none', repeat: -1, duration: track.scrollWidth / 2 / DRIFT_SPEED }
      );

      // Speed = base (eased to 0 while the row is paused) × a boost from
      // scrolling the page, which fades back out.
      const speed = { base: 1, boost: 0 };
      const update = () => {
        speed.boost *= Math.pow(0.92, gsap.ticker.deltaRatio());
        drift.timeScale(speed.base * (1 + speed.boost));
      };
      gsap.ticker.add(update);
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          speed.boost = Math.max(speed.boost, Math.min(Math.abs(self.getVelocity()) / 300, 6));
        },
      });

      const pause = () => gsap.to(speed, { base: 0, duration: 0.5, ease: 'power2.out', overwrite: true });
      const resume = () => gsap.to(speed, { base: 1, duration: 0.8, ease: 'power2.in', overwrite: true });

      // Keyboard focus stops the row and slides the focused card into view.
      const onFocusIn = (e: FocusEvent) => {
        pause();
        const item = (e.target as HTMLElement).closest<HTMLElement>('[data-row-item]');
        if (!item) return;
        const half = track.scrollWidth / 2;
        const x = Math.min(0, Math.max(-half, (row.clientWidth - item.offsetWidth) / 2 - item.offsetLeft));
        drift.progress((x + half) / half);
      };
      const onFocusOut = (e: FocusEvent) => {
        if (!row.contains(e.relatedTarget as Node | null)) resume();
      };

      row.addEventListener('pointerenter', pause);
      row.addEventListener('pointerleave', resume);
      row.addEventListener('focusin', onFocusIn);
      row.addEventListener('focusout', onFocusOut);
      return () => {
        gsap.ticker.remove(update);
        row.removeEventListener('pointerenter', pause);
        row.removeEventListener('pointerleave', resume);
        row.removeEventListener('focusin', onFocusIn);
        row.removeEventListener('focusout', onFocusOut);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, [still]);

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
      </div>

      {/* One full-width row of cards drifting left to right, faded at both ends */}
      <div
        ref={rowRef}
        className={`relative z-10 mt-10 sm:mt-12 ${
          still
            ? 'overflow-x-auto px-4 sm:px-6'
            : 'overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)]'
        }`}
      >
        <div ref={trackRef} className="flex w-max">
          {rowItems.map(({ project, clone }, index) => (
            <div
              key={`${project.title}${clone ? '-copy' : ''}`}
              data-row-item
              aria-hidden={clone || undefined}
              className="flex w-[80vw] shrink-0 pr-5 sm:w-[340px] sm:pr-6 xl:w-[360px]"
            >
              <ProjectCard
                project={project}
                isClone={clone}
                isActive={active === index}
                onActivate={() => setActive(index)}
                onDeactivate={() => setActive((current) => (current === index ? null : current))}
                onOpenGallery={() => setGalleryProject(project)}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </div>

      <ProjectGallery project={galleryProject} onClose={() => setGalleryProject(null)} />
    </section>
  );
};

export default Projects;
