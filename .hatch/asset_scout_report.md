# Asset Scout Report — Personal Site (viviano.cantu.info)

## App Profile

- **Type:** Consumer-facing personal portfolio + blog
- **Aesthetic:** Brutalist — thick borders, hard shadows, emoji-forward, warm cream backgrounds
- **Target audience:** Engineers, recruiters, AI community, consulting leads

## Decision: Minimal Asset Manifest

The spec is unusually explicit about what it does NOT want:

> "No stock photos. No gradients. No rounded blobs. No hero illustrations."

Emojis (👋 🐀 🧠 🏈 📝 ⌚️ 🤖 📸 🔦) serve as the primary visual decoration system. The brutalist aesthetic relies on typography, borders, shadows, and layout — not imagery. This is one of those rare specs where over-scouting would actively hurt the product.

## What Was Scouted

### Icons: lucide-react (ISC license)
- **Why Lucide:** Covers both UI icons (ChevronDown for accordions, ExternalLink for project links, ArrowRight for CTAs) and social/brand icons (Github, Linkedin, Twitter, Mail) in one package. Clean geometric style fits the brutalist vibe without being decorative.
- **Alternatives considered:** Simple Icons (CC0) for brand logos — but Lucide already includes the social icons needed, and one package is simpler than two.

### Font: Space Grotesk (OFL-1.1)
- **Why:** Spec explicitly names it: "Font: Space Grotesk (bold, slightly quirky geometric sans) for headings."
- **License:** SIL Open Font License 1.1 — free for commercial use, attribution required (font name + license link).
- **Integration:** CSS `@import` from Google Fonts — no file download needed for web. Body text uses system font stack per spec.
- **Weights:** 400, 500, 600, 700 — covers regular through bold for heading hierarchy.

## What Was Deliberately Skipped

| Category | Reason |
|---|---|
| **Hero illustrations (unDraw, Open Peeps, etc.)** | Spec says "No hero illustrations" — emojis fill this role |
| **Stock photos (Unsplash, Pexels)** | Spec says "No stock photos" |
| **Background patterns (Hero Patterns)** | Brutalist aesthetic uses solid cream (#FAF4E8) backgrounds with hard shadows — patterns would fight the design |
| **Additional fonts** | Spec says system font for body — only Space Grotesk needed for headings |
| **Multiple icon packages** | Lucide covers all needs (UI + social) in one package |

## Download Status

No files downloaded to disk. All assets are either:
- **npm package** (lucide-react) — Builder installs via `bun add`
- **CSS @import** (Space Grotesk) — loaded at runtime from Google Fonts CDN

## Attribution Requirements

| Asset | Attribution Required | Credit Line |
|---|---|---|
| Lucide icons | No (ISC) | Icons by Lucide (lucide.dev) |
| Space Grotesk | Yes (OFL-1.1) | Space Grotesk by Florian Karsten, SIL OFL 1.1 |

Both credit lines should appear in a footer credits section or an `/about` page if one exists.
