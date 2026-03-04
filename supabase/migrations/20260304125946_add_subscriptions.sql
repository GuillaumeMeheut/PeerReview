-- Create subscriptions table
create table public.subscriptions (
    user_id uuid primary key references public.profiles(id) on delete cascade,
    is_premium boolean not null default false,
    free_monthly_ai_calls integer not null default 0
);

-- Enable RLS
alter table public.subscriptions enable row level security;

-- RLS Policies
create policy "Users can view own subscription"
    on public.subscriptions for select
    using (auth.uid() = user_id);

-- Trigger to auto-create subscription on new user signup
create or replace function public.handle_new_subscription()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
    insert into public.subscriptions (user_id)
    values (new.id);
    return new;
end;
$$;

create trigger on_profile_created
    after insert on public.profiles
    for each row
    execute function public.handle_new_subscription();

-- Backfill existing users (if any) who do not have a subscription row
insert into public.subscriptions (user_id)
select id from public.profiles
where id not in (select user_id from public.subscriptions);

-- RPC Function to securely increment the free AI call count
create or replace function public.increment_free_ai_calls(target_user_id uuid)
returns void
language sql
security definer
as $$
    update public.subscriptions
    set free_monthly_ai_calls = free_monthly_ai_calls + 1
    where user_id = target_user_id;
$$;
