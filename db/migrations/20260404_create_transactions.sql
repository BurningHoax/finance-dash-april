create extension if not exists pgcrypto;

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  amount numeric not null check (amount > 0),
  category text not null,
  type text check (type in ('income', 'expense')) not null,
  created_at timestamptz not null default now()
);

alter table public.transactions enable row level security;

drop policy if exists "read_transactions_authenticated" on public.transactions;
create policy "read_transactions_authenticated"
  on public.transactions
  for select
  to authenticated
  using (true);

drop policy if exists "insert_transactions_authenticated" on public.transactions;
create policy "insert_transactions_authenticated"
  on public.transactions
  for insert
  to authenticated
  with check (true);
