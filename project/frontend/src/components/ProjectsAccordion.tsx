import { useState } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProjectItem {
  emoji: string;
  name: string;
  url: string;
  status: 'live' | 'building';
  description: string;
}

const PROJECTS: ProjectItem[] = [
  {
    emoji: '🐀',
    name: 'ratradar.com',
    url: 'https://ratradar.com',
    status: 'live',
    description:
      "Real government health inspection data mapped across US cities. Because knowing what's in your food — and your neighborhood — shouldn't require a public records request. Live in Boston, NYC & Chicago.",
  },
  {
    emoji: '🧠',
    name: 'bluf.ai',
    url: 'https://bluf.ai',
    status: 'building',
    description:
      'An AI layer that lives in your browser. Pull context from any tab, run writing transforms on command, keep your thinking in one place. Still building — but using it every day.',
  },
  {
    emoji: '🏈',
    name: 'footballchess.com',
    url: 'https://footballchess.com',
    status: 'building',
    description:
      'Turn-based strategy game at the intersection of football and chess. Each play is a move. Read the defense, call your formation, outsmart your opponent. Phase 1 shipped.',
  },
  {
    emoji: '📊',
    name: 'vibe-stats',
    url: 'https://github.com/vcantu/vibe-stats',
    status: 'live',
    description:
      'CLI tool that analyzes your Claude Code session history and gives you developer productivity stats. See how much time you spend coding, debugging, shipping. Built for AI-assisted development.',
  },
];

export function ProjectsAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {PROJECTS.map((project, index) => {
        const isOpen = openIndex === index;
        return (
          <motion.div
            key={project.name}
            className={cn(
              'border-[3px] border-ink bg-cream transition-shadow duration-200',
              'shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]',
              isOpen && 'shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]'
            )}
            animate={{
              x: isOpen ? 2 : 0,
              y: isOpen ? 2 : 0,
            }}
            transition={{ duration: 0.2 }}
            data-testid={`project-item-${project.name.replace(/\./g, '-')}`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full text-left px-4 sm:px-5 py-4 flex items-center justify-between gap-3 cursor-pointer"
              data-testid={`project-toggle-${project.name.replace(/\./g, '-')}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl flex-shrink-0">{project.emoji}</span>
                <div className="min-w-0">
                  <div className="font-display font-bold text-lg leading-tight flex items-center gap-2 flex-wrap">
                    {project.name}
                    <StatusBadge status={project.status} />
                  </div>
                </div>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5 flex-shrink-0" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-4 sm:px-5 pb-5 border-t-2 border-ink/10 pt-4">
                    <p className="text-sm leading-relaxed mb-4">{project.description}</p>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-display font-medium text-sm text-ink hover:text-yellow transition-colors underline decoration-2 underline-offset-4"
                    >
                      Visit {project.name}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

function StatusBadge({ status }: { status: 'live' | 'building' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-display font-bold uppercase tracking-wider border-2 border-ink',
        status === 'live' ? 'bg-green text-ink' : 'bg-orange text-ink'
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full',
          status === 'live' ? 'bg-ink' : 'bg-ink animate-pulse'
        )}
      />
      {status}
    </span>
  );
}
