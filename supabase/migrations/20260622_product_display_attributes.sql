alter table public.products
  add column if not exists side_attributes jsonb not null default '[]'::jsonb,
  add column if not exists technical_attributes jsonb not null default '[]'::jsonb;

alter table public.oksid_urunler
  add column if not exists side_attributes jsonb not null default '[]'::jsonb,
  add column if not exists technical_attributes jsonb not null default '[]'::jsonb;

notify pgrst, 'reload schema';
