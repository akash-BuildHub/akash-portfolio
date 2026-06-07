import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eye, Cpu, Brain, Rocket } from "lucide-react";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

// Headline split into colored segments so the typing effect can preserve the
// two-tone styling while revealing one character at a time.
const headlineSegments = [
  { text: "Hey, I'm ", className: "text-foreground/50" },
  { text: "Akash", className: "text-white" },
  {
    text:
      " — I build intelligent computer vision systems that transform visual data into ",
    className: "text-foreground/50",
  },
  {
    text: "faster decisions and smarter automation.",
    className: "text-white",
  },
];
const headlineText = headlineSegments.map((s) => s.text).join("");
const headlineLength = headlineText.length;

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const hasTypedRef = useRef(false);
  const [typedCount, setTypedCount] = useState(0);

  // Type the headline out, one character at a time, when it scrolls into view.
  useEffect(() => {
    if (prefersReducedMotion()) {
      setTypedCount(headlineLength);
      return;
    }

    let intervalId: number | undefined;

    const startTyping = () => {
      if (hasTypedRef.current) return;
      hasTypedRef.current = true;
      intervalId = window.setInterval(() => {
        setTypedCount((prev) => {
          if (prev >= headlineLength) {
            if (intervalId) window.clearInterval(intervalId);
            return headlineLength;
          }
          return prev + 1;
        });
      }, 45);
    };

    const trigger = ScrollTrigger.create({
      trigger: headlineRef.current,
      start: "top 72%",
      onEnter: startTyping,
    });

    return () => {
      if (intervalId) window.clearInterval(intervalId);
      trigger.kill();
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: prefersReducedMotion() ? 0 : 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        },
      );

      if (!prefersReducedMotion()) {
        gsap.fromTo(
          ".about-line",
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 68%",
              toggleActions: "play none none reverse",
            },
          },
        );

        gsap.fromTo(
          ".about-highlight",
          { opacity: 0, x: -36, y: 12 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.4,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const highlights = [
    { icon: Brain, label: "Deep Learning" },
    { icon: Eye, label: "Computer Vision" },
    { icon: Cpu, label: "Machine Learning" },
    { icon: Rocket, label: "AI Implementation" },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden py-16 sm:py-20 md:py-28 lg:py-36"
    >
      {/* aboutme image anchored to the left end, fading toward the center */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-0 w-3/4 bg-contain bg-left bg-no-repeat opacity-40 sm:w-2/3 lg:w-1/2 lg:bg-[length:auto_135%] lg:bg-[position:left_15%]"
        style={{
          backgroundImage: "url('/aboutme.jpeg')",
          WebkitMaskImage:
            "linear-gradient(to right, rgba(0,0,0,0.9), transparent 72%)",
          maskImage:
            "linear-gradient(to right, rgba(0,0,0,0.9), transparent 72%)",
        }}
      />
      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div
          ref={contentRef}
          className="mx-auto max-w-6xl"
          style={{ opacity: 0, transform: "translateY(60px)" }}
        >
          {/* Micro label */}
          <div className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-primary" />
            <span className="shimmer-text text-[0.7rem] font-semibold uppercase tracking-[0.4em]">
              About Me
            </span>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
            {/* Left: big editorial headline + socials */}
            <div>
              <h2
                ref={headlineRef}
                className="relative text-[1.7rem] font-bold leading-[1.45] tracking-tight sm:text-[2rem] md:text-[2.6rem] lg:text-[2.9rem] lg:leading-[1.35]"
              >
                {/* Ghost copy reserves the final layout so typing never shifts the page */}
                <span aria-hidden="true" className="invisible">
                  {headlineSegments.map((seg, i) => (
                    <span key={i} className={seg.className}>
                      {seg.text}
                    </span>
                  ))}
                </span>

                {/* Full headline for screen readers (visual layers are decorative) */}
                <span className="sr-only">{headlineText}</span>

                {/* Typed overlay rendered on top of the ghost */}
                <span aria-hidden="true" className="absolute inset-0">
                  {(() => {
                    let remaining = typedCount;
                    return headlineSegments.map((seg, i) => {
                      const visibleLength = Math.max(
                        0,
                        Math.min(seg.text.length, remaining),
                      );
                      remaining -= seg.text.length;
                      if (visibleLength === 0) return null;
                      return (
                        <span key={i} className={seg.className}>
                          {seg.text.slice(0, visibleLength)}
                        </span>
                      );
                    });
                  })()}
                  {typedCount < headlineLength && (
                    <span
                      aria-hidden="true"
                      className="ml-0.5 animate-blink font-normal text-primary"
                    >
                      |
                    </span>
                  )}
                </span>
              </h2>
            </div>

            {/* Right: short paragraph + numbered focus index */}
            <div className="lg:pt-2">
              <p className="about-line text-sm leading-[1.9] tracking-wide text-foreground/60">
                Specialize in machine learning, deep learning, and computer
                vision &mdash; building end-to-end AI systems that are fast,
                accurate, scalable, and ready for real-world deployment.
              </p>

              <div className="mt-9 space-y-4 border-t border-border/60 pt-7">
                {highlights.map((item, i) => (
                  <div
                    key={item.label}
                    className="about-highlight group flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-foreground/70 transition-colors hover:text-foreground"
                  >
                    <span className="text-sm font-semibold text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px w-5 bg-primary/50 transition-all duration-300 group-hover:w-8" />
                    <item.icon className="h-4 w-4 flex-shrink-0 text-primary" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

