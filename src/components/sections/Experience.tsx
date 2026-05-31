import { useEffect, useRef, useState } from "react";
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
    company: "Grow Space Innovations",
    parentCompany: "iQue Ventures",
    location: "Madiwala, Bengaluru",
    duration: "2026 - Present",
    description:
      "Developing AI-powered real-time person detection and multi-object tracking systems for live video analytics. Working on end-to-end AI pipelines, including camera stream processing, object detection, tracking logic, action recognition, and performance optimization. Focused on improving detection accuracy, reducing latency, tuning model thresholds, and refining tracking stability for real-world AI deployment.",
  },
  {
    title: "AI Developer",
    company: "Owlytics",
    parentCompany: "iQue Ventures",
    location: "Madiwala, Bengaluru",
    duration: "2025 - 2026",
    description:
      "Designed and deployed AI-powered deep learning models for detection, recognition, and intelligent automation tasks. Built scalable machine learning pipelines from data preprocessing and model training to API integration and production deployment, ensuring seamless performance within backend systems. Focused on improving model accuracy, workflow efficiency, and real-world AI implementation for business-ready solutions.",
  },
  {
    title: "Research Analyst",
    company: "Rpinnacle Research Solutions",
    parentCompany: "Resbee Info Technologies Pvt Ltd",
    location: "Thuckalay, Tamil Nadu",
    duration: "2024 - 2025",
    description:
      "Produced technical documentation and research support for deep learning and data science projects. Worked on dataset analysis, experimental evaluation, model comparison, and performance benchmarking to support AI research workflows. Contributed to preparing structured reports, research summaries, and technical references for model development and validation.",
  },
  {
    title: "Python-Intern",
    company: "Srishti Innovations",
    parentCompany: "Techno Park",
    location: "Thiruvananthapuram, Kerala",
    duration: "July 2023",
    description:
      "Learned the fundamentals of Python programming through an internship training program. Developed a strong understanding of basic syntax, variables, data types, conditional statements, loops, functions, and beginner-level problem-solving through hands-on coding practice.",
  },
  {
    title: "Inplant Training",
    company: "iTrobes Technologies Pvt. Ltd.",
    location: "Marthandam, Tamil Nadu",
    duration: "July 2022",
    description:
      "Gained industry exposure through in-plant training at ITrobes Technologies Pvt. Ltd., understanding software development practices, company workflows, team collaboration, and real-world IT project environments.",
  },
];

const Experience = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const activeExp = experiences[active];

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current?.querySelectorAll("[data-reveal]") ?? [],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Reveal the active experience's description line-by-line whenever it changes.
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".exp-desc",
        { clipPath: "inset(0 0 100% 0)", opacity: 0 },
        {
          clipPath: "inset(0 0 0% 0)",
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [active]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative overflow-hidden pb-14 pt-8 sm:pb-16 sm:pt-10 md:pb-24 md:pt-16 lg:pb-32 lg:pt-24"
    >
      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div data-reveal className="mx-auto flex max-w-6xl items-center gap-4">
          <span className="h-px w-10 bg-primary" />
          <span className="shimmer-text text-base font-semibold uppercase tracking-[0.4em] sm:text-lg md:text-xl">
            My Experience
          </span>
        </div>

        <div className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-10 sm:mt-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          {/* Stacked, highlight-on-active list of companies */}
          <div className="flex flex-col gap-6 sm:gap-8 md:gap-10">
            {experiences.map((exp, i) => (
              <button
                key={`${exp.company}-${exp.duration}`}
                type="button"
                data-reveal
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className="group flex items-baseline gap-3 text-left sm:gap-4"
              >
                <h3
                  className={`text-xl font-extrabold uppercase leading-[1.1] tracking-tight transition-colors duration-300 sm:text-2xl md:text-3xl ${
                    active === i ? "text-white" : "text-white/20 group-hover:text-white/45"
                  }`}
                >
                  {exp.title}
                </h3>
              </button>
            ))}
          </div>

          {/* Detail panel for the active item */}
          <div data-reveal className="lg:pt-1">
            <div key={active} className="animate-fade-in">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary sm:text-base">
                {activeExp.company}
              </p>
              {activeExp.parentCompany && (
                <p className="mt-1.5 text-xs uppercase tracking-[0.2em] text-foreground/45">
                  {activeExp.parentCompany}
                </p>
              )}
              <p className="mt-3 text-sm tracking-wide text-foreground/55">
                {activeExp.location}
              </p>
              <p className="mt-1 text-sm font-medium tracking-wide text-foreground/80">
                {activeExp.duration}
              </p>
              <div className="mt-6 h-px w-12 bg-primary" />
              <p className="exp-desc mt-6 text-sm leading-[1.9] text-foreground/75 text-justify">
                {activeExp.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
