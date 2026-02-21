import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileCode2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface TechItem {
  name: string;
  logo?: string;
}

const techStacks: TechItem[] = [
  { name: 'HTML', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
  { name: 'CSS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
  { name: 'JavaScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'Node.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { name: 'React', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Figma', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
  { name: 'FastAPI', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
  { name: 'API Integration', logo: 'https://cdn-icons-png.flaticon.com/512/906/906334.png' },
  { name: 'Python', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'PostgreSQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  { name: 'Git', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Git_icon.svg?v=2' },
  { name: 'Research Analyst', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg' },
  { name: 'Dataset Development', logo: '/icons/dataset_development.png' },
  { name: 'Data Streaming', logo: 'https://cdn.simpleicons.org/apachekafka/FFFFFF' },
  { name: 'Data Analysis', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg' },
  { name: 'Model Evaluation', logo: 'https://cdn.simpleicons.org/weightsandbiases/FFBE00' },
  { name: 'Machine Learning', logo: '/icons/machine_learning.png' },
  { name: 'Deep Learning', logo: '/icons/deep_learning.png' },
  { name: 'Computer Vision', logo: '/icons/computer_vision.png' },
  { name: 'Artificial Intelligence', logo: '/icons/AI.png' },
];

const TechIcon = ({ tech }: { tech: TechItem }) => {
  const [logoFailed, setLogoFailed] = useState(false);

  if (tech.logo && !logoFailed) {
    return (
      <div className="tech-icon-float">
        <img
          src={tech.logo}
          alt={`${tech.name} icon`}
          className="tech-icon-visual w-8 h-8 object-contain flex-shrink-0 will-change-transform"
          loading="lazy"
          onError={() => setLogoFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className="tech-icon-float">
      <div className="tech-icon-visual w-8 h-8 rounded-md gradient-primary flex items-center justify-center flex-shrink-0 will-change-transform">
        <FileCode2 className="w-5 h-5 text-primary-foreground" />
      </div>
    </div>
  );
};

const TechStacks = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const handleIconHoverIn = (event: MouseEvent<HTMLDivElement>) => {
    const icon = event.currentTarget.querySelector('.tech-icon-visual');
    if (!icon) return;

    gsap.to(icon, {
      y: -6,
      scale: 1.08,
      duration: 0.22,
      ease: 'power2.out',
      filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.45))',
      overwrite: 'auto',
    });
  };

  const handleIconHoverOut = (event: MouseEvent<HTMLDivElement>) => {
    const icon = event.currentTarget.querySelector('.tech-icon-visual');
    if (!icon) return;

    gsap.to(icon, {
      y: 0,
      scale: 1,
      duration: 0.22,
      ease: 'power2.out',
      filter: 'drop-shadow(0 0 0 rgba(59, 130, 246, 0))',
      overwrite: 'auto',
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.tech-stack-item',
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: 'power2.out',
          stagger: 0.04,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      const floatTargets = gsap.utils.toArray<HTMLElement>('.tech-icon-float');
      floatTargets.forEach((target) => {
        const drift = gsap.utils.random(2, 4, 0.1);
        const duration = gsap.utils.random(1.8, 2.8, 0.1);
        const delay = gsap.utils.random(0, 0.8, 0.1);

        gsap.to(target, {
          y: -drift,
          repeat: -1,
          yoyo: true,
          duration,
          delay,
          ease: 'sine.inOut',
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="tech-stacks" ref={sectionRef} className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="section-title">Tech Stacks</h2>

        <div className="max-w-4xl mx-auto bg-[#0a0a12]/70 border border-border/90 rounded-2xl px-4 py-6 md:px-6 md:py-7 overflow-x-hidden">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:grid-rows-4">
            {techStacks.map((tech) => (
              <div
                key={tech.name}
                className="tech-stack-item flex flex-col items-center justify-start text-center gap-2 min-h-[84px] min-w-0"
                onMouseEnter={handleIconHoverIn}
                onMouseLeave={handleIconHoverOut}
              >
                <TechIcon tech={tech} />
                <p className="text-xs md:text-sm font-medium text-foreground leading-tight break-words">
                  {tech.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStacks;
