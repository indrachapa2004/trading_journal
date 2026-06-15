-- Run this in the Supabase SQL Editor after creating your project.

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  default_currency text not null default 'USD',
  daily_loss_limit numeric(18, 2),
  weekly_loss_limit numeric(18, 2),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Accounts
create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null default 'Main Account',
  broker text,
  starting_balance numeric(18, 2) not null default 0,
  currency text not null default 'USD',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.accounts enable row level security;

create policy "Users manage own accounts"
  on public.accounts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table public.profiles
  add column if not exists active_account_id uuid references public.accounts (id) on delete set null;

-- Enums
do $$ begin
  create type public.asset_class as enum ('stocks', 'forex', 'crypto', 'options', 'futures');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.trade_direction as enum ('long', 'short');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.emotional_state as enum ('calm', 'confident', 'anxious', 'fomo', 'revenge');
exception when duplicate_object then null;
end $$;

-- Trades
create table if not exists public.trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  account_id uuid references public.accounts (id) on delete set null,
  symbol text not null,
  direction public.trade_direction not null,
  asset_class public.asset_class not null default 'stocks',
  quantity numeric(18, 8) not null check (quantity > 0),
  entry_price numeric(18, 8) not null check (entry_price > 0),
  exit_price numeric(18, 8) check (exit_price is null or exit_price > 0),
  entry_at timestamptz not null,
  exit_at timestamptz,
  stop_loss numeric(18, 8),
  take_profit numeric(18, 8),
  fees numeric(18, 2) not null default 0,
  pre_trade_notes text,
  post_trade_notes text,
  emotional_state public.emotional_state,
  tags text[] not null default '{}',
  mistakes text[] not null default '{}',
  self_rating smallint check (self_rating is null or (self_rating >= 1 and self_rating <= 10)),
  rules_acknowledged uuid[] not null default '{}',
  screenshot_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists trades_user_id_idx on public.trades (user_id);
create index if not exists trades_account_id_idx on public.trades (account_id);
create index if not exists trades_entry_at_idx on public.trades (entry_at desc);

alter table public.trades enable row level security;

create policy "Users manage own trades"
  on public.trades for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

do $$ begin
  create type public.screenshot_phase as enum ('before', 'after');
exception when duplicate_object then null;
end $$;

-- Screenshots metadata
create table if not exists public.trade_screenshots (
  id uuid primary key default gen_random_uuid(),
  trade_id uuid not null references public.trades (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  storage_path text not null,
  caption text,
  phase public.screenshot_phase not null default 'before',
  created_at timestamptz not null default now()
);

alter table public.trade_screenshots enable row level security;

create policy "Users manage own screenshots"
  on public.trade_screenshots for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- User-defined pre-trade rules
create table if not exists public.trading_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  label text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists trading_rules_user_id_idx on public.trading_rules (user_id);

alter table public.trading_rules enable row level security;

create policy "Users manage own trading rules"
  on public.trading_rules for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Monthly goals per account
create table if not exists public.monthly_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  account_id uuid not null references public.accounts (id) on delete cascade,
  year int not null,
  month int not null check (month between 1 and 12),
  pnl_target numeric(18, 2),
  win_rate_target numeric(5, 2)
    check (win_rate_target is null or (win_rate_target >= 0 and win_rate_target <= 100)),
  created_at timestamptz not null default now(),
  unique (user_id, account_id, year, month)
);

create index if not exists monthly_goals_account_idx on public.monthly_goals (account_id, year, month);

alter table public.monthly_goals enable row level security;

create policy "Users manage own monthly goals"
  on public.monthly_goals for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Auto-create profile + default account on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;

  insert into public.accounts (user_id, name, is_default)
  values (new.id, 'Main Account', true);

  insert into public.trading_rules (user_id, label, sort_order)
  values
    (new.id, 'Reviewed my trading plan', 1),
    (new.id, 'Defined stop loss before entry', 2),
    (new.id, 'Position size within risk limit', 3),
    (new.id, 'Not trading out of revenge/FOMO', 4);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Storage bucket (create in dashboard if this fails)
insert into storage.buckets (id, name, public)
values ('trade-screenshots', 'trade-screenshots', false)
on conflict (id) do nothing;

create policy "Users can upload own screenshots"
  on storage.objects for insert
  with check (
    bucket_id = 'trade-screenshots'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can view own screenshots"
  on storage.objects for select
  using (
    bucket_id = 'trade-screenshots'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own screenshots"
  on storage.objects for delete
  using (
    bucket_id = 'trade-screenshots'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
