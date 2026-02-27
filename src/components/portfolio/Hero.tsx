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

  return (
    <section
      ref={heroRef}
      className="min-h-screen bg-[#0a0a12] px-4 pt-20 sm:px-6 md:pt-24"
      aria-label="Hero section"
    >
      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center overflow-hidden rounded-3xl border border-purple-500/40 bg-gradient-to-br from-[#0e0e18] via-[#0b0b14] to-black shadow-[0_0_80px_-20px_rgba(168,85,247,0.35)]">
        <div className="grid w-full grid-cols-1 items-center gap-10 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-[55%_45%] lg:gap-14 lg:px-14 lg:py-20">
          <div ref={textRef}>
            <p className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              Welcome to
            </p>

            <h1 className="mt-2 text-4xl font-bold text-purple-500 sm:text-5xl md:text-6xl">
              Akash Portfolio
              <Heart className="ml-3 inline-block text-red-500" size={36} />
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

          <div ref={imageRef} className="flex justify-center">
            <img
              src="/akash_profile.png"
              alt="Akash profile"
              width={380}
              height={500}
              loading="eager"
              decoding="async"
              className="w-full max-w-[300px] rounded-2xl grayscale sm:max-w-[340px] lg:max-w-[380px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
