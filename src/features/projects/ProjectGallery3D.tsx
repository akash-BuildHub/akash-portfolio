import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import {
  ArrowUpRight,
  Brain,
  Camera,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Eye,
  Lightbulb,
  Rotate3d,
  ScanFace,
  Settings,
  X,
  type LucideIcon,
} from 'lucide-react';
import { projects } from './projects.data';
import { createGalleryScene, type GalleryScene } from './gallery3dScene';

interface ProjectGallery3DProps {
  onClose: () => void;
}

// Every project image in list order, tagged with its project.
const SHOTS = projects.flatMap((project) => (project.image ? [{ src: project.image, project }] : []));

// One chip per project that has screenshots, jumping to its first one.
const CHIPS = projects
  .map((project) => ({ project, first: SHOTS.findIndex((shot) => shot.project === project) }))
  .filter((chip) => chip.first !== -1);

// Gold line icons drifting around the scene; deeper ones shift more with the pointer.
const FLOATERS: { Icon: LucideIcon; className: string; depth: number }[] = [
  { Icon: Camera, className: 'left-[7%] top-[22%]', depth: 26 },
  { Icon: Settings, className: 'right-[9%] top-[18%]', depth: 18 },
  { Icon: Lightbulb, className: 'right-[5%] top-[48%] hidden sm:block', depth: 30 },
  { Icon: ScanFace, className: 'left-[11%] bottom-[30%]', depth: 22 },
  { Icon: Cpu, className: 'right-[15%] bottom-[26%] hidden sm:block', depth: 14 },
  { Icon: Brain, className: 'left-[26%] top-[13%] hidden md:block', depth: 12 },
  { Icon: Eye, className: 'left-[4%] top-[55%] hidden md:block', depth: 34 },
];

const circle =
  'pointer-events-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';
const roundButton = `${circle} bg-white/10 text-foreground hover:bg-primary hover:text-primary-foreground`;
const goldButton = `${circle} bg-primary text-primary-foreground hover:bg-primary/85`;

