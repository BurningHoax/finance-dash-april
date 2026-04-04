drop policy if exists "delete_admin_own_transactions" on public.transactions;
create policy "delete_admin_own_transactions"
  on public.transactions
  for delete
  to authenticated
  using (
    user_id = auth.uid()
    and coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
  );
