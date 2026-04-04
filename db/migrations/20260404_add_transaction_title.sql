alter table public.transactions
  add column if not exists title text;

update public.transactions
set title = category
where title is null or btrim(title) = '';

alter table public.transactions
  alter column title set not null;
