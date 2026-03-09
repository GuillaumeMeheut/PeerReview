# Find Pull Requests for PeerReview Exercises

You are sourcing GitHub pull requests to use as code review exercises in the PeerReview app. Follow this methodology to find the best candidates.

## Context

The PeerReview app turns real GitHub PRs into code review practice exercises. Each exercise stores:
- Title, description, difficulty (Junior/Mid/Senior), tech_stack, tags
- The full diff (files + chunks + per-line changes)
- Expected issues reviewers should catch (`exercise_expected_issues` with severity)
- Commonly missed review points

The admin app (`apps/admin`) imports PRs via GitHub URL and generates SQL seeds.

## What Makes a Good Exercise PR

### Ideal characteristics
- **Small diff**: 1-8 files changed, 10-200 lines modified (sweet spot: 2-5 files, 30-150 lines)
- **Clear review points**: Contains identifiable bugs, anti-patterns, or improvement opportunities (important, look if the file diff got comment on the code)
- **Self-contained**: Understandable without deep repo context
- **Educational value**: Teaches a real-world lesson (security, performance, correctness, accessibility)
- **Popular tech stack**: React, TypeScript, Next.js, Node.js, Supabase, or similar web technologies

### Bad candidates
- Massive refactors (50+ files)
- Dependency bumps or config-only changes
- Documentation-only PRs
- PRs requiring deep domain knowledge of the specific project

## Existing Coverage (check before sourcing)

Review the current exercises in `supabase/seed.sql` to avoid duplicate topics. Current coverage includes:
- React component refactoring (Junior)
- API caching layer (Mid)
- Next.js Server Actions migration (Mid)
- next/image optimization (Junior)
- Search with URL params (Mid)
- React hooks/polling + immutable state (Mid)
- Stripe Checkout integration / security (Mid)

**Prioritize gaps**: security, accessibility, race conditions, memory leaks, testing, error handling, database/ORM, SSR/hydration, authentication, CSS/styling.

## Step-by-Step Sourcing Process

### Step 1: Search via GitHub API (most effective)

Use `gh api` to search for merged PRs with bug/fix labels in popular repos:

```bash
# Search by repo + label
gh api search/issues --method GET \
  -f q="repo:OWNER/REPO is:pr is:merged label:bug sort:reactions-desc" \
  -f per_page=15 \
  --jq '.items[] | "\(.number) | \(.title)"'

# Search by keyword across TypeScript repos
gh search prs --label=bug --language=TypeScript --merged --sort=reactions \
  -- "fix" "React" --limit 15 --json title,url,repository
```

**Best source repos** (popular, React/TS ecosystem, well-labeled):
- `vercel/next.js` — Next.js framework
- `facebook/react` — React core
- `vercel/swr` — Data fetching hooks
- `TanStack/query` — Server state management
- `pmndrs/zustand` — Client state management
- `shadcn-ui/ui` — UI components
- `supabase/supabase` — Supabase platform
- `ant-design/ant-design` — UI library (good for a11y)
- `remix-run/react-router` — Routing
- `testing-library/react-testing-library` — Testing
- `axios/axios` — HTTP client (security fixes)
- `colinhacks/zod` — Validation (security, regex)
- `drizzle-team/drizzle-orm` — ORM
- `apollographql/apollo-client` — GraphQL client
- `reduxjs/react-redux` — Redux bindings
- `remarkjs/react-markdown` — Markdown rendering
- `nextauthjs/next-auth` — Authentication
- `calcom/cal.com` — Full-stack Next.js app
- `hoppscotch/hoppscotch` — API development

### Step 2: Check diff size (filter aggressively)

For each candidate PR, check the diff size:

```bash
gh api "repos/OWNER/REPO/pulls/NUMBER" \
  --jq '"\(.changed_files) files | +\(.additions)/-\(.deletions) | \(.title)"'
```

**Keep**: 1-8 files, 10-200 total lines changed
**Discard**: >10 files or >300 lines (too large for an exercise)

### Step 3: Review the actual diff

Before recommending, skim the diff to verify:
- The code changes are understandable without deep context
- There are clear "things to catch" in a review
- The PR teaches something valuable

```bash
gh pr diff NUMBER --repo OWNER/REPO
```

### Step 4: Categorize by topic and difficulty

Assign each PR:
- **Difficulty**: Junior (1-2 files, obvious issues), Mid (2-5 files, subtle bugs), Senior (complex patterns, architectural)
- **Tags**: Pick from: refactor, performance, security, accessibility, hooks, state, testing, architecture, readability, server-components, forms, payments, api, database, ssr, error-handling
- **Tech stack**: React, TypeScript, Next.js, Node.js, etc.

## Useful Search Queries by Topic

```bash
# Security fixes
gh api search/issues -f q="repo:axios/axios is:pr is:merged \"security\" OR \"SSRF\" OR \"XSS\" sort:reactions-desc" -f per_page=10

# Accessibility
gh api search/issues -f q="repo:ant-design/ant-design is:pr is:merged label:Accessibility sort:updated-desc" -f per_page=10

# Race conditions
gh api search/issues -f q="is:pr is:merged \"race condition\" \"useEffect\" language:TypeScript sort:reactions-desc" -f per_page=10

# Memory leaks
gh api search/issues -f q="is:pr is:merged \"memory leak\" language:TypeScript sort:reactions-desc" -f per_page=10

# Performance (re-renders, memoization)
gh api search/issues -f q="is:pr is:merged \"re-render\" OR \"useMemo\" OR \"useCallback\" label:performance language:TypeScript sort:reactions-desc" -f per_page=10
```

## Output Format

Present results as a list with:
1. GitHub PR URL
2. Diff size (files, additions/deletions)
3. Suggested difficulty (Junior/Mid/Senior)
4. Suggested tags
5. Why it's a good exercise (1 sentence)

Sort by recommendation strength — best candidates first.
