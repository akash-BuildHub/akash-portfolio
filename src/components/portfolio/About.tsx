import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eye, Cpu, TrendingUp } from "lucide-react";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const highlights = [
    { icon: Cpu, label: "AI Development" },
    { icon: Eye, label: "Computer Vision" },
    { icon: TrendingUp, label: "Technical Growth" },
  ];

  return (
    <section id="about" ref={sectionRef} className="relative py-24 md:py-32">
      <div className="container relative z-10 mx-auto px-6">
        <div ref={contentRef} className="mx-auto max-w-6xl text-center">
          <h2 className="section-title">About Me</h2>

          <div className="rounded-xl border border-border/90 bg-[#0a0a12]/80 p-8 transition-all duration-500 md:p-12">
            <p className="mb-8 text-justify text-lg leading-[1.7] text-foreground/90 md:text-xl md:leading-[1.9]">
              I'm <span className="font-semibold text-foreground">Akash</span>, an{" "}
              <span className="gradient-text font-semibold">AI Developer</span>{" "}
              specializing in machine learning, deep learning, and computer vision, with hands-on
              experience in designing, building, and deploying intelligent systems for real-world
              applications. I focus on writing clean, scalable, and production-ready code while
              transforming complex datasets into meaningful insights and developing end-to-end AI
              pipelines optimized for performance and accuracy. Driven by innovation and
              problem-solving, I'm passionate about creating impactful, data-driven AI solutions
              that bridge cutting-edge research with practical applications.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-full border border-border/90 bg-card/60 px-6 py-3 transition-all duration-300 hover:scale-105 hover:border-primary/60"
                >
                  <item.icon className="h-5 w-5 text-primary" />
                  <span className="text-foreground/90">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
