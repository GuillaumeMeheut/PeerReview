-- =============================================================================
-- PeerReview — Initial Database Schema
-- 14 tables, RLS policies, triggers
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. profiles — public user data (extends auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  username   text,
  full_name  text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Auto-create a profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'user_name', new.raw_user_meta_data ->> 'name'),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 2. exercises — PR review exercises
-- ---------------------------------------------------------------------------
create table public.exercises (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  description     text not null,
  difficulty      text not null check (difficulty in ('Junior', 'Mid', 'Senior')),
  tech_stack      text[] not null default '{}',
  tags            text[] not null default '{}',
  author          text not null,
  base_branch     text not null,
  head_branch     text not null,
  commonly_missed text[] not null default '{}',
  senior_example  text not null default '',
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 3. exercise_files — diff files per exercise
-- ---------------------------------------------------------------------------
create table public.exercise_files (
  id          uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  path        text not null,
  additions   int not null default 0,
  deletions   int not null default 0,
  sort_order  int not null default 0
);

create index idx_exercise_files_exercise_id on public.exercise_files(exercise_id);

-- ---------------------------------------------------------------------------
-- 4. file_chunks — diff chunks within files
-- ---------------------------------------------------------------------------
create table public.file_chunks (
  id         uuid primary key default gen_random_uuid(),
  file_id    uuid not null references public.exercise_files(id) on delete cascade,
  header     text not null,
  lines      jsonb not null default '[]',
  sort_order int not null default 0
);

create index idx_file_chunks_file_id on public.file_chunks(file_id);

-- ---------------------------------------------------------------------------
-- 5. exercise_expected_issues — known issues in the PR
-- ---------------------------------------------------------------------------
create table public.exercise_expected_issues (
  id          uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  title       text not null,
  description text not null,
  severity    text not null check (severity in ('critical', 'suggestion', 'nitpick')),
  line        text,
  sort_order  int not null default 0
);

create index idx_exercise_expected_issues_exercise_id on public.exercise_expected_issues(exercise_id);

-- ---------------------------------------------------------------------------
-- 6. user_reviews — a user's review session on an exercise
-- ---------------------------------------------------------------------------
create table public.user_reviews (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  exercise_id    uuid not null references public.exercises(id) on delete cascade,
  attempt_number int not null default 1,
  status         text not null default 'in_progress' check (status in ('in_progress', 'submitted')),
  submitted_at   timestamptz,
  created_at     timestamptz not null default now()
);

-- Only one in-progress review per user per exercise at a time
create unique index idx_user_reviews_active
  on public.user_reviews(user_id, exercise_id)
  where (status = 'in_progress');

create index idx_user_reviews_user_exercise on public.user_reviews(user_id, exercise_id);

-- ---------------------------------------------------------------------------
-- 7. review_comments — individual comments in a review
-- ---------------------------------------------------------------------------
create table public.review_comments (
  id         uuid primary key default gen_random_uuid(),
  review_id  uuid not null references public.user_reviews(id) on delete cascade,
  file_id    uuid not null references public.exercise_files(id) on delete cascade,
  line_index int not null,
  text       text not null,
  severity   text not null check (severity in ('critical', 'suggestion', 'nitpick')),
  created_at timestamptz not null default now()
);

create index idx_review_comments_review_id on public.review_comments(review_id);

-- ---------------------------------------------------------------------------
-- 8. ai_feedback_results — cached AI feedback per review
-- ---------------------------------------------------------------------------
create table public.ai_feedback_results (
  id                   uuid primary key default gen_random_uuid(),
  review_id            uuid not null unique references public.user_reviews(id) on delete cascade,
  overall_score        numeric not null check (overall_score >= 0 and overall_score <= 10),
  summary              text not null,
  strengths            text[] not null default '{}',
  improvements         text[] not null default '{}',
  technical_accuracy   numeric not null check (technical_accuracy >= 0 and technical_accuracy <= 10),
  communication_style  numeric not null check (communication_style >= 0 and communication_style <= 10),
  constructiveness     numeric not null check (constructiveness >= 0 and constructiveness <= 10),
  completeness         numeric not null check (completeness >= 0 and completeness <= 10),
  comment_feedback     jsonb not null default '[]',
  created_at           timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 9. discussions — community discussion threads
-- ---------------------------------------------------------------------------
create table public.discussions (
  id          uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  content     text not null,
  created_at  timestamptz not null default now()
);

create index idx_discussions_exercise_id on public.discussions(exercise_id);

-- ---------------------------------------------------------------------------
-- 10. discussion_votes — upvotes on discussions
-- ---------------------------------------------------------------------------
create table public.discussion_votes (
  id            uuid primary key default gen_random_uuid(),
  discussion_id uuid not null references public.discussions(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  created_at    timestamptz not null default now(),
  unique(discussion_id, user_id)
);

-- ---------------------------------------------------------------------------
-- 11. discussion_replies
-- ---------------------------------------------------------------------------
create table public.discussion_replies (
  id            uuid primary key default gen_random_uuid(),
  discussion_id uuid not null references public.discussions(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  content       text not null,
  created_at    timestamptz not null default now()
);

create index idx_discussion_replies_discussion_id on public.discussion_replies(discussion_id);

-- ---------------------------------------------------------------------------
-- 12. solutions — community review solutions
-- ---------------------------------------------------------------------------
create table public.solutions (
  id          uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  description text not null,
  created_at  timestamptz not null default now()
);

create index idx_solutions_exercise_id on public.solutions(exercise_id);

-- ---------------------------------------------------------------------------
-- 13. solution_comments — inline comments in a solution
-- ---------------------------------------------------------------------------
create table public.solution_comments (
  id          uuid primary key default gen_random_uuid(),
  solution_id uuid not null references public.solutions(id) on delete cascade,
  file_id     uuid not null references public.exercise_files(id) on delete cascade,
  line_index  int not null,
  text        text not null,
  severity    text not null check (severity in ('critical', 'suggestion', 'nitpick')),
  created_at  timestamptz not null default now()
);

create index idx_solution_comments_solution_id on public.solution_comments(solution_id);

-- ---------------------------------------------------------------------------
-- 14. solution_votes — upvotes on solutions
-- ---------------------------------------------------------------------------
create table public.solution_votes (
  id          uuid primary key default gen_random_uuid(),
  solution_id uuid not null references public.solutions(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique(solution_id, user_id)
);


-- =============================================================================
-- Row Level Security (RLS)
-- =============================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.exercises enable row level security;
alter table public.exercise_files enable row level security;
alter table public.file_chunks enable row level security;
alter table public.exercise_expected_issues enable row level security;
alter table public.user_reviews enable row level security;
alter table public.review_comments enable row level security;
alter table public.ai_feedback_results enable row level security;
alter table public.discussions enable row level security;
alter table public.discussion_votes enable row level security;
alter table public.discussion_replies enable row level security;
alter table public.solutions enable row level security;
alter table public.solution_comments enable row level security;
alter table public.solution_votes enable row level security;

-- ---- profiles ----
create policy "Profiles are publicly readable"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- ---- exercises + related (public read, admin-only write) ----
create policy "Exercises are publicly readable"
  on public.exercises for select using (true);

create policy "Exercise files are publicly readable"
  on public.exercise_files for select using (true);

create policy "File chunks are publicly readable"
  on public.file_chunks for select using (true);

create policy "Expected issues are publicly readable"
  on public.exercise_expected_issues for select using (true);

-- ---- user_reviews ----
create policy "Users can view own reviews"
  on public.user_reviews for select using (auth.uid() = user_id);

create policy "Users can create own reviews"
  on public.user_reviews for insert with check (auth.uid() = user_id);

create policy "Users can update own reviews"
  on public.user_reviews for update using (auth.uid() = user_id);

-- ---- review_comments ----
create policy "Users can view own review comments"
  on public.review_comments for select
  using (exists (
    select 1 from public.user_reviews
    where user_reviews.id = review_comments.review_id
      and user_reviews.user_id = auth.uid()
  ));

create policy "Users can insert own review comments"
  on public.review_comments for insert
  with check (exists (
    select 1 from public.user_reviews
    where user_reviews.id = review_comments.review_id
      and user_reviews.user_id = auth.uid()
  ));

create policy "Users can update own review comments"
  on public.review_comments for update
  using (exists (
    select 1 from public.user_reviews
    where user_reviews.id = review_comments.review_id
      and user_reviews.user_id = auth.uid()
  ));

create policy "Users can delete own review comments"
  on public.review_comments for delete
  using (exists (
    select 1 from public.user_reviews
    where user_reviews.id = review_comments.review_id
      and user_reviews.user_id = auth.uid()
  ));

-- ---- ai_feedback_results (read: owner, write: service role only) ----
create policy "Users can view own AI feedback"
  on public.ai_feedback_results for select
  using (exists (
    select 1 from public.user_reviews
    where user_reviews.id = ai_feedback_results.review_id
      and user_reviews.user_id = auth.uid()
  ));

-- ---- discussions ----
create policy "Discussions are publicly readable"
  on public.discussions for select using (true);

create policy "Authenticated users can create discussions"
  on public.discussions for insert
  with check (auth.uid() = user_id);

-- ---- discussion_votes ----
create policy "Discussion votes are publicly readable"
  on public.discussion_votes for select using (true);

create policy "Authenticated users can vote on discussions"
  on public.discussion_votes for insert
  with check (auth.uid() = user_id);

create policy "Users can remove own discussion votes"
  on public.discussion_votes for delete
  using (auth.uid() = user_id);

-- ---- discussion_replies ----
create policy "Discussion replies are publicly readable"
  on public.discussion_replies for select using (true);

create policy "Authenticated users can create replies"
  on public.discussion_replies for insert
  with check (auth.uid() = user_id);

-- ---- solutions ----
create policy "Solutions are publicly readable"
  on public.solutions for select using (true);

create policy "Authenticated users can create solutions"
  on public.solutions for insert
  with check (auth.uid() = user_id);

-- ---- solution_comments ----
create policy "Solution comments are publicly readable"
  on public.solution_comments for select using (true);

create policy "Authenticated users can create solution comments"
  on public.solution_comments for insert
  with check (exists (
    select 1 from public.solutions
    where solutions.id = solution_comments.solution_id
      and solutions.user_id = auth.uid()
  ));

-- ---- solution_votes ----
create policy "Solution votes are publicly readable"
  on public.solution_votes for select using (true);

create policy "Authenticated users can vote on solutions"
  on public.solution_votes for insert
  with check (auth.uid() = user_id);

create policy "Users can remove own solution votes"
  on public.solution_votes for delete
  using (auth.uid() = user_id);
