-- PrimeSec admin paneli - urun kategorileri kurulumu
-- Supabase > SQL Editor ekraninda tek parca halinde calistirabilirsiniz.
-- Mevcut verileri silmez; tekrar calistirilabilir.

create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  type text not null default 'product',
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.categories
  drop constraint if exists categories_type_check;

alter table public.categories
  add constraint categories_type_check
  check (type in ('product', 'service', 'blog'));

create index if not exists categories_type_active_idx
  on public.categories (type, is_active, sort_order);

alter table public.products
  add column if not exists category_id uuid;

alter table public.products
  drop constraint if exists products_category_id_fkey;

alter table public.products
  add constraint products_category_id_fkey
  foreign key (category_id) references public.categories(id)
  on delete set null;

create or replace function public.set_categories_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
before update on public.categories
for each row execute function public.set_categories_updated_at();

alter table public.categories enable row level security;

drop policy if exists "public reads active categories" on public.categories;
create policy "public reads active categories"
on public.categories for select
using (is_active = true);

drop policy if exists "content admins manage categories" on public.categories;
create policy "content admins manage categories"
on public.categories for all
using (public.admin_can_manage_content())
with check (public.admin_can_manage_content());
