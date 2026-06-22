alter table public.oksid_urunler
  add column if not exists custom_attributes jsonb not null default '[]'::jsonb;

notify pgrst, 'reload schema';
