-- Onboarding fields on profiles
alter table public.profiles
  add column if not exists full_name text,
  add column if not exists trading_experience text
    check (trading_experience is null or trading_experience in ('beginner', 'intermediate', 'pro')),
  add column if not exists onboarding_completed boolean not null default false,
  add column if not exists primary_asset_class text;

-- Risk per trade stored on the account (already exists on accounts as starting_balance etc)
-- Add risk_per_trade_percent if not present
alter table public.accounts
  add column if not exists risk_per_trade_percent numeric(5, 2) not null default 1;
