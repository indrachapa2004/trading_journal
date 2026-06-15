-- Add screenshot URL/path column to trades (run if you already applied schema.sql)
alter table public.trades
  add column if not exists screenshot_url text;
