alter table public.transactions
  add column if not exists user_id uuid references auth.users (id) on delete cascade;

create index if not exists idx_transactions_user_id on public.transactions (user_id);

-- Remove earlier broad policies so tenant-scoped policies are the only active rules.
drop policy if exists "read_transactions_authenticated" on public.transactions;
drop policy if exists "read_transactions_anon_dev" on public.transactions;
drop policy if exists "insert_transactions_authenticated" on public.transactions;

drop policy if exists "read_own_transactions" on public.transactions;
create policy "read_own_transactions"
  on public.transactions
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "insert_admin_own_transactions" on public.transactions;
create policy "insert_admin_own_transactions"
  on public.transactions
  for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
  );
