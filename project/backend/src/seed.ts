/**
 * Seed script. Run once at deploy time, NOT at server startup.
 * Usage: bun run src/seed.ts
 */
import { db } from "./db.ts";
import { blogPosts } from "./schema.ts";

const BLOG_POST_CONTENT = `I've been obsessed with Lighthouse scores lately. Not because I think they're the ultimate measure of web performance — they're not — but because they're a perfect optimization target for an AI loop.

## The Setup

I built a tool that runs in a loop: measure Lighthouse score, analyze the report, generate a code change, apply it, re-measure. Simple concept. The execution? That's where it gets interesting.

## 25 Rounds, 2 Wins

Out of 25 optimization rounds, only 2 actually improved the score meaningfully. The rest were either neutral, regressions that got rolled back, or changes that improved one metric while tanking another.

The big win came from a single commit: **moving Google Tag Manager and Ahrefs analytics scripts to \`lazyOnload\`**. That alone moved the performance score from 57 to 74.

\`\`\`javascript
// Before: blocking the main thread
<script src="https://www.googletagmanager.com/gtag/js?id=GA_ID" />

// After: load when the browser is idle
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_ID"
  strategy="lazyOnload"
/>
\`\`\`

## What the AI Got Wrong

A lot, actually. Some highlights:

1. **Over-optimizing images** — It tried to convert PNGs that were already optimized, adding build complexity for zero gain
2. **Removing useful CSS** — It identified "unused" CSS that was actually used by dynamically rendered components
3. **Aggressive code splitting** — Breaking bundles into too many tiny chunks actually hurt performance due to HTTP/2 overhead
4. **Font subsetting gone wrong** — Removed character ranges that included accented characters used in the content

## What's Still Broken

The accessibility score barely moved. Turns out, fixing color contrast ratios and ARIA labels requires understanding the *design intent*, not just running rules. The AI kept suggesting changes that technically passed the rules but made the UI worse.

The SEO score is stubbornly stuck at 92. The remaining 8 points are all about structured data and meta descriptions that need human judgment about what the page is actually *about*.

## The Tool

The loop runner is open-source. It's basically:

1. Run Lighthouse CI
2. Parse the JSON report
3. Feed the worst-scoring audits to Claude
4. Apply the suggested fix
5. Re-run Lighthouse
6. Keep the change if score improved, revert if not

The interesting part isn't the tool itself — it's what it reveals about the boundary between mechanical optimization (minify, lazy-load, compress) and judgment calls (what content matters, what the user sees first, what the brand looks like).

AI is great at the mechanical stuff. It's terrible at the judgment stuff. And most of the low-hanging fruit is mechanical, which means this approach works surprisingly well for the first pass.

## Takeaway

If your Lighthouse performance score is below 70, an AI loop can probably get you to 75-80 without human intervention. Above that, you need a human who understands your product. The gains get smaller and the risk of regression gets higher.

The best optimization strategy? Ship less JavaScript. But that requires saying no to features, and no AI is going to do that for you.`;

async function seed() {
  // Check if blog post already exists
  const existing = await db.select().from(blogPosts).limit(1);
  if (existing.length === 0) {
    await db.insert(blogPosts).values({
      slug: "ai-loop-lighthouse-optimization",
      title: "I built an AI loop that auto-optimizes Lighthouse scores",
      emoji: "🔦",
      tag: "ai + dev tools",
      excerpt:
        "25 rounds, 2 wins, perf 57→74. One commit that moved the score: moving GTM + Ahrefs to lazyOnload. What the AI got wrong. What's still broken.",
      content: BLOG_POST_CONTENT,
      publishedAt: new Date("2026-03-15"),
    });
    console.log("Blog post seeded");
  } else {
    console.log("Blog post already exists, skipping");
  }

  console.log("Seed complete");
}

seed().then(() => process.exit(0));
