import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-8 border-t border-border/90 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-center">
          <p className="text-muted-foreground">
            Designed and Developed by{' '}
            <span className="gradient-text font-semibold glow-text">Akash</span>
          </p>
          <Heart className="w-4 h-4 text-red-500 animate-pulse" />
        </div>
        <p className="text-center text-muted-foreground/60 text-sm mt-2">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

