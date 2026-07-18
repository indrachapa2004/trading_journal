-- Add status column to trades table
do $$ begin
  create type public.trade_status as enum ('open', 'closed');
exception when duplicate_object then null;
end $$;

alter table public.trades
  add column if not exists status public.trade_status not null default 'open';

-- Backfill existing trades: if exit_price is not null, mark as closed
update public.trades
  set status = 'closed'
  where exit_price is not null and status = 'open';

create index if not exists trades_status_idx on public.trades (status);