import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

interface HeroProps {
  setShowTimeline: (show: boolean) => void;
}

const HEADLINE = "My Universe";
const ROLE = "AI Developer";

const Hero = ({ setShowTimeline }: HeroProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [typedRole, setTypedRole] = useState(() =>
    prefersReducedMotion() ? ROLE : "",
  );

  const scrollToTimeline = () => {
    setShowTimeline(true);
    requestAnimationFrame(() => {
      const section = document.getElementById("timeline");
      section?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    });
  };

  // Entrance: staggered fade-up for the column + a character cascade on the headline.
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".hero-reveal", { opacity: 0, y: 24, duration: 0.7, stagger: 0.09 })
        .from(
          ".hero-char",
          {
            opacity: 0,
            yPercent: 120,
            duration: 1.1,
            ease: "power3.out",
            stagger: 0.08,
          },
          0.25,
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Typewriter effect for the role line.
  useEffect(() => {
    if (prefersReducedMotion()) return;

    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTypedRole(ROLE.slice(0, i));
      if (i >= ROLE.length) window.clearInterval(id);
    }, 95);

    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden pb-16 pt-28 sm:py-24 md:py-28 lg:py-32"
      aria-label="Hero section"
    >
      {/* Profile image as the home section background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-no-repeat opacity-30"
        style={{
          backgroundImage: "url('/akash_profile.jpeg')",
          backgroundPosition: "114% 12%",
          backgroundSize: "66%",
        }}
      />

      {/* Giant faint watermark */}
      <span
        aria-hidden="true"
        className="watermark-fade pointer-events-none absolute left-0 top-[78%] -z-0 -translate-y-1/2 scale-y-75 select-none whitespace-nowrap text-[24vw] font-extrabold uppercase leading-none tracking-[0.1em] text-white/[0.04]"
      >
        Akash
      </span>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">
          {/* Left: editorial text column */}
          <div className="text-left">
            {/* Vertical indicator: dot + line + label */}
            <div className="hero-reveal mb-8 flex items-center gap-4 lg:mb-10">
              <span className="flex flex-col items-center gap-2">
                <span className="h-2 w-2 rounded-full border border-primary" />
                <span className="h-10 w-px bg-gradient-to-b from-primary/70 to-transparent" />
              </span>
              <span className="text-[0.7rem] font-medium uppercase tracking-[0.4em] text-foreground/55">
                Portfolio
              </span>
            </div>

            <p className="hero-reveal shimmer-text mb-3 text-sm font-medium uppercase tracking-[0.35em]">
              Welcome to
            </p>

            <h1
              aria-label={`${HEADLINE}°`}
              className="text-5xl font-extrabold uppercase leading-[0.9] tracking-[0.06em] text-white sm:text-6xl md:text-7xl lg:text-8xl"
            >
              {HEADLINE.split("").map((ch, i) => (
                <span key={i} aria-hidden="true" className="hero-char inline-block">
                  {ch === " " ? " " : ch}
                </span>
              ))}
              <span aria-hidden="true" className="hero-char inline-block text-primary">
                &#176;
              </span>
            </h1>

            <div className="hero-reveal mt-7 flex items-center gap-4 sm:mt-9">
              <span className="h-px w-12 bg-primary sm:w-16" />
              <h2
                aria-label={ROLE}
                className="text-sm font-semibold uppercase tracking-[0.28em] text-foreground/85 sm:text-base"
              >
                <span aria-hidden="true">{typedRole}</span>
                <span
                  aria-hidden="true"
                  className="ml-1 inline-block h-[1em] w-[2px] animate-pulse bg-primary align-middle"
                />
              </h2>
            </div>

            <div className="hero-reveal mt-6 max-w-md text-xs uppercase leading-[2.1] tracking-[0.18em] text-foreground/55 sm:text-sm">
              <p>Think it, let the AI do it.</p>
              <p className="mt-5">
                Designing, building, and deploying intelligent systems for
                real-world applications.
              </p>
            </div>

            <button
              onClick={scrollToTimeline}
              className="group mt-6 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary transition sm:mt-8"
              aria-label="Explore timeline section"
            >
              Explore
              <span className="h-px w-10 bg-primary transition-all duration-300 group-hover:w-16" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
