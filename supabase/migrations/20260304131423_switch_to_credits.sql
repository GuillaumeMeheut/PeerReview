-- Rename column track to be credits and set default to 3
ALTER TABLE public.subscriptions RENAME COLUMN free_monthly_ai_calls TO credits;
ALTER TABLE public.subscriptions ALTER COLUMN credits SET DEFAULT 3;

-- Give existing users 3 credits
UPDATE public.subscriptions SET credits = 3;

-- Drop old increment function
DROP FUNCTION IF EXISTS public.increment_free_ai_calls(uuid);

-- Create new decrement function
CREATE OR REPLACE FUNCTION public.decrement_credits(target_user_id uuid)
RETURNS void
LANGUAGE sql
SECURITY definer
AS $$
    UPDATE public.subscriptions
    SET credits = GREATEST(credits - 1, 0)
    WHERE user_id = target_user_id;
$$;