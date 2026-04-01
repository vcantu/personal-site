# Personal Site — Hatch Spec
**Project:** viviano.cantu.info (or vcantu.github.io)
**Type:** Personal site / portfolio / blog
**For:** Viviano Cantu — AI engineer, builder, Boston

---

## Who This Is For

Viviano is a Senior Staff AI Tech Lead at WHOOP and a prolific side-project builder. He created AIQL (AI Query Language) — a foundational AI infrastructure product — and built WHOOP Coach, the company's first LLM-powered feature. Outside work he ships consumer apps: ratradar.com (health inspection data for US cities), bluf.ai (AI writing assistant), and FootballChess.

He's building toward being a recognized technical voice — think Andrej Karpathy meets George Hotz. His personal site is the anchor for that identity.

**Audience:** Other engineers, potential consulting clients, potential employers, Boston AI community, recruiters.

---

## Personality & Aesthetic

- Brutalist / hand-drawn feel — thick borders, visible shadows, rough edges that feel intentional
- Emoji-forward — not decorative, functional. Each section has an emoji that earns its place.
- Warm cream/stone background (#FAF4E8 or stone-100), not white. Never stark white.
- Font: Space Grotesk (bold, slightly quirky geometric sans) for headings. System font for body.
- Cards have a subtle tilt on hover — `-rotate-1` or `-rotate-2` — like paper being shuffled
- Brutalist shadows: `4px 4px 0px 0px black` — hard offset, no blur
- Colors: black borders, yellow accents (blog links), green for live projects, orange for in-progress
- No stock photos. No gradients. No rounded blobs. No hero illustrations.
- Mobile-first. This site will be read on phones.

**Reference feel:** Feels like a developer's personal Notion page got a design pass. Organized chaos. Smart but approachable.

---

## Pages

### 1. Home (`/`)

**Hero section**
- Big bold greeting: `👋 Hi, I'm Viviano`
- Subheading (1–2 lines): "Senior Staff AI Tech Lead at WHOOP, Boston's Rat Czar [self-appointed] & Commissioner of the Football Chess League."
- One-liner: "I build AI systems by day and ship side projects by night. Based in Boston."
- CTA: link to blog (`📝 blog`) in a yellow pill button with brutalist shadow

**Work section** — accordion cards, one per company
- WHOOP ⌚️ — Senior Staff AI Tech Lead (Oct 2020–present)
  - Created AIQL, built WHOOP Coach (first LLM feature), promoted to Senior Staff 2026
  - Stack: TypeScript, React, Python, AWS, OpenAI API, LLMs
  - Previous titles shown as footnotes when expanded
- Amazon Robotics 🤖 — SDE II (Jul 2019–Oct 2020)
  - Real-time floor visualizations for robot operations
- Axon/TASER 📸 — Data Analyst & PM (Jul 2017–Dec 2017)

Accordion behavior: click to expand, shows "They:" and "I:" descriptions plus tech stack pills. Only one open at a time.

**Projects section** — accordion cards with live/building status badge
- ratradar.com 🐀 — live — health inspection radar for US cities
- bluf.ai 🧠 — building — AI writing assistant that lives in your browser
- footballchess.com 🏈 — building — football meets chess, turn-based strategy game

**Writing section** — most recent 2-3 posts, each as a card with emoji, tag, date, title, 1-sentence blurb
- "all posts →" link top right

**Footer links** — pill buttons for X, LinkedIn, GitHub, Email

---

### 2. Blog (`/blog`)

List of all posts, newest first. Each post is a card: emoji, tag pill, date, title, excerpt (2 sentences), "read more →"

Blog cards use the same brutalist card style as the home page.

**First post to include:**
- 🔦 "I built an AI loop that auto-optimizes Lighthouse scores" — March 2026 — tag: `ai + dev tools`
- Story: 25 rounds, 2 wins, perf 57→74. One commit that moved the score: moving GTM + Ahrefs to `lazyOnload`. What the AI got wrong. What's still broken. Tool is open-source.

---

### 3. Blog post (`/blog/[slug]`)

Clean reading experience. Max-width ~680px. Large readable font. Blog post title as H1. Date + tag pill below. Body text uses prose styling (good line-height, no wall-of-text). Code blocks styled with monospace font and light background. No sidebar, no related posts — just the post.

---

## Content to include (verbatim copy)

**Hero tagline:**
> Senior Staff AI Tech Lead at WHOOP, Boston's Rat Czar [self-appointed] & Commissioner of the Football Chess League.

**About line:**
> I build AI systems by day and ship side projects by night. Based in Boston. Obsessed with the gap between human intent and computer execution.

**WHOOP description:**
> Created AIQL (AI Query Language), a foundational AI infrastructure layer now powering personalized insights across all of WHOOP. Built and launched WHOOP Coach — the company's first LLM-powered feature, delivering real-time health coaching to millions of members. Promoted to Senior Staff in 2026.

**ratradar.com description:**
> Real government health inspection data mapped across US cities. Because knowing what's in your food — and your neighborhood — shouldn't require a public records request. Live in Boston, NYC & Chicago.

**bluf.ai description:**
> An AI layer that lives in your browser. Pull context from any tab, run writing transforms on command, keep your thinking in one place. Still building — but using it every day.

**footballchess.com description:**
> Turn-based strategy game at the intersection of football and chess. Each play is a move. Read the defense, call your formation, outsmart your opponent. Phase 1 shipped.

---

## Technical requirements

- Static site (Gatsby, Next.js, Astro, or plain HTML — anything that deploys to GitHub Pages or Vercel)
- Blog posts written in MDX or Markdown — no CMS dependency
- No backend required
- Mobile-responsive, looks great on iPhone
- Fast — Lighthouse score should be above 90
- OG meta tags for blog posts (title, description, og:image ideally)
- `vcantu.github.io` or `viviano.cantu.info` as target domain

---

## What success looks like

Someone lands on the site and immediately knows: this person is serious, ships real things, has opinions, and is approachable. They click on WHOOP and understand the scope of his AI work. They read one blog post and want to share it. They find his Twitter/X and follow him.

The site should feel like him — not a polished agency portfolio. A real person who codes and thinks.

---

## Comparison version

An existing version of this site is running locally from `vcantu.github.io` (Gatsby). This spec is for a Hatch-built comparison — different scaffold, same content and personality. We'll evaluate both and pick the better starting point.
