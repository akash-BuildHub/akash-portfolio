import { Briefcase, GraduationCap, TrendingUp, Wrench, type LucideIcon } from "lucide-react";

export interface TimelineItem {
  icon: LucideIcon;
  title: string;
  content: string[];
}

export const timelineData: TimelineItem[] = [
  {
    icon: GraduationCap,
    title: "Education",
    content: [
      "HSE - Child Jesus Matriculation Higher Secondary School, Unnamalaikadai [2018 - 2020]",
      "BE (CSE) - Bethlahem Institute of Engineering, Karungal [2020 - 2024]",
    ],
  },
  {
    icon: Briefcase,
    title: "Career",
    content: [
      "2023 - Academic Project using Deep Learning",
      "2024 - Python/Django Intern",
      "2024 - Assistant Technical Writer",
      "2025 - AI Developer",
    ],
  },
  {
    icon: TrendingUp,
    title: "Personal Journey",
    content: [
      "2020 - Transitioned from school to engineering, building core technical foundations",
      "2023 - Achieved significant research milestones and actively explored career opportunities",
      "2024 - Placed in an Assistant Technical Writer role, documenting AI research",
      "2025 - Joined Grow Space Innovations as an AI Developer, building AI systems",
      "2026 - Focused on AI-powered HRMS, computer vision, and full-stack business applications",
    ],
  },
  {
    icon: Wrench,
    title: "Skills",
    content: [
      "- Frontend Development",
      "- Backend Development",
      "- Databases & Cloud Services",
      "- Full-Stack Business Applications",
      "- Artificial Intelligence",
      "- Computer Vision Models",
      "- Optimization & Performance Tuning",
      "- Real-Time Video Streaming",
      "- DevOps & Version Control",
    ],
  },
];
