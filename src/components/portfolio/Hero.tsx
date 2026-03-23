import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ChevronRight, Heart } from "lucide-react";
import { prefersReducedMotion } from "@/lib/motion";

interface HeroProps {
  setShowTimeline: (show: boolean) => void;
}

const THEME_KEY = "portfolio-theme";

const Hero = ({ setShowTimeline }: HeroProps) => {
  const imageRef = useRef<HTMLDivElement>(null);
  const avatarCardRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef(0);
  const [theme, setTheme] = useState<"light" | "dark">(
    document.documentElement.classList.contains("dark") ? "dark" : "light",
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

  const toggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    const nextTheme = isDark ? "light" : "dark";

    root.classList.remove("light", "dark");
    root.classList.add(nextTheme);
    window.localStorage.setItem(THEME_KEY, nextTheme);
    setTheme(nextTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setTheme(root.classList.contains("dark") ? "dark" : "light");
    });

    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
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

  const handleProfilePointerUp = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 320) {
      toggleTheme();
    }
    lastTapRef.current = now;
  };

  return (
    <section className="relative pb-16 pt-24 sm:py-16 md:py-24 lg:py-32" aria-label="Hero section">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-xl border border-border/90 bg-[#0a0a12]/80 p-4 transition-all duration-500 sm:p-6 md:p-10 lg:p-12">
          <div className="grid w-full grid-cols-1 items-center gap-6 sm:gap-8 lg:grid-cols-[55%_45%] lg:gap-14">
            <div className="text-center lg:text-left">
              <p className="text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl">Welcome to</p>

              <h1 className="mt-2 text-3xl font-bold text-purple-500 sm:text-4xl md:text-5xl lg:text-6xl">
                Akash Portfolio
                <Heart className="ml-1.5 inline-block text-red-500 sm:ml-2 md:ml-3" size={22} />
              </h1>

              <div className="mt-6 sm:mt-8 md:mt-10">
                <h2 className="text-xl font-semibold text-white sm:text-2xl md:text-3xl">AI Developer</h2>
                <p className="mt-1.5 text-sm italic text-gray-400 sm:mt-2 sm:text-base md:text-lg">think it, let the AI do it</p>
              </div>

              <button
                onClick={scrollToTimeline}
                className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full border border-purple-500/40 px-5 py-2.5 text-xs text-white transition hover:bg-purple-500/10 sm:mt-10 sm:gap-3 sm:px-7 sm:py-3 sm:text-sm md:mt-12 md:px-10 md:py-4 md:text-base lg:mx-0"
                aria-label="Explore timeline section"
              >
                <ChevronRight className="h-4 w-4 text-purple-500 sm:h-5 sm:w-5" />
                Click here to explore more
              </button>
            </div>

            <div
              ref={imageRef}
              className="flex justify-center [perspective:1200px] lg:-translate-x-5 lg:justify-start"
            >
              <div
                ref={avatarCardRef}
                className={`reflect-circle w-full max-w-[180px] cursor-grab touch-pan-y transform-gpu rounded-full border-2 border-purple-500/50 p-[4px] [transform-style:preserve-3d] active:cursor-grabbing sm:max-w-[280px] sm:p-[6px] md:max-w-[340px] lg:max-w-[400px] ${
                  theme === "dark"
                    ? "bg-[#2a2a2a] shadow-[0_10px_24px_rgba(0,0,0,0.4)] sm:shadow-[0_14px_34px_rgba(0,0,0,0.45)]"
                    : "bg-transparent"
                }`}
                onPointerUp={handleProfilePointerUp}
              >
                <img
                  src={theme === "light" ? "/akash_profile_white.jpeg" : "/akash_profile_black.png"}
                  alt="Akash profile"
                width={380}
                height={500}
                loading="eager"
                decoding="async"
                draggable={false}
                className="reflect-circle aspect-square w-full select-none object-cover"
              />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
