create table public.solution_replies (
  id            uuid primary key default gen_random_uuid(),
  solution_id   uuid not null references public.solutions(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  content       text not null,
  created_at    timestamptz not null default now()
);

create index idx_solution_replies_solution_id on public.solution_replies(solution_id);

alter table public.solution_replies enable row level security;

create policy "Solution replies are publicly readable"
  on public.solution_replies for select using (true);

create policy "Authenticated users can create replies"
  on public.solution_replies for insert
  with check (auth.uid() = user_id);
