import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GraduationCap, Briefcase, TrendingUp, Wrench } from "lucide-react";
import { prefersReducedMotion } from "@/lib/motion";

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
    title: "Education",
    content: [
      "HSE - Child Jesus Matriculation Higher Secondary School, Unnamalaikadai [2018 - 2020]",
      "BE (CSE) - Bethlahem Institute of Engineering, Karungal [2020 - 2024]",
    ],
  },
  {
    icon: Briefcase,
    title: "Career",
    content: [
      "2023 - Academic Project using Deep Learning",
      "2024 - Research Analyst",
      "2025 - Python Developer",
      "2026 - AI Developer",
    ],
  },
  {
    icon: TrendingUp,
    title: "Personal Journey",
    content: [
      "2020 - Transitioned from school to engineering, building core technical foundations",
      "2023 - Achieved significant research milestones and actively explored career opportunities",
      "2024 - Placed in a Research Analyst role, working on data-driven research tasks",
      "2025 - Exploring opportunities in Web Development and AI technologies",
      "2026 - Focused on building AI-powered computer vision and real-time analytics projects",
    ],
  },
  {
    icon: Wrench,
    title: "Skills",
    content: [
      "Frontend Development",
      "Backend Development",
      "Databases & Cloud Services",
      "Artificial Intelligence",
      "Computer Vision Models",
      "Optimization & Performance Tuning",
      "Real-Time Video Streaming",
      "DevOps & Version Control",
    ],
  },
];

const TimelineItemComponent = ({
  item,
  index,
}: {
  item: TimelineItem;
  index: number;
}) => {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        itemRef.current,
        { opacity: 0, x: index % 2 === 0 ? -100 : 100 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: itemRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, itemRef);

    return () => ctx.revert();
  }, [index]);

  const isLeft = index % 2 === 0;

  return (
    <div
      ref={itemRef}
      className={`flex flex-col gap-4 md:items-center md:gap-8 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
    >
      <div className={`flex-1 ${isLeft ? "md:text-right" : "md:text-left"}`}>
        <div className="inline-block rounded-xl border border-border/90 bg-[#0a0a12]/80 p-6 transition-all duration-500">
          <h3 className="gradient-text mb-4 text-xl font-bold">{item.title}</h3>
          <ul className="space-y-2">
            {item.content.map((text, i) => {
              const [lead, ...rest] = text.split(" - ");
              return (
                <li key={`${item.title}-${i}`} className="break-words text-justify leading-[1.55] text-foreground/80 md:leading-[1.7]">
                  {rest.length > 0 ? (
                    <>
                      <strong className="text-foreground">{lead}</strong> - {rest.join(" - ")}
                    </>
                  ) : (
                    text
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="relative z-10 shrink-0 self-center">
        <div className="gradient-primary flex h-16 w-16 items-center justify-center rounded-full">
          <item.icon className="h-7 w-7 text-primary-foreground" />
        </div>
      </div>

      <div className="hidden flex-1 md:block" />
    </div>
  );
};

const Timeline = ({ show }: TimelineProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [show]);

  if (!show) return null;

  return (
    <section id="timeline" ref={sectionRef} className="relative py-24 md:py-32">
      <div className="container relative z-10 mx-auto px-6">
        <h2 className="section-title">My Journey</h2>

        <div className="relative mx-auto max-w-4xl">
          <div
            ref={lineRef}
            className="absolute bottom-0 left-1/2 top-0 hidden w-1 -translate-x-1/2 origin-top bg-gradient-to-b from-primary via-accent to-primary md:block"
          />

          <div className="space-y-12">
            {timelineData.map((item, index) => (
              <TimelineItemComponent key={`${item.title}-${index}`} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
