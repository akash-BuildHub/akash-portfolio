import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Activity,
  Atom,
  BarChart3,
  BrainCircuit,
  Braces,
  ClipboardCheck,
  CloudCog,
  Cpu,
  Database,
  FileCode2,
  FileSearch,
  Network,
  Paintbrush,
  PlugZap,
  ScanEye,
  ServerCog,
  Workflow,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface TechItem {
  name: string;
  icon?: React.ElementType;
  logo?: string;
}

const techStacks: TechItem[] = [
  { name: 'HTML', logo: 'https://cdn.simpleicons.org/html5/E34F26', icon: FileCode2 },
  { name: 'CSS', logo: 'https://cdn.simpleicons.org/css/1572B6', icon: Paintbrush },
  { name: 'React', logo: 'https://cdn.simpleicons.org/react/61DAFB', icon: Atom },
  { name: 'FastAPI', logo: 'https://cdn.simpleicons.org/fastapi/009688', icon: Workflow },
  { name: 'Python', logo: 'https://cdn.simpleicons.org/python/3776AB', icon: FileCode2 },
  { name: 'JavaScript', logo: 'https://cdn.simpleicons.org/javascript/F7DF1E', icon: Braces },
  { name: 'Node.js', logo: 'https://cdn.simpleicons.org/nodedotjs/5FA04E', icon: ServerCog },
  { name: 'PostgreSQL', logo: 'https://cdn.simpleicons.org/postgresql/4169E1', icon: Database },
  { name: 'Data Analysis', logo: 'https://cdn.simpleicons.org/chartdotjs/FF6384', icon: BarChart3 },
  { name: 'API Integration', logo: 'https://cdn.simpleicons.org/postman/FF6C37', icon: PlugZap },
  { name: 'Data Handling', logo: 'https://cdn.simpleicons.org/googlecloud/4285F4', icon: CloudCog },
  { name: 'Research Analyst', logo: 'https://cdn.simpleicons.org/readthedocs/8CA1AF', icon: FileSearch },
  { name: 'Model Evaluation', logo: 'https://cdn.simpleicons.org/weightsandbiases/FFBE00', icon: ClipboardCheck },
  { name: 'Artificial Intelligence', logo: 'https://img.icons8.com/ios-filled/100/FFFFFF/artificial-intelligence.png', icon: BrainCircuit },
  { name: 'Machine Learning', logo: 'https://cdn.simpleicons.org/scikitlearn/F7931E', icon: Cpu },
  { name: 'Deep Learning', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg', icon: Network },
  { name: 'Computer Vision', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg', icon: ScanEye },
  { name: 'Real-Time Processing', logo: 'https://cdn.simpleicons.org/apachekafka/FFFFFF', icon: Activity },
];

const TechIcon = ({ tech }: { tech: TechItem }) => {
  const [logoFailed, setLogoFailed] = useState(false);
  const Icon = tech.icon ?? FileCode2;

  if (tech.logo && !logoFailed) {
    return (
      <img
        src={tech.logo}
        alt={`${tech.name} icon`}
        className="w-8 h-8 object-contain flex-shrink-0"
        loading="lazy"
        onError={() => setLogoFailed(true)}
      />
    );
  }

  return (
    <div className="w-8 h-8 rounded-md gradient-primary flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5 text-primary-foreground" />
    </div>
  );
};

const TechStacks = () => {
  const sectionRef = useRef<HTMLElement>(null);

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
