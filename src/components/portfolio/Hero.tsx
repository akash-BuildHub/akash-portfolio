import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ChevronRight, Heart } from "lucide-react";
import { prefersReducedMotion } from "@/lib/motion";

interface HeroProps {
  setShowTimeline: (show: boolean) => void;
}

const Hero = ({ setShowTimeline }: HeroProps) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
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

    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        opacity: 0,
        x: -50,
        duration: 1,
        ease: "power4.out",
      });

      gsap.from(imageRef.current, {
        opacity: 0,
        x: 50,
        duration: 1,
        delay: 0.15,
        ease: "power4.out",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

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

      const tiltStrength = isPressed ? 20 : 16;
      rotateXTo(-py * tiltStrength);
      rotateYTo(px * tiltStrength);
      xTo(px * (isPressed ? 5 : 10));
      yTo(py * (isPressed ? 5 : 10));
    };

    const onEnter = () => {
      gsap.to(card, { scale: 1.03, duration: 0.22, ease: "power2.out" });
      zTo(18);
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
    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointerdown", onDown);
    card.addEventListener("pointerup", onUp);
    card.addEventListener("pointercancel", onUp);
    card.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    return () => {
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerenter", onEnter);
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
      ref={heroRef}
      className="flex min-h-screen items-center bg-[#0a0a12] px-4 pt-16 sm:px-6 sm:pt-20"
      aria-label="Hero section"
    >
      <div className="relative mx-auto flex w-full max-w-6xl items-center overflow-hidden rounded-3xl border border-purple-500/40 bg-gradient-to-br from-[#0e0e18] via-[#0b0b14] to-black shadow-[0_0_80px_-20px_rgba(168,85,247,0.35)]">
        <div className="grid w-full grid-cols-1 items-center gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[55%_45%] lg:gap-14 lg:px-14 lg:py-14">
          <div ref={textRef}>
            <p className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              Welcome to
            </p>

            <h1 className="mt-2 text-4xl font-bold text-purple-500 sm:text-5xl md:text-6xl">
              Akash Portfolio
              <Heart className="ml-2 inline-block text-red-500 sm:ml-3" size={28} />
            </h1>

            <div className="mt-8 sm:mt-10">
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                AI Developer
              </h2>
              <p className="mt-2 text-base italic text-gray-400 sm:text-lg">
                think it, let the AI do it
              </p>
            </div>

            <button
              onClick={scrollToTimeline}
              className="mt-10 inline-flex items-center gap-3 rounded-full border border-purple-500/40 px-7 py-3 text-sm text-white transition hover:bg-purple-500/10 sm:mt-12 sm:px-10 sm:py-4 sm:text-base"
              aria-label="Explore timeline section"
            >
              <ChevronRight className="text-purple-500" />
              Click here to explore more
            </button>
          </div>

          <div
            ref={imageRef}
            className="flex justify-center [perspective:1200px] lg:-translate-x-5 lg:justify-start"
          >
            <div
              ref={avatarCardRef}
              className="avatar-ring reflect-card reflect-circle w-full max-w-[280px] cursor-grab touch-pan-y transform-gpu [transform-style:preserve-3d] active:cursor-grabbing sm:max-w-[340px] lg:max-w-[400px]"
            >
              <img
                src="/akash_profile_white.jpeg"
                alt="Akash profile"
                width={380}
                height={500}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                draggable={false}
                className="reflect-circle aspect-square w-full select-none object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

