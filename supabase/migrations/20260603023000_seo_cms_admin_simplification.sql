create extension if not exists "pgcrypto";

do $$
declare constraint_name text;
begin
  select conname into constraint_name
  from pg_constraint
  where conrelid = 'public.admin_profiles'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) like '%role%';

  if constraint_name is not null then
    execute format('alter table public.admin_profiles drop constraint %I', constraint_name);
  end if;

  alter table public.admin_profiles
    add constraint admin_profiles_role_check
    check (role in ('super_admin','editor','support','viewer'));
end $$;

alter table public.products
  add column if not exists image_alt text,
  add column if not exists focus_keyword text,
  add column if not exists secondary_keywords text[] not null default '{}',
  add column if not exists robots_index text not null default 'index',
  add column if not exists robots_follow text not null default 'follow',
  add column if not exists og_title text,
  add column if not exists og_description text,
  add column if not exists twitter_title text,
  add column if not exists twitter_description text,
  add column if not exists twitter_image_url text,
  add column if not exists schema_type text not null default 'Product',
  add column if not exists json_ld jsonb not null default '{}'::jsonb,
  add column if not exists breadcrumb_label text,
  add column if not exists sitemap_include boolean not null default true,
  add column if not exists redirect_to text;

alter table public.services
  add column if not exists image_alt text,
  add column if not exists card_image_url text,
  add column if not exists card_image_alt text,
  add column if not exists related_service_slugs text[] not null default '{}',
  add column if not exists focus_keyword text,
  add column if not exists secondary_keywords text[] not null default '{}',
  add column if not exists robots_index text not null default 'index',
  add column if not exists robots_follow text not null default 'follow',
  add column if not exists og_title text,
  add column if not exists og_description text,
  add column if not exists twitter_title text,
  add column if not exists twitter_description text,
  add column if not exists twitter_image_url text,
  add column if not exists schema_type text not null default 'Service',
  add column if not exists json_ld jsonb not null default '{}'::jsonb,
  add column if not exists breadcrumb_label text,
  add column if not exists sitemap_include boolean not null default true,
  add column if not exists redirect_to text;

alter table public.blog_posts
  add column if not exists cover_image_alt text,
  add column if not exists category_name text,
  add column if not exists tags text[] not null default '{}',
  add column if not exists author_name text,
  add column if not exists focus_keyword text,
  add column if not exists secondary_keywords text[] not null default '{}',
  add column if not exists robots_index text not null default 'index',
  add column if not exists robots_follow text not null default 'follow',
  add column if not exists og_title text,
  add column if not exists og_description text,
  add column if not exists twitter_title text,
  add column if not exists twitter_description text,
  add column if not exists twitter_image_url text,
  add column if not exists schema_type text not null default 'Article',
  add column if not exists json_ld jsonb not null default '{}'::jsonb,
  add column if not exists breadcrumb_label text,
  add column if not exists sitemap_include boolean not null default true,
  add column if not exists redirect_to text;

alter table public.service_areas
  add column if not exists focus_keyword text,
  add column if not exists secondary_keywords text[] not null default '{}',
  add column if not exists robots_index text not null default 'index',
  add column if not exists robots_follow text not null default 'follow',
  add column if not exists og_title text,
  add column if not exists og_description text,
  add column if not exists twitter_title text,
  add column if not exists twitter_description text,
  add column if not exists twitter_image_url text,
  add column if not exists schema_type text not null default 'LocalBusiness',
  add column if not exists json_ld jsonb not null default '{}'::jsonb,
  add column if not exists breadcrumb_label text,
  add column if not exists sitemap_include boolean not null default true,
  add column if not exists redirect_to text;

alter table public.brands
  add column if not exists logo_alt text;

alter table public.leads
  add column if not exists admin_note text,
  add column if not exists page_url text;

