# Progress

## Features
- [x] Feature 1: Core Layout & Home Page (hero, work, projects, writing, footer)
- [x] Feature 2: Blog System (listing, post detail, backend API, seed data)
- [x] Feature 3: Credits & Polish (attribution, mobile, final touches)
- [x] Fix: Catch-all 404 route (evaluator feedback from attempt 1)

## Status
All features built and tested. 404 fix applied. Ready for re-evaluation.

## Notes
- Space Grotesk font loaded via Google Fonts link tag
- Custom SVG social icons (GitHub, Twitter/X, LinkedIn) since lucide-react removed brand icons
- Blog posts stored in PostgreSQL via Drizzle ORM, served via Hono API
- Markdown rendering handles: headings, code blocks, bold, italic, numbered lists, inline code
- Brutalist aesthetic: cream background (#FAF4E8), hard shadows, thick borders, Space Grotesk
- Auth: password strategy with JWT, login/register pages
- Credits page with font attribution (required by OFL license)
- 404 page with emoji, message, and back-to-home link for any unknown route
