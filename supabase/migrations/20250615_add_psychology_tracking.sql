alter table public.trades
  add column if not exists mistakes text[] not null default '{}',
  add column if not exists self_rating smallint check (self_rating is null or (self_rating >= 1 and self_rating <= 10));
