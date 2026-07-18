import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FileCode2,
  ScanFace,
  ScanSearch,
  Radar,
  Activity,
  Images,
  Gauge,
  Server,
  Webhook,
  Cable,
  KeyRound,
  BarChart3,
  Radio,
  Film,
  FileVideo,
  Cctv,
  Network,
  Infinity as InfinityIcon,
  type LucideIcon,
} from 'lucide-react';
import { prefersReducedMotion } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

interface TechItem {
  name: string;
  logo?: string;
  icon?: LucideIcon;
}

interface TechCategory {
  title: string;
  items: TechItem[];
}

const devicon = (slug: string, variant = 'original') =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-${variant}.svg`;
const simple = (slug: string) => `https://cdn.simpleicons.org/${slug}`;

const categories: TechCategory[] = [
  {
    title: 'AI & Computer Vision',
    items: [
      { name: 'Machine Learning', logo: '/icons/machine_learning.png' },
      { name: 'Deep Learning', logo: '/icons/deep_learning.png' },
      { name: 'Computer Vision', logo: '/icons/computer_vision.png' },
      { name: 'Image Classification', icon: Images },
      { name: 'Object Detection', icon: ScanSearch },
      { name: 'Face Detection & Recognition', icon: ScanFace },
      { name: 'Multi-Object Tracking (MOT)', icon: Radar },
      { name: 'Action Recognition', icon: Activity },
      { name: 'Model Optimization', icon: Gauge },
    ],
  },
  {
    title: 'AI/ML Frameworks & Libraries',
    items: [
      { name: 'PyTorch', logo: devicon('pytorch') },
      { name: 'TensorFlow', logo: devicon('tensorflow') },
      { name: 'Keras', logo: devicon('keras') },
      { name: 'OpenCV', logo: devicon('opencv') },
      { name: 'YOLO', logo: `${simple('ultralytics')}/white` },
      { name: 'InsightFace (SCRFD, ArcFace)', icon: ScanFace },
      { name: 'ONNX Runtime (GPU / CUDA)', logo: simple('onnx') },
      { name: 'NumPy', logo: devicon('numpy') },
      { name: 'Pillow', icon: Images },
    ],
  },
  {
    title: 'Languages',
    items: [
      { name: 'HTML5', logo: devicon('html5') },
      { name: 'CSS3', logo: devicon('css3') },
      { name: 'JavaScript (ES2022)', logo: devicon('javascript') },
      { name: 'TypeScript', logo: devicon('typescript') },
      { name: 'SQL', logo: devicon('azuresqldatabase') },
      { name: 'Python', logo: devicon('python') },
    ],
  },
  {
    title: 'Backend',
    items: [
      { name: 'FastAPI', logo: devicon('fastapi') },
      { name: 'Flask', logo: devicon('flask') },
      { name: 'Pydantic', logo: simple('pydantic') },
      { name: 'SQLAlchemy (ORM)', logo: devicon('sqlalchemy') },
      { name: 'Uvicorn (ASGI)', icon: Server },
      { name: 'RESTful API Design', icon: Webhook },
      { name: 'WebSocket APIs', icon: Cable },
      { name: 'JWT Auth', logo: `${simple('jsonwebtokens')}/white` },
      { name: 'Bcrypt', icon: KeyRound },
    ],
  },
  {
    title: 'Video & Streaming',
    items: [
      { name: 'RTSP', icon: Radio },
      { name: 'ONVIF', icon: Cctv },
      { name: 'WebRTC (aiortc)', logo: `${simple('webrtc')}/white` },
      { name: 'PyAV / FFmpeg', logo: simple('ffmpeg') },
      { name: 'NVDEC / libx264', logo: simple('nvidia') },
      { name: 'MJPEG', icon: Film },
      { name: 'MSE / FMP4', icon: FileVideo },
      { name: 'Live Multi-Camera Pipelines', icon: Network },
    ],
  },
  {
    title: 'Frontend',
    items: [
      { name: 'React 19', logo: devicon('react') },
      { name: 'TypeScript', logo: devicon('typescript') },
      { name: 'Vite', logo: devicon('vitejs') },
      { name: 'Tailwind CSS', logo: devicon('tailwindcss') },
      { name: 'TanStack Router', logo: `${simple('tanstack')}/white` },
      { name: 'TanStack Query', logo: simple('reactquery') },
      { name: 'React Hook Form', logo: simple('reacthookform') },
      { name: 'Zod', logo: simple('zod') },
      { name: 'Radix UI', logo: `${simple('radixui')}/white` },
      { name: 'Recharts', icon: BarChart3 },
    ],
  },
  {
    title: 'Databases & Cloud',
    items: [
      { name: 'PostgreSQL', logo: devicon('postgresql') },
      { name: 'SQLite', logo: devicon('sqlite') },
      { name: 'Supabase', logo: '/icons/supabase.png' },
      { name: 'AWS EC2', logo: '/icons/cloud_EC2.png' },
      { name: 'Railway', logo: devicon('railway') },
      { name: 'Cloudflare', logo: devicon('cloudflare') },
    ],
  },
  {
    title: 'DevOps & Tools',
    items: [
      { name: 'Git', logo: devicon('git') },
      { name: 'GitHub', logo: devicon('github') },
      { name: 'Docker', logo: devicon('docker') },
      { name: 'CI/CD', icon: InfinityIcon },
    ],
  },
];

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
          {categories.map((category) => (
            <div
              key={category.title}
              className="tech-stack-item beam-border flex items-start gap-3 rounded-2xl bg-white/[0.03] px-4 py-4 sm:gap-5 sm:px-6 sm:py-5"
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
