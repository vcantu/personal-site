# Viviano Cantu — Personal Site

A personal portfolio and blog for Viviano Cantu (viviano.cantu.info). It's a full-stack app: a React + Vite SPA for the UI, and a Hono/Bun backend that serves blog content from a database. The site has three real pages — home (with work + projects accordions), blog list, and blog post — plus a `/login` page and `/credits` page that are scaffold artifacts. One blog post is pre-seeded (the Lighthouse AI loop post). The brutalist design system uses Space Grotesk, cream/stone backgrounds, hard drop shadows, and hover tilts throughout.

## Running locally

```bash
# From the repo root — starts both frontend (5173) and backend (8000)
cd project && bun install && bun run dev

# Or individually:
cd project/backend && bun install && bun run dev   # http://localhost:8000
cd project/frontend && bun install && bun run dev  # http://localhost:5173
```

No env vars required for local dev. The backend auto-falls back to an embedded PGlite database (stored at `project/backend/pglite/`) when `DATABASE_URL` is not set — zero external setup.

**First-time only:** seed the blog post:
```bash
cd project/backend && bun run src/seed.ts
```

**Optional env vars (production):**
- `DATABASE_URL` — Postgres connection string; omit to use PGlite locally
- `JWT_SECRET` — required in production for auth token signing
- `API_KEYS` — comma-separated valid API keys
- `CORS_ORIGIN` — defaults to `http://localhost:5173`

## Architecture

- `project/frontend/` — React 19 + Vite + Tailwind v4. Entry: `src/main.tsx`, routes in `src/App.tsx`
- `project/backend/` — Hono on Bun. Routes: `src/routes/blog.ts`, `src/routes/health.ts`. DB schema: `src/schema.ts`
- `project/e2e/` — Playwright configured (chromium, port 5173), but **no test files exist yet** — the `tests/` directory is empty

The frontend proxies `/api/*` to `localhost:8000` via Vite's dev server, so you never deal with CORS locally.

## What's real vs placeholder

- ✅ **Home page** — hero, work accordion (WHOOP/Amazon/Axon), projects accordion (ratradar/bluf.ai/footballchess), writing preview, footer social links. All spec copy is verbatim.
- ✅ **Blog list** (`/blog`) — fetches from `GET /api/blog`, renders all posts newest-first
- ✅ **Blog post** (`/blog/:slug`) — fetches from `GET /api/blog/:slug`, renders Markdown via a hand-rolled inline parser (handles headers, bold, italic, code blocks, ordered lists). No MDX, no external renderer.
- ✅ **404 page** — catch-all `*` route with brutalist design and back-to-home link
- ✅ **One blog post seeded** — "I built an AI loop that auto-optimizes Lighthouse scores" (March 2026)
- 🔶 **OG meta tags** — static tags exist in `index.html` for the site root only; individual blog posts do NOT get dynamic OG tags (the spec called for per-post og:image/title, not implemented)
- 🔶 **Auth system** — fully wired (JWT + API key + dev impersonation via `?_user=email`), but **nothing on the site requires login**. The `/login` page is a scaffold artifact. You can safely ignore the entire `src/auth/` directory unless you add gated features.
- ⬜ **E2E tests** — Playwright is configured but no `.spec.ts` files were written
- ⬜ **Static site / GitHub Pages deploy** — the spec asked for a static site deployable to `vcantu.github.io`. What was built is a full-stack app requiring a running backend. Deployment to Vercel or a similar platform works; GitHub Pages does not.
- ⬜ **Lighthouse score ≥ 90** — not verified post-build; Space Grotesk is loaded via Google Fonts (blocking), which typically costs ~10 Lighthouse perf points

## Making changes

**Add a blog post:** insert a row into `blog_posts` directly or extend `src/seed.ts`. Fields: `slug`, `title`, `emoji`, `tag`, `excerpt`, `content` (Markdown string), `publishedAt`.

**Add a page:** create `project/frontend/src/pages/YourPage.tsx`, import it in `App.tsx`, add a `<Route>`.

**Add a backend route:** create `project/backend/src/routes/your-route.ts`, register it in `src/index.ts` with `app.route("/api", yourRoute)`.

**Run the linter / type check:**
```bash
cd project && bun run check
```

**Run e2e tests** (once you write them):
```bash
cd project && bun run test:e2e
```

The QA rubric at `hatch/qa_report.md` is a good checklist for "did I break anything" — it covers accordion behavior, blog navigation, mobile responsiveness, and the 404 route.

## Original spec

See `hatch/spec.md` for the full product spec this was built from.
