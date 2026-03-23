import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Users, Hospital, Calendar, ArrowLeft, Trophy } from 'lucide-react';
import { prefersReducedMotion } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  title: string;
  year?: string;
  description: string;
  features: string[];
  icon: React.ElementType;
  link?: string;
  demoImages?: string[];
}

const projects: Project[] = [
  {
    title: 'AI Cricket Batting Shot Classification',
    year: '2026',
    description:
      'AI-Based Cricket Shot Classification is a computer vision system that processes uploaded cricket videos to identify and classify batting shots, analyze performance metrics, and predict outcomes for advanced sports analytics.',
    features: ['Deep Learning', 'Prediction', 'Classification'],
    icon: Trophy,
    demoImages: [
      '/project_demo/ai_cricket/1.jpg',
      '/project_demo/ai_cricket/2.jpg',
      '/project_demo/ai_cricket/3.jpg',
      '/project_demo/ai_cricket/4.jpg',
      '/project_demo/ai_cricket/5.jpg',
      '/project_demo/ai_cricket/6.jpg',
      '/project_demo/ai_cricket/7.jpg',
      '/project_demo/ai_cricket/8.jpg',
      '/project_demo/ai_cricket/9.jpg',
      '/project_demo/ai_cricket/10.jpg',
    ],
  },
  {
    title: 'AI Recognition & Detection',
    year: '2026',
    description:
      'An advanced AI-powered system for real-time recognition and detection using IP cameras and deep learning techniques, enabling accurate identification, classification, tracking, and intelligent video analysis.',
    features: ['Deep Learning', 'Detection', 'Recognition'],
    icon: Hospital,
  },
  {
    title: 'Vision Snap',
    year: '2025',
    description:
      'Vision Snap is a web based tool for creating image datasets for computer vision. It captures images from live webcams and extracts frames from uploaded videos. Users can organize samples into custom classes and export them as machine learning ready datasets.',
    features: ['Webcam Capture', 'Video Frame Extraction', 'Dataset Creation'],
    icon: Calendar,
    demoImages: [
      '/project_demo/vision_snap/1.png',
      '/project_demo/vision_snap/2.png',
      '/project_demo/vision_snap/3.png',
      '/project_demo/vision_snap/4.png',
      '/project_demo/vision_snap/5.png',
    ],
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

const ProjectCard = ({ project }: { project: Project }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const demoMetaRef = useRef<HTMLDivElement>(null);
  const demoMediaRef = useRef<HTMLDivElement>(null);
  const [showDemo, setShowDemo] = useState(false);
  const [lockedCardHeight, setLockedCardHeight] = useState<number | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [cacheToken, setCacheToken] = useState(() => Date.now());
  const dragStateRef = useRef<{ isDragging: boolean; lastY: number }>({
    isDragging: false,
    lastY: 0,
  });
  const isDemoProject = Boolean(project.demoImages?.length);

  useEffect(() => {
    const sourceImages = project.demoImages ?? [];
    if (!sourceImages.length) {
      setAvailableImages([]);
      return;
    }

    let isCancelled = false;
    const checks = sourceImages.map(
      (src) =>
        new Promise<string | null>((resolve) => {
          const img = new Image();
          const withCacheBypass = `${src}${src.includes('?') ? '&' : '?'}v=${cacheToken}`;
          img.onload = () => resolve(withCacheBypass);
          img.onerror = () => resolve(null);
          img.src = withCacheBypass;
        })
    );

    Promise.all(checks).then((results) => {
      if (isCancelled) return;
      const valid = results.filter((src): src is string => Boolean(src));
      setAvailableImages(valid);
    });

    return () => {
      isCancelled = true;
    };
  }, [project.title, project.demoImages, cacheToken]);

  useEffect(() => {
    if (!availableImages.length) {
      setActiveImageIndex(0);
      return;
    }
    if (activeImageIndex >= availableImages.length) {
      setActiveImageIndex(0);
    }
  }, [activeImageIndex, availableImages.length]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

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
  }, []);

  useEffect(() => {
    if (!showDemo || prefersReducedMotion()) return;

    const meta = demoMetaRef.current;
    const media = demoMediaRef.current;
    if (!meta || !media) return;

    gsap.killTweensOf([meta, media]);
    gsap.set([meta, media], { opacity: 0, y: 12 });

    gsap.timeline().to(meta, { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out' }).to(
      media,
      { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' },
      '-=0.1'
    );
  }, [showDemo]);

  useEffect(() => {
    if (!showDemo || availableImages.length <= 1 || isInteracting) return;

    const interval = window.setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % availableImages.length);
    }, 1200);

    return () => {
      window.clearInterval(interval);
    };
  }, [showDemo, availableImages.length, isInteracting]);

  useEffect(() => {
    setActiveImageIndex(0);
    if (showDemo) {
      setCacheToken(Date.now());
    }
  }, [showDemo, project.title]);

  const handleBackToDetails = () => {
    setShowDemo(false);
    setLockedCardHeight(null);
    setIsInteracting(false);
    dragStateRef.current = { isDragging: false, lastY: 0 };
  };

  const handleOpenDemo = () => {
    const currentHeight = cardRef.current?.offsetHeight ?? null;
    setLockedCardHeight(currentHeight);
    setShowDemo(true);
  };

  const moveToPreviousImage = () => {
    if (availableImages.length <= 1) return;
    setActiveImageIndex((prev) => (prev === 0 ? availableImages.length - 1 : prev - 1));
  };

  const moveToNextImage = () => {
    if (availableImages.length <= 1) return;
    setActiveImageIndex((prev) => (prev + 1) % availableImages.length);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (availableImages.length <= 1) return;
    dragStateRef.current = { isDragging: true, lastY: event.clientY };
    setIsInteracting(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.isDragging || availableImages.length <= 1) return;

    const deltaY = event.clientY - dragStateRef.current.lastY;
    const stepThreshold = 28;
    if (Math.abs(deltaY) < stepThreshold) return;

    if (deltaY > 0) {
      moveToPreviousImage();
    } else {
      moveToNextImage();
    }

    dragStateRef.current.lastY = event.clientY;
  };

  const handlePointerEnd = () => {
    if (!dragStateRef.current.isDragging) return;
    dragStateRef.current.isDragging = false;
    setIsInteracting(false);
  };

  const getCircularDistance = (index: number, current: number, total: number) => {
    if (total === 0) return 0;
    const forward = (index - current + total) % total;
    const backward = (current - index + total) % total;
    return forward <= backward ? forward : -backward;
  };

  const frontContent = (
    <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 sm:flex-row sm:items-start">
      <div className="flex-shrink-0">
        <div className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <project.icon className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary-foreground" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-3 sm:gap-3">
          <h3 className="text-base font-bold text-foreground sm:text-lg md:text-2xl">{project.title}</h3>
          {project.year && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs sm:px-3 sm:py-1 sm:text-sm">
              <Calendar className="w-3 h-3" />
              {project.year}
            </div>
          )}
        </div>

        <p className="mb-3 text-left text-xs leading-relaxed text-muted-foreground sm:mb-4 sm:text-sm sm:text-justify md:text-base">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {project.features.map((feature, i) => (
            <span
              key={`${feature}-${i}`}
              className="px-2 py-0.5 rounded-full bg-secondary/80 text-foreground/80 text-xs border border-primary/40 hover:border-primary/60 transition-colors sm:px-3 sm:py-1 sm:text-sm"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {isDemoProject ? (
        <button
          type="button"
          onClick={handleOpenDemo}
          className="flex-shrink-0 self-start"
          title="View project images"
          aria-label={`View project images for ${project.title}`}
        >
          <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors hover:text-primary sm:h-5 sm:w-5" />
        </button>
      ) : project.link ? (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 self-start"
          title="Open project"
        >
          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors sm:w-5 sm:h-5" />
        </a>
      ) : (
        <ExternalLink className="h-4 w-4 flex-shrink-0 self-start text-muted-foreground transition-colors group-hover:text-primary sm:h-5 sm:w-5" />
      )}
    </div>
  );

  if (!isDemoProject) {
    return (
      <div
        ref={cardRef}
        className="h-full bg-[#0a0a12]/80 border border-border/90 rounded-xl p-4 transition-transform duration-500 hover:scale-[1.02] group sm:p-6 lg:p-8"
      >
        {frontContent}
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      className={`h-full min-h-[320px] bg-[#0a0a12]/80 border border-border/90 rounded-xl p-4 sm:min-h-[360px] sm:p-6 lg:p-8 transition-transform duration-500 ${
        showDemo ? '' : 'hover:scale-[1.02] group'
      }`}
      style={lockedCardHeight ? { height: `${lockedCardHeight}px` } : undefined}
    >
      {!showDemo ? (
        frontContent
      ) : (
        <>
          <div ref={demoMetaRef} className="mb-3 flex flex-col gap-2 sm:relative sm:mb-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
            <h3 className="text-xs font-semibold tracking-[0.14em] text-foreground sm:absolute sm:left-1/2 sm:-translate-x-1/2 sm:text-lg sm:tracking-normal">
              PROJECT GALLERY
            </h3>
            <button
              type="button"
              onClick={handleBackToDetails}
              className="inline-flex self-start items-center rounded-md border border-border/90 p-2 text-foreground/90 transition-colors hover:border-primary/60 hover:text-primary sm:self-auto"
              title="Back to project details"
              aria-label={`Back to ${project.title} details`}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          </div>

          <div ref={demoMediaRef}>
            <div className="relative w-full overflow-hidden rounded-lg bg-black py-1.5 sm:py-3">
              <div
                className="relative mx-auto h-[160px] w-full max-w-[640px] touch-none sm:h-[220px] md:h-[240px] [perspective:1000px]"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerEnd}
                onPointerCancel={handlePointerEnd}
                onPointerLeave={handlePointerEnd}
              >
                {availableImages.length > 0 ? (
                  availableImages.map((image, index) => {
                    const distance = getCircularDistance(
                      index,
                      activeImageIndex,
                      availableImages.length
                    );
                    const absDistance = Math.abs(distance);
                    if (absDistance > 2) return null;

                    const translateY = distance * 36;
                    const rotateX = distance * 18;
                    const scale = distance === 0 ? 1 : absDistance === 1 ? 0.86 : 0.72;
                    const opacity = distance === 0 ? 1 : absDistance === 1 ? 0.65 : 0.3;
                    const blur = distance === 0 ? 0 : absDistance === 1 ? 0.6 : 1.2;
                    const zIndex = 20 - absDistance;

                    return (
                      <button
                        key={image}
                        type="button"
                        onClick={() => setActiveImageIndex(index)}
                        className="absolute left-1/2 top-1/2 flex h-[94%] w-[96%] -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-md bg-black shadow-[0_16px_40px_rgba(0,0,0,0.55)] transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] sm:h-[96%] sm:w-[89%]"
                        style={{
                          transform: `translate(-50%, -50%) translateY(${translateY}%) rotateX(${rotateX}deg) scale(${scale})`,
                          opacity,
                          filter: `blur(${blur}px)`,
                          zIndex,
                        }}
                        aria-label={`Open image ${index + 1}`}
                      >
                        <img
                          src={image}
                          alt={`${project.title} screenshot ${index + 1}`}
                          className="block h-full w-full object-cover object-center"
                        />
                      </button>
                    );
                  })
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                    No images available.
                  </div>
                )}
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
};

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="projects" ref={sectionRef} className="relative py-12 sm:py-16 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <h2 className="section-title">Projects</h2>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
