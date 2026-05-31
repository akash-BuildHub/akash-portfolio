import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, Hospital, Calendar, ArrowLeft, Trophy, Vote, UserCheck } from 'lucide-react';
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
    title: 'AI Election Prediction',
    year: '2026',
    description:
      'A data-driven election forecasting system that leverages machine learning models on historical voting data, demographic indicators, and sentiment signals to predict constituency-level outcomes with confidence scoring and interactive visual analytics.',
    features: ['Machine Learning', 'Forecasting', 'Data Analytics'],
    icon: Vote,
    link: 'https://owlytics-election-prediction.vercel.app/',
  },
  {
    title: 'AI Attendance System',
    year: '2026',
    description:
      'An AI-powered attendance system using face recognition and computer vision to automate check-ins in real time. It securely records attendance, prevents proxy entries, and offers a dashboard for live tracking, reporting, and analytics.',
    features: ['Face Recognition', 'Computer Vision', 'Real-Time Tracking'],
    icon: UserCheck,
    demoImages: [
      '/project_demo/AI_attendance_system/1.jpeg',
      '/project_demo/AI_attendance_system/2.png',
      '/project_demo/AI_attendance_system/3.png',
      '/project_demo/AI_attendance_system/4.png',
      '/project_demo/AI_attendance_system/5.png',
      '/project_demo/AI_attendance_system/6.png',
    ],
  },
  {
    title: 'AI Cricket Batting Shot Classification',
    year: '2026',
    description:
      'AI-Based Cricket Shot Classification is a computer vision system that processes uploaded cricket videos to identify and classify batting shots, analyze performance metrics, and predict outcomes for advanced sports analytics.',
    features: ['Deep Learning', 'Prediction', 'Classification'],
    icon: Trophy,
    link: 'https://ai-batting-classifier.vercel.app/',
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
    link: 'https://vision-snap-two.vercel.app/',
  },
  {
    title: 'ALL IN ONE',
    year: '2025',
    description:
      'ALL IN ONE is a web-based OCR tool that extracts content from images, PDFs, and web uploads. It converts scanned documents into readable and searchable text and extracts embedded images along with textual data. Supports structured output from multi-page PDF documents for fast and accurate digitization.',
    features: ['OCR', 'Document AI', 'Text & Image Extraction'],
    icon: Users,
    link: 'https://allinone-snowy.vercel.app/',
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

const renderTwoToneTitle = (title: string) => {
  const words = title.trim().split(/\s+/);
  if (words.length === 1) {
    return <span className="text-primary">{title}</span>;
  }
  const last = words.pop();
  return (
    <>
      <span className="text-white">{words.join(" ")} </span>
      <span className="text-primary">{last}</span>
    </>
  );
};

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
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 90%',
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
    <div className="flex h-full flex-col">
      {/* Icon + year */}
      <div className="flex items-start justify-between">
        <project.icon
          className="h-9 w-9 text-primary transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10"
          strokeWidth={1.25}
        />
        {project.year && (
          <span className="text-[0.7rem] font-medium tracking-[0.25em] text-foreground/35">
            {project.year}
          </span>
        )}
      </div>

      {/* Two-tone title */}
      <h3 className="mt-6 text-lg font-bold uppercase tracking-wide sm:text-xl md:text-[1.4rem]">
        {renderTwoToneTitle(project.title)}
      </h3>

      {/* Description */}
      <p className="mt-4 text-sm leading-[1.8] text-foreground/55">
        {project.description}
      </p>

      {/* Features */}
      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 text-[0.65rem] font-medium uppercase tracking-[0.15em] text-foreground/40">
        {project.features.map((feature, i) => (
          <span key={`${feature}-${i}`} className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-primary/60" />
            {feature}
          </span>
        ))}
      </div>

      {/* View link */}
      {(isDemoProject || project.link) && (
        <div className="mt-auto pt-7">
          {isDemoProject ? (
            <button
              type="button"
              onClick={handleOpenDemo}
              className="group/link inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
              aria-label={`View project images for ${project.title}`}
            >
              <span className="border-b border-primary/40 pb-1 transition-colors group-hover/link:border-primary">
                View Project
              </span>
              <span className="transition-transform duration-300 group-hover/link:translate-x-1">&rsaquo;</span>
            </button>
          ) : (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
              title="Open project"
            >
              <span className="border-b border-primary/40 pb-1 transition-colors group-hover/link:border-primary">
                View Project
              </span>
              <span className="transition-transform duration-300 group-hover/link:translate-x-1">&rsaquo;</span>
            </a>
          )}
        </div>
      )}
    </div>
  );

  if (!isDemoProject) {
    return (
      <div
        ref={cardRef}
        className="group h-full rounded-xl border border-border/50 bg-card/50 p-6 transition-colors duration-300 hover:border-primary/40 sm:p-7 lg:p-8"
      >
        {frontContent}
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      className={`h-full min-h-[340px] rounded-xl border border-border/50 bg-card/50 p-6 transition-colors duration-300 sm:min-h-[380px] sm:p-7 lg:p-8 ${
        showDemo ? '' : 'group hover:border-primary/40'
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
                          className="block h-full w-full object-contain object-center"
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
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, headingRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" className="relative pb-12 pt-6 sm:pb-16 sm:pt-10 md:pb-32 md:pt-24">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div ref={headingRef} className="mx-auto mb-8 flex max-w-6xl items-center gap-4 sm:mb-10">
          <span className="h-px w-10 bg-primary" />
          <span className="shimmer-text text-base font-semibold uppercase tracking-[0.4em] sm:text-lg md:text-xl">
            Projects
          </span>
        </div>

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
