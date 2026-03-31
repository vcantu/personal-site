import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function NotFoundPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className="text-7xl sm:text-8xl block mb-6" aria-hidden="true">🕳️</span>
        <h1 className="font-display font-bold text-3xl sm:text-4xl mb-3">
          404 — Page not found
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          This page doesn't exist. Maybe it did once, maybe it never will. Either way, there's nothing here.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow border-[3px] border-ink font-display font-bold text-sm shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          data-testid="404-home-link"
        >
          ← Back to home
        </Link>
      </motion.div>
    </div>
  );
}
