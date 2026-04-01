import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { SectionTitle } from '@/components/SectionTitle';
import { WorkAccordion } from '@/components/WorkAccordion';
import { ProjectsAccordion } from '@/components/ProjectsAccordion';
import { ResumeHighlights } from '@/components/ResumeHighlights';
import { WritingPreview } from '@/components/WritingPreview';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function HomePage() {
  return (
    <motion.div
      className="max-w-3xl mx-auto px-4 sm:px-6"
      initial="initial"
      animate="animate"
      variants={stagger}
    >
      {/* Hero */}
      <section className="py-12 sm:py-16 md:py-20" data-testid="hero-section">
        <motion.h1
          className="font-display font-bold text-4xl sm:text-5xl md:text-6xl leading-[1.1] mb-4"
          variants={fadeUp}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block mr-2 animate-wave origin-[70%_70%]">👋</span> Hi, I'm Viviano
        </motion.h1>
        <motion.p
          className="font-display font-medium text-lg sm:text-xl text-ink/80 leading-snug mb-4 max-w-2xl"
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Senior Staff AI Tech Lead at WHOOP, Boston's Rat Czar [self-appointed] &amp; Commissioner of the Football Chess League.
        </motion.p>
        <motion.p
          className="text-base text-muted-foreground leading-relaxed mb-6 max-w-xl"
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          I build AI systems by day and ship side projects by night. 10+ years in software—from robotics to health tech to public data. Based in Boston. Obsessed with the gap between human intent and computer execution.
        </motion.p>
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow border-[3px] border-ink font-display font-bold text-sm shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            data-testid="hero-blog-cta"
          >
            📝 blog
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* Work */}
      <motion.section
        className="py-8 sm:py-12"
        data-testid="work-section"
        variants={fadeUp}
        transition={{ duration: 0.5 }}
      >
        <SectionTitle emoji="💼" title="Work" id="work" />
        <WorkAccordion />
      </motion.section>

      {/* Projects */}
      <motion.section
        className="py-8 sm:py-12"
        data-testid="projects-section"
        variants={fadeUp}
        transition={{ duration: 0.5 }}
      >
        <SectionTitle emoji="🚀" title="Projects" id="projects" />
        <ProjectsAccordion />
      </motion.section>

      {/* Resume Highlights */}
      <motion.section
        className="py-8 sm:py-12"
        data-testid="resume-section"
        variants={fadeUp}
        transition={{ duration: 0.5 }}
      >
        <SectionTitle emoji="📋" title="Core Strengths" id="resume" />
        <ResumeHighlights />
      </motion.section>

      {/* Writing */}
      <motion.section
        className="py-8 sm:py-12 pb-16"
        data-testid="writing-section"
        variants={fadeUp}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display font-bold text-2xl sm:text-3xl flex items-center gap-3">
            <span className="text-3xl sm:text-4xl" aria-hidden="true">✍️</span>
            Writing
          </h2>
          <Link
            to="/blog"
            className="font-display font-medium text-sm text-muted-foreground hover:text-ink transition-colors flex items-center gap-1 flex-shrink-0 pb-1"
            data-testid="all-posts-link"
          >
            all posts <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <WritingPreview />
      </motion.section>
    </motion.div>
  );
}
