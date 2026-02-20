-- =============================================================================
-- Refine Schema: user_reviews cleanup & solutions linkage
-- =============================================================================

-- 1. Remove attempt_number, status and submitted_at from user_reviews 
alter table public.user_reviews
  drop column attempt_number,
  drop column status,
  drop column submitted_at;

-- 2. Add user_review_id to solutions
alter table public.solutions
  add column user_review_id uuid references public.user_reviews(id) on delete cascade;

-- 3. Index for user_review_id on solutions
create index idx_solutions_user_review_id on public.solutions(user_review_id);


-- 1. Drop solution_comments table as we use review_comments
drop table public.solution_comments;

