# Generate a New PeerReview Exercise

Generate a new code review exercise and append it to `supabase/seed.sql`.

## Input

The user provides a topic or theme for the exercise (e.g., "authentication middleware", "React form validation", "database migration"). If no topic is given, pick one that fills a gap in the existing coverage. $ARGUMENTS

## Process

### Step 1: Check existing exercises

Read `supabase/seed.sql` and list all existing exercise titles, topics, difficulty levels, and tech stacks. Identify gaps in coverage to avoid duplicates.

### Step 2: Design the exercise

Design a realistic PR scenario that:
- Has **1-4 files** changed, **20-150 lines** modified (small, focused diff)
- Contains **3-5 identifiable issues** at varying severity levels (at least 2 critical, 1 suggestion, 1 nitpick)
- Is **self-contained** — understandable without deep project context
- Teaches a **real-world lesson** (security, performance, correctness, accessibility, architecture)
- Uses a **popular tech stack** (React, TypeScript, Next.js, Node.js, Python, Go, etc.)

Assign:
- **Difficulty**: Junior (1-2 files, obvious issues), Mid (2-5 files, subtle bugs), Senior (complex patterns, architectural issues)
- **Tags**: Pick from: refactor, performance, security, accessibility, hooks, state, testing, architecture, readability, server-components, forms, payments, api, database, ssr, error-handling, real-time, ui
- **Author**: A realistic username (lowercase, hyphenated)

### Step 3: Write the code diff

Write realistic, production-quality code that contains intentional but plausible bugs. The code should:
- Look like a real PR from a competent developer (not obviously broken)
- Have bugs that are **subtle enough** to be missed in a casual review
- Include a mix of added, removed, and unchanged lines where appropriate
- Use proper formatting and conventions for the chosen tech stack

### Step 4: Generate the SQL

Append to `supabase/seed.sql` following this exact format. Generate deterministic UUIDs (valid format, unique across the file).

```sql
-- ---------------------------------------------------------------------------
-- Exercise N: <title>
-- ---------------------------------------------------------------------------
insert into public.exercises (id, title, description, difficulty, tech_stack, tags, author, base_branch, head_branch, commonly_missed)
values (
  '<uuid>',
  '<title>',
  '<description - 1-3 sentences explaining the PR>',
  '<Junior|Mid|Senior>',
  array[<tech stack items>],
  array[<tag items>],
  '<author>',
  'main',
  '<branch-name>',
  array[<commonly missed items - 2-3 strings describing what reviewers typically miss>]
) on conflict (id) do nothing;

-- Exercise N — Files
insert into public.exercise_files (id, exercise_id, path, additions, deletions, sort_order) values
  ('<uuid>', '<exercise-uuid>', '<file-path>', <additions>, <deletions>, <sort_order>),
  ...
on conflict (id) do nothing;

-- Exercise N, File M — <filename> chunk
insert into public.file_chunks (id, file_id, header, lines, sort_order) values
('<uuid>', '<file-uuid>', '<diff-header e.g. @@ -0,0 +1,38 @@>',
'[
  {"type":"added|removed|unchanged","content":"<line content>","oldLineNumber":<number|null>,"newLineNumber":<number|null>},
  ...
]'::jsonb, <sort_order>)
on conflict (id) do nothing;

-- Exercise N — Expected Issues
insert into public.exercise_expected_issues (id, exercise_id, title, description, severity, line, sort_order) values
('<uuid>', '<exercise-uuid>',
 '<issue title>',
 '<detailed description of the issue and how to fix it>',
 '<critical|suggestion|nitpick>', '<matching line content from the diff, or null>', <sort_order>),
...
on conflict (id) do nothing;
```

### Line format rules

Each line in `file_chunks.lines` is a JSON object:
- `type`: `"added"` (new line), `"removed"` (deleted line), or `"unchanged"` (context line)
- `content`: The actual source code line (without +/- prefix)
- `oldLineNumber`: Line number in the old file (`null` for added lines)
- `newLineNumber`: Line number in the new file (`null` for removed lines)

### Diff header format

The `header` field follows the unified diff format: `@@ -<old_start>,<old_count> +<new_start>,<new_count> @@`
- For new files: `@@ -0,0 +1,<line_count> @@`
- For modified files: match the line ranges to the actual unchanged/removed/added lines

### Expected issues rules

- `severity`: `critical` (bugs, security issues, breaking changes), `suggestion` (improvements, best practices), `nitpick` (style, minor improvements)
- `line`: The exact content string of a line from the diff that the issue relates to, or `null` if it's a general issue
- Include at least **2 critical** issues, **1 suggestion**, and **1 nitpick**
- Descriptions should explain **what's wrong** and **how to fix it**

### Important

- Escape single quotes in SQL strings by doubling them: `''`
- Escape double quotes inside JSON strings properly
- The `additions` and `deletions` counts in `exercise_files` should match the actual line counts
- Keep line numbers sequential and consistent
- Make sure UUIDs are unique and don't collide with existing ones in the file
