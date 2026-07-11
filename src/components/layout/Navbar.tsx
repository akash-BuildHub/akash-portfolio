import { useState, useEffect, useRef, type CSSProperties } from "react";
import { Menu, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RESUME_PATH } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion";

const NAV_ITEMS = [
  { label: "About", id: "about" },
  { label: "Experience", id: "experience" },
  { label: "Projects", id: "projects" },
  { label: "Contact", id: "contact" },
];

// Radial particles for the Resume button's "impact spark burst" collision effect.
const COLLISION_SPARKS = Array.from({ length: 12 }, (_, i) => ({
  angle: (360 / 12) * i,
  dist: 26 + (i % 3) * 12,
  size: i % 2 === 0 ? 5 : 3,
  delay: 0.2 + (i % 4) * 0.02,
}));

// Keyed overlay for the "impact spark burst" — remount (via key) to replay.
const CollisionBurst = () => (
  <span aria-hidden="true" className="collision-fx">
    <span className="collision-projectile" />
    <span className="collision-flash" />
    {COLLISION_SPARKS.map((spark, i) => (
      <span
        key={i}
        className="collision-spark"
        style={
          {
            "--a": `${spark.angle}deg`,
            "--d": `${spark.dist}px`,
            "--s": `${spark.size}px`,
            "--delay": `${spark.delay}s`,
          } as CSSProperties
        }
      />
    ))}
  </span>
);

const Navbar = () => {
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [logoBurst, setLogoBurst] = useState(0);
  const logoTapTimerRef = useRef<number | null>(null);

  const triggerLogoCollision = () => {
    if (prefersReducedMotion()) return;
    setLogoBurst((count) => count + 1);
  };

  useEffect(() => {
    if (sessionStorage.getItem("scrollToTopAfterReload") === "1") {
      sessionStorage.removeItem("scrollToTopAfterReload");
      window.scrollTo({ top: 0, behavior: "auto" });
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateActiveSection = () => {
      const navOffset = (navRef.current?.offsetHeight ?? 80) + 10;
      const scrollPosition = window.scrollY + navOffset;
      let currentSection: string | null = null;

      for (const item of NAV_ITEMS) {
        const section = document.getElementById(item.id);
        if (section && scrollPosition >= section.offsetTop) {
          currentSection = item.id;
        }
      }

      setActiveSection(currentSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const navHeight = navRef.current?.offsetHeight ?? 80;
      let target: HTMLElement;
      let navOffset: number;

      if (id === "about" || id === "experience") {
        // About and Experience land on the section itself with a tuned offset so
        // their own top padding stays visible below the navbar. The navbar
        // shrinks by ~16px (py-5 -> py-3) once the page scrolls past 50px, and
        // these sections always finish well past that point. So always base the
        // offset on the scrolled (short) height — otherwise clicking from the
        // top vs. from another section lands the section ~16px differently.
        const scrolledNavHeight = window.scrollY > 50 ? navHeight : navHeight - 16;
        target = element;
        navOffset = scrolledNavHeight - 2;
      } else {
        // All other sections keep the original behavior: scroll to the inner
        // heading/container with a fixed gap below the navbar.
        target =
          (element.querySelector(".section-title") as HTMLElement | null) ??
          (element.querySelector(".container") as HTMLElement | null) ??
          element;
        navOffset = navHeight + 32;
      }

      const top =
        target.getBoundingClientRect().top + window.scrollY - navOffset;
      setActiveSection(id);
      window.scrollTo({
        top: Math.max(top, 0),
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      ref={navRef}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass py-3" : "bg-transparent py-5"
      }`}
      aria-label="Primary"
    >
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6">
        <button
          onMouseEnter={triggerLogoCollision}
          onClick={() => {
            triggerLogoCollision();
            if (logoTapTimerRef.current !== null) {
              // Second tap within the window → double tap → hard refresh at once
              // (no scroll-to-top first).
              window.clearTimeout(logoTapTimerRef.current);
              logoTapTimerRef.current = null;
              window.location.reload();
              return;
            }
            // Hold the single-tap action briefly in case a second tap follows.
            logoTapTimerRef.current = window.setTimeout(() => {
              logoTapTimerRef.current = null;
              window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion() ? "auto" : "smooth",
              });
            }, 300);
          }}
          className="relative flex cursor-pointer items-center gap-2 transition-all duration-300 hover:scale-105 hover:opacity-80"
          aria-label="Scroll to top; double-tap to reload"
        >
          <img
            src="/signature_logo_white.png"
            alt="Akash signature logo"
            width={40}
            height={40}
            loading="eager"
            decoding="async"
            className="h-10 w-auto"
          />
          <span className="shine animate-pulse text-2xl text-primary md:text-3xl">
            {"\u272F\u00B0"}
          </span>
          {logoBurst > 0 && <CollisionBurst key={logoBurst} />}
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`group relative text-sm uppercase tracking-[0.2em] transition-all duration-300 hover:text-foreground hover:glow-text ${
                activeSection === item.id ? "text-foreground" : "text-foreground/80"
              }`}
            >
              {item.label}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                  activeSection === item.id ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </button>
          ))}
          <Button
            variant="ghost"
            className="resume-flip overflow-hidden text-sm font-normal uppercase tracking-[0.2em] text-foreground/80 duration-300 hover:bg-transparent hover:text-foreground"
            onClick={() => window.open(RESUME_PATH, "_blank")}
            aria-label="Resume"
          >
            <span className="resume-flip__face resume-flip__front">Resume</span>
            <span className="resume-flip__face resume-flip__back text-primary" aria-hidden="true">
              <Download className="h-4 w-4" />
            </span>
          </Button>
        </div>

        <button
          className="p-2 text-foreground md:hidden"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div id="mobile-menu" className="glass mx-4 mt-2 max-h-[75vh] overflow-y-auto rounded-xl p-6 md:hidden animate-fade-in">
          <div className="flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`py-2 text-left transition-colors hover:text-foreground ${
                  activeSection === item.id ? "text-foreground" : "text-foreground/80"
                }`}
              >
                {item.label}
              </button>
            ))}
            <a
              href={RESUME_PATH}
              download
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md border border-primary/60 px-4 py-2 text-foreground transition-colors hover:border-primary hover:bg-primary/10"
            >
              <Download className="h-4 w-4" />
              Resume
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;


