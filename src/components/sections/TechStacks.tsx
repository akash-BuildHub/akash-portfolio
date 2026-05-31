import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileCode2 } from 'lucide-react';
import { prefersReducedMotion } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

interface TechItem {
  name: string;
  logo?: string;
}

interface TechCategory {
  title: string;
  items: TechItem[];
}

const categories: TechCategory[] = [
  {
    title: 'Languages',
    items: [
      { name: 'HTML', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
      { name: 'CSS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
      { name: 'JavaScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
      { name: 'Python', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    ],
  },
  {
    title: 'Artificial Intelligence',
    items: [
      { name: 'Deep Learning', logo: '/icons/deep_learning.png' },
      { name: 'Computer Vision', logo: '/icons/computer_vision.png' },
      { name: 'Machine Learning', logo: '/icons/machine_learning.png' },
    ],
  },
  {
    title: 'Frameworks & APIs',
    items: [
      { name: 'React', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
      { name: 'Node.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
      { name: 'FastAPI', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
      { name: 'API Integration', logo: 'https://cdn-icons-png.flaticon.com/512/906/906334.png' },
    ],
  },
  {
    title: 'Data & Research',
    items: [
      { name: 'Dataset Development', logo: '/icons/dataset_development.png' },
      { name: 'Data Streaming', logo: 'https://cdn.simpleicons.org/apachekafka/FFFFFF' },
      { name: 'Data Analysis', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg' },
      { name: 'Model Evaluation', logo: 'https://cdn.simpleicons.org/weightsandbiases/FFBE00' },
      { name: 'Research Analyst', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg' },
    ],
  },
  {
    title: 'Database',
    items: [
      { name: 'PostgreSQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
      { name: 'Supabase', logo: '/icons/supabase.png' },
    ],
  },
  {
    title: 'Deployment',
    items: [
      { name: 'Vercel', logo: 'https://cdn.simpleicons.org/vercel/FFFFFF' },
      { name: 'Hostinger', logo: 'https://cdn.simpleicons.org/hostinger/673DE6' },
      { name: 'Railway', logo: 'https://cdn.simpleicons.org/railway/FFFFFF' },
      { name: 'Cloud EC2', logo: '/icons/cloud_EC2.png' },
    ],
  },
  {
    title: 'Tools',
    items: [
      { name: 'Git', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Git_icon.svg?v=2' },
      { name: 'Figma', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
    ],
  },
];

const TechBadge = ({ tech }: { tech: TechItem }) => {
  const [logoFailed, setLogoFailed] = useState(false);

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
        <FileCode2 className="h-4 w-4 flex-shrink-0 text-primary" />
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
        <div className="ts-heading mx-auto mb-8 flex max-w-6xl items-center gap-4 sm:mb-10">
          <span className="h-px w-10 bg-primary" />
          <span className="shimmer-text text-base font-semibold uppercase tracking-[0.4em] sm:text-lg md:text-xl">
            Tech Stacks
          </span>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          {categories.map((category) => (
            <div
              key={category.title}
              className="tech-stack-item flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-4 transition-colors duration-300 hover:border-white/20 sm:gap-5 sm:px-6 sm:py-5"
            >
              <h3 className="w-24 flex-shrink-0 text-sm font-semibold leading-snug text-foreground sm:w-44 sm:text-base">
                {category.title}
              </h3>
              <span className="h-8 w-px flex-shrink-0 bg-white/10 sm:h-9" />
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
