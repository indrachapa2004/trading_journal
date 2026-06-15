-- Run this in the Supabase SQL Editor after creating your project.

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  default_currency text not null default 'USD',
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
  created_at timestamptz not null default now()
);

alter table public.accounts enable row level security;

create policy "Users manage own accounts"
  on public.accounts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists trades_user_id_idx on public.trades (user_id);
create index if not exists trades_entry_at_idx on public.trades (entry_at desc);

alter table public.trades enable row level security;

create policy "Users manage own trades"
  on public.trades for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Screenshots metadata
create table if not exists public.trade_screenshots (
  id uuid primary key default gen_random_uuid(),
  trade_id uuid not null references public.trades (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  storage_path text not null,
  caption text,
  created_at timestamptz not null default now()
);

alter table public.trade_screenshots enable row level security;

create policy "Users manage own screenshots"
  on public.trade_screenshots for all
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

  insert into public.accounts (user_id, name)
  values (new.id, 'Main Account');

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
