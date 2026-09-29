import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";
import { experiences } from "./experience.data";

gsap.registerPlugin(ScrollTrigger);

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

  // Reveal the active experience's description whenever it changes.
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
      className="relative overflow-hidden pb-14 pt-2 sm:pb-16 sm:pt-3 md:pb-24 md:pt-6 lg:pb-32 lg:pt-10"
    >
      {/* experience network graphic anchored to the left, fading toward the center */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-0 w-2/3 bg-left bg-contain bg-no-repeat opacity-10 sm:w-1/2 lg:w-2/5"
        style={{
          backgroundImage: "url('/experience.png')",
          filter: "invert(1)",
          WebkitMaskImage:
            "linear-gradient(to right, rgba(0,0,0,1), transparent 85%)",
          maskImage:
            "linear-gradient(to right, rgba(0,0,0,1), transparent 85%)",
        }}
      />
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
              <ul className="exp-desc mt-6 space-y-3 text-sm leading-[1.7] text-foreground/75">
                {activeExp.description.map((point, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="mt-[0.5rem] h-1 w-1 flex-shrink-0 rounded-full bg-primary/70" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
