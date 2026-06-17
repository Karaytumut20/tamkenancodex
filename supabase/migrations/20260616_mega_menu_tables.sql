-- ============================================================
-- Mega Menu Management Tables
-- ============================================================

create extension if not exists "pgcrypto";

-- ─── mega_menu_sections ──────────────────────────────────────
-- One row per navbar mega menu (alarm-sistemleri, kamera-sistemleri, etc.)
create table if not exists public.mega_menu_sections (
  id            uuid primary key default gen_random_uuid(),
  menu_key      text not null unique,       -- e.g. "alarm-sistemleri"
  title         text not null default '',
  eyebrow       text not null default '',
  insight_title text not null default '',
  insight_body  text not null default '',
  sort_order    int  not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ─── mega_menu_personas ──────────────────────────────────────
-- Left column audience cards (Ev Sahibi, İşletme, Kurumsal…)
create table if not exists public.mega_menu_personas (
  id          uuid primary key default gen_random_uuid(),
  section_id  uuid not null references public.mega_menu_sections(id) on delete cascade,
  title       text not null,
  description text not null default '',
  href        text not null,
  sort_order  int  not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── mega_menu_items ─────────────────────────────────────────
-- Middle column product/category links
create table if not exists public.mega_menu_items (
  id          uuid primary key default gen_random_uuid(),
  section_id  uuid not null references public.mega_menu_sections(id) on delete cascade,
  title       text not null,
  href        text not null,
  image_url   text not null default '',
  sort_order  int  not null default 0,
  is_active   boolean not null default true,
  -- Optional: link to an oksid product or db category
  source_type text,   -- 'product' | 'category' | 'custom'
  source_id   text,   -- product slug or category id
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── Auto-update timestamps ───────────────────────────────────
create or replace function public.set_updated_at_generic()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists mega_menu_sections_updated_at on public.mega_menu_sections;
create trigger mega_menu_sections_updated_at
  before update on public.mega_menu_sections
  for each row execute function public.set_updated_at_generic();

drop trigger if exists mega_menu_personas_updated_at on public.mega_menu_personas;
create trigger mega_menu_personas_updated_at
  before update on public.mega_menu_personas
  for each row execute function public.set_updated_at_generic();

drop trigger if exists mega_menu_items_updated_at on public.mega_menu_items;
create trigger mega_menu_items_updated_at
  before update on public.mega_menu_items
  for each row execute function public.set_updated_at_generic();

-- ─── Indexes ─────────────────────────────────────────────────
create index if not exists idx_mega_menu_sections_menu_key on public.mega_menu_sections(menu_key);
create index if not exists idx_mega_menu_personas_section on public.mega_menu_personas(section_id, sort_order);
create index if not exists idx_mega_menu_items_section    on public.mega_menu_items(section_id, sort_order);

-- ─── Row-level security ──────────────────────────────────────
alter table public.mega_menu_sections enable row level security;
alter table public.mega_menu_personas  enable row level security;
alter table public.mega_menu_items     enable row level security;

drop policy if exists "public reads mega_menu_sections" on public.mega_menu_sections;
create policy "public reads mega_menu_sections" on public.mega_menu_sections
  for select using (is_active = true);

drop policy if exists "public reads mega_menu_personas" on public.mega_menu_personas;
create policy "public reads mega_menu_personas" on public.mega_menu_personas
  for select using (is_active = true);

drop policy if exists "public reads mega_menu_items" on public.mega_menu_items;
create policy "public reads mega_menu_items" on public.mega_menu_items
  for select using (is_active = true);

-- Admins can do everything
drop policy if exists "admins manage mega_menu_sections" on public.mega_menu_sections;
create policy "admins manage mega_menu_sections" on public.mega_menu_sections
  for all using (public.admin_can_manage_content())
  with check (public.admin_can_manage_content());

drop policy if exists "admins manage mega_menu_personas" on public.mega_menu_personas;
create policy "admins manage mega_menu_personas" on public.mega_menu_personas
  for all using (public.admin_can_manage_content())
  with check (public.admin_can_manage_content());

drop policy if exists "admins manage mega_menu_items" on public.mega_menu_items;
create policy "admins manage mega_menu_items" on public.mega_menu_items
  for all using (public.admin_can_manage_content())
  with check (public.admin_can_manage_content());

-- ─── Seed from static data ────────────────────────────────────
insert into public.mega_menu_sections (menu_key, title, eyebrow, insight_title, insight_body, sort_order)
select * from (values
  ('alarm-sistemleri',     'Alarm Sistemleri',     'Risk tipine gore secin',
   'Ev ve is yerleri icin akilli alarm akislari',
   'Hirsizlik, yangin, su baskini ve panik senaryolarini tek panelde toplayan alarm mimarisiyle alaninizi 7/24 izlenebilir hale getirin.',
   1),
  ('akilli-ev-sistemleri', 'Akilli Ev Sistemleri', 'Konfor ve guvenlik',
   'Akilli ev urunlerini guvenlik sistemine baglayin',
   'Akilli zil, video takip, kilit, aydinlatma ve enerji kontrolunu mobil uygulama odakli entegre bir deneyime donusturun.',
   2),
  ('kamera-sistemleri',    'Kamera Sistemleri',    'Canli izleme ve kayit',
   'CCTV, IP kamera ve marka bazli kamera cozumleri',
   'Kameralarin gorus acisi, kayit altyapisi, network durumu ve mobil izleme ihtiyacini birlikte planlayarak net goruntu saglayin.',
   3)
) as seed(menu_key, title, eyebrow, insight_title, insight_body, sort_order)
where not exists (
  select 1 from public.mega_menu_sections existing where existing.menu_key = seed.menu_key
);

-- Personas seed
with sections as (
  select id, menu_key from public.mega_menu_sections
)
insert into public.mega_menu_personas (section_id, title, description, href, sort_order)
select s.id, p.title, p.description, p.href, p.sort_order
from sections s
cross join lateral (values
  ('alarm-sistemleri',     'Ev Sahibi',    'Daire, villa ve yazliklar icin pratik koruma',            '/alarm-sistemleri/ev-alarm-sistemleri',    1),
  ('alarm-sistemleri',     'Isletme',      'Magaza, ofis ve depo icin caydirici alarm',               '/alarm-sistemleri/is-yeri-alarm-sistemleri',2),
  ('alarm-sistemleri',     'Kurumsal',     'Cok alanli projeler icin genisletilebilir yapi',          '/alarm-sistemleri',                         3),
  ('akilli-ev-sistemleri', 'Akilli Yasam', 'Ev otomasyonu ve uzaktan kontrol',                        '/akilli-ev-sistemleri',                     1),
  ('akilli-ev-sistemleri', 'Kapida Guvenlik','Akilli zil ve kilit cozumleri',                         '/urunler/akilli-zil',                       2),
  ('akilli-ev-sistemleri', 'Video Takip',  'Anlik bildirimli akilli izleme',                          '/urunler/akilli-video-takip-sistemi',       3),
  ('kamera-sistemleri',    'CCTV Kamera',  'Ekonomik ve guvenilir kamera kurulumu',                   '/kamera-sistemleri/cctv-kamera',            1),
  ('kamera-sistemleri',    'IP Kamera',    'PoE ve network tabanli profesyonel izleme',               '/kamera-sistemleri/ip-kamera',              2),
  ('kamera-sistemleri',    'Marka Cozumleri','Hikvision, Dahua, UNV ve Reolink',                      '/kamera-sistemleri',                        3)
) as p(menu_key_p, title, description, href, sort_order)
where s.menu_key = p.menu_key_p
  and not exists (
    select 1 from public.mega_menu_personas ex where ex.section_id = s.id and ex.title = p.title
  );

-- Items seed
with sections as (
  select id, menu_key from public.mega_menu_sections
)
insert into public.mega_menu_items (section_id, title, href, image_url, sort_order, source_type)
select s.id, i.title, i.href, i.image_url, i.sort_order, 'custom'
from sections s
cross join lateral (values
  ('alarm-sistemleri', 'Ev Alarm Sistemleri',        '/alarm-sistemleri/ev-alarm-sistemleri',        '/images/alarm-sistemi.svg',  1),
  ('alarm-sistemleri', 'Is Yeri Alarm Sistemleri',   '/alarm-sistemleri/is-yeri-alarm-sistemleri',   '/images/local-security.svg', 2),
  ('alarm-sistemleri', 'PrimeSec Plus',               '/urunler/primesec-plus-kamerali-alarm-paketi', '/images/alarm-sistemi.svg',  3),
  ('alarm-sistemleri', 'Manyetik Kontak',             '/urunler/manyetik-kontak-alarm-sensoru',       '/images/manyetik-kontak.svg',4),
  ('alarm-sistemleri', 'Su Baskini Alarmi',           '/urunler/su-baskini-alarmi',                   '/images/alarm-sistemi.svg',  5),
  ('alarm-sistemleri', 'Yangin Alarmi',               '/urunler/yangin-ihbar-dedektoru',              '/images/yangin-alarm.svg',   6),
  ('akilli-ev-sistemleri','Akilli Video',             '/urunler/akilli-video-takip-sistemi',          '/images/akilli-ev.svg',      1),
  ('akilli-ev-sistemleri','Akilli Kilit',             '/akilli-ev-sistemleri',                        '/images/smart-lock.svg',     2),
  ('akilli-ev-sistemleri','Akilli Zil',               '/urunler/akilli-zil',                          '/images/akilli-ev.svg',      3),
  ('akilli-ev-sistemleri','Akilli Priz',              '/akilli-ev-sistemleri',                        '/images/akilli-ev.svg',      4),
  ('akilli-ev-sistemleri','Akilli Aydinlatma',        '/akilli-ev-sistemleri',                        '/images/akilli-ev.svg',      5),
  ('akilli-ev-sistemleri','Akilli Termostat',         '/akilli-ev-sistemleri',                        '/images/akilli-ev.svg',      6),
  ('kamera-sistemleri','KameramPro',                  '/kamera-sistemleri',                           '/images/kamera-sistemi.svg', 1),
  ('kamera-sistemleri','CCTV Kamera',                 '/kamera-sistemleri/cctv-kamera',               '/images/kamera-sistemi.svg', 2),
  ('kamera-sistemleri','IP Kamera',                   '/kamera-sistemleri/ip-kamera',                 '/images/kamera-sistemi.svg', 3),
  ('kamera-sistemleri','Hikvision Kamera Sistemleri', '/urunler/hikvision-cctv-kamera-sistemi',       '/images/kamera-sistemi.svg', 4),
  ('kamera-sistemleri','Dahua Kamera Sistemleri',     '/urunler/dahua-ip-kamera-sistemi',             '/images/kamera-sistemi.svg', 5),
  ('kamera-sistemleri','Akilli Video',                '/urunler/akilli-video-takip-sistemi',          '/images/akilli-ev.svg',      6)
) as i(menu_key_i, title, href, image_url, sort_order)
where s.menu_key = i.menu_key_i
  and not exists (
    select 1 from public.mega_menu_items ex where ex.section_id = s.id and ex.title = i.title
  );

notify pgrst, 'reload schema';
