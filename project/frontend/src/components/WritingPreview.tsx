import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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

export function WritingPreview() {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog')
      .then((r) => r.json())
      .then((data) => {
        setPosts(data.slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="border-[3px] border-ink/20 bg-stone p-5 animate-pulse h-28"
          />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="border-[3px] border-ink/20 bg-stone p-6 text-center text-muted-foreground">
        <p className="font-display">No posts yet. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post, index) => (
        <Link
          to={`/blog/${post.slug}`}
          key={post.slug}
          className="block group"
          data-testid={`writing-preview-${post.slug}`}
        >
          <div
            className={cn(
              'border-[3px] border-ink bg-cream p-4 sm:p-5 transition-all duration-200',
              'shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]',
              'group-hover:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px]',
              index % 2 === 0 ? 'group-hover:-rotate-[0.5deg]' : 'group-hover:rotate-[0.5deg]'
            )}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0 mt-0.5">{post.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="inline-block px-2 py-0.5 text-xs font-display font-bold border-2 border-ink bg-yellow">
                    {post.tag}
                  </span>
                  <span className="text-xs text-muted-foreground font-display">
                    {formatDate(post.publishedAt)}
                  </span>
                </div>
                <h3 className="font-display font-bold text-base sm:text-lg leading-tight mb-1">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}
