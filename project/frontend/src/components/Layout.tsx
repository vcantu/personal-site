import { Outlet, Link, useLocation } from 'react-router-dom';
import { Mail, ArrowUp } from 'lucide-react';
import { GithubIcon, TwitterIcon, LinkedinIcon } from '@/components/SocialIcons';
import { useState, useEffect } from 'react';

export function Layout() {
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b-[3px] border-ink">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="font-display font-bold text-lg tracking-tight hover:text-yellow transition-colors"
            data-testid="nav-logo"
          >
            viviano.cantu
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/blog"
              className="font-display font-medium text-sm hover:text-yellow transition-colors"
              data-testid="nav-blog"
            >
              blog
            </Link>
            <a
              href="https://github.com/vcantu"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow transition-colors"
              aria-label="GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t-[3px] border-ink bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-wrap gap-3 mb-6">
            <FooterPill
              href="https://x.com/vivianocantu"
              icon={<TwitterIcon className="w-4 h-4" />}
              label="X / Twitter"
            />
            <FooterPill
              href="https://linkedin.com/in/vivianocantu"
              icon={<LinkedinIcon className="w-4 h-4" />}
              label="LinkedIn"
            />
            <FooterPill
              href="https://github.com/vcantu"
              icon={<GithubIcon className="w-4 h-4" />}
              label="GitHub"
            />
            <FooterPill
              href="mailto:viviano@cantu.info"
              icon={<Mail className="w-4 h-4" />}
              label="Email"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Viviano Cantu</p>
            <Link to="/credits" className="hover:text-ink underline decoration-dotted underline-offset-4">
              Credits
            </Link>
          </div>
        </div>
      </footer>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 bg-ink text-cream p-2 border-2 border-ink shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

function FooterPill({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 bg-cream border-2 border-ink text-ink font-display font-medium text-sm shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] hover:shadow-[1px_1px_0px_0px_rgba(26,26,26,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
    >
      {icon}
      {label}
    </a>
  );
}
