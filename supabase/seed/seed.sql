insert into public.categories (name, slug, type, description, sort_order, is_active) values
  ('Alarm Sistemleri', 'alarm-sistemleri', 'service', 'Alarm sistemleri hizmet ve ürün kategorisi.', 10, true),
  ('Akıllı Ev Sistemleri', 'akilli-ev-sistemleri', 'service', 'Akıllı ev ve otomasyon çözümleri.', 20, true),
  ('Kamera Sistemleri', 'kamera-sistemleri', 'service', 'CCTV ve IP kamera sistemleri.', 30, true),
  ('Yangın İhbar Sistemleri', 'yangin-ihbar-sistemleri', 'service', 'Yangın ihbar ve dedektör çözümleri.', 40, true),
  ('Araç Takip Sistemleri', 'arac-takip-sistemleri', 'service', 'Araç ve filo takip çözümleri.', 50, true),
  ('Personel Takip PDKS', 'personel-takip-pdks', 'service', 'Personel takip ve geçiş kontrol çözümleri.', 60, true),
  ('Network Çözümleri', 'network-cozumleri', 'service', 'Network altyapı ve kablolama çözümleri.', 70, true),
  ('Satın Alma Rehberleri', 'satin-alma-rehberleri', 'blog', 'Güvenlik sistemi satın alma rehberleri.', 10, true),
  ('Yerel Güvenlik Rehberleri', 'yerel-guvenlik-rehberleri', 'blog', 'Şehir ve ilçe bazlı güvenlik rehberleri.', 20, true),
  ('Karşılaştırmalar', 'karsilastirmalar', 'blog', 'Ürün ve teknoloji karşılaştırmaları.', 30, true)
on conflict (slug) do update set
  name = excluded.name,
  type = excluded.type,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

insert into public.brands (name, slug, sort_order, is_featured, is_active) values
  ('PrimeSec', 'primesec', 0, true, true),
  ('Hikvision', 'hikvision', 10, true, true),
  ('Dahua', 'dahua', 20, true, true),
  ('TTEC', 'ttec', 30, false, true),
  ('UNV', 'unv', 40, true, true),
  ('Xmeye', 'xmeye', 50, false, true),
  ('Reolink', 'reolink', 60, true, true),
  ('Inox', 'inox', 70, false, true),
  ('Paradox', 'paradox', 80, true, true),
  ('DSC', 'dsc', 90, true, true),
  ('Teknim', 'teknim', 100, true, true),
  ('Ajax', 'ajax', 110, true, true)
on conflict (slug) do update set
  name = excluded.name,
  sort_order = excluded.sort_order,
  is_featured = excluded.is_featured,
  is_active = excluded.is_active;

