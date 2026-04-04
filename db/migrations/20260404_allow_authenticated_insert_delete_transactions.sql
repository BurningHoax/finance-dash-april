drop policy if exists "insert_admin_own_transactions" on public.transactions;
create policy "insert_own_transactions"
  on public.transactions
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "delete_admin_own_transactions" on public.transactions;
create policy "delete_own_transactions"
  on public.transactions
  for delete
  to authenticated
  using (user_id = auth.uid());
