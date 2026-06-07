create extension if not exists "pgcrypto";

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  menu_key text not null,
  parent_id uuid references public.menu_items(id) on delete set null,
  label text not null,
  url text not null,
  target text not null default '_self' check (target in ('_self','_blank')),
  mega_menu_key text,
  description text,
  image_url text,
  image_alt text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.menu_items
  add column if not exists mega_menu_key text,
  add column if not exists description text,
  add column if not exists image_url text,
  add column if not exists image_alt text,
  add column if not exists sort_order int not null default 0,
  add column if not exists is_active boolean not null default true,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_menu_items_updated_at on public.menu_items;
create trigger set_menu_items_updated_at
before update on public.menu_items
for each row execute function public.set_updated_at();

create index if not exists menu_items_menu_sort_idx on public.menu_items(menu_key, is_active, sort_order);

alter table public.menu_items enable row level security;

drop policy if exists "public reads active menu items" on public.menu_items;
drop policy if exists "content admins manage menu items" on public.menu_items;

create policy "public reads active menu items" on public.menu_items
  for select using (is_active = true);

create policy "content admins manage menu items" on public.menu_items
  for all using (public.admin_can_manage_content())
  with check (public.admin_can_manage_content());

insert into public.menu_items (menu_key, label, url, target, mega_menu_key, sort_order, is_active)
select *
from (
  values
    ('header', 'Alarm Sistemleri', '/alarm-sistemleri', '_self', 'alarm-sistemleri', 1, true),
    ('header', 'Akilli Ev Sistemleri', '/akilli-ev-sistemleri', '_self', 'akilli-ev-sistemleri', 2, true),
    ('header', 'Kamera Sistemleri', '/kamera-sistemleri', '_self', 'kamera-sistemleri', 3, true),
    ('header', 'Urunler', '/urunler', '_self', null, 4, true),
    ('header', 'Kurumsal', '/kurumsal', '_self', null, 5, true),
    ('header', 'Blog', '/blog', '_self', null, 6, true)
) as seed(menu_key, label, url, target, mega_menu_key, sort_order, is_active)
where not exists (
  select 1
  from public.menu_items existing
  where existing.menu_key = seed.menu_key
    and existing.url = seed.url
);

notify pgrst, 'reload schema';
