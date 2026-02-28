<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the PeerReview Next.js App Router application. The integration covers both client-side and server-side event tracking, user identification, error capture, and a reverse proxy for reliable ingestion.

## What was set up

- **`instrumentation-client.ts`** — Client-side PostHog initialization using the Next.js 15.3+ `instrumentation-client` pattern. Enables automatic exception capture and session replay.
- **`lib/posthog-server.ts`** — Singleton server-side PostHog client (`posthog-node`) used in API routes and Server Actions.
- **`next.config.mjs`** — Added reverse proxy rewrites (`/ingest/*` → PostHog EU endpoints) and `skipTrailingSlashRedirect: true` for reliable event delivery.
- **`.env.local`** — `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` set securely via environment variables.
- **`components/upgrade-cta-button.tsx`** — New small client component to track the "Upgrade to Pro" CTA click from the server-rendered homepage.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User initiated OAuth sign-in (GitHub or Google) | `components/auth/oauth-buttons.tsx` |
| `user_signed_out` | User signed out; PostHog session reset | `components/auth/user-nav.tsx` |
| `auth_callback_completed` | OAuth callback succeeded; user identified server-side | `app/auth/callback/route.ts` |
| `review_started` | User clicked a PR card to begin reviewing | `components/pr-card.tsx` |
| `review_submitted` | User submitted their code review with comments | `components/review/submit-review.tsx` |
| `ai_feedback_requested` | AI feedback generated for a review (with score metrics) | `app/api/review/feedback/route.ts` |
| `discussion_created` | User created a new discussion on a PR | `lib/supabase/actions.ts` |
| `solution_submitted` | User submitted a reference solution | `lib/supabase/actions.ts` |
| `problems_filtered` | User applied tech stack filters on the problems list | `components/home-content.tsx` |
| `upgrade_cta_clicked` | User clicked "Upgrade to Pro" CTA on the homepage | `components/upgrade-cta-button.tsx` |

## User identification

- **Client-side**: PostHog `identify()` is called in `app/auth/callback/route.ts` after a successful OAuth exchange, using the Supabase user ID as the distinct ID along with email, name, and provider properties.
- **Server-side**: `posthog-node` calls `identify()` in the same callback route, ensuring server and client events are correlated on the same user.
- **Sign-out**: `posthog.reset()` is called before sign-out to disassociate the session.

## Error tracking

`posthog.captureException()` is wired up in:
- `components/auth/oauth-buttons.tsx` — OAuth sign-in failures
- `components/review/submit-review.tsx` — Unexpected errors during review submission
- Global unhandled exceptions via `capture_exceptions: true` in `instrumentation-client.ts`

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- [Analytics basics](https://eu.posthog.com/project/133362/dashboard/545499)

### Insights
- [User Sign-Up to Review Submission Funnel](https://eu.posthog.com/project/133362/insights/MUiALlEl) — End-to-end conversion funnel from auth to submitted review
- [Daily Review Activity (Started vs Submitted)](https://eu.posthog.com/project/133362/insights/bzi9BjBs) — Spot drop-off between starting and completing reviews
- [AI Feedback Adoption Rate](https://eu.posthog.com/project/133362/insights/XR35BcOO) — Measures how many reviewers go on to request AI coaching
- [New User Sign-Ins Over Time](https://eu.posthog.com/project/133362/insights/8SKem4Tc) — Daily unique sign-in trend for growth tracking
- [Community Engagement: Discussions & Solutions](https://eu.posthog.com/project/133362/insights/9HJS6btY) — Weekly community activity via discussions and solutions

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