insert into public.products (
  title, slug, sku, short_description, long_description, category_id, brand_id,
  image_url, tags, usage_areas, features, faqs, is_featured, is_popular, is_active, meta_title, meta_description, sort_order
)
select * from (
  values
    ('PrimeSec Plus Kameralı Alarm Paketi','primesec-plus-kamerali-alarm-paketi','PS-PLUS-001','Alarm, mobil bildirim ve akıllı video takibini tek pakette birleştiren premium güvenlik çözümü.','Alarm, mobil bildirim ve akıllı video takibini tek pakette birleştiren premium güvenlik çözümü.','alarm-sistemleri','primesec','/images/alarm-sistemi.svg',array['En Popüler','Kablosuz','Mobil Uyumlu'],array['Ev','İş Yeri'],'["Mobil uygulama kontrolü","Kameralı doğrulama","Anında bildirim","Genişletilebilir sensör yapısı"]'::jsonb,'[{"question":"PrimeSec Plus internetsiz çalışır mı?","answer":"GSM yedekleme ile kritik bildirimler internet kesintilerinde de sürdürülebilir."}]'::jsonb,true,true,true,'PrimeSec Plus Kameralı Alarm Paketi','Alarm, mobil bildirim ve akıllı video takip paketi.',10),
    ('Hikvision CCTV Kamera Sistemi','hikvision-cctv-kamera-sistemi','HK-CCTV-4MP','Yüksek çözünürlüklü kayıt, gece görüşü ve uzaktan izleme özellikli CCTV kamera sistemi.','Yüksek çözünürlüklü kayıt, gece görüşü ve uzaktan izleme özellikli CCTV kamera sistemi.','kamera-sistemleri','hikvision','/images/kamera-sistemi.svg',array['CCTV Kamera','Gece Görüşü','Uzaktan İzleme'],array['Ev','İş Yeri','Depo'],'["4MP net görüntü","NVR/DVR kayıt","Mobil izleme","Dış mekan dayanımı"]'::jsonb,'[{"question":"CCTV kamera uzaktan izlenebilir mi?","answer":"Evet, mobil uygulama ile canlı ve geçmiş kayıtlar takip edilebilir."}]'::jsonb,true,false,true,'Hikvision CCTV Kamera Sistemi','Hikvision CCTV kamera sistemi ve kurulum bilgileri.',20),
    ('Dahua IP Kamera Sistemi','dahua-ip-kamera-sistemi','DH-IP-5MP','IP tabanlı yüksek çözünürlüklü güvenlik kamerası ve kayıt altyapısı.','IP tabanlı yüksek çözünürlüklü güvenlik kamerası ve kayıt altyapısı.','kamera-sistemleri','dahua','/images/kamera-sistemi.svg',array['IP Kamera','PoE','Akıllı Analiz'],array['İş Yeri','Site','Mağaza'],'["PoE ile kolay kurulum","Hareket algılama","Yüksek çözünürlük","Uzaktan kayıt erişimi"]'::jsonb,'[{"question":"IP kamera ile CCTV farkı nedir?","answer":"IP kameralar ağ üzerinden çalışır ve esnek kurulum imkanı sunar."}]'::jsonb,true,false,true,'Dahua IP Kamera Sistemi','Dahua IP kamera sistemi ve PoE altyapı çözümü.',30),
    ('Akıllı Video Takip Sistemi','akilli-video-takip-sistemi','PS-VIDEO-AI','Hareket algılama, akıllı bildirim ve canlı izleme özellikli video güvenlik çözümü.','Hareket algılama, akıllı bildirim ve canlı izleme özellikli video güvenlik çözümü.','akilli-ev-sistemleri','primesec','/images/akilli-ev.svg',array['Akıllı Video','Anında Bildirim'],array['Ev','İş Yeri'],'["Canlı izleme","Akıllı hareket analizi","Bulut uyumlu kayıt","Mobil bildirim"]'::jsonb,'[]'::jsonb,false,false,true,'Akıllı Video Takip Sistemi','Akıllı video takip sistemi.',40),
    ('Akıllı Zil','akilli-zil','PS-DOORBELL','Kapınıza gelenleri mobil cihazdan görmenizi ve konuşmanızı sağlayan akıllı zil.','Kapınıza gelenleri mobil cihazdan görmenizi ve konuşmanızı sağlayan akıllı zil.','akilli-ev-sistemleri','primesec','/images/akilli-ev.svg',array['Görüntülü','Mobil'],array['Ev','Ofis'],'["Çift yönlü ses","Gece görüşü","Hareket algılama","Mobil bildirim"]'::jsonb,'[]'::jsonb,false,true,true,'Akıllı Zil','Akıllı zil ürün detayları.',50),
    ('Manyetik Kontak Alarm Sensörü','manyetik-kontak-alarm-sensoru','PS-MAG-01','Kapı ve pencere açılışlarını algılayan kablosuz alarm sensörü.','Kapı ve pencere açılışlarını algılayan kablosuz alarm sensörü.','alarm-sistemleri','primesec','/images/manyetik-kontak.svg',array['Sensör','Kablosuz'],array['Kapı','Pencere'],'["Kolay montaj","Düşük pil tüketimi","Anında alarm","Kapı/pencere uyumu"]'::jsonb,'[]'::jsonb,false,false,true,'Manyetik Kontak Alarm Sensörü','Manyetik kontak alarm sensörü.',60),
    ('Su Baskını Alarmı','su-baskini-alarmi','PS-WATER-01','Su kaçağı ve baskın riskini erken algılayan akıllı güvenlik sensörü.','Su kaçağı ve baskın riskini erken algılayan akıllı güvenlik sensörü.','alarm-sistemleri','primesec','/images/alarm-sistemi.svg',array['Su Baskını','Akıllı Sensör'],array['Ev','Mutfak','Banyo'],'["Erken uyarı","Mobil bildirim","Kablosuz çalışma","Alarm entegrasyonu"]'::jsonb,'[]'::jsonb,false,false,true,'Su Baskını Alarmı','Su baskını alarmı ürün detayları.',70),
    ('Yangın İhbar Dedektörü','yangin-ihbar-dedektoru','PS-FIRE-01','Duman ve yangın risklerini erken algılayan güvenilir yangın ihbar dedektörü.','Duman ve yangın risklerini erken algılayan güvenilir yangın ihbar dedektörü.','yangin-ihbar-sistemleri','teknim','/images/yangin-alarm.svg',array['Yangın İhbar','Duman Dedektörü'],array['Ev','İş Yeri','Depo'],'["Hızlı algılama","Alarm paneli uyumu","Düşük bakım","Yüksek hassasiyet"]'::jsonb,'[]'::jsonb,false,false,true,'Yangın İhbar Dedektörü','Yangın ihbar dedektörü.',80),
    ('PDKS Personel Takip Terminali','pdks-personel-takip-terminali','PS-PDKS-01','Personel giriş çıkışlarını kart, şifre veya biyometrik doğrulama ile izleyen PDKS çözümü.','Personel giriş çıkışlarını kart, şifre veya biyometrik doğrulama ile izleyen PDKS çözümü.','personel-takip-pdks','inox','/images/pdks.svg',array['PDKS','Biyometrik','Raporlama'],array['İş Yeri','Fabrika','Ofis'],'["Detaylı rapor","Kartlı geçiş","Biyometrik seçenek","Bordro entegrasyonuna hazır"]'::jsonb,'[]'::jsonb,false,false,true,'PDKS Personel Takip Terminali','PDKS personel takip terminali.',90),
    ('Network Altyapı Çözümü','network-altyapi-cozumu','PS-NET-01','Kamera, alarm, POS ve ofis cihazları için güvenilir ağ altyapısı kurulumu.','Kamera, alarm, POS ve ofis cihazları için güvenilir ağ altyapısı kurulumu.','network-cozumleri','unv','/images/network.svg',array['Network','Altyapı','Kablolama'],array['İş Yeri','Kamera Altyapısı','Ofis'],'["Keşif ve planlama","Yapısal kablolama","Switch kurulumu","Performans testi"]'::jsonb,'[]'::jsonb,false,false,true,'Network Altyapı Çözümü','Network altyapı çözümü.',100)
) as seed(title, slug, sku, short_description, long_description, category_slug, brand_slug, image_url, tags, usage_areas, features, faqs, is_featured, is_popular, is_active, meta_title, meta_description, sort_order)
join public.categories c on c.slug = seed.category_slug
join public.brands b on b.slug = seed.brand_slug
on conflict (slug) do update set
  title = excluded.title,
  sku = excluded.sku,
  short_description = excluded.short_description,
  long_description = excluded.long_description,
  category_id = excluded.category_id,
  brand_id = excluded.brand_id,
  image_url = excluded.image_url,
  tags = excluded.tags,
  usage_areas = excluded.usage_areas,
  features = excluded.features,
  faqs = excluded.faqs,
  is_featured = excluded.is_featured,
  is_popular = excluded.is_popular,
  is_active = excluded.is_active,
  meta_title = excluded.meta_title,
  meta_description = excluded.meta_description,
  sort_order = excluded.sort_order;

