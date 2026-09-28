import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

interface HeroProps {
  setShowTimeline: (show: boolean) => void;
}

const HEADLINE = "My Universe";
const ROLE = "AI Developer";

// The backdrop art is laid out in the portrait's own units — 1000 wide by 1640
// tall, the aspect ratio of /akash_profile.jpeg — so the arrows can be placed
// against the subject (head ≈ x 490–770, y 130–500; shoulders from y ≈ 500)
// and keep that relationship at every breakpoint.
const ART_W = 1000;
const ART_H = 1640;

// Outline of the subject in portrait units, traced on a brightness-stretched
// copy of the photo (the jacket is nearly as dark as the backdrop). The arrows
// are masked with it so they pass behind the figure instead of showing through
// the faded photo. It runs past the bottom edge of the portrait.
const SILHOUETTE_PATH =
  "M611 140 L677 146 L712 164 L742 207 L753 251 L748 295 L737 328 L751 371 L731 406 " +
  "L715 459 L710 497 L786 513 L862 546 L917 568 L941 611 L952 710 L961 873 L966 1037 " +
  "L959 1146 L939 1201 L922 1288 L906 1419 L901 1800 L257 1800 L224 1528 L205 1408 " +
  "L213 1343 L262 1266 L338 1190 L347 1092 L349 983 L360 873 L380 764 L391 677 L402 611 " +
  "L426 579 L480 557 L568 535 L579 513 L562 459 L540 415 L535 328 L513 284 L503 251 " +
  "L505 218 L520 191 L560 150 Z";

// Everything below the right shoulder line, extended on past the arm. The
// jacket barely shows in the faded photo, so without this the arrow's lower
// arm would reappear beside the right arm as a stray sliver; with it, the arm
// simply disappears behind the shoulder.
const RIGHT_SHOULDER_BLOCK = "M786 513 L917 568 L2600 1914 L2600 3000 L786 3000 Z";

// Region the arrow mask covers: generously past the portrait on every side.
const MASK_AREA = { x: -1500, y: -1500, width: 4000, height: 5000 };

// A double gold "<" chevron in the gap between the head and the right edge,
// level with the neck and pointing in at the subject; the lower arms pass
// behind the right shoulder. Arms run at 45° from each tip; REACH is long
// enough for them to fade out before they end.
const TIP_Y = 440;
const REACH = 900;

const ARROW = {
  /** Nested bands: each tip's x and the band's horizontal thickness. */
  bands: [
    { tipX: 730, depth: 100 },
    { tipX: 930, depth: 100 },
  ],
  /** Peak opacity of the band fill. */
  fill: 0.4,
  /** Center and radius of the falloff that fades the arms toward their ends. */
  fade: { cx: 880, cy: 420, r: 560 },
};

// A lighter tint of the theme's antique gold (--primary, the color of the °
// after the headline), so the bands read as soft gold rather than bronze.
const GOLD = "color-mix(in srgb, hsl(var(--primary)) 80%, white)";

// Box for the arrow, matching the photo inside the dark panel (see the markup):
// 66% of the section wide. Below xl it is the photo's original placement
// (`background-size: 66%` at `114% 12%`, i.e. left edge 38.76% across); from xl
// up the photo slides 11% of the section width further left.
const ART_BOX =
  "pointer-events-none absolute right-[-4.76%] top-[calc(12%-13vw)] aspect-[1000/1640] w-[66%] xl:right-[6.24%]";

// The giant "Akash" watermark, drawn twice: a solid copy in the page color
// that hides the arrow behind the letters, then the faint original on top.
// Centered; the left padding balances the letter-spacing after the last "H"
// and the glyphs' uneven side bearings, so the letters sit optically centered.
const WATERMARK =
  "watermark-fade pointer-events-none absolute left-1/2 top-[45%] -z-0 -translate-x-1/2 -translate-y-1/2 scale-y-75 select-none whitespace-nowrap pl-[0.16em] text-[24vw] font-extrabold uppercase leading-none tracking-[0.1em] sm:top-[60%] lg:top-[78%]";

// Closed "<" band: from the tip, 45° arms out to the right, with a parallel
// back edge `depth` behind it.
const chevronBand = (tipX: number, depth: number) => {
  const backX = tipX + depth;
  return (
    `M${tipX + REACH} ${TIP_Y - REACH} L${tipX} ${TIP_Y} L${tipX + REACH} ${TIP_Y + REACH} ` +
    `L${backX + REACH} ${TIP_Y + REACH} L${backX} ${TIP_Y} L${backX + REACH} ${TIP_Y - REACH} Z`
  );
};

