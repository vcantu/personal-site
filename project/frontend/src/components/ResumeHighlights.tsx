import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HighlightItem {
  icon: string;
  title: string;
  description: string;
}

const HIGHLIGHTS: HighlightItem[] = [
  {
    icon: '🤖',
    title: 'AI Infrastructure',
    description: 'Built AIQL & WHOOP Coach — production AI systems serving millions of users. Expert in LLM architecture, prompt engineering, and real-time personalization.',
  },
  {
    icon: '🏗️',
    title: 'Full-Stack Systems',
    description: 'End-to-end product ownership: from TypeScript/React frontends to Python/Java backends. 10+ years shipping from robotics to health tech to public data.',
  },
  {
    icon: '📈',
    title: 'Data-Driven Product',
    description: 'SQL expert. Transformed raw data (health metrics, public records, game state) into actionable insights. Built ratradar.com serving 18 US cities.',
  },
  {
    icon: '🎯',
    title: 'Shipped Products',
    description: 'Shipped 5 side projects with real users: ratradar (LIVE), BLUF, Football Chess, vibe-stats. Deployed to prod, managed Stripe payments, scaled to demand.',
  },
  {
    icon: '🔬',
    title: 'AI Research & Experimentation',
    description: 'Built an AI loop that auto-optimizes Lighthouse scores. Designed experiments, implemented feedback systems, measured real-world impact.',
  },
  {
    icon: '🧩',
    title: 'Tech Depth',
    description: 'TypeScript, React, Python, Java, AWS, PostgreSQL, Firebase, Next.js, Real-time systems, LLM APIs, DevOps, TDD, CI/CD.',
  },
];

export function ResumeHighlights() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {HIGHLIGHTS.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          viewport={{ once: true }}
          className={cn(
            'border-[3px] border-ink bg-cream p-4 sm:p-5',
            'shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]',
            'hover:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] hover:translate-x-[2px] hover:translate-y-[2px]',
            'transition-all duration-200'
          )}
          data-testid={`resume-highlight-${item.title.replace(/\s+/g, '-').toLowerCase()}`}
        >
          <div className="flex gap-3 h-full">
            <span className="text-2xl flex-shrink-0">{item.icon}</span>
            <div className="min-w-0">
              <h3 className="font-display font-bold text-base leading-tight mb-2">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-ink/80">{item.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
