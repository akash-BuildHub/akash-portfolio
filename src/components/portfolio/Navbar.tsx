import { useState, useEffect, useRef } from 'react';
import { Menu, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { label: 'About', id: 'about' },
    { label: 'Experience', id: 'experience' },
    { label: 'Projects', id: 'projects' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <button
          onClick={() => {
            if (clickTimeout.current) return;

            clickTimeout.current = setTimeout(() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              clickTimeout.current = null;
            }, 250);
          }}
          onDoubleClick={() => {
            if (clickTimeout.current) {
              clearTimeout(clickTimeout.current);
              clickTimeout.current = null;
            }
            window.location.reload();
          }}
          className="hover:opacity-80 hover:scale-105 transition-all duration-300 cursor-pointer flex items-center gap-2"
        >
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="h-10 w-auto"
          />
          <span className="shine text-primary text-2xl md:text-3xl animate-pulse">✰</span>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-foreground/80 hover:text-foreground hover:glow-text transition-all duration-300 relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </button>
          ))}
          <Button
            variant="outline"
            className="border-primary/50 hover:border-primary w-full mt-2"
            onClick={() => window.open('/ak-resume.pdf', '_blank')}
          >
            <Download className="w-4 h-4 mr-2" />
            Resume
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass mt-2 mx-4 rounded-xl p-6 animate-fade-in">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-foreground/80 hover:text-foreground text-left py-2 transition-colors"
              >
                {item.label}
              </button>
            ))}
            <Button
              variant="outline"
              className="border-primary/50 hover:border-primary w-full mt-2"
              onClick={() => window.open('/resume.pdf', '_blank')}
            >
              <Download className="w-4 h-4 mr-2" />
              Resume
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;