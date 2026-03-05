import { useState, useEffect, useRef } from "react";
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

const Navbar = () => {
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const clickTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      const navOffset = (navRef.current?.offsetHeight ?? 80) + 24;
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
      const navOffset = (navRef.current?.offsetHeight ?? 80) + 12;
      const top = element.getBoundingClientRect().top + window.scrollY - navOffset;
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
          onClick={() => {
            if (clickTimeout.current) return;

            clickTimeout.current = setTimeout(() => {
              window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion() ? "auto" : "smooth",
              });
              clickTimeout.current = null;
            }, 250);
          }}
          onDoubleClick={() => {
            if (clickTimeout.current) {
              clearTimeout(clickTimeout.current);
              clickTimeout.current = null;
            }
            sessionStorage.setItem("scrollToTopAfterReload", "1");
            window.location.reload();
          }}
          className="flex cursor-pointer items-center gap-2 transition-all duration-300 hover:scale-105 hover:opacity-80"
          aria-label="Scroll to top. Double click to reload."
        >
          <img
            src="/logo.png"
            alt="Akash portfolio logo"
            width={40}
            height={40}
            loading="eager"
            decoding="async"
            className="h-10 w-auto"
          />
          <span className="shine animate-pulse text-2xl text-primary md:text-3xl">{"\u272F\u00B0"}</span>
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`group relative transition-all duration-300 hover:text-foreground hover:glow-text ${
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
            variant="outline"
            className="border-primary/60 hover:border-primary"
            onClick={() => window.open(RESUME_PATH, "_blank")}
          >
            <Download className="mr-2 h-4 w-4" />
            Resume
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

