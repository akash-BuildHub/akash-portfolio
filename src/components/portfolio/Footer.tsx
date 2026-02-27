import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative border-t border-border/90 py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-center gap-2 text-center md:flex-row">
          <p className="text-muted-foreground">
            Designed and Developed by{" "}
            <span className="gradient-text glow-text font-semibold">Akash</span>
          </p>
          <Heart className="h-4 w-4 animate-pulse text-red-500" />
        </div>
        <p className="mt-2 text-center text-sm text-muted-foreground/60">
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
