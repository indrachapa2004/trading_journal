-- Replace full_name with first_name / last_name on profiles

alter table public.profiles
  add column if not exists first_name text,
  add column if not exists last_name text;

-- Migrate existing full_name values
update public.profiles
set
  first_name = split_part(trim(full_name), ' ', 1),
  last_name = nullif(
    trim(substring(trim(full_name) from position(' ' in trim(full_name)) + 1)),
    ''
  )
where full_name is not null
  and first_name is null;

-- Fall back to display_name for older rows
update public.profiles
set
  first_name = split_part(trim(display_name), ' ', 1),
  last_name = nullif(
    trim(substring(trim(display_name) from position(' ' in trim(display_name)) + 1)),
    ''
  )
where display_name is not null
  and first_name is null;

alter table public.profiles drop column if exists full_name;

-- Sync names from auth metadata when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta_first text := nullif(trim(new.raw_user_meta_data->>'first_name'), '');
  meta_last text := nullif(trim(new.raw_user_meta_data->>'last_name'), '');
  meta_display text := nullif(trim(concat_ws(' ', meta_first, meta_last)), '');
begin
  insert into public.profiles (id, first_name, last_name, display_name)
  values (new.id, meta_first, meta_last, meta_display)
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