insert into public.services (title, slug, hero_title, hero_description, image_url, category_id, intro_title, intro_content, advantages, usage_areas, process_steps, faqs, cta_title, cta_description, is_active, meta_title, meta_description, sort_order)
select seed.title, seed.slug, seed.title, seed.description, seed.image_url, c.id, seed.title || ' nasıl planlanmalı?', seed.description,
  '["Anahtar teslim proje yönetimi","İhtiyaca uygun ürün seçimi","Profesyonel kurulum","Satış sonrası destek"]'::jsonb,
  '["Evler","İş yerleri","Kurumsal alanlar"]'::jsonb,
  '["Keşif","Projelendirme","Kurulum","Test ve teslim"]'::jsonb,
  '[{"question":"Keşif yapıyor musunuz?","answer":"Evet, alanın risk yapısını analiz ederek doğru sistemi planlıyoruz."}]'::jsonb,
  'Size özel güvenlik planı çıkaralım', 'Uzman ekibimiz seçtiğiniz hizmet için doğru ürün ve kurulum kapsamını belirler.', true,
  seed.title || ' | PrimeSec Teknoloji', seed.description, seed.sort_order
from (
  values
    ('Alarm Sistemleri','alarm-sistemleri','Ev ve iş yerleri için hırsız alarm, kablosuz sensör, siren ve mobil bildirim destekli güvenlik sistemleri kuruyoruz.','/images/alarm-sistemi.svg','alarm-sistemleri',10),
    ('Kamera Sistemleri','kamera-sistemleri','CCTV kamera, IP kamera, kayıt cihazı ve uzaktan izleme çözümleriyle alanlarınızı net ve kesintisiz izleyin.','/images/kamera-sistemi.svg','kamera-sistemleri',20),
    ('CCTV Kamera Sistemleri','kamera-sistemleri/cctv-kamera','CCTV kamera sistemleriyle ev, mağaza, depo ve ofisler için ekonomik ve güvenilir görüntü güvenliği sağlayın.','/images/kamera-sistemi.svg','kamera-sistemleri',30),
    ('IP Kamera Sistemleri','kamera-sistemleri/ip-kamera','PoE destekli IP kamera sistemleriyle yüksek çözünürlüklü, ölçeklenebilir ve akıllı video altyapısı kurun.','/images/kamera-sistemi.svg','kamera-sistemleri',40),
    ('Akıllı Ev Sistemleri','akilli-ev-sistemleri','Akıllı ev sistemleriyle güvenlik, konfor ve enerji yönetimini tek mobil ekranda birleştirin.','/images/akilli-ev.svg','akilli-ev-sistemleri',50),
    ('Yangın İhbar Sistemleri','yangin-ihbar-sistemleri','Duman, ısı ve yangın risklerini erken algılayan profesyonel yangın ihbar çözümleri kuruyoruz.','/images/yangin-alarm.svg','yangin-ihbar-sistemleri',60),
    ('Araç Takip Sistemleri','arac-takip-sistemleri','CanBus uyumlu araç takip çözümleriyle filonuzu canlı izleyin, raporlayın ve güvenle yönetin.','/images/arac-takip.svg','arac-takip-sistemleri',70),
    ('Personel Takip PDKS','personel-takip-pdks','Personel giriş çıkışlarını kartlı, şifreli veya biyometrik terminallerle güvenilir şekilde takip edin.','/images/pdks.svg','personel-takip-pdks',80),
    ('Network Çözümleri','network-cozumleri','Kamera, POS, ofis ve güvenlik cihazları için stabil network altyapısı tasarlıyor ve kuruyoruz.','/images/network.svg','network-cozumleri',90)
) as seed(title, slug, description, image_url, category_slug, sort_order)
join public.categories c on c.slug = seed.category_slug
on conflict (slug) do update set
  title = excluded.title,
  hero_title = excluded.hero_title,
  hero_description = excluded.hero_description,
  image_url = excluded.image_url,
  category_id = excluded.category_id,
  intro_title = excluded.intro_title,
  intro_content = excluded.intro_content,
  advantages = excluded.advantages,
  usage_areas = excluded.usage_areas,
  process_steps = excluded.process_steps,
  faqs = excluded.faqs,
  is_active = excluded.is_active,
  meta_title = excluded.meta_title,
  meta_description = excluded.meta_description,
  sort_order = excluded.sort_order;

