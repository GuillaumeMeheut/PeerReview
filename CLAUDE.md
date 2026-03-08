# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Structure

This is a **pnpm + Turbo monorepo** for PeerReview — a SaaS platform for practicing code reviews with AI-powered feedback.

```
apps/
  web/     # Main Next.js app (port 3000)
  admin/   # Admin dashboard (port 3001)
packages/
  ui/      # Shared shadcn/ui components
  eslint-config/
  typescript-config/
supabase/  # DB migrations & seeds
```

## Commands

Run from repo root using pnpm:

```bash
pnpm dev          # Start all apps (Turbopack)
pnpm build        # Build all apps
pnpm lint         # Lint all packages
pnpm format       # Prettier format all TS/TSX/MD files
```

Run within `apps/web` or `apps/admin`:

```bash
pnpm typecheck    # Type-check without emit
pnpm lint:fix     # Auto-fix lint issues
pnpm deploy       # Deploy to Cloudflare via OpenNext
```

Add shadcn/ui components from the repo root:

```bash
pnpm dlx shadcn@latest add <component> -c apps/web
# Components land in packages/ui/src/components/
```

## Tech Stack

- **Next.js 16** with App Router + React 19
- **Supabase** — PostgreSQL, auth, row-level security
- **Vercel AI SDK** + OpenAI — AI feedback generation
- **Stripe** — subscriptions & payments
- **Zustand** — client state, **TanStack Query** — server state
- **Tailwind CSS v4** + shadcn/ui (New York style, Lucide icons)
- **PostHog** — analytics, **Upstash** — rate limiting
- **Cloudflare** via OpenNext for deployment

## Key Architecture

### Data Flow

`Supabase DB → lib/supabase/queries.ts (server fetches) → page.tsx (RSC) → components`

Server actions live in `lib/supabase/actions.ts`. Client-side mutations use TanStack Query + server actions.

### Core Domain Types (`apps/web/lib/types.ts`)

- `PullRequest` (= `ExerciseRow`) — the code review exercise with files
- `DiffFile` / `DiffChunk` / `DiffLine` — parsed diff data
- `InlineComment` — review comments on diff lines
- `Discussion` / `Solution` — community content on exercises
- `ReviewFeedback` / `StructuredFeedback` — AI feedback results

DB row types are auto-generated in `lib/supabase/database.types.ts` and re-exported as domain types.

### Main Web App Routes (`apps/web/app/`)

- `/problems` — browse exercises (PR listing)
- `/review/[id]` — review an exercise (diff viewer + inline comments)
- `/review/[id]/[reviewId]` — view a submitted review
- `/review/[id]/discussions` — community discussions
- `/review/[id]/solutions` — community solutions
- `/review/[id]/feedback/[reviewId]` — AI feedback results
- `/contribute` — submit PRs as exercises
- `/premium` — subscription page

API routes: `app/api/review/feedback/` (AI feedback), `app/api/stripe/` (checkout, portal, webhook).

### UI Package

Import shared components as `@workspace/ui/components/<name>`. The `cn()` utility is from `@workspace/ui/lib/utils`.

### Supabase Client Usage

- Server components / route handlers: `lib/supabase/server.ts` → `createClient()`
- Client components: `lib/supabase/client.ts` → `createClient()`

### Styling Conventions

Tailwind v4 with CSS variables for theming. Dark mode via `next-themes`. Use `cn()` from `@workspace/ui/lib/utils` for conditional class merging.
