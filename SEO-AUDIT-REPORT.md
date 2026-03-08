# SEO Full Audit Report — peer-review.dev

**Date:** 2026-03-08
**Business Type:** SaaS — Developer Education (code review practice platform)
**Tech Stack:** Next.js 16 App Router, Cloudflare Workers via OpenNext, Supabase

---

## SEO Health Score: 38 / 100

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 25% | 54/100 | 13.5 |
| Content Quality / E-E-A-T | 25% | 31/100 | 7.75 |
| On-Page SEO | 20% | 45/100 | 9.0 |
| Schema / Structured Data | 10% | 2/100 | 0.2 |
| Performance (Core Web Vitals) | 10% | 40/100 | 4.0 |
| Images | 5% | 50/100 | 2.5 |
| AI Search Readiness | 5% | 10/100 | 0.5 |
| **Total** | **100%** | — | **37.5** |

> **38/100** — Early-stage MVP. Strong technical product foundation; SEO infrastructure is critically underdeveloped. Most issues are straightforward to fix.

---

## Top 5 Critical Issues

1. **No security headers** — CSP, HSTS, X-Frame-Options, etc. all absent on a payments site
2. **Zero schema markup** — No structured data on any page (SoftwareApplication, LearningResource, Offers)
3. **All AI crawlers blocked** — ClaudeBot, GPTBot, Google-Extended blocked via robots.txt; kills AI search visibility
4. **No E-E-A-T trust infrastructure** — No About page, Privacy Policy, Terms, or contact info on a paid SaaS
5. **Google Fonts render-blocking** — `<link>` stylesheet for Inter + JetBrains Mono blocks LCP paint

## Top 5 Quick Wins

1. Fix `NEXT_PUBLIC_APP_URL` trailing slash → fixes double-slash in robots.txt sitemap URL
2. Add `robots: { index: false }` to `/signup`, `/signin`, `/learn` pages + remove from sitemap
3. Add `og:image` (1200×630px) to `layout.tsx` — images already exist at `pr-list.png`, `code-review.png`
4. Add page-specific `openGraph` blocks to `/problems` and `/premium` (currently inheriting homepage values)
5. Replace Google Fonts `<link>` with `next/font/google` (self-hosted, zero render-blocking)

---

## Critical Issues

### C-1 — Security Headers Absent
**File:** `apps/web/public/_headers`
**Impact:** SEO trust signal, security risk on payments site

The `_headers` file only sets `Cache-Control` for static assets. No global security headers exist anywhere — not in `_headers`, `next.config.mjs headers()`, or Cloudflare Transform Rules.

Missing headers:
| Header | Risk |
|---|---|
| `Content-Security-Policy` | XSS, data injection |
| `Strict-Transport-Security` | Protocol downgrade, MITM |
| `X-Frame-Options` | Clickjacking |
| `X-Content-Type-Options: nosniff` | MIME-sniffing |
| `Referrer-Policy` | Referrer leakage |
| `Permissions-Policy` | Unrestricted browser API access |

**Fix:** Add a global `/*` block to `apps/web/public/_headers`:
```
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```
Add CSP separately after auditing all inline scripts and external origins.

---

### C-2 — `/signup` and `/signin` Are Indexable and In Sitemap
**Files:** `apps/web/app/signup/page.tsx`, `apps/web/app/signin/page.tsx`, `apps/web/app/sitemap.ts`

Auth pages have zero organic search value, waste crawl budget, and create thin-content signals.

**Fix:**
```ts
// In signup/page.tsx and signin/page.tsx
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
```
Remove both from the `routes` array in `sitemap.ts`.

---

### C-3 — Double Slash in robots.txt Sitemap URL
**File:** `apps/web/app/robots.ts` (source is correct; env var causes the bug)

Live robots.txt contains: `Sitemap: https://peer-review.dev//sitemap.xml`

Root cause: `NEXT_PUBLIC_APP_URL` is set to `https://peer-review.dev/` (trailing slash) in the Cloudflare environment.

