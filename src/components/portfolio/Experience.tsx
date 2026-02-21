import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ExperienceItem {
  title: string;
  company: string;
  parentCompany?: string;
  location: string;
  duration: string;
  description: string;
}

const experiences: ExperienceItem[] = [
  {
    title: 'AI Developer',
    company: 'GROW AI',
    parentCompany: 'iQue Ventures',
    location: 'Madiwala, Bengaluru',
    duration: '2026 — Present',
    description:
      'Building real-time video analytics solutions that extract actionable insights using object detection, recognition, and event-driven AI processing.',
  },
    {
    title: 'AI Developer',
    company: 'Owlytics',
    parentCompany: 'iQue Ventures',
    location: 'Madiwala, Bengaluru',
    duration: '2025 — 2026',
    description:
      'Designing and implementing computer vision AI project systems focused on intelligent automation and decision-driven workflows.',
  },
  {
    title: 'Research Analyst',
    company: 'Rpinnacle Research Solutions',
    parentCompany: 'Resbee',
    location: 'Thuckalay, Tamil Nadu',
    duration: '2024 — 2025',
    description:
      'Created documentation, technical reports, and research materials for deep learning projects, improving clarity, knowledge sharing, and supporting ongoing development and research efforts.',
  },
  {
    title: 'Python-Intern',
    company: 'Srishti Innovations',
    parentCompany: 'Techno Park',
    location: 'Thiruvananthapuram, Kerala',
    duration: 'July 2023',
    description:
      'Enhanced Python programming skills and explored software development methodologies through hands-on projects and practical applications.',
  },
  {
    title: 'Inplant Training',
    company: 'iTrobes Technologies Pvt. Ltd.',
    location: 'Marthandam, Tamil Nadu',
    duration: 'July 2022',
    description:
      'Gained industry exposure to software development practices and team collaboration, strengthening practical understanding of real-world workflows.',
  },
];

const ExperienceCard = ({ experience, index }: { experience: ExperienceItem; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
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
      className="flip-card h-[280px] w-full"
    >
      <div className="flip-card-inner">
        {/* Front Side - Job Title Only */}
        <div className="flip-card-front bg-[#0a0a12]/80 to-card/40 border border-border/90 rounded-xl flex items-center justify-center p-6 hover:border-primary/60 transition-colors">
          <h3 className="text-2xl font-bold text-foreground text-center gradient-text">
            {experience.title}
          </h3>
        </div>
        
        {/* Back Side - Full Details */}
        <div className="flip-card-back bg-[#0a0a12]/20 to-accent/10 border border-primary/60 rounded-xl p-6 flex flex-col justify-center">
          <h3 className="text-xl font-bold text-foreground mb-1">{experience.company}</h3>
          {experience.parentCompany && (
            <p className="text-primary text-sm mb-2">({experience.parentCompany})</p>
          )}
          <p className="text-muted-foreground text-sm mb-4">
            {experience.location} | {experience.duration}
          </p>
          <p className="text-foreground/80 text-sm leading-relaxed text-justify">
            {experience.description}
          </p>
        </div>
      </div>
    </div>
  );
};

const Experience = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="experience" ref={sectionRef} className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="section-title">Experience</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {experiences.map((exp, index) => (
            <ExperienceCard key={index} experience={exp} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;


