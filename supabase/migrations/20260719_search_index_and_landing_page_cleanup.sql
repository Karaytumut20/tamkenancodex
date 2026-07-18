-- Keep every indexable URL on the single canonical www host.
update public.blog_posts
set
  canonical_url = regexp_replace(
    canonical_url,
    '^https://primesecteknoloji[.]com',
    'https://www.primesecteknoloji.com'
  ),
  updated_at = now()
where canonical_url like 'https://primesecteknoloji.com/%';

-- This CMS test article is not a real landing page and must not be indexed.
update public.blog_posts
set
  status = 'draft',
  robots_index = 'noindex',
  sitemap_include = false,
  canonical_url = null,
  updated_at = now()
where slug = 'repudiandae-accusant';

-- /kurumsal is a permanent redirect to /iletisim.
update public.pages
set
  sitemap_include = false,
  redirect_to = '/iletisim',
  updated_at = now()
where slug = 'kurumsal';

-- Search and ad copy must describe the actual regional landing page.
with landing_copy(slug, meta_title, description, focus_keyword, secondary_keywords) as (
  values
    ('pendik-alarm-sistemleri', 'Pendik Alarm Sistemleri | Ücretsiz Keşif', 'Pendik ev, villa, ofis ve iş yerleri için hırsız alarm ve yangın ihbar sistemi keşfi, profesyonel kurulumu ve satış sonrası desteği.', 'pendik alarm sistemleri', array['pendik iş yeri alarm sistemi', 'pendik alarm sistemi kurulumu']),
    ('tuzla-kamera-sistemleri', 'Tuzla Kamera Sistemleri | Ücretsiz Keşif', 'Tuzla fabrika, depo, ofis ve konut projeleri için profesyonel IP ve CCTV kamera sistemi keşfi, projelendirme ve kurulum hizmeti.', 'tuzla kamera sistemleri', array['tuzla cctv kamera kurulumu', 'tuzla iş yeri kamera sistemi']),
    ('kartal-guvenlik-sistemleri', 'Kartal Güvenlik Sistemleri | Ücretsiz Keşif', 'Kartal iş yerleri ve konutlar için alarm, kamera, PDKS, kartlı geçiş ve network çözümlerini tek projede planlayıp kuruyoruz.', 'kartal güvenlik sistemleri', array['kartal iş yeri güvenlik sistemi', 'kartal kamera ve alarm sistemleri']),
    ('kocaeli-alarm-sistemleri', 'Kocaeli Alarm Sistemleri | Ücretsiz Keşif', 'Kocaeli ev, mağaza, ofis, depo ve fabrikaları için mobil bildirimli alarm sistemi keşfi, projelendirme ve profesyonel kurulum.', 'kocaeli alarm sistemleri', array['kocaeli iş yeri alarm sistemi', 'kocaeli alarm sistemi kurulumu']),
    ('kocaeli-kamera-sistemleri', 'Kocaeli Kamera Sistemleri | Ücretsiz Keşif', 'Kocaeli iş yeri ve konutları için IP ve CCTV güvenlik kamera sistemi keşfi, doğru kamera konumlandırma ve profesyonel kurulum.', 'kocaeli kamera sistemleri', array['kocaeli güvenlik kamera sistemleri', 'kocaeli kamera sistemi kurulumu']),
    ('kocaeli-guvenlik-sistemleri', 'Kocaeli Güvenlik Sistemleri | PrimeSec', 'Kocaeli için alarm, kamera, yangın ihbar, PDKS, geçiş kontrol ve network güvenlik sistemlerinde ücretsiz keşif ve kurulum.', 'kocaeli güvenlik sistemleri', array['kocaeli iş yeri güvenlik sistemleri', 'kocaeli kamera ve alarm sistemleri']),
    ('istanbul-alarm-sistemleri', 'İstanbul Alarm Sistemleri | Ücretsiz Keşif', 'İstanbul Anadolu Yakası ev, villa, mağaza ve ofisleri için mobil bildirimli alarm sistemi keşfi ve profesyonel kurulum.', 'istanbul alarm sistemleri', array['istanbul iş yeri alarm sistemi', 'istanbul alarm sistemi kurulumu']),
    ('istanbul-kamera-sistemleri', 'İstanbul Kamera Sistemleri | Ücretsiz Keşif', 'İstanbul Anadolu Yakası iş yeri ve konutları için IP ve CCTV güvenlik kamera sistemi keşfi, projelendirme ve profesyonel kurulum.', 'istanbul kamera sistemleri', array['istanbul güvenlik kamera sistemleri', 'istanbul kamera sistemi kurulumu']),
    ('istanbul-guvenlik-sistemleri', 'İstanbul Güvenlik Sistemleri | PrimeSec', 'İstanbul Anadolu Yakası için alarm, kamera, yangın ihbar, PDKS ve geçiş kontrol sistemlerinde ücretsiz keşif ve kurulum.', 'istanbul güvenlik sistemleri', array['istanbul iş yeri güvenlik sistemleri', 'istanbul kamera ve alarm sistemleri']),
    ('gebze-alarm-sistemleri', 'Gebze Alarm Sistemleri | Ücretsiz Keşif', 'Gebze ev, iş yeri, depo ve fabrikaları için mobil bildirimli alarm sistemi keşfi, projelendirme ve profesyonel kurulum.', 'gebze alarm sistemleri', array['gebze iş yeri alarm sistemi', 'gebze alarm sistemi kurulumu']),
    ('gebze-kamera-sistemleri', 'Gebze Kamera Sistemleri | Ücretsiz Keşif', 'Gebze fabrika, depo, ofis ve konutları için IP ve CCTV güvenlik kamera sistemi keşfi, projelendirme ve profesyonel kurulum.', 'gebze kamera sistemleri', array['gebze güvenlik kamera sistemleri', 'gebze kamera sistemi kurulumu']),
    ('izmit-alarm-sistemleri', 'İzmit Alarm Sistemleri | Ücretsiz Keşif', 'İzmit ev, mağaza ve ofisleri için mobil bildirimli hırsız alarm sistemi keşfi, profesyonel kurulum ve teknik destek.', 'izmit alarm sistemleri', array['izmit iş yeri alarm sistemi', 'izmit alarm sistemi kurulumu']),
    ('izmit-kamera-sistemleri', 'İzmit Kamera Sistemleri | Ücretsiz Keşif', 'İzmit iş yeri ve konutları için IP ve CCTV kamera sistemi keşfi, doğru kamera konumlandırma, kurulum ve uzaktan izleme.', 'izmit kamera sistemleri', array['izmit güvenlik kamera sistemleri', 'izmit kamera sistemi kurulumu']),
    ('darica-guvenlik-sistemleri', 'Darıca Güvenlik Sistemleri | PrimeSec', 'Darıca ev ve iş yerleri için alarm, kamera ve akıllı güvenlik sistemlerinde ücretsiz keşif, projelendirme ve profesyonel kurulum.', 'darıca güvenlik sistemleri', array['darıca iş yeri güvenlik sistemleri', 'darıca kamera ve alarm sistemleri']),
    ('cayirova-kamera-sistemleri', 'Çayırova Kamera Sistemleri | Ücretsiz Keşif', 'Çayırova mağaza, depo, üretim alanı ve konutları için IP ve CCTV güvenlik kamera sistemi keşfi ve profesyonel kurulum.', 'çayırova kamera sistemleri', array['çayırova iş yeri kamera sistemi', 'çayırova kamera sistemi kurulumu']),
    ('maltepe-alarm-sistemleri', 'Maltepe Alarm Sistemleri | Ücretsiz Keşif', 'Maltepe daire, villa, mağaza ve iş yerleri için mobil bildirimli alarm sistemi keşfi, profesyonel kurulum ve teknik destek.', 'maltepe alarm sistemleri', array['maltepe iş yeri alarm sistemi', 'maltepe alarm sistemi kurulumu'])
)
update public.service_areas as area
set
  meta_title = copy.meta_title,
  meta_description = copy.description,
  description = copy.description,
  focus_keyword = copy.focus_keyword,
  secondary_keywords = copy.secondary_keywords,
  updated_at = now()
from landing_copy as copy
where area.slug = copy.slug;
