import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Users, Hospital, Calendar } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  title: string;
  year?: string;
  description: string;
  features: string[];
  icon: React.ElementType;
  link?: string;
}

const projects: Project[] = [
    {
    title: 'AI Batting Classification',
    year: '2026',
    description:
      'AI Batting Classification – An intelligent computer vision system that processes uploaded cricket videos to identify and classify batting shots, analyze performance metrics, and predict outcomes for advanced sports analytics.',
    features: ['Deep Learning','Prediction','clasification'],
    icon: Hospital,
  },
    {
    title: 'AI Recognition & Detection',
    year: '2026',
    description:
      'An advanced AI-powered system for real-time recognition and detection using IP cameras and deep learning techniques, enabling accurate identification, classification, tracking, and intelligent video analysis.',
    features: ['Deep Learning','Detection','Recognition'],
    icon: Hospital,
  },
    {
    title: 'Vision Snap',
    year: '2025',
    description:
      'Vision Snap is a web based tool for creating image datasets for computer vision. It captures images from live webcams and extracts frames from uploaded videos. Users can organize samples into custom classes and export them as machine learning ready datasets.',
    features: ['Webcam Capture', 'Video Frame Extraction', 'Dataset Creation'],
    icon: Calendar,
  },
    {
    title: 'ALL IN ONE',
    year: '2025',
    description:
      'ALL IN ONE is a web-based OCR tool that extracts content from images, PDFs, and web uploads. It converts scanned documents into readable and searchable text and extracts embedded images along with textual data. Supports structured output from multi-page PDF documents for fast and accurate digitization.',
    features: ['OCR', 'Document AI', 'Text & Image Extraction'],
    icon: Users,
  },
    {
    title: 'Hospital Management System',
    year: '2024',
    description:
      'Developed a hospital management system with dedicated login portals for patients and doctors. Integrated functionalities for managing treatment plans, brain tumor detection records, and visit histories, enhancing efficiency in medical data handling and patient care.',
    features: ['Patient & Doctor Portals', 'Medical Records', 'Brain Tumor Detection'],
    icon: Hospital,
  },
    {
    title: 'Tech Media Community',
    year: '2023',
    description:
      'Designed and developed a tech media platform that encourages group learning and topic-based conversations. The platform enables members to exchange ideas, discuss emerging technologies, and collaborate on upcoming developments, creating a community-driven learning experience.',
    features: ['Group Learning', 'Topic-Based Discussions', 'Community Collaboration'],
    icon: Users,
  },
];

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
        gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 95%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="h-full bg-[#0a0a12]/80 border border-border/90 rounded-xl p-8 transition-all duration-500 hover:scale-[1.02] group"
    >
      <div className="flex items-start gap-6">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <project.icon className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-2xl font-bold text-foreground">{project.title}</h3>
            {project.year && (
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
                <Calendar className="w-3 h-3" />
                {project.year}
              </div>
            )}
          </div>

          <p className="text-muted-foreground mb-4 leading-relaxed text-justify">
            {project.description}
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-2">
            {project.features.map((feature, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-secondary/80 text-foreground/80 text-sm border border-primary/40 hover:border-primary/60 transition-colors"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* External link icon - Clickable only if link exists */}
        {project.link ? (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0"
            title="Open project"
          >
            <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </a>
        ) : (
          <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
        )}
      </div>
    </div>
  );
};

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="projects" ref={sectionRef} className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="section-title">Projects</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;