insert into public.blog_posts (title, slug, excerpt, content, cover_image_url, category_id, reading_time, published_at, status, faqs, meta_title, meta_description)
select seed.title, seed.slug, seed.excerpt, seed.content, seed.cover_image_url, c.id, seed.reading_time, seed.published_at::timestamptz, 'published',
  '[{"question":"Bu konuda keşif gerekli mi?","answer":"Evet, doğru güvenlik planı için alanın fiziksel yapısını ve kullanım senaryosunu görmek önemlidir."}]'::jsonb,
  seed.title || ' | PrimeSec Blog', seed.excerpt
from (
  values
    ('Ev Alarm Sistemi Seçerken Nelere Dikkat Edilmeli?','ev-alarm-sistemi-secerken-nelere-dikkat-edilmeli','Ev alarm sistemi seçimi için temel rehber.','Güvenlik sistemi seçimi yalnızca cihaz sayısından ibaret değildir. Alanın giriş noktaları ve kullanım alışkanlıkları birlikte değerlendirilmelidir.','/images/blog-security.svg','satin-alma-rehberleri','6 dk','2026-05-10'),
    ('Kocaeli Alarm Sistemleri İçin En Çok Tercih Edilen Çözümler','kocaeli-alarm-sistemleri-en-cok-tercih-edilen-cozumler','Kocaeli alarm sistemleri için önerilen çözümler.','Kocaeli bölgesinde alarm, kamera ve akıllı güvenlik sistemleri ihtiyaca göre planlanmalıdır.','/images/blog-security.svg','yerel-guvenlik-rehberleri','6 dk','2026-05-11'),
    ('İstanbul Kamera Sistemleri Kurulum Rehberi','istanbul-kamera-sistemleri-kurulum-rehberi','İstanbul kamera sistemleri kurulumu için rehber.','Kamera sistemi kurulumu kör nokta analizi, kayıt altyapısı ve mobil erişim planlamasıyla birlikte yapılmalıdır.','/images/kamera-sistemi.svg','yerel-guvenlik-rehberleri','7 dk','2026-05-12'),
    ('CCTV Kamera ile IP Kamera Arasındaki Farklar','cctv-kamera-ile-ip-kamera-arasindaki-farklar','CCTV ve IP kamera teknolojilerini karşılaştırın.','CCTV ve IP kamera sistemleri farklı altyapı, kayıt ve ölçeklenebilirlik özellikleri sunar.','/images/kamera-sistemi.svg','karsilastirmalar','5 dk','2026-05-13')
) as seed(title, slug, excerpt, content, cover_image_url, category_slug, reading_time, published_at)
join public.categories c on c.slug = seed.category_slug
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  cover_image_url = excluded.cover_image_url,
  category_id = excluded.category_id,
  reading_time = excluded.reading_time,
  published_at = excluded.published_at,
  status = excluded.status,
  meta_title = excluded.meta_title,
  meta_description = excluded.meta_description;

