import { useEffect, useRef } from "react";
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

  return (
    <div ref={cardRef} className="flip-card h-[280px] w-full">
      <div className="flip-card-inner">
        <div className="flip-card-front flex items-center justify-center rounded-xl border border-border/90 bg-[#0a0a12]/80 p-6 transition-colors hover:border-primary/60">
          <h3 className="gradient-text text-center text-2xl font-bold text-foreground">
            {experience.title}
          </h3>
        </div>

        <div className="flip-card-back flex flex-col justify-center rounded-xl border border-primary/60 bg-[#0a0a12]/20 p-6">
          <h3 className="mb-1 text-xl font-bold text-foreground">{experience.company}</h3>
          {experience.parentCompany && (
            <p className="mb-2 text-sm text-primary">({experience.parentCompany})</p>
          )}
          <p className="mb-4 text-sm text-muted-foreground">
            {experience.location} | {experience.duration}
          </p>
          <p className="text-justify text-sm leading-relaxed text-foreground/80">
            {experience.description}
          </p>
        </div>
      </div>
    </div>
  );
};

const Experience = () => {
  return (
    <section id="experience" className="relative py-24 md:py-32">
      <div className="container relative z-10 mx-auto px-6">
        <h2 className="section-title">Experience</h2>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {experiences.map((exp, index) => (
            <ExperienceCard key={`${exp.company}-${exp.duration}`} experience={exp} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
