import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface WorkItem {
  emoji: string;
  company: string;
  role: string;
  period: string;
  theyDo: string;
  iDid: string;
  stack: string[];
  previousTitles?: string[];
}

const WORK_ITEMS: WorkItem[] = [
  {
    emoji: '⌚️',
    company: 'WHOOP',
    role: 'Senior Staff AI Tech Lead',
    period: 'Oct 2020 — present',
    theyDo: 'Build the most advanced wearable health & fitness platform on the market.',
    iDid: 'Created AIQL (AI Query Language), a foundational AI infrastructure layer now powering personalized insights across all of WHOOP. Built and launched WHOOP Coach — the company\'s first LLM-powered feature, delivering real-time health coaching to millions of members. Promoted to Senior Staff in 2026.',
    stack: ['TypeScript', 'React', 'Python', 'AWS', 'OpenAI API', 'LLMs'],
    previousTitles: ['Staff Engineer (2024)', 'Senior Software Engineer (2022)', 'Software Engineer (2020)'],
  },
  {
    emoji: '🤖',
    company: 'Amazon Robotics',
    role: 'SDE II',
    period: 'Jul 2019 — Oct 2020',
    theyDo: 'Run the largest fleet of autonomous mobile robots in the world.',
    iDid: 'Built real-time floor visualizations for robot operations, giving operators instant visibility into what hundreds of robots were doing simultaneously.',
    stack: ['Java', 'React', 'AWS', 'Real-time Systems'],
  },
  {
    emoji: '📸',
    company: 'Axon / TASER',
    role: 'Data Analyst & PM',
    period: 'Jul 2017 — Dec 2017',
    theyDo: 'Build technology to protect life — body cameras, evidence management, AI for public safety.',
    iDid: 'Analyzed usage patterns and informed product decisions for body camera adoption across law enforcement agencies.',
    stack: ['SQL', 'Python', 'Tableau', 'Product Management'],
  },
];

export function WorkAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {WORK_ITEMS.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <motion.div
            key={item.company}
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
            data-testid={`work-item-${item.company.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full text-left px-4 sm:px-5 py-4 flex items-center justify-between gap-3 cursor-pointer"
              data-testid={`work-toggle-${item.company.toLowerCase().replace(/[\s/]+/g, '-')}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                <div className="min-w-0">
                  <div className="font-display font-bold text-lg leading-tight">
                    {item.company}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.role} · {item.period}
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
                    <div className="space-y-3">
                      <div>
                        <span className="font-display font-bold text-sm uppercase tracking-wide text-muted-foreground">They:</span>
                        <p className="mt-1 text-sm leading-relaxed">{item.theyDo}</p>
                      </div>
                      <div>
                        <span className="font-display font-bold text-sm uppercase tracking-wide text-muted-foreground">I:</span>
                        <p className="mt-1 text-sm leading-relaxed">{item.iDid}</p>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {item.stack.map((tech) => (
                          <span
                            key={tech}
                            className="inline-block px-2 py-0.5 text-xs font-display font-medium border-2 border-ink bg-stone"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {item.previousTitles && (
                        <div className="pt-2 border-t border-ink/10">
                          <p className="text-xs text-muted-foreground italic">
                            Previously: {item.previousTitles.join(' → ')}
                          </p>
                        </div>
                      )}
                    </div>
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