insert into public.service_areas (city, district, service_type, title, slug, description, content_sections, faqs, is_active, meta_title, meta_description)
values
  ('Kocaeli', null, 'Alarm Sistemleri', 'Kocaeli Alarm Sistemleri', 'kocaeli-alarm-sistemleri', 'Kocaeli alarm sistemleri keşif, kurulum ve destek hizmetleri.', '[]'::jsonb, '[]'::jsonb, true, 'Kocaeli Alarm Sistemleri', 'Kocaeli alarm sistemleri keşif ve kurulum.'),
  ('Kocaeli', null, 'Kamera Sistemleri', 'Kocaeli Kamera Sistemleri', 'kocaeli-kamera-sistemleri', 'Kocaeli kamera sistemleri kurulum hizmetleri.', '[]'::jsonb, '[]'::jsonb, true, 'Kocaeli Kamera Sistemleri', 'Kocaeli kamera sistemleri kurulum.'),
  ('Kocaeli', null, 'Güvenlik Sistemleri', 'Kocaeli Güvenlik Sistemleri', 'kocaeli-guvenlik-sistemleri', 'Kocaeli güvenlik sistemleri çözümleri.', '[]'::jsonb, '[]'::jsonb, true, 'Kocaeli Güvenlik Sistemleri', 'Kocaeli güvenlik sistemleri.'),
  ('İstanbul', null, 'Alarm Sistemleri', 'İstanbul Alarm Sistemleri', 'istanbul-alarm-sistemleri', 'İstanbul alarm sistemleri keşif ve kurulum hizmetleri.', '[]'::jsonb, '[]'::jsonb, true, 'İstanbul Alarm Sistemleri', 'İstanbul alarm sistemleri.'),
  ('İstanbul', null, 'Kamera Sistemleri', 'İstanbul Kamera Sistemleri', 'istanbul-kamera-sistemleri', 'İstanbul kamera sistemleri kurulum hizmetleri.', '[]'::jsonb, '[]'::jsonb, true, 'İstanbul Kamera Sistemleri', 'İstanbul kamera sistemleri.'),
  ('İstanbul', null, 'Güvenlik Sistemleri', 'İstanbul Güvenlik Sistemleri', 'istanbul-guvenlik-sistemleri', 'İstanbul güvenlik sistemleri çözümleri.', '[]'::jsonb, '[]'::jsonb, true, 'İstanbul Güvenlik Sistemleri', 'İstanbul güvenlik sistemleri.'),
  ('Kocaeli', 'Gebze', 'Alarm Sistemleri', 'Gebze Alarm Sistemleri', 'gebze-alarm-sistemleri', 'Gebze alarm sistemleri keşif ve kurulum hizmetleri.', '[]'::jsonb, '[]'::jsonb, true, 'Gebze Alarm Sistemleri', 'Gebze alarm sistemleri.'),
  ('Kocaeli', 'Gebze', 'Kamera Sistemleri', 'Gebze Kamera Sistemleri', 'gebze-kamera-sistemleri', 'Gebze kamera sistemleri kurulum hizmetleri.', '[]'::jsonb, '[]'::jsonb, true, 'Gebze Kamera Sistemleri', 'Gebze kamera sistemleri.')