alter table public.media_assets
  add column if not exists alt_text text,
  add column if not exists title_text text,
  add column if not exists caption text,
  add column if not exists description text,
  add column if not exists used_on text[] not null default '{}',
  add column if not exists webp_optimized boolean not null default false,
  add column if not exists lazy_load boolean not null default true,
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  section_key text unique not null,
  title text not null,
  subtitle text,
  body text,
  primary_button_label text,
  primary_button_url text,
  secondary_button_label text,
  secondary_button_url text,
  image_url text,
  image_alt text,
  items jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  status text not null default 'active' check (status in ('active','passive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  h1 text not null,
  excerpt text,
  content text,
  cta_label text,
  cta_url text,
  image_url text,
  image_alt text,
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  meta_title text,
  meta_description text,
  focus_keyword text,
  secondary_keywords text[] not null default '{}',
  canonical_url text,
  robots_index text not null default 'index',
  robots_follow text not null default 'follow',
  og_title text,
  og_description text,
  og_image_url text,
  twitter_title text,
  twitter_description text,
  twitter_image_url text,
  schema_type text not null default 'WebPage',
  json_ld jsonb not null default '{}'::jsonb,
  breadcrumb_label text,
  sitemap_include boolean not null default true,
  redirect_to text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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
  add column if not exists mega_menu_key text;

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  page_slug text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  person_name text,
  role text,
  quote text not null,
  logo_url text,
  logo_alt text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  summary text,
  content text,
  location text,
  service_tags text[] not null default '{}',
  image_url text,
  image_alt text,
  gallery jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft','published')),
  sort_order int not null default 0,
  meta_title text,
  meta_description text,
  focus_keyword text,
  secondary_keywords text[] not null default '{}',
  canonical_url text,
  robots_index text not null default 'index',
  robots_follow text not null default 'follow',
  og_title text,
  og_description text,
  og_image_url text,
  twitter_title text,
  twitter_description text,
  twitter_image_url text,
  schema_type text not null default 'WebPage',
  json_ld jsonb not null default '{}'::jsonb,
  breadcrumb_label text,
  sitemap_include boolean not null default true,
  redirect_to text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.seo_settings (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid,
  path text not null,
  meta_title text,
  meta_description text,
  focus_keyword text,
  secondary_keywords text[] not null default '{}',
  canonical_url text,
  robots_index text not null default 'index',
  robots_follow text not null default 'follow',
  og_title text,
  og_description text,
  og_image_url text,
  twitter_title text,
  twitter_description text,
  twitter_image_url text,
  schema_type text not null default 'WebPage',
  json_ld jsonb not null default '{}'::jsonb,
  breadcrumb_label text,
  sitemap_include boolean not null default true,
  redirect_to text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pages_status_updated_idx on public.pages(status, updated_at desc);
create index if not exists site_content_section_idx on public.site_content(section_key, status, sort_order);
create index if not exists menu_items_menu_sort_idx on public.menu_items(menu_key, is_active, sort_order);
create index if not exists faqs_page_sort_idx on public.faqs(page_slug, is_active, sort_order);
create index if not exists testimonials_active_sort_idx on public.testimonials(is_active, sort_order);
create index if not exists projects_status_sort_idx on public.projects(status, sort_order, updated_at desc);
create index if not exists seo_settings_path_idx on public.seo_settings(path);
create index if not exists media_assets_alt_idx on public.media_assets(alt_text);

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'site_content','pages','menu_items','faqs','testimonials','projects','seo_settings','media_assets',
    'products','services','blog_posts','service_areas','brands','leads'
  ]
  loop
    execute format('drop trigger if exists set_%s_updated_at on public.%I', table_name, table_name);
    execute format('create trigger set_%s_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end $$;

alter table public.site_content enable row level security;
alter table public.pages enable row level security;
alter table public.menu_items enable row level security;
alter table public.faqs enable row level security;
alter table public.testimonials enable row level security;
alter table public.projects enable row level security;
alter table public.seo_settings enable row level security;

drop policy if exists "public reads active site content" on public.site_content;
drop policy if exists "content admins manage site content" on public.site_content;
drop policy if exists "public reads published pages" on public.pages;
drop policy if exists "content admins manage pages" on public.pages;
drop policy if exists "public reads active menu items" on public.menu_items;
drop policy if exists "content admins manage menu items" on public.menu_items;
drop policy if exists "public reads active faqs" on public.faqs;
drop policy if exists "content admins manage faqs" on public.faqs;
drop policy if exists "public reads active testimonials" on public.testimonials;
drop policy if exists "content admins manage testimonials" on public.testimonials;
drop policy if exists "public reads published projects" on public.projects;
drop policy if exists "content admins manage projects" on public.projects;
drop policy if exists "admins read seo settings" on public.seo_settings;
drop policy if exists "content admins manage seo settings" on public.seo_settings;

create policy "public reads active site content" on public.site_content
  for select using (status = 'active');
create policy "content admins manage site content" on public.site_content
  for all using (public.admin_can_manage_content())
  with check (public.admin_can_manage_content());

create policy "public reads published pages" on public.pages
  for select using (status = 'published');
create policy "content admins manage pages" on public.pages
  for all using (public.admin_can_manage_content())
  with check (public.admin_can_manage_content());

create policy "public reads active menu items" on public.menu_items
  for select using (is_active = true);
create policy "content admins manage menu items" on public.menu_items
  for all using (public.admin_can_manage_content())
  with check (public.admin_can_manage_content());

create policy "public reads active faqs" on public.faqs
  for select using (is_active = true);
create policy "content admins manage faqs" on public.faqs
  for all using (public.admin_can_manage_content())
  with check (public.admin_can_manage_content());

create policy "public reads active testimonials" on public.testimonials
  for select using (is_active = true);
create policy "content admins manage testimonials" on public.testimonials
  for all using (public.admin_can_manage_content())
  with check (public.admin_can_manage_content());

create policy "public reads published projects" on public.projects
  for select using (status = 'published');
create policy "content admins manage projects" on public.projects
  for all using (public.admin_can_manage_content())
  with check (public.admin_can_manage_content());

create policy "admins read seo settings" on public.seo_settings
  for select using (public.is_admin());
create policy "content admins manage seo settings" on public.seo_settings
  for all using (public.admin_can_manage_content())
  with check (public.admin_can_manage_content());

insert into public.site_settings (key, value)
values
  ('site.name', '{"value":"PrimeSec Teknoloji"}'::jsonb),
  ('contact.phone', '{"value":"+90 262 000 00 00"}'::jsonb),
  ('contact.whatsapp', '{"value":"905320000000"}'::jsonb),
  ('contact.email', '{"value":"info@primesecteknoloji.com"}'::jsonb),
  ('seo.defaults', '{"title":"PrimeSec Teknoloji","description":"Alarm, kamera ve guvenlik sistemleri icin profesyonel kesif ve kurulum.","ogImage":"/images/primesec-hero-guvenlik-sistemleri.svg"}'::jsonb)
on conflict (key) do nothing;