**Fix:**
```ts
// In robots.ts and sitemap.ts
const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://peer-review.dev").replace(/\/$/, "");
```

---

### C-4 — Google Fonts Render-Blocking (LCP)
**File:** `apps/web/app/layout.tsx`, lines 38–47

Inter + JetBrains Mono loaded via `<link rel="stylesheet">` — synchronous, blocks rendering. Adds 300–600ms to LCP on slow connections. Also causes CLS when fonts swap.

**Fix:** Replace with `next/font/google` (self-hosted, zero external round-trip):
```ts
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], display: 'swap' });
```

---

### C-5 — All AI Crawlers Blocked
**File:** `apps/web/app/robots.ts` (reflects Cloudflare Managed Content in robots.txt)

Current robots.txt blocks: `ClaudeBot`, `GPTBot`, `Google-Extended`, `Amazonbot`, `Applebot-Extended`, `Bytespider`, `CCBot`, `meta-externalagent`.

This completely eliminates visibility in:
- ChatGPT Browse / web search
- Google AI Overviews (SGE) — `Google-Extended`
- Perplexity (uses ClaudeBot/GPTBot)
- Claude.ai web search

For a developer-education SaaS, AI search is the primary discovery channel for the target audience.

**Fix:** Review and selectively allow AI search crawlers. At minimum, allow `Google-Extended` and `GPTBot`:
```
User-agent: Google-Extended
Allow: /

User-agent: GPTBot
Allow: /
```
Keep blocking `ai-train` crawlers (CCBot, Amazonbot) if desired, but separate training-use bots from search-use bots.

---

## High Priority Issues

### H-1 — No og:image on Any Page
**File:** `apps/web/app/layout.tsx`

`twitter:card` is set to `summary_large_image` but no image is provided. Social shares on X/Twitter, LinkedIn, Slack show a blank card.

Three suitable source images already exist: `pr-list.png`, `code-review.png`, `ai-feedback.png`.

**Fix:**
```ts
// layout.tsx openGraph
images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PeerReview — Practice Code Reviews with AI Feedback" }],
```
For review exercise pages, use `opengraph-image.tsx` with `ImageResponse` to generate dynamic OG images showing the PR title.

---

### H-2 — OG Tags Not Overridden on /problems and /premium
**Files:** `apps/web/app/problems/page.tsx`, `apps/web/app/premium/page.tsx`

Both pages inherit the homepage's `openGraph` block (title, description, url all point to homepage) due to Next.js App Router's shallow metadata merging. Social shares of these pages show homepage content.

**Fix:** Add explicit `openGraph` + `twitter` blocks to each page's `metadata` export.

---

### H-3 — /learn Is a "Coming Soon" Stub — Indexed
**File:** `apps/web/app/learn/page.tsx`

Renders only `"Coming soon!"` — no content, no links, no value. Is in the sitemap and has no `noindex`. A thin-content signal against the entire domain.

**Fix:** Add `robots: { index: false }` and remove from sitemap until built out.

---

### H-4 — Canonical Tags Absent on All Pages

No `canonical` URL defined anywhere. Query-parameter variants of `/problems` (e.g., `?difficulty=junior&stack=react`) are treated as separate pages by Google, splitting link equity.

**Fix:** Add `alternates: { canonical: url }` to each page's metadata. For dynamic routes:
```ts
alternates: { canonical: `https://peer-review.dev/review/${id}` }
```

---

### H-5 — AnimatedBackground Canvas: rAF Loop on Main Thread (INP)
**File:** `apps/web/components/animated-background.tsx`

Permanent `requestAnimationFrame` loop running 36+ gradient/stroke operations per frame at 60fps. No `prefers-reduced-motion` guard. Blocks main thread and directly harms INP on mobile devices.

The `resolveColors` function performs DOM insertion/removal on every resize — a forced layout reflow.

**Fix:**
```ts
// Check prefers-reduced-motion
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReduced) return; // skip animation entirely

