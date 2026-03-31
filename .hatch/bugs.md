# Confirmed Bugs

## Bug: Timezone bug — blog post dates display one day early for US users

**File:** `project/frontend/src/pages/BlogPostPage.tsx:307-314`

The seed script creates dates as `new Date("2026-03-15")` (UTC midnight). All three `formatDate` functions use `new Date(dateStr).toLocaleDateString('en-US', ...)` without specifying `timeZone: 'UTC'`. For users in US timezones (UTC-4 to UTC-10), UTC midnight converts to the previous evening, so dates display one day early (e.g., "March 14, 2026" instead of "March 15, 2026"). Fix: add `timeZone: 'UTC'` to the `toLocaleDateString` options, or parse date components directly.

**Affected locations:**
- `project/frontend/src/pages/BlogPage.tsx:115`
- `project/frontend/src/pages/BlogPostPage.tsx:307`
- `project/frontend/src/components/WritingPreview.tsx:94`

---

## Bug: MarkdownRenderer silently drops content after unclosed code block

**File:** `project/frontend/src/pages/BlogPostPage.tsx:111-225`

If markdown contains an opening code fence (`` ``` ``) without a matching closing fence, all lines after it are accumulated in the `codeBlock` array but never rendered. When the while loop exits with `codeBlock !== null`, there is no finalization step to flush the pending block. Fix: after the loop, check if `codeBlock !== null` and push the accumulated code as a final `<pre>` element.

---

## Bug: MarkdownRenderer fails to render inline code nested inside bold text

**File:** `project/frontend/src/pages/BlogPostPage.tsx:244-252`

The `renderInlineMarkdown` function treats bold, italic, and inline code as mutually exclusive. When bold wraps inline code (as in the actual seed data: `` **moving ... to `lazyOnload`** ``), the bold regex matches first and renders its captured content as a plain string inside `<strong>`, causing backticks to appear literally in the browser. Fix: recursively call `renderInlineMarkdown` on captured bold/italic content instead of rendering it as a plain string.

---

## Bug: BlogPage and WritingPreview crash on non-200 API responses

**File:** `project/frontend/src/pages/BlogPage.tsx:21-28`

Both BlogPage and WritingPreview fetch from `/api/blog` without checking `response.ok` before calling `r.json()`. On a non-200 response (e.g., 500), the error JSON object is set as `posts`, then `posts.map()` throws `TypeError: posts.map is not a function`, crashing the component. BlogPostPage correctly checks `if (!r.ok) throw new Error(...)` — the same pattern should be applied here.

**Affected locations:**
- `project/frontend/src/pages/BlogPage.tsx:21-28`
- `project/frontend/src/components/WritingPreview.tsx:21-28`

---

## Bug: Footer mailto link opens blank tab due to unconditional target="_blank"

**File:** `project/frontend/src/components/Layout.tsx:108-128`

The `FooterPill` component unconditionally applies `target="_blank"` to all links, including the `mailto:viviano@cantu.info` email link. In Chrome and Firefox, this causes both the mail client to open AND an unwanted blank tab. Fix: conditionally skip `target="_blank"` for mailto links.

---

## Bug: WorkAccordion data-testid regex inconsistency for company names with slashes

**File:** `project/frontend/src/components/WorkAccordion.tsx:60-65`

The outer container div (line 60) uses `/\s+/g` while the toggle button (line 65) uses `/[\s/]+/g` for generating `data-testid`. For "Axon / TASER", this produces `work-item-axon-/-taser` (literal slash) vs `work-toggle-axon-taser`. The literal slash in the test ID is problematic for CSS selectors and testing queries. Fix: use the same regex `/[\s/]+/g` on both lines.

---

## Skipped

None — all 6 confirmed bugs (`bug_001`, `bug_002`, `bug_003`, `bug_004`, `bug_007`, `bug_008`) are distinct issues and are included above.
