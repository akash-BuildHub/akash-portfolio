import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

interface HeroProps {
  setShowTimeline: (show: boolean) => void;
}

const Hero = ({ setShowTimeline }: HeroProps) => {
  const avatarCardRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (typeof window !== "undefined" && !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const card = avatarCardRef.current;
    if (!card) return;

    let isPressed = false;

    const rotateXTo = gsap.quickTo(card, "rotationX", { duration: 0.2, ease: "power3.out" });
    const rotateYTo = gsap.quickTo(card, "rotationY", { duration: 0.2, ease: "power3.out" });
    const xTo = gsap.quickTo(card, "x", { duration: 0.24, ease: "power3.out" });
    const yTo = gsap.quickTo(card, "y", { duration: 0.24, ease: "power3.out" });
    const zTo = gsap.quickTo(card, "z", { duration: 0.24, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;

      const tiltStrength = isPressed ? 24 : 18;
      rotateXTo(-py * tiltStrength);
      rotateYTo(px * tiltStrength);
      xTo(px * (isPressed ? 7 : 12));
      yTo(py * (isPressed ? 7 : 12));
    };

    const onDown = () => {
      isPressed = true;
      gsap.to(card, { scale: 0.95, duration: 0.12, ease: "power2.out" });
      zTo(-22);
    };

    const onUp = () => {
      isPressed = false;
      gsap
        .timeline()
        .to(card, { scale: 1.055, duration: 0.18, ease: "power2.out" })
        .to(card, { scale: 1.03, duration: 0.24, ease: "back.out(2.1)" });
      zTo(24);
    };

    const onLeave = () => {
      isPressed = false;
      rotateXTo(0);
      rotateYTo(0);
      xTo(0);
      yTo(0);
      zTo(0);
      gsap.to(card, { scale: 1, duration: 0.35, ease: "back.out(1.8)" });
    };

    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerdown", onDown);
    card.addEventListener("pointerup", onUp);
    card.addEventListener("pointercancel", onUp);
    card.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    return () => {
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerdown", onDown);
      card.removeEventListener("pointerup", onUp);
      card.removeEventListener("pointercancel", onUp);
      card.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <section
      className="relative overflow-hidden pb-20 pt-28 sm:py-24 md:py-28 lg:py-36"
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
        className="pointer-events-none absolute left-0 top-[70%] -z-0 -translate-y-1/2 scale-y-75 select-none whitespace-nowrap text-[24vw] font-extrabold uppercase leading-none tracking-[0.1em] text-white/[0.04]"
      >
        Akash
      </span>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">
          {/* Left: editorial text column */}
          <div className="text-left">
            {/* Vertical indicator: dot + line + label */}
            <div className="mb-8 flex items-center gap-4 lg:mb-10">
              <span className="flex flex-col items-center gap-2">
                <span className="h-2 w-2 rounded-full border border-primary" />
                <span className="h-10 w-px bg-gradient-to-b from-primary/70 to-transparent" />
              </span>
              <span className="text-[0.7rem] font-medium uppercase tracking-[0.4em] text-foreground/55">
                Portfolio
              </span>
            </div>

            <p className="mb-3 text-sm font-medium uppercase tracking-[0.35em] text-foreground/60">
              Welcome to
            </p>

            <h1 className="text-5xl font-extrabold uppercase leading-[0.9] tracking-[0.06em] text-white sm:text-6xl md:text-7xl lg:text-8xl">
              My Universe
              <span className="text-primary">&#176;</span>
            </h1>

            <div className="mt-7 flex items-center gap-4 sm:mt-9">
              <span className="h-px w-12 bg-primary sm:w-16" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-foreground/85 sm:text-base">
                AI Developer
              </h2>
            </div>

            <div className="mt-6 max-w-md text-xs uppercase leading-[2.1] tracking-[0.18em] text-foreground/55 sm:text-sm">
              <p>Think it, let the AI do it.</p>
              <p className="mt-5">
                Designing, building, and deploying intelligent systems for
                real-world applications.
              </p>
            </div>

            <button
              onClick={scrollToTimeline}
              className="group mt-16 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary transition sm:mt-20"
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