on conflict (slug) do update set
  city = excluded.city,
  district = excluded.district,
  service_type = excluded.service_type,
  title = excluded.title,
  description = excluded.description,
  is_active = excluded.is_active,
  meta_title = excluded.meta_title,
  meta_description = excluded.meta_description;

insert into public.site_settings (key, value) values
  ('company_info', '{"name":"PrimeSec Teknoloji","description":"Güvenlik sistemleri, alarm, kamera ve akıllı otomasyon çözümleri."}'::jsonb),
  ('contact_info', '{"phone":"+90 555 000 00 00","email":"info@primesec.com","address":"Türkiye"}'::jsonb),
  ('social_links', '{"instagram":"","facebook":"","linkedin":""}'::jsonb),
  ('whatsapp_settings', '{"number":"+905550000000","default_message":"Merhaba, PrimeSec Teknoloji hakkında bilgi almak istiyorum."}'::jsonb),
  ('footer_settings', '{"description":"PrimeSec Teknoloji güvenlik çözümleri."}'::jsonb),
  ('seo_defaults', '{"title":"PrimeSec Teknoloji","description":"Güvenlik sistemleri ve akıllı çözümler."}'::jsonb)
on conflict (key) do update set value = excluded.value;

insert into public.builder_options (step_number, step_key, title, option_label, option_value, sort_order, is_active) values
  (1, 'protected_area', 'Neyi korumak istiyorsunuz?', 'Ev', 'home', 10, true),
  (1, 'protected_area', 'Neyi korumak istiyorsunuz?', 'İş Yeri', 'business', 20, true),
  (2, 'space_type', 'Alan tipi nedir?', 'Daire', 'apartment', 10, true),
  (2, 'space_type', 'Alan tipi nedir?', 'Villa', 'villa', 20, true),
  (3, 'need_reason', 'Önceliğiniz nedir?', 'Hırsızlık önleme', 'intrusion', 10, true),
  (3, 'need_reason', 'Önceliğiniz nedir?', 'Kamera izleme', 'camera', 20, true),
  (4, 'package', 'Önerilen paket', 'Akıllı alarm paketi', 'smart_alarm', 10, true)
on conflict do nothing;
