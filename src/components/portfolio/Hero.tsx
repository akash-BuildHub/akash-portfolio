import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ChevronRight, Heart } from "lucide-react";

interface HeroProps {
  setShowTimeline: (show: boolean) => void;
}

const Hero = ({ setShowTimeline }: HeroProps) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const scrollToTimeline = () => {
    // 👉 open timeline ONLY when CTA is clicked
    setShowTimeline(true);

    // wait one frame so Timeline mounts, then scroll
    requestAnimationFrame(() => {
      const section = document.getElementById("timeline");
      section?.scrollIntoView({ behavior: "smooth" });
    });
  };

  useEffect(() => {
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
      className="min-h-screen flex items-center justify-center bg-[#0a0a12]"
    >
      <div className="relative w-full max-w-6xl mx-auto rounded-3xl border border-purple-500/15 bg-gradient-to-br from-[#0e0e18] via-[#0b0b14] to-black shadow-[0_0_80px_-20_rgba(168,85,247,0.35)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] items-center gap-14 px-14 py-20">

          {/* LEFT */}
          <div ref={textRef}>
            <h1 className="text-5xl font-bold text-white">Welcome to</h1>

            <h1 className="mt-2 text-6xl font-bold text-purple-500">
              Akash Portfolio
              <Heart className="inline-block ml-3 text-red-500" size={38} />
            </h1>

            <div className="mt-10">
              <h2 className="text-3xl font-semibold text-white">
                AI Developer
              </h2>
              <p className="mt-2 text-lg italic text-gray-400">
                think it, let the AI do it
              </p>
            </div>

            {/* CTA (LOGIC UPDATED, DESIGN SAME) */}
            <button
              onClick={scrollToTimeline}
              className="mt-14 inline-flex items-center gap-3 px-10 py-4 rounded-full border border-purple-500/40 text-white hover:bg-purple-500/10 transition"
            >
              <ChevronRight className="text-purple-500" />
              Click here → to explore more
            </button>
          </div>

          {/* RIGHT */}
          <div ref={imageRef} className="flex justify-center">
            <img
              src="/ak-profile.png"
              alt="Akash profile"
              className="w-[380px] rounded-2xl grayscale"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
