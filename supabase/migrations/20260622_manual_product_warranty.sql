alter table public.products
  add column if not exists warranty_months integer not null default 0;

alter table public.products
  drop constraint if exists products_warranty_months_nonnegative;

alter table public.products
  add constraint products_warranty_months_nonnegative check (warranty_months >= 0);

notify pgrst, 'reload schema';