const Floater = ({
  Icon,
  className,
  depth,
  index,
  pointerX,
  pointerY,
}: {
  Icon: LucideIcon;
  className: string;
  depth: number;
  index: number;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}) => {
  const x = useTransform(pointerX, (v) => v * depth);
  const y = useTransform(pointerY, (v) => v * depth);
  return (
    <motion.div style={{ x, y }} className={`absolute ${className}`}>
      <motion.div
        animate={{ y: [0, -14, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 6 + index, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}
      >
        <Icon
          className="h-7 w-7 text-primary/60 drop-shadow-[0_0_10px_hsl(var(--primary)/0.7)]"
          strokeWidth={1.25}
        />
      </motion.div>
    </motion.div>
  );
};

// Full-screen 3D gallery of every project screenshot. Loaded on demand (it
// pulls in Three.js), shown in a <dialog> so focus stays inside and Esc works.
const ProjectGallery3D = ({ onClose }: ProjectGallery3DProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<GalleryScene | null>(null);
  const [ready, setReady] = useState(false);
  const [focused, setFocused] = useState<number | null>(null);
  const [closing, setClosing] = useState(false);
  const still = useReducedMotion() ?? false;

  // Pointer position (-0.5..0.5), smoothed, drives the icons' parallax.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const pointerX = useSpring(rawX, { stiffness: 50, damping: 18 });
  const pointerY = useSpring(rawY, { stiffness: 50, damping: 18 });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    // Keep the page behind the gallery from scrolling.
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const scene = createGalleryScene(stage, {
      images: SHOTS.map((shot) => shot.src),
      reducedMotion: still,
      onReady: () => setReady(true),
      onSelect: setFocused,
    });
    sceneRef.current = scene;
    return () => {
      scene.dispose();
      sceneRef.current = null;
    };
  }, [still]);

  useEffect(() => {
    sceneRef.current?.focus(focused);
  }, [focused]);

  // Previous / next screen (from the focused one, or the one facing the viewer).
  const step = useCallback(
    (delta: number) =>
      setFocused((current) => {
        const from = current ?? sceneRef.current?.frontIndex() ?? 0;
        return (from + delta + SHOTS.length) % SHOTS.length;
      }),
    []
  );

  // ← / → anywhere while the gallery is open: clicking the canvas leaves focus
  // on the page body, so a listener on the dialog alone would miss them.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [step]);

  const shot = focused !== null ? SHOTS[focused] : null;
  const projectShots = shot ? SHOTS.filter((s) => s.project === shot.project) : [];

  return (
    <dialog
      ref={dialogRef}
      aria-label="Project gallery"
      onCancel={(e) => {
        // Esc steps back out of a focused screen before closing the gallery.
        e.preventDefault();
        if (focused !== null) setFocused(null);
        else setClosing(true);
      }}
      // Fires however the dialog ends up closed, including when the browser
      // closes it directly on a quick second Esc (it won't let a page block
      // repeated Esc presses), so the gallery always unmounts and unlocks scrolling.
      onClose={onClose}
      className="m-0 h-full max-h-none w-full max-w-none overflow-hidden border-0 bg-transparent p-0 text-foreground backdrop:bg-black/80"
    >
      <MotionConfig reducedMotion="user">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: closing ? 0 : 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          onAnimationComplete={() => {
            if (closing) dialogRef.current?.close();
          }}
          onPointerMove={(e) => {
            rawX.set(e.clientX / window.innerWidth - 0.5);
            rawY.set(e.clientY / window.innerHeight - 0.5);
          }}
          className="relative h-full w-full overflow-hidden bg-[#0f0f11]"
        >
          {/* Warm glow behind the carousel */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,hsl(var(--primary)/0.14),transparent_62%)]"
          />

          {/* Floating icons, behind the 3D screens */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            {FLOATERS.map((floater, i) => (
              <Floater key={i} {...floater} index={i} pointerX={pointerX} pointerY={pointerY} />
            ))}
          </div>

          {/* Three.js canvas */}
          <motion.div
            ref={stageRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute inset-0"
          />

          <AnimatePresence>
            {!ready && (
              <motion.div
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4"
              >
                <span className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
                <span className="text-[0.65rem] uppercase tracking-[0.3em] text-foreground/50">
                  Loading gallery
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-5 sm:p-8">
            <div>
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-primary" />
                <span className="shimmer-text text-xs font-semibold uppercase tracking-[0.4em] sm:text-sm">
                  Project Gallery
                </span>
              </div>
              <p className="mt-3 text-[0.65rem] uppercase tracking-[0.25em] text-foreground/45">
                <span className="hidden sm:inline">Drag to rotate · Scroll to zoom · Click a screen</span>
                <span className="sm:hidden">Swipe to rotate · Tap a screen</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setClosing(true)}
              aria-label="Close gallery"
              className={roundButton}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Footer: project chips, or the focused screen's caption */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center p-5 sm:p-8">
            <AnimatePresence mode="wait">
              {ready && !shot && (
                <motion.div
                  key="chips"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.35 }}
                  className="pointer-events-auto flex max-w-full gap-2 overflow-x-auto pb-1 [scrollbar-width:none]"
                >
                  {CHIPS.map(({ project, first }) => (
                    <button
                      key={project.title}
                      type="button"
                      onClick={() => setFocused(first)}
                      className="max-w-[16rem] shrink-0 truncate rounded-full border border-white/15 bg-black/40 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-foreground/75 backdrop-blur transition-colors duration-300 hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {project.title}
                    </button>
                  ))}
                </motion.div>
              )}

              {ready && shot && (
                <motion.div
                  key="caption"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.35 }}
                  className="pointer-events-auto flex w-full max-w-xl items-center gap-3 rounded-2xl border border-white/10 bg-black/55 p-3 backdrop-blur-md sm:gap-4"
                >
                  <button
                    type="button"
                    onClick={() => setFocused(null)}
                    aria-label="Back to all screens"
                    className={roundButton}
                  >
                    <Rotate3d className="h-5 w-5" strokeWidth={1.75} />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-primary">
                      {projectShots.length > 1
                        ? `Screen ${projectShots.indexOf(shot) + 1} of ${projectShots.length}`
                        : shot.project.year}
                    </p>
                    <h3 className="mt-1 truncate text-sm font-bold uppercase tracking-wide text-white">
                      {shot.project.title}
                    </h3>
                  </div>
                  {shot.project.link && (
                    <a
                      href={shot.project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${shot.project.title} (opens in a new tab)`}
                      className={goldButton}
                    >
                      <ArrowUpRight className="h-5 w-5" strokeWidth={1.75} />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous screen"
                    className={roundButton}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next screen"
                    className={roundButton}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </MotionConfig>
    </dialog>
  );
};

export default ProjectGallery3D;
