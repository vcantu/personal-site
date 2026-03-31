# Personal Site — Attempt 1

## Summary
Built a complete personal portfolio/blog site for Viviano Cantu with a distinctive brutalist aesthetic. Includes home page with hero, work accordion, projects accordion, and writing preview; blog listing page; full blog post rendering with markdown support; credits page; and auth login/register.

## Rubric Self-Check
- P: PASS - All spec content delivered verbatim. Hero, work history (3 companies with They/I descriptions, tech stacks, previous titles), projects (3 with live/building status), blog with full first post, footer social links. Accordion behavior, emoji-forward design, brutalist aesthetic all implemented.
- F: PASS - All flows work: navigation between pages, accordion open/close (one at a time), blog post loading from API, 404 handling, auth register/login, mobile responsiveness. API calls properly proxied. Database seeded with blog content.
- V: PASS - Distinctive brutalist aesthetic with cream background (#FAF4E8), Space Grotesk headings, hard shadow cards (4px 4px 0px), thick 3px borders, yellow accents, green/orange status badges. Emoji-forward section titles. Hover effects with card tilt and shadow compression. Custom scrollbar and text selection. Not generic — clearly intentional design system.
- C: PASS - Clean component hierarchy (Layout → Pages → Components), proper React patterns (hooks, state management), Hono backend with Drizzle ORM, separate routes, seed script, responsive utility classes via Tailwind 4.

## Evidence
- Homepage renders with all 4 sections (hero, work, projects, writing)
- Work accordion: 3 companies, only one open at a time, shows They/I descriptions + tech stack pills + previous titles
- Projects accordion: 3 projects with live/building status badges, descriptions, external links
- Blog listing: card layout with emoji, tag pill, date, excerpt, "read more"
- Blog post: full markdown rendering (headings, code blocks, bold, italic, ordered lists, inline code)
- Credits page: font attribution for Space Grotesk (OFL license requirement)
- Mobile responsive at 375px width
- Auth: register + login flow works, redirects to homepage

## Issues
None known.
