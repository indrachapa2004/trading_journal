  -- Phase 2–6 upgrade: multi-account, psychology rules, goals, risk limits, screenshot phases

  -- Profile risk limits & active account
  alter table public.profiles
    add column if not exists daily_loss_limit numeric(18, 2),
    add column if not exists weekly_loss_limit numeric(18, 2),
    add column if not exists active_account_id uuid references public.accounts (id) on delete set null;

  -- Default account flag
  alter table public.accounts
    add column if not exists is_default boolean not null default false;

  update public.accounts
  set is_default = true
  where id in (
    select distinct on (user_id) id
    from public.accounts
    order by user_id, created_at asc
  );

  -- Screenshot phase (before/after)
  do $$ begin
    create type public.screenshot_phase as enum ('before', 'after');
  exception when duplicate_object then null;
  end $$;

  alter table public.trade_screenshots
    add column if not exists phase public.screenshot_phase not null default 'before';

  -- Rule acknowledgments on trades
  alter table public.trades
    add column if not exists rules_acknowledged uuid[] not null default '{}';

  -- User-defined trading rules
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

  -- Monthly P&L / win-rate goals per account
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

  -- Faster account-scoped trade queries
  create index if not exists trades_account_id_idx on public.trades (account_id);

  -- Seed default rules for existing users (optional, idempotent)
  insert into public.trading_rules (user_id, label, sort_order)
  select p.id, rule.label, rule.sort_order
  from public.profiles p
  cross join (
    values
      ('Reviewed my trading plan', 1),
      ('Defined stop loss before entry', 2),
      ('Position size within risk limit', 3),
      ('Not trading out of revenge/FOMO', 4)
  ) as rule(label, sort_order)
  where not exists (
    select 1 from public.trading_rules tr where tr.user_id = p.id
  );
