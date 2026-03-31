import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  emoji: string;
  tag: string;
  excerpt: string;
  content: string;
  publishedAt: string;
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/blog/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-stone w-20" />
          <div className="h-10 bg-stone w-3/4" />
          <div className="h-4 bg-stone w-1/3" />
          <div className="h-64 bg-stone" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-8 sm:py-12 text-center">
        <p className="text-4xl mb-4">🔍</p>
        <h1 className="font-display font-bold text-2xl mb-2">Post not found</h1>
        <p className="text-muted-foreground mb-6">
          This post doesn't exist or has been removed.
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-4 py-2 bg-yellow border-[3px] border-ink font-display font-bold text-sm shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          back to blog
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-[680px] mx-auto px-4 sm:px-6 py-8 sm:py-12" data-testid="blog-post">
      <Link
        to="/blog"
        className="inline-flex items-center gap-1 font-display font-medium text-sm text-muted-foreground hover:text-ink transition-colors mb-8"
        data-testid="post-back-link"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        all posts
      </Link>

      <header className="mb-8">
        <h1 className="font-display font-bold text-3xl sm:text-4xl leading-tight mb-3">
          {post.emoji} {post.title}
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-block px-2 py-0.5 text-xs font-display font-bold border-2 border-ink bg-yellow">
            {post.tag}
          </span>
          <span className="text-sm text-muted-foreground font-display">
            {formatDate(post.publishedAt)}
          </span>
        </div>
      </header>

      <div className="prose-brutalist" data-testid="blog-post-content">
        <MarkdownRenderer content={post.content} />
      </div>
    </article>
  );
}

function MarkdownRenderer({ content }: { content: string }) {
  // Simple markdown renderer for the blog post content
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let codeBlock: string[] | null = null;
  let codeBlockLang = '';

  while (i < lines.length) {
    const line = lines[i];

    // Code blocks
    if (line.startsWith('```')) {
      if (codeBlock !== null) {
        elements.push(
          <pre
            key={`code-${i}`}
            className="bg-ink text-cream p-4 sm:p-5 overflow-x-auto border-[3px] border-ink text-sm font-mono leading-relaxed my-6"
          >
            <code>{codeBlock.join('\n')}</code>
          </pre>
        );
        codeBlock = null;
      } else {
        codeBlock = [];
        codeBlockLang = line.slice(3);
      }
      i++;
      continue;
    }

    if (codeBlock !== null) {
      codeBlock.push(line);
      i++;
      continue;
    }

    // Headers
    if (line.startsWith('## ')) {
      elements.push(
        <h2
          key={`h2-${i}`}
          className="font-display font-bold text-xl sm:text-2xl mt-10 mb-4 border-b-2 border-ink/10 pb-2"
        >
          {line.slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    if (line.startsWith('### ')) {
      elements.push(
        <h3
          key={`h3-${i}`}
          className="font-display font-bold text-lg mt-8 mb-3"
        >
          {line.slice(4)}
        </h3>
      );
      i++;
      continue;
    }

    // Ordered lists (both "1. **bold** — rest" and plain "1. text" formats)
    const olMatchBold = line.match(/^(\d+)\.\s\*\*(.*?)\*\*\s*—\s*(.*)/);
    const olMatchPlain = line.match(/^(\d+)\.\s+(.*)/);
    if (olMatchBold || olMatchPlain) {
      const listItems: { num: string; content: React.ReactNode }[] = [];
      while (i < lines.length) {
        const mBold = lines[i].match(/^(\d+)\.\s\*\*(.*?)\*\*\s*—\s*(.*)/);
        const mPlain = lines[i].match(/^(\d+)\.\s+(.*)/);
        if (mBold) {
          listItems.push({
            num: mBold[1],
            content: (
              <span>
                <strong className="font-display font-bold">{mBold[2]}</strong> — {mBold[3]}
              </span>
            ),
          });
          i++;
        } else if (mPlain) {
          listItems.push({
            num: mPlain[1],
            content: <span>{renderInlineMarkdown(mPlain[2])}</span>,
          });
          i++;
        } else {
          break;
        }
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-none space-y-3 my-6 pl-0">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex gap-3 text-base leading-relaxed">
              <span className="font-display font-bold text-yellow flex-shrink-0">
                {item.num}.
              </span>
              {item.content}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Empty lines
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Regular paragraphs
    elements.push(
      <p key={`p-${i}`} className="text-base leading-relaxed my-4 text-ink/90">
        {renderInlineMarkdown(line)}
      </p>
    );
    i++;
  }

  return <>{elements}</>;
}

function renderInlineMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining.length > 0) {
    // Bold
    const boldMatch = remaining.match(/\*\*(.*?)\*\*/);
    // Italic (single * around text, not bold **)
    const italicMatch = remaining.match(/(?:^|[^*])\*([^*]+)\*(?:[^*]|$)/);
    // Inline code
    const codeMatch = remaining.match(/`([^`]+)`/);

    let firstMatch: { index: number; length: number; node: React.ReactNode } | null = null;

    if (boldMatch && boldMatch.index !== undefined) {
      const candidate = {
        index: boldMatch.index,
        length: boldMatch[0].length,
        node: (
          <strong key={`b-${keyIdx++}`} className="font-display font-bold">
            {boldMatch[1]}
          </strong>
        ),
      };
      if (!firstMatch || candidate.index < firstMatch.index) {
        firstMatch = candidate;
      }
    }

    if (italicMatch && italicMatch.index !== undefined) {
      const candidate = {
        index: italicMatch.index,
        length: italicMatch[0].length,
        node: (
          <em key={`i-${keyIdx++}`} className="italic">
            {italicMatch[1]}
          </em>
        ),
      };
      if (!firstMatch || candidate.index < firstMatch.index) {
        firstMatch = candidate;
      }
    }

    if (codeMatch && codeMatch.index !== undefined) {
      const candidate = {
        index: codeMatch.index,
        length: codeMatch[0].length,
        node: (
          <code
            key={`c-${keyIdx++}`}
            className="bg-stone px-1.5 py-0.5 font-mono text-sm border border-ink/20"
          >
            {codeMatch[1]}
          </code>
        ),
      };
      if (!firstMatch || candidate.index < firstMatch.index) {
        firstMatch = candidate;
      }
    }

    if (firstMatch) {
      if (firstMatch.index > 0) {
        parts.push(remaining.slice(0, firstMatch.index));
      }
      parts.push(firstMatch.node);
      remaining = remaining.slice(firstMatch.index + firstMatch.length);
    } else {
      parts.push(remaining);
      break;
    }
  }

  return parts;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
