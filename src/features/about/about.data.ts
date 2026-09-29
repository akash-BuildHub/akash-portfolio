import { Brain, Cpu, Eye, Rocket, type LucideIcon } from "lucide-react";

// Headline split into colored segments so the typing effect can preserve the
// two-tone styling while revealing one character at a time.
export const headlineSegments = [
  { text: "Hey, I'm ", className: "text-foreground/50" },
  { text: "Akash", className: "text-white" },
  {
    text:
      " — I build intelligent computer vision systems that transform visual data into ",
    className: "text-foreground/50",
  },
  {
    text: "faster decisions and smarter automation.",
    className: "text-white",
  },
];

export const highlights: { icon: LucideIcon; label: string }[] = [
  { icon: Brain, label: "Deep Learning" },
  { icon: Eye, label: "Computer Vision" },
  { icon: Cpu, label: "Machine Learning" },
  { icon: Rocket, label: "AI Implementation" },
];
