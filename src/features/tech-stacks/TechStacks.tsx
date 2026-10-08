import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileCode2 } from 'lucide-react';
import { prefersReducedMotion } from '@/lib/motion';
import { categories, type TechItem } from './techStacks.data';

gsap.registerPlugin(ScrollTrigger);

const TechBadge = ({ tech }: { tech: TechItem }) => {
  const [logoFailed, setLogoFailed] = useState(false);
  const FallbackIcon = tech.icon ?? FileCode2;

  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-2.5 py-1.5 transition-colors duration-200 hover:border-white/25 hover:bg-white/[0.1]">
      {tech.logo && !logoFailed ? (
        <img
          src={tech.logo}
          alt=""
          className="h-4 w-4 flex-shrink-0 object-contain sm:h-[18px] sm:w-[18px]"
          loading="lazy"
          decoding="async"
          onError={() => setLogoFailed(true)}
        />
      ) : (
        <FallbackIcon className="h-4 w-4 flex-shrink-0 text-primary sm:h-[18px] sm:w-[18px]" />
      )}
      <span className="whitespace-nowrap text-xs font-medium text-foreground/80">
        {tech.name}
      </span>
    </div>
  );
};

const TechStacks = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.ts-heading',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        '.tech-stack-item',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="tech-stacks" ref={sectionRef} className="relative py-12 sm:py-16 md:py-24 lg:py-32">
      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="ts-heading mx-auto mb-8 flex max-w-7xl items-center gap-4 sm:mb-10">
          <span className="h-px w-10 bg-primary" />
          <span className="shimmer-text text-base font-semibold uppercase tracking-[0.4em] sm:text-lg md:text-xl">
            Tech Stacks
          </span>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          {/* An odd card out at the end spans both columns so the grid stays even */}
          {categories.map((category) => (
            <div
              key={category.title}
              className="tech-stack-item beam-border flex items-start gap-3 rounded-2xl bg-white/[0.03] px-4 py-4 sm:gap-5 sm:px-6 sm:py-5 md:odd:last:col-span-2"
            >
              {['beam-top', 'beam-right', 'beam-bottom', 'beam-left'].map((edge) => (
                <span key={edge} aria-hidden="true" className={`beam-line ${edge}`} />
              ))}
              <h3 className="w-24 flex-shrink-0 text-sm font-semibold leading-snug text-foreground sm:w-44 sm:text-base">
                {category.title}
              </h3>
              <span className="w-px flex-shrink-0 self-stretch bg-white/10" />
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {category.items.map((tech) => (
                  <TechBadge key={tech.name} tech={tech} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStacks;
