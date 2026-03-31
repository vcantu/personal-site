# Personal Site - Attempt 2

## Summary
Fixed the critical issue from Attempt 1: added a catch-all `<Route path="*">` in App.tsx that renders a proper NotFoundPage component. Unknown routes now show a 404 page with full navigation (nav + footer), a friendly error message, and a yellow "Back to home" CTA button — all in the brutalist design system.

## Rubric Self-Check
- P: PASS - All spec content delivered verbatim. Hero, Work (3 companies), Projects (3 with status badges), Writing preview, footer social links, credits page.
- F: PASS - All user stories work. Accordion one-at-a-time behavior, blog listing/detail, blog 404, and now generic 404 for unknown routes all handled properly.
- V: PASS - Consistent brutalist aesthetic across all pages including the new 404 page. Cream background, Space Grotesk, hard shadows, thick borders, emoji-forward.
- C: PASS - Clean component structure, proper React patterns, well-organized routing with catch-all fallback.

## Evidence
- Navigated to `/nonexistent-page` → shows 404 page with emoji, heading, message, and "Back to home" button
- Nav and footer render on 404 page (inside Layout component)
- Homepage still loads correctly after changes
- Screenshot: 404-page.png

## Issues
None