// Use OffscreenCanvas for the gradient work
// Or throttle to 30fps: only draw on every other rAF
```

---

### H-6 — Diff Viewer: Per-Line Prism Tokenization Causes Long Tasks (INP)
**File:** `apps/web/components/review/diff-viewer.tsx`

500+ `<Highlight>` component instantiations per render on large PRs. Every file toggle re-tokenizes all visible lines synchronously. `onMouseEnter` on every line row fires `setDragState`, causing full re-renders on each hover.

**Fix:**
- Virtualize the diff lines with `react-window` or `@tanstack/virtual`
- Move tokenization to a Web Worker or memoize per line
- Debounce or throttle the `onMouseEnter` drag handler

---

### H-7 — No Trust Infrastructure for a Paid SaaS (E-E-A-T / Trustworthiness)

Footer contains only copyright. No Privacy Policy, Terms of Service, contact info, or refund policy — on a site collecting payment via Stripe. Google's Quality Rater Guidelines weight Trustworthiness at 30% of E-E-A-T, and the absence of legal pages on a payments site is a disqualifying signal.

**Fix:**
- Add `/privacy`, `/terms` pages with real content
- Add contact email or support link
- Link to both from the footer
- Add refund/cancellation policy to `/premium`

---

## Medium Priority Issues

### M-1 — UUID-Based Exercise URLs (No Keywords)
**Pattern:** `/review/15728c8e-2642-469f-a581-c0c402962e48`

UUIDs provide no keyword signal. A URL like `/review/refactor-react-custom-hooks` is more descriptive, click-worthy in SERPs, and earns a minor ranking signal.

**Fix (long-term):** Add `slug` column to exercises table. Route as `/review/[slug]`. Redirect old UUID URLs with 301.

---

### M-2 — /discussions and /solutions Sub-Pages Missing from Sitemap
**File:** `apps/web/app/sitemap.ts`

`/review/[id]/discussions` and `/review/[id]/solutions` contain user-generated content — the most valuable long-tail content on the site. These pages are not in the sitemap and receive no crawl invitation.

**Fix:** Add to `sitemap.ts`:
```ts
...exercises.map(pr => ({
  url: `${baseUrl}/review/${pr.id}/discussions`,
  lastModified: pr.updated_at,
})),
...exercises.map(pr => ({
  url: `${baseUrl}/review/${pr.id}/solutions`,
  lastModified: pr.updated_at,
})),
```

---

### M-3 — Static Route `lastmod` Always = Today
**File:** `apps/web/app/sitemap.ts`

Every static route is stamped with `new Date().toISOString()` on every render. Google ignores `lastmod` when values are clearly unreliable or always "today."

**Fix:** Hardcode ISO date strings for each static route, updated only when content actually changes.

---

### M-4 — No Social Proof or User Count (E-E-A-T)

Homepage has no testimonials, user count, or community signal. No GitHub stars, no Product Hunt badge, no "X developers use PeerReview" stat.

**Fix:** Add a social proof section once any data exists. Even "Join 50 developers" is better than nothing.

---

### M-5 — Navbar: Sequential Supabase Calls on Every SSR (TTFB)
**File:** `apps/web/components/navbar.tsx`, lines 9–10

`getUserSubscription` calls `getUser()` internally after the Navbar already awaits `getUser()`. Two sequential DB round-trips on every page load for authenticated users, delaying TTFB → LCP.

**Fix:** Pass the already-resolved `user` into `getUserSubscription` to avoid the double fetch:
```ts
const { user } = await getUser();
const subscription = user ? await getUserSubscription(user.id) : null;
```

---

### M-6 — `react-icons` in Filter Bar — Use `lucide-react` Instead
**File:** `apps/web/components/filter-bar.tsx`

`react-icons` is imported for tech stack icons when `lucide-react` is already a project dependency. Unnecessary bundle overhead.

**Fix:** Replace with inline SVGs or `lucide-react` equivalents.

---

### M-7 — Problems Page: Thin Editorial Context (Content Quality)

The `/problems` page has ~120 words of body text outside the exercise cards. There is no explanation of difficulty levels, no guidance on where to start, no editorial frame for the exercise library.

**Fix:** Add 200–300 words of editorial context explaining the difficulty tiers, what skills each exercise targets, and how to approach a code review. This also creates natural keyword coverage.

---

### M-8 — No About / Team Page (E-E-A-T)

No founder/team context anywhere on the site. For a platform whose value proposition is "trust our AI feedback to train your engineering judgment," the absence of any human credibility signal is an E-E-A-T gap.

**Fix:** A simple `/about` page with the founder's background, the platform's pedagogical approach, and the reasoning behind the exercise curation would directly address Expertise and Authoritativeness signals.

---

## Low Priority / Opportunities

### L-1 — No Blog or Content Hub

Zero content marketing. No blog, tutorials, changelog, or comparison pages. Organic footprint is limited to 13 URLs. Developer tools with strong SEO (Vercel, Railway, Supabase) invest heavily in long-form technical content.

**Opportunities:**
- "How to write good code review comments" → targets `code review comments` (1.2K/mo)
- "Junior vs Senior code review: what's the difference" → targets `code review skills`
- "React TypeScript code review checklist" → targets stack-specific queries

---

### L-2 — Homepage H1 Ambiguity

"Master Code Review with AI Context" — "AI Context" is semantically ambiguous. "AI-Powered Feedback" or "AI-Assisted Code Reviews" is more precise and matches search queries.

---

### L-3 — Duplicate CTAs on Homepage

"Start Reviewing" and "Browse PRs" both link to `/problems`. This reduces information scent. Consider differentiating: one CTA to `/problems` (browse), one to `/signup` (create account).

---

### L-4 — Both Feature Images Missing OG Image

`pr-list.png`, `code-review.png`, `ai-feedback.png` exist in `/public` but are only used as feature section images. These could double as the base for OG image generation.

---

### L-5 — Premium Page: Weak Conversion Copy

"Support Development" as a Pro benefit frames the €4.99/month as a donation rather than a value exchange. Remove or reframe as "Help us ship more exercises faster."

---

## Schema Markup: Ready-to-Implement JSON-LD

### Homepage (`/`) — Priority 1

```json
[
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PeerReview",
    "url": "https://peer-review.dev",
    "description": "Practice code reviews and refactoring like in real teams. Improve your engineering skills with AI-assisted feedback on real-world pull requests.",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web",
    "offers": [
      {
        "@type": "Offer",
        "name": "Free",
        "price": "0",
        "priceCurrency": "EUR",
        "description": "3 AI review credits per month, access to all exercises, community discussions."
      },
      {
        "@type": "Offer",
        "name": "Pro",
        "price": "4.99",
        "priceCurrency": "EUR",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "4.99",
          "priceCurrency": "EUR",
          "unitCode": "MON",
          "billingIncrement": 1
        },
        "description": "Unlimited AI reviews, priority support."
      }
    ],
    "featureList": [
      "AI-powered code review feedback",
      "Inline comment interface on real pull request diffs",
      "Difficulty levels: Junior, Mid, Senior",
      "Tech stacks: React, Node.js, TypeScript, Next.js, Python, Go"
    ],
    "screenshot": "https://peer-review.dev/code-review.png"
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PeerReview",
    "url": "https://peer-review.dev",
    "logo": "https://peer-review.dev/logo.png"
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "PeerReview",
    "url": "https://peer-review.dev"
  }
]
```

### Exercise Pages (`/review/[id]`) — Priority 2

Generate server-side in `generateMetadata` or as a `<Script>` in the RSC page:

```json
{
  "@context": "https://schema.org",
  "@type": "LearningResource",
  "name": "{{pr.title}}",
  "description": "{{pr.description}}",
  "url": "https://peer-review.dev/review/{{pr.id}}",
  "educationalLevel": "{{pr.difficulty}}",
  "keywords": "{{pr.tech_stack.join(', ')}}",
  "learningResourceType": "Exercise",
  "provider": {
    "@type": "Organization",
    "name": "PeerReview",
    "url": "https://peer-review.dev"
  }
}
```

---

## Visual Analysis

### Homepage (Desktop)
- H1 and CTAs are visible above the fold ✅
- Dark theme is clean and consistent ✅
- Large empty area above the headline (grid background only) — no product screenshot in the hero
- "Browse PRs" button is dark-on-dark — low contrast vs. "Start Reviewing" (white)
- Feature images (`pr-list.png`, `code-review.png`, `ai-feedback.png`) have proper alt text ✅

### Homepage (Mobile — 390px)
- Fully responsive, H1 reflows correctly ✅
- Both CTAs are full-width ✅
- Hamburger menu present ✅
- No issues

### Problems Page (Desktop)
- Exercise cards use color-coded difficulty badges (green=Junior, yellow=Mid) ✅
- Stack filters and difficulty filters visible above fold ✅
- 3-column grid is well-spaced ✅
- No hero image or context paragraph visible above the filter row

### Review Page (Desktop)
- GitHub-style interface — familiar to the target audience ✅
- Breadcrumb navigation present ✅
- File tree + diff viewer layout is well-structured ✅
- "Submit Review" CTA is at the bottom of the sidebar — may require scrolling on short viewports

### Console Errors
```
ReferenceError: __name is not defined
```
Present on every page. This is a Cloudflare Workers + esbuild bundling artifact — `__name` is a TypeScript helper that isn't being shimmed correctly in the worker runtime. This is a **build configuration bug** that should be investigated, as it may indicate other helpers are also missing.

---

## Prioritized Action Plan

### Immediate (This Week)

| # | Action | File | Impact |
|---|---|---|---|
| 1 | Fix trailing slash in `NEXT_PUBLIC_APP_URL` env var | Cloudflare dashboard | Fixes robots.txt double-slash |
| 2 | Add `robots: noindex` to `/signup`, `/signin`, `/learn` | Each page.tsx | Stops thin content indexing |
| 3 | Remove above 3 routes from sitemap | `apps/web/app/sitemap.ts` | Clean sitemap |
| 4 | Add `og:image` to `layout.tsx` | `apps/web/app/layout.tsx` | Social sharing |
| 5 | Add page-specific OG to `/problems` + `/premium` | Each page.tsx | Correct social unfurls |
| 6 | Add canonical tags to all pages | Each page.tsx + layout.tsx | Link equity |
| 7 | Add security headers to `_headers` | `apps/web/public/_headers` | Security + trust |
| 8 | Review and allow AI search crawlers in robots | `apps/web/app/robots.ts` | AI search visibility |

### Short Term (This Month)

| # | Action | Impact |
|---|---|---|
| 9 | Replace Google Fonts `<link>` with `next/font/google` | LCP improvement |
| 10 | Add `prefers-reduced-motion` guard to canvas animation | INP + accessibility |
| 11 | Add `/privacy` and `/terms` pages; link from footer | E-E-A-T Trustworthiness |
| 12 | Add SoftwareApplication + LearningResource schema | Rich results eligibility |
| 13 | Add /discussions and /solutions to sitemap | Crawl coverage |
| 14 | Fix navbar sequential Supabase calls | TTFB for auth users |
| 15 | Add canonical tags to review sub-pages | Duplicate content |
| 16 | Fix `__name is not defined` console error | Build correctness |

### Medium Term (Next Quarter)

| # | Action | Impact |
|---|---|---|
| 17 | Virtualize diff viewer with `react-window` | INP on /review pages |
| 18 | Add slug column to exercises; migrate URLs | Keyword-rich URLs |
| 19 | Add About page with founder context | E-E-A-T Expertise/Authority |
| 20 | Start blog: 3-5 foundational articles | Organic footprint, long-tail |
| 21 | Add social proof section to homepage | E-E-A-T + conversion |
| 22 | Add FAQ/billing section to /premium | Conversion + E-E-A-T |
| 23 | Replace react-icons with lucide-react in filter-bar | Bundle size |
| 24 | Add more exercise stacks (Go, Python) to problems page | Content coverage |
