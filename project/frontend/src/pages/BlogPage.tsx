import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlogPostSummary {
  id: number;
  slug: string;
  title: string;
  emoji: string;
  tag: string;
  excerpt: string;
  publishedAt: string;
}

export function BlogPage() {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog')
      .then((r) => r.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-1 font-display font-medium text-sm text-muted-foreground hover:text-ink transition-colors mb-8"
        data-testid="blog-back-link"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        back home
      </Link>

      <h1 className="font-display font-bold text-3xl sm:text-4xl mb-2">
        ✍️ Writing
      </h1>
      <p className="text-muted-foreground mb-8">
        Thoughts on AI, building products, and the occasional rant.
      </p>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border-[3px] border-ink/20 bg-stone p-6 animate-pulse h-36"
            />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="border-[3px] border-ink bg-cream p-8 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] text-center">
          <p className="text-2xl mb-2">📝</p>
          <p className="font-display font-bold text-lg">No posts yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Check back soon — something's brewing.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post, index) => (
            <Link
              to={`/blog/${post.slug}`}
              key={post.slug}
              className="block group"
              data-testid={`blog-card-${post.slug}`}
            >
              <article
                className={cn(
                  'border-[3px] border-ink bg-cream p-5 sm:p-6 transition-all duration-200',
                  'shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]',
                  'group-hover:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px]',
                  index % 2 === 0
                    ? 'group-hover:-rotate-[0.5deg]'
                    : 'group-hover:rotate-[0.5deg]'
                )}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <span className="text-3xl flex-shrink-0 mt-1">{post.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="inline-block px-2 py-0.5 text-xs font-display font-bold border-2 border-ink bg-yellow">
                        {post.tag}
                      </span>
                      <span className="text-xs text-muted-foreground font-display">
                        {formatDate(post.publishedAt)}
                      </span>
                    </div>
                    <h2 className="font-display font-bold text-lg sm:text-xl leading-tight mb-2">
                      {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      {post.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1 font-display font-medium text-sm text-ink group-hover:text-yellow transition-colors">
                      read more <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
