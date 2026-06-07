create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null check (role in ('super_admin','editor','support')),
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  type text not null check (type in ('product','service','blog')),
  description text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  logo_url text,
  description text,
  sort_order int not null default 0,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  sku text,
  short_description text,
  long_description text,
  category_id uuid references public.categories(id),
  brand_id uuid references public.brands(id),
  image_url text,
  gallery jsonb not null default '[]'::jsonb,
  tags text[] not null default '{}',
  usage_areas text[] not null default '{}',
  features jsonb not null default '[]'::jsonb,
  benefits jsonb not null default '[]'::jsonb,
  installation_steps jsonb not null default '[]'::jsonb,
  faqs jsonb not null default '[]'::jsonb,
  related_product_ids uuid[] not null default '{}',
  price numeric,
  price_note text,
  is_featured boolean not null default false,
  is_popular boolean not null default false,
  is_active boolean not null default true,
  meta_title text,
  meta_description text,
  canonical_url text,
  og_image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  eyebrow text,
  hero_title text,
  hero_description text,
  image_url text,
  category_id uuid references public.categories(id),
  intro_title text,
  intro_content text,
  advantages jsonb not null default '[]'::jsonb,
  usage_areas jsonb not null default '[]'::jsonb,
  process_steps jsonb not null default '[]'::jsonb,
  faqs jsonb not null default '[]'::jsonb,
  related_product_ids uuid[] not null default '{}',
  cta_title text,
  cta_description text,
  is_active boolean not null default true,
  meta_title text,
  meta_description text,
  canonical_url text,
  og_image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  cover_image_url text,
  category_id uuid references public.categories(id),
  reading_time text,
  published_at timestamptz,
  status text not null default 'draft' check (status in ('draft','published')),
  table_of_contents jsonb not null default '[]'::jsonb,
  faqs jsonb not null default '[]'::jsonb,
  related_product_ids uuid[] not null default '{}',
  meta_title text,
  meta_description text,
  canonical_url text,
  og_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_areas (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  district text,
  service_type text not null,
  title text not null,
  slug text unique not null,
  description text,
  content_sections jsonb not null default '[]'::jsonb,
  related_product_ids uuid[] not null default '{}',
  faqs jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  meta_title text,
  meta_description text,
  canonical_url text,
  og_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('contact_form','product_quote','service_quote','system_builder','whatsapp_click','manual')),
  full_name text,
  phone text,
  email text,
  city text,
  district text,
  message text,
  interested_service text,
  interested_product_id uuid references public.products(id),
  status text not null default 'new' check (status in ('new','contacted','proposal_sent','won','lost','spam')),
  priority text not null default 'normal' check (priority in ('low','normal','high')),
  kvkk_consent boolean not null default false,
  assigned_to uuid references public.admin_profiles(id),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  admin_id uuid references public.admin_profiles(id),
  note text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.system_builder_submissions (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  protected_area text,
  space_type text,
  need_reason text,
  selected_product_ids uuid[] not null default '{}',
  selected_products_snapshot jsonb not null default '[]'::jsonb,
  estimated_total numeric,
  summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.builder_options (
  id uuid primary key default gen_random_uuid(),
  step_number int not null,
  step_key text not null,
  title text not null,
  description text,
  option_label text not null,
  option_value text not null,
  image_url text,
  recommended_product_ids uuid[] not null default '{}',
  price_effect numeric not null default 0,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null,
  path text not null,
  public_url text,
  file_name text,
  file_type text,
  size_bytes bigint,
  uploaded_by uuid references public.admin_profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.admin_profiles(id),
  action text not null,
  entity_type text,
  entity_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists categories_type_active_idx on public.categories(type, is_active, sort_order);
create index if not exists products_active_sort_idx on public.products(is_active, sort_order, created_at desc);
create index if not exists services_active_sort_idx on public.services(is_active, sort_order, created_at desc);
create index if not exists blog_posts_status_published_idx on public.blog_posts(status, published_at desc);
create index if not exists leads_status_created_idx on public.leads(status, created_at desc);
create index if not exists leads_source_created_idx on public.leads(source, created_at desc);

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'admin_profiles','site_settings','categories','brands','products','services',
    'blog_posts','service_areas','leads','builder_options'
  ]
  loop
    execute format('drop trigger if exists set_%s_updated_at on public.%I', table_name, table_name);
    execute format('create trigger set_%s_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end $$;

create or replace function public.current_admin_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role
  from public.admin_profiles
  where id = auth.uid()
    and is_active = true
  limit 1
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.current_admin_role() is not null
$$;

create or replace function public.admin_can_manage_content()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.current_admin_role() in ('super_admin','editor')
$$;

create or replace function public.admin_can_manage_support()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.current_admin_role() in ('super_admin','support')
$$;

alter table public.admin_profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.services enable row level security;
alter table public.blog_posts enable row level security;
alter table public.service_areas enable row level security;
alter table public.leads enable row level security;
alter table public.lead_notes enable row level security;
alter table public.system_builder_submissions enable row level security;
alter table public.builder_options enable row level security;
alter table public.media_assets enable row level security;
alter table public.activity_logs enable row level security;

create policy "admin profiles read own or super admin" on public.admin_profiles
  for select using (id = auth.uid() or public.current_admin_role() = 'super_admin');
create policy "super admin manages profiles" on public.admin_profiles
  for all using (public.current_admin_role() = 'super_admin')
  with check (public.current_admin_role() = 'super_admin');

create policy "public reads active categories" on public.categories
  for select using (is_active = true);
create policy "content admins manage categories" on public.categories
  for all using (public.admin_can_manage_content())
  with check (public.admin_can_manage_content());

create policy "public reads active brands" on public.brands
  for select using (is_active = true);
create policy "content admins manage brands" on public.brands
  for all using (public.admin_can_manage_content())
  with check (public.admin_can_manage_content());

create policy "public reads active products" on public.products
  for select using (is_active = true);
create policy "content admins manage products" on public.products
  for all using (public.admin_can_manage_content())
  with check (public.admin_can_manage_content());

create policy "public reads active services" on public.services
  for select using (is_active = true);
create policy "content admins manage services" on public.services
  for all using (public.admin_can_manage_content())
  with check (public.admin_can_manage_content());

create policy "public reads published blog posts" on public.blog_posts
  for select using (status = 'published');
create policy "content admins manage blog posts" on public.blog_posts
  for all using (public.admin_can_manage_content())
  with check (public.admin_can_manage_content());

create policy "public reads active service areas" on public.service_areas
  for select using (is_active = true);
create policy "content admins manage service areas" on public.service_areas
  for all using (public.admin_can_manage_content())
  with check (public.admin_can_manage_content());

create policy "public reads site settings" on public.site_settings
  for select using (true);
create policy "content admins manage site settings" on public.site_settings
  for all using (public.admin_can_manage_content())
  with check (public.admin_can_manage_content());

create policy "anonymous can insert leads" on public.leads
  for insert to anon with check (true);
create policy "admins read leads" on public.leads
  for select using (public.current_admin_role() in ('super_admin','support'));
create policy "admins update leads" on public.leads
  for update using (public.current_admin_role() in ('super_admin','support'))
  with check (public.current_admin_role() in ('super_admin','support'));
create policy "super admin deletes leads" on public.leads
  for delete using (public.current_admin_role() = 'super_admin');

create policy "support admins manage lead notes" on public.lead_notes
  for all using (public.current_admin_role() in ('super_admin','support'))
  with check (public.current_admin_role() in ('super_admin','support'));

create policy "anonymous can insert system builder submissions" on public.system_builder_submissions
  for insert to anon with check (true);
create policy "support admins read system builder submissions" on public.system_builder_submissions
  for select using (public.current_admin_role() in ('super_admin','support'));
create policy "super admin deletes system builder submissions" on public.system_builder_submissions
  for delete using (public.current_admin_role() = 'super_admin');

create policy "public reads active builder options" on public.builder_options
  for select using (is_active = true);
create policy "content admins manage builder options" on public.builder_options
  for all using (public.admin_can_manage_content())
  with check (public.admin_can_manage_content());

create policy "admins read media assets" on public.media_assets
  for select using (public.is_admin());
create policy "content admins insert media assets" on public.media_assets
  for insert with check (public.admin_can_manage_content());
create policy "content admins update media assets" on public.media_assets
  for update using (public.admin_can_manage_content())
  with check (public.admin_can_manage_content());
create policy "content admins delete media assets" on public.media_assets
  for delete using (public.admin_can_manage_content());

create policy "super admin reads activity logs" on public.activity_logs
  for select using (public.current_admin_role() = 'super_admin');
create policy "admins insert activity logs" on public.activity_logs
  for insert with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do update set public = excluded.public;

create policy "public reads site media" on storage.objects
  for select using (bucket_id = 'site-media');
create policy "content admins insert site media" on storage.objects
  for insert with check (bucket_id = 'site-media' and public.admin_can_manage_content());
create policy "content admins update site media" on storage.objects
  for update using (bucket_id = 'site-media' and public.admin_can_manage_content())
  with check (bucket_id = 'site-media' and public.admin_can_manage_content());
create policy "content admins delete site media" on storage.objects
  for delete using (bucket_id = 'site-media' and public.admin_can_manage_content());
