import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import assetsData from '@/generated/assets.json';

interface AssetEntry {
  name: string;
  url?: string;
  attribution_text: string;
  attribution_required: boolean;
}

export function CreditsPage() {
  const allCredits: AssetEntry[] = [
    ...assetsData.packages.map((p) => ({
      name: p.name,
      url: `https://www.npmjs.com/package/${p.name}`,
      attribution_text: p.attribution_text,
      attribution_required: p.attribution_required,
    })),
    ...assetsData.assets.map((a) => ({
      name: a.name,
      url: a.url,
      attribution_text: a.attribution_text,
      attribution_required: a.attribution_required,
    })),
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-1 font-display font-medium text-sm text-muted-foreground hover:text-ink transition-colors mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        back home
      </Link>

      <h1 className="font-display font-bold text-3xl sm:text-4xl mb-2">
        🙏 Credits
      </h1>
      <p className="text-muted-foreground mb-8">
        This site uses the following open-source tools and assets.
      </p>

      <div className="space-y-3">
        {allCredits.map((credit) => (
          <div
            key={credit.name}
            className="border-[3px] border-ink bg-cream p-4 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display font-bold text-base">{credit.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {credit.attribution_text}
                </p>
              </div>
              {credit.url && (
                <a
                  href={credit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-muted-foreground hover:text-ink transition-colors"
                  aria-label={`Visit ${credit.name}`}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