// The arrow: soft, borderless gold bands that fade out along the arms. Drawn
// in the portrait's own viewBox and allowed to overflow it, so it stays
// aligned with the photo; the subject's outline is cut out with a hard edge
// so it passes cleanly behind the figure.
const HeroArrow = () => {
  const { bands, fill, fade } = ARROW;

  return (
    <svg
      viewBox={`0 0 ${ART_W} ${ART_H}`}
      className="absolute inset-0 h-full w-full overflow-visible"
    >
      <defs>
        <radialGradient
          id="hero-arrow-fill"
          gradientUnits="userSpaceOnUse"
          cx={fade.cx}
          cy={fade.cy}
          r={fade.r}
        >
          <stop offset="0" style={{ stopColor: GOLD, stopOpacity: fill }} />
          <stop offset="1" style={{ stopColor: GOLD, stopOpacity: 0 }} />
        </radialGradient>
        <mask id="hero-arrow-cutout" maskUnits="userSpaceOnUse" {...MASK_AREA}>
          <rect {...MASK_AREA} fill="white" />
          <path d={SILHOUETTE_PATH} fill="black" />
          <path d={RIGHT_SHOULDER_BLOCK} fill="black" />
        </mask>
      </defs>

      <g mask="url(#hero-arrow-cutout)">
        {bands.map(({ tipX, depth }) => (
          <path key={tipX} d={chevronBand(tipX, depth)} fill="url(#hero-arrow-fill)" />
        ))}
      </g>
    </svg>
  );
};

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
        )
        // Backdrop: the portrait settles in while each set of arrows slides in
        // from its own side toward the subject.
        .from(
          ".hero-portrait",
          {
            opacity: 0,
            scale: 1.05,
            duration: 1.8,
            ease: "power2.out",
            clearProps: "opacity,transform",
          },
          0,
        )
        .from(
          ".hero-arrow",
          { opacity: 0, x: 80, duration: 1.5, clearProps: "opacity,transform" },
          0.3,
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
      className="relative overflow-hidden pb-16 pt-28 sm:py-24 md:py-28 lg:min-h-[100svh] lg:py-32"
      aria-label="Hero section"
    >
      {/* Home backdrop, back to front. The photo box and the arrow's ART_BOX
          use the same size and position so the arrow stays aligned with the
          subject (the arrow is drawn in the portrait's own units). */}

      {/* The profile photo, faded into the background (30%) and brightened
          1.35× so the face reads clearly without lightening the dark panel.
          Its black backdrop forms that panel, which always starts 38.76%
          across — the photo's original left edge. From xl up the photo slides
          11% of the section width left inside the panel (-17.96% of the
          panel's 61.24% width), and the panel fills in on the right with the
          photo's own backdrop color (#060606 measured along its right edge,
          ×1.35 ≈ #070707) so there's no seam. The photo is 66% of the section
          wide = 107.77% of the panel. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[38.76%] right-0 overflow-hidden opacity-30 xl:bg-[#070707]"
      >
        <div
          className="hero-portrait absolute left-0 top-[calc(12%-13vw)] aspect-[1000/1640] w-[107.77%] bg-cover bg-top bg-no-repeat brightness-[1.35] will-change-transform xl:left-[-17.96%]"
          style={{ backgroundImage: "url('/akash_profile.jpeg')" }}
        />
      </div>

      {/* Gold arrow, above the photo so its dark backdrop doesn't dim it; the
          subject's outline is cut out of it, so it passes behind the figure */}
      <div aria-hidden="true" className={ART_BOX}>
        <div className="hero-arrow absolute inset-0 opacity-40 will-change-transform md:opacity-60 lg:opacity-100">
          <HeroArrow />
        </div>
      </div>

      {/* Solid copy of the watermark in the page color: keeps the letters in
          front, hiding the arrow where it crosses them */}
      <span aria-hidden="true" className={`${WATERMARK} text-background`}>
        Akash
      </span>

      {/* Giant faint watermark */}
      <span aria-hidden="true" className={`${WATERMARK} text-white/[0.04]`}>
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
              className="group mt-10 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary transition sm:mt-12"
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
