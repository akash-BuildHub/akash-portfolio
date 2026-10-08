import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { Project } from './projects.data';

interface ProjectGalleryProps {
  project: Project | null;
  onClose: () => void;
}

const roundButton =
  'flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-foreground transition-colors duration-300 hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';

// Screenshot viewer for projects that ship demo images instead of a live link.
// Built on <dialog>, which traps focus, closes on Esc and hands focus back to
// the button that opened it.
const ProjectGallery = ({ project, onClose }: ProjectGalleryProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const images = project?.demoImages ?? [];
  const count = images.length;

  useEffect(() => {
    if (!project) return;
    setIndex(0);
    dialogRef.current?.showModal();
    // Keep the page behind the dialog from scrolling while it is open.
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [project]);

  const close = () => dialogRef.current?.close();
  const step = (delta: number) => setIndex((i) => (i + delta + count) % count);

  return (
    <dialog
      ref={dialogRef}
      aria-label={project ? `${project.title} screenshots` : undefined}
      onClose={onClose}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') step(-1);
        if (e.key === 'ArrowRight') step(1);
      }}
      className="m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 text-foreground backdrop:bg-black/85 backdrop:backdrop-blur-sm"
    >
      {project && count > 0 && (
        // Clicking the empty space around the screenshot closes the viewer.
        <div
          onClick={(e) => e.target === e.currentTarget && close()}
          className="flex h-full w-full flex-col items-center justify-center gap-5 p-4 sm:p-8"
        >
          <div className="flex w-full max-w-5xl items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-foreground/80">
              {project.title}
            </p>
            <div className="flex shrink-0 items-center gap-4">
              <span className="text-xs tracking-[0.2em] text-foreground/50">
                {index + 1} / {count}
              </span>
              <button type="button" onClick={close} aria-label="Close gallery" className={roundButton}>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <img
            key={images[index]}
            src={images[index]}
            alt={`${project.title} screenshot ${index + 1} of ${count}`}
            className="max-h-[70vh] w-auto max-w-full animate-fade-in rounded-xl object-contain shadow-2xl sm:max-w-5xl"
          />

          {count > 1 && (
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous screenshot"
                className={roundButton}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                {images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Show screenshot ${i + 1}`}
                    aria-current={i === index}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === index ? 'w-6 bg-primary' : 'w-1.5 bg-white/30 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next screenshot"
                className={roundButton}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
};

export default ProjectGallery;
