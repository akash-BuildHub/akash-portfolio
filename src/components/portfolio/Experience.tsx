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
      "Designed and deployed deep learning models for detection and recognition tasks, building scalable ML pipelines from preprocessing to deployment and integrating AI solutions seamlessly into production backend systems.",
  },
  {
    title: "Research Analyst",
    company: "Rpinnacle Research Solutions",
    parentCompany: "Resbee Info Technologies Pvt Ltd",
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

      // Pin the section and step through each experience as the user scrolls.
      if (window.matchMedia("(min-width: 1024px)").matches) {
        let lastIdx = -1;
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: () => "+=" + (experiences.length - 1) * 300,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.round(self.progress * (experiences.length - 1));
            if (idx !== lastIdx) {
              lastIdx = idx;
              setActive(idx);
            }
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative overflow-hidden pb-14 pt-8 sm:pb-16 sm:pt-10 md:pb-24 md:pt-16 lg:pb-32 lg:pt-24"
    >
      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div data-reveal className="mx-auto flex max-w-6xl items-center gap-4">
          <span className="h-px w-10 bg-primary" />
          <span className="text-base font-semibold uppercase tracking-[0.4em] text-foreground/60 sm:text-lg md:text-xl">
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
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
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
              <p className="mt-6 text-sm leading-[1.9] text-foreground/75">
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
