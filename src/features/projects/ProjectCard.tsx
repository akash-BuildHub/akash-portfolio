import { ArrowUpRight } from 'lucide-react';
import type { Project } from './projects.data';

interface ProjectCardProps {
  project: Project;
  isActive: boolean;
  onActivate: () => void;
  onOpenGallery: () => void;
  className?: string;
}

// White title with the last word in gold; on the gold active card it goes all dark.
const renderTitle = (title: string, isActive: boolean) => {
  if (isActive) return title;
  const words = title.trim().split(/\s+/);
  const last = words.pop();
  return (
    <>
      {words.length > 0 && <span className="text-white">{words.join(' ')} </span>}
      <span className="text-primary">{last}</span>
    </>
  );
};

const ProjectCard = ({
  project,
  isActive,
  onActivate,
  onOpenGallery,
  className = '',
}: ProjectCardProps) => {
  const hasGallery = Boolean(project.demoImages?.length);

  const actionClass = `group/action absolute bottom-1.5 right-1.5 flex h-[52px] w-[52px] items-center justify-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
    isActive
      ? 'bg-primary text-primary-foreground'
      : 'bg-white/[0.06] text-foreground hover:bg-primary hover:text-primary-foreground'
  }`;
  const arrow = (
    <ArrowUpRight
      className="h-5 w-5 transition-transform duration-300 group-hover/action:rotate-45"
      strokeWidth={1.75}
    />
  );

  return (
    <article
      onMouseEnter={onActivate}
      onFocus={onActivate}
      className={`project-card group relative ${className}`}
    >
      {/* Card body; the notch cut from its bottom-right corner holds the action */}
      <div
        className={`project-notch flex h-full flex-col overflow-hidden rounded-[1.75rem] transition-colors duration-500 ${
          isActive ? 'bg-primary' : 'bg-white/[0.045]'
        }`}
      >
        {/* Header: the title. It grows to fill the card, so the dividers of
            cards in the same row line up whatever the title length. */}
        <div className="flex-1 p-6 sm:p-7">
          <h3
            className={`text-lg font-bold uppercase leading-snug tracking-wide sm:text-xl ${
              isActive ? 'text-primary-foreground' : ''
            }`}
          >
            {renderTitle(project.title, isActive)}
          </h3>
        </div>

        {/* Preview: the cover rests on a stack of two translucent sheets */}
        <div
          className={`relative h-52 shrink-0 border-t transition-colors duration-500 sm:h-60 lg:h-72 xl:h-64 ${
            isActive ? 'border-primary-foreground/15' : 'border-white/10'
          }`}
        >
          <div
            aria-hidden="true"
            className={`absolute inset-x-11 bottom-0 top-4 rounded-t-[1.125rem] transition duration-500 group-hover:-translate-y-1.5 ${
              isActive ? 'bg-white/25' : 'bg-white/[0.05]'
            }`}
          />
          <div
            aria-hidden="true"
            className={`absolute inset-x-5 bottom-0 top-7 rounded-t-[1.25rem] transition duration-500 group-hover:-translate-y-1 ${
              isActive ? 'bg-white/40' : 'bg-white/[0.09]'
            }`}
          />
          <div className="absolute inset-x-0 bottom-0 top-10 overflow-hidden rounded-t-[1.375rem]">
            {project.image ? (
              <img
                src={project.image}
                alt={`${project.title} preview`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-top transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
              />
            ) : (
              <div
                aria-hidden="true"
                className="project-art flex h-full w-full items-center justify-center"
              >
                <project.icon className="h-14 w-14 text-primary/80" strokeWidth={1.1} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action in the notch: screenshots, the live demo, or — with neither —
          just the project's icon */}
      {hasGallery ? (
        <button
          type="button"
          onClick={onOpenGallery}
          aria-label={`View ${project.title} screenshots`}
          className={actionClass}
        >
          {arrow}
        </button>
      ) : project.link ? (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${project.title} (opens in a new tab)`}
          className={actionClass}
        >
          {arrow}
        </a>
      ) : (
        <span
          aria-hidden="true"
          className="absolute bottom-1.5 right-1.5 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white/[0.04] text-foreground/40"
        >
          <project.icon className="h-5 w-5" strokeWidth={1.5} />
        </span>
      )}
    </article>
  );
};

export default ProjectCard;
