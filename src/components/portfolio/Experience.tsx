import {
  useEffect,
  useRef,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

interface ExperienceItem {
  title: string;
  company: string;
  parentCompany?: string;
  location: string;
  duration: string;
  description: string;
}

const experiences: ExperienceItem[] = [
  {
    title: "AI Developer",
    company: "GROW AI",
    parentCompany: "iQue Ventures",
    location: "Madiwala, Bengaluru",
    duration: "2026 - Present",
    description:
      "Building real-time person detection and multi-object tracking systems for live video analytics, optimizing end-to-end stream processing and improving accuracy through threshold tuning and tracking refinement.",
  },
  {
    title: "AI Developer",
    company: "Owlytics",
    parentCompany: "iQue Ventures",
    location: "Madiwala, Bengaluru",
    duration: "2025 - 2026",
    description:
      "Designed and deployed deep learning models for detection and recognition tasks, building scalable ML pipelines from preprocessing to deployment and integrating AI solutions seamlessly into production backend systems.",
  },
  {
    title: "Research Analyst",
    company: "Rpinnacle Research Solutions",
    parentCompany: "Resbee",
    location: "Thuckalay, Tamil Nadu",
    duration: "2024 - 2025",
    description:
      "Produced technical documentation for deep learning and data science research, contributing to dataset analysis, experimental evaluation, and comparative model benchmarking.",
  },
  {
    title: "Python-Intern",
    company: "Srishti Innovations",
    parentCompany: "Techno Park",
    location: "Thiruvananthapuram, Kerala",
    duration: "July 2023",
    description:
      "Enhanced Python programming skills and explored software development methodologies through hands-on projects and practical applications.",
  },
  {
    title: "Inplant Training",
    company: "iTrobes Technologies Pvt. Ltd.",
    location: "Marthandam, Tamil Nadu",
    duration: "July 2022",
    description:
      "Gained industry exposure to software development practices and team collaboration, strengthening practical understanding of real-world workflows.",
  },
];

const ExperienceCard = ({
  experience,
  index,
}: {
  experience: ExperienceItem;
  index: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const hasFinePointer =
    typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  const handleCardMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion() || !hasFinePointer || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = ((event.clientX - centerX) / rect.width) * 8;
    const rotateX = -((event.clientY - centerY) / rect.height) * 8;

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      y: -4,
      duration: 0.2,
      ease: "power2.out",
      transformPerspective: 1000,
      transformOrigin: "center",
      overwrite: "auto",
    });
  };

  const handleCardMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      y: 0,
      duration: 0.25,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  return (
    <div
      ref={cardRef}
      className="flip-card h-[320px] w-full cursor-pointer touch-manipulation sm:h-[310px]"
      onMouseMove={handleCardMouseMove}
      onMouseLeave={handleCardMouseLeave}
      aria-label={`${experience.title} at ${experience.company}`}
    >
      <div className="flip-card-inner">
        <div className="flip-card-front flex items-center justify-center rounded-xl border border-border/90 bg-[#0a0a12]/80 p-6 transition-all duration-300 hover:border-primary/60 hover:shadow-[0_0_26px_rgba(168,85,247,0.2)]">
          <h3 className="gradient-text text-center text-2xl font-bold text-foreground">
            {experience.title}
          </h3>
        </div>

        <div className="flip-card-back flex flex-col justify-center rounded-xl border border-border/90 bg-card/95 p-6 dark:border-primary/60 dark:bg-[#0a0a12]/20">
          <h3 className="mb-1 text-xl font-bold text-foreground">{experience.company}</h3>
          {experience.parentCompany && (
            <p className="mb-2 text-sm text-primary">({experience.parentCompany})</p>
          )}
          <p className="mb-4 text-sm text-foreground/70 dark:text-muted-foreground">
            {experience.location} | {experience.duration}
          </p>
          <p className="text-justify text-sm leading-relaxed text-foreground/85 dark:text-foreground/80">
            {experience.description}
          </p>
        </div>
      </div>
    </div>
  );
};

const Experience = () => {
  return (
    <section id="experience" className="relative py-20 md:py-32">
      <div className="container relative z-10 mx-auto px-6">
        <h2 className="section-title">Experience</h2>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {experiences.map((exp, index) => (
            <ExperienceCard
              key={`${exp.company}-${exp.duration}`}
              experience={exp}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
