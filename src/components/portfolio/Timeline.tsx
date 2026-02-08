import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, Briefcase, TrendingUp, Wrench } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface TimelineProps {
  show: boolean;
}

interface TimelineItem {
  icon: React.ElementType;
  title: string;
  content: string[];
}

const timelineData: TimelineItem[] = [
  {
    icon: GraduationCap,
    title: 'Education',
    content: [
      'HSE – Child Jesus Matriculation Higher Secondary School, Unnamalaikadai [2018 – 2020]',
      'BE (CSE) – Bethlahem Institute of Engineering, Karungal [2020 – 2024]',
    ],
  },
      {
    icon: Briefcase,
    title: 'Career',
    content: [
      '2023 – Academic Project using Deep Learning',
      '2024 – Research Analyst',
      '2025 – Python Developer',
      '2026 – AI Developer',
    ],
  },
  {
    icon: TrendingUp,
    title: 'Personal Journey',
    content: [
      '2020 – Transitioned from school to engineering, building core technical foundations',
      '2023 – Achieved significant research milestones and actively explored career opportunities',
      '2024 – Placed in a Research Analyst role, working on data-driven research tasks',
      '2025 – Exploring opportunities in Web Development and AI technologies',
      '2026 – Focused on building AI-powered computer vision and real-time analytics projects',
    ],
  },
  {
    icon: Wrench,
    title: 'Skills',
    content: [
      'Programming – HTML, CSS, JavaScript, React, Node.js',
      'Backend & Databases – Python, Cloud, API Integration, PostgreSQL',
      'Design – UI/UX (Figma), Graphic/Interior design',
      'AI/Research – Computer vision, Network optimization, Deep Learning, Machine Learning, AI - Recognition | Detection | Classification',
    ],
  },
];

const TimelineItemComponent = ({ item, index }: { item: TimelineItem; index: number }) => {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        itemRef.current,
        { opacity: 0, x: index % 2 === 0 ? -100 : 100 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: itemRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, itemRef);

    return () => ctx.revert();
  }, [index]);

  const isLeft = index % 2 === 0;

  return (
    <div
      ref={itemRef}
      className={`flex items-center gap-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      {/* Content */}
      <div className={`flex-1 ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
        <div className="bg-[#0a0a12]/80 border border-border/50 rounded-xl p-6 transition-all duration-500 inline-block">
          <h3 className="text-xl font-bold gradient-text mb-4">{item.title}</h3>
          <ul className="space-y-2">
            {item.content.map((text, i) => (
              <li key={i} className="text-foreground/80 text-justify leading-relaxed md:leading-[1.8]">
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Icon */}
      <div className="relative flex-shrink-0 z-10">
        <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
          <item.icon className="w-7 h-7 text-primary-foreground" />
        </div>
      </div>

      {/* Spacer for alternating layout */}
      <div className="flex-1 hidden md:block" />
    </div>
  );
};

const Timeline = ({ show }: TimelineProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show) return;

    const ctx = gsap.context(() => {
      // Animate the vertical line
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [show]);

  if (!show) return null;

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="py-24 md:py-32 relative"
    >
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="section-title">My Journey</h2>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <div
            ref={lineRef}
            className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-primary -translate-x-1/2 origin-top hidden md:block"
          />

          {/* Timeline items */}
          <div className="space-y-12">
            {timelineData.map((item, index) => (
              <TimelineItemComponent key={index} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;