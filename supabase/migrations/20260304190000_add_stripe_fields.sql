-- Add Stripe-related columns to subscriptions table
ALTER TABLE public.subscriptions
  ADD COLUMN stripe_customer_id text,
  ADD COLUMN stripe_subscription_id text,
  ADD COLUMN premium_since timestamptz;
