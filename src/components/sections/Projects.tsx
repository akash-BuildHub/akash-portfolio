import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Hospital, ArrowLeft, Trophy, Vote, Smile, ScanFace, Radar, Camera, ScanText } from 'lucide-react';
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
    title: 'Real-Time Facial Recognition Attendance Platform',
    year: '2026',
    description:
      'Full-stack workforce platform that automates attendance from live camera face recognition, with payroll computation and HR/admin dashboards. Powered by GPU face recognition (InsightFace + ONNX Runtime CUDA) and live multi-camera WebRTC streaming.',
    features: ['InsightFace', 'ONNX Runtime (CUDA)', 'FastAPI', 'WebRTC'],
    icon: ScanFace,
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
    title: 'AI Election Prediction',
    year: '2026',
    description:
      'A data-driven election forecasting system that leverages machine learning models on historical voting data, demographic indicators, and sentiment signals to predict constituency-level outcomes with confidence scoring and interactive visual analytics.',
    features: ['Machine Learning', 'Forecasting', 'Data Analytics'],
    icon: Vote,
    link: 'https://owlytics-election-prediction.vercel.app/',
  },
  {
    title: 'AI Cricket Shot Classification & Batting Analysis System',
    year: '2026',
    description:
      'Cricket shot classifier built on a CNN-LSTM architecture with MobileNetV2 for video-based action recognition. Designed preprocessing and feature-engineering pipelines plus backend APIs for confidence scoring and performance tiering.',
    features: ['CNN-LSTM', 'MobileNetV2', 'FastAPI', 'Action Recognition'],
    icon: Trophy,
    link: 'https://ai-batting-classifier.vercel.app/',
  },
  {
    title: 'AI Real-Time Person Detection & Tracking System',
    year: '2026',
    description:
      'Real-time person detection and multi-object tracking pipeline using YOLO, processing RTSP streams with optimized inference. Implements frame-wise analytics and unique person counting.',
    features: ['YOLO', 'Multi-Object Tracking', 'RTSP', 'Python'],
    icon: Radar,
  },
  {
    title: 'Emotion Recognition',
    year: '2026',
    description:
      'An AI-powered emotion recognition system that uses deep learning and computer vision to detect facial expressions in real time and classify emotions such as happiness, sadness, anger, and surprise, enabling intelligent sentiment analysis and human-computer interaction.',
    features: ['Deep Learning', 'Computer Vision', 'Emotion Detection'],
    icon: Smile,
    link: 'https://emotion-recognition-two.vercel.app/',
  },
  {
    title: 'Vision Snap — Computer Vision Dataset Tool',
    year: '2025',
    description:
      'Dataset-generation tool built in React with webcam capture, video frame extraction, and automated dataset packaging workflows for computer vision.',
    features: ['React', 'Webcam Capture', 'Dataset Automation'],
    icon: Camera,
    link: 'https://vision-snap-two.vercel.app/',
  },
  {
    title: 'ALL IN ONE — OCR Web Application',
    year: '2025',
    description:
      'JavaScript OCR web app with a modular architecture and responsive UI for structured, multi-page text and image extraction from documents, PDFs, and uploads.',
    features: ['JavaScript', 'OCR', 'Modular Architecture'],
    icon: ScanText,
    link: 'https://allinone-snowy.vercel.app/',
  },
  {
    title: 'Hospital Management System with Brain Tumor Detection',
    year: '2024',
    description:
      'Django-based hospital management system with authentication workflows and integrated deep-learning brain tumor detection and medical reporting.',
    features: ['Django', 'Deep Learning', 'Medical Imaging'],
    icon: Hospital,
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

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
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

    // Even indices sit in the left column, odd indices in the right column.
    // Slide each card in from its own side as it scrolls into view.
    const fromLeft = index % 2 === 0;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, x: fromLeft ? -260 : 260 },
        {
          opacity: 1,
          x: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 90%',
            end: 'top 55%',
            scrub: 1,
          },
        }
      );
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

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
                        className="absolute left-1/2 top-1/2 flex h-[94%] w-[96%] -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-md bg-black shadow-[0_16px_40px_rgba(0,0,0,0.55)] transition-all duration-500 ease-smooth sm:h-[96%] sm:w-[89%]"
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
          ease: 'none',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 90%',
            end: 'top 65%',
            scrub: 1,
          },
        }
      );
    }, headingRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" className="relative overflow-hidden pb-12 pt-6 sm:pb-16 sm:pt-10 md:pb-32 md:pt-24">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div ref={headingRef} className="mx-auto mb-8 flex max-w-6xl items-center gap-4 sm:mb-10">
          <span className="h-px w-10 bg-primary" />
          <span className="shimmer-text text-base font-semibold uppercase tracking-[0.4em] sm:text-lg md:text-xl">
            Projects
          </span>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
