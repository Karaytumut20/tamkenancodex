-- Yeni hizmet sekmelerini ve kartlarını eklemek için anonim bir PL/pgSQL bloğu kullanıyoruz.
-- Not: Bu işlem mevcut tabloları temizlemez, sadece yenilerini ekler. 
-- Eğer eskisini silmek isterseniz üstteki yorumlu DELETE komutlarını açabilirsiniz.

-- DELETE FROM public.homepage_services;
-- DELETE FROM public.homepage_service_tabs;

DO $$ 
DECLARE
    tab_cctv uuid := gen_random_uuid();
    tab_hirsiz uuid := gen_random_uuid();
    tab_yangin uuid := gen_random_uuid();
    tab_arac uuid := gen_random_uuid();
    tab_arac_kam uuid := gen_random_uuid();
    tab_pdks uuid := gen_random_uuid();
    tab_gecis uuid := gen_random_uuid();
    tab_diafon uuid := gen_random_uuid();
    tab_pos uuid := gen_random_uuid();
    tab_network uuid := gen_random_uuid();
    tab_markalar uuid := gen_random_uuid();
BEGIN
    -- 1. SEKMELERİ EKLİYORUZ
    INSERT INTO public.homepage_service_tabs (id, title, sort_order) VALUES
    (tab_cctv, 'CCTV Kamera', 10),
    (tab_hirsiz, 'Hırsız Alarm', 20),
    (tab_yangin, 'Yangın İhbar', 30),
    (tab_arac, 'Araç Takip', 40),
    (tab_arac_kam, 'Araç Kamerası', 50),
    (tab_pdks, 'Personel Takip PDKS', 60),
    (tab_gecis, 'Kapı Geçiş Sistemleri', 70),
    (tab_diafon, 'IP Diafon Sistemleri', 80),
    (tab_pos, 'Restoran POS Yazılımı', 90),
    (tab_network, 'Network Çözümleri', 100),
    (tab_markalar, 'Kamera Markaları', 110);

    -- 2. KARTLARI EKLİYORUZ (Her sekme için 4 kart)
    
    -- CCTV Kamera Kartları
    INSERT INTO public.homepage_services (tab_id, title, description, image, link, sort_order) VALUES
    (tab_cctv, 'Dome Kameralar', 'İç mekanlar için estetik ve geniş açılı güvenlik çözümleri.', '/images/services/cctv-dome.jpg', '/hizmetler/cctv-kamera', 1),
    (tab_cctv, 'Bullet Kameralar', 'Zorlu dış ortam şartlarına dayanıklı, uzun menzilli kameralar.', '/images/services/cctv-bullet.jpg', '/hizmetler/cctv-kamera', 2),
    (tab_cctv, 'PTZ Kameralar', '360 derece dönebilen ve yüksek optik zoom yapabilen sistemler.', '/images/services/cctv-ptz.jpg', '/hizmetler/cctv-kamera', 3),
    (tab_cctv, 'NVR Kayıt Cihazları', 'Yüksek kapasiteli depolama ile uzun süreli ve güvenli kayıt imkanı.', '/images/services/cctv-nvr.jpg', '/hizmetler/cctv-kamera', 4);

    -- Hırsız Alarm Kartları
    INSERT INTO public.homepage_services (tab_id, title, description, image, link, sort_order) VALUES
    (tab_hirsiz, 'Kablolu Alarm Sistemleri', 'Büyük projeler ve işletmeler için kesintisiz, yüksek güvenlik.', '/images/services/alarm-kablolu.jpg', '/hizmetler/hirsiz-alarm', 1),
    (tab_hirsiz, 'Kablosuz Alarm Sistemleri', 'Evler için kırma dökme olmadan, estetik ve hızlı kurulum.', '/images/services/alarm-kablosuz.jpg', '/hizmetler/hirsiz-alarm', 2),
    (tab_hirsiz, 'Hareket Dedektörleri', 'Gelişmiş PIR ve mikrodalga teknolojisiyle hatasız algılama.', '/images/services/alarm-dedektor.jpg', '/hizmetler/hirsiz-alarm', 3),
    (tab_hirsiz, 'Çevre Güvenlik Sistemleri', 'Bahçe ve dış mekanlarda ihlalleri anında tespit eden bariyerler.', '/images/services/alarm-cevre.jpg', '/hizmetler/hirsiz-alarm', 4);

    -- Yangın İhbar Kartları
    INSERT INTO public.homepage_services (tab_id, title, description, image, link, sort_order) VALUES
    (tab_yangin, 'Duman ve Isı Dedektörleri', 'Yangın başlangıcını anında tespit ederek erken uyarı sağlar.', '/images/services/yangin-dedektor.jpg', '/hizmetler/yangin-ihbar', 1),
    (tab_yangin, 'Konvansiyonel Paneller', 'Küçük ve orta ölçekli binalar için ekonomik bölgesel koruma.', '/images/services/yangin-konvansiyonel.jpg', '/hizmetler/yangin-ihbar', 2),
    (tab_yangin, 'Adresli Yangın Panelleri', 'Büyük binalarda tehlikenin tam noktasını gösteren sistemler.', '/images/services/yangin-adresli.jpg', '/hizmetler/yangin-ihbar', 3),
    (tab_yangin, 'Yangın Buton ve Sirenleri', 'Acil durumlarda binanın hızlıca tahliye edilmesini sağlayan uyarıcılar.', '/images/services/yangin-siren.jpg', '/hizmetler/yangin-ihbar', 4);

    -- Araç Takip Kartları
    INSERT INTO public.homepage_services (tab_id, title, description, image, link, sort_order) VALUES
    (tab_arac, 'Standart Araç Takip', 'Araçlarınızı 7/24 harita üzerinden canlı konum ve hızla takip edin.', '/images/services/arac-takip-standart.jpg', '/hizmetler/arac-takip', 1),
    (tab_arac, 'Filo Yönetim Yazılımı', 'Gelişmiş rota planlaması ve yakıt optimizasyonu sağlayan yazılımlar.', '/images/services/arac-takip-filo.jpg', '/hizmetler/arac-takip', 2),
    (tab_arac, 'OBD Takip Cihazları', 'Tak-çalıştır özelliğiyle kolay kurulum ve detaylı motor verisi analizi.', '/images/services/arac-takip-obd.jpg', '/hizmetler/arac-takip', 3),
    (tab_arac, 'Sensör Entegrasyonları', 'Soğuk zincir için ısı, kapı açılış ve yakıt seviyesi sensörü destekleri.', '/images/services/arac-takip-sensor.jpg', '/hizmetler/arac-takip', 4);

    -- Araç Kamerası Kartları
    INSERT INTO public.homepage_services (tab_id, title, description, image, link, sort_order) VALUES
    (tab_arac_kam, 'Çift Yönlü Kameralar', 'Olası kazalarda kanıt sunan araç içi ve dışı eş zamanlı kayıt.', '/images/services/arac-kam-cift.jpg', '/hizmetler/arac-kamerasi', 1),
    (tab_arac_kam, 'MDVR Sistemleri', 'Toplu taşıma ve lojistik araçları için titreşime dayanıklı mobil kayıt.', '/images/services/arac-kam-mdvr.jpg', '/hizmetler/arac-kamerasi', 2),
    (tab_arac_kam, 'Geri Görüş Sistemleri', 'Büyük araçlarda kör noktaları ortadan kaldıran güvenli park asistanı.', '/images/services/arac-kam-geri.jpg', '/hizmetler/arac-kamerasi', 3),
    (tab_arac_kam, 'Yapay Zeka (ADAS)', 'Sürücü yorgunluk tespiti ve şerit ihlali uyarısı yapan akıllı kameralar.', '/images/services/arac-kam-adas.jpg', '/hizmetler/arac-kamerasi', 4);

    -- Personel Takip PDKS Kartları
    INSERT INTO public.homepage_services (tab_id, title, description, image, link, sort_order) VALUES
    (tab_pdks, 'Parmak İzi Okuyucular', 'Başkasının yerine kart basılmasını engelleyen biyometrik güvenlik.', '/images/services/pdks-parmakizi.jpg', '/hizmetler/pdks', 1),
    (tab_pdks, 'Yüz Tanıma Sistemleri', 'Temassız, hijyenik ve çok hızlı personel giriş-çıkış takibi.', '/images/services/pdks-yuztanima.jpg', '/hizmetler/pdks', 2),
    (tab_pdks, 'Kartlı Geçiş Terminalleri', 'Mifare ve Proximity kart destekli, turnike entegreli geçiş cihazları.', '/images/services/pdks-kartli.jpg', '/hizmetler/pdks', 3),
    (tab_pdks, 'PDKS Yazılımı', 'Maaş, mesai, eksik çalışma ve mola sürelerinin otomatik hesaplanması.', '/images/services/pdks-yazilim.jpg', '/hizmetler/pdks', 4);

    -- Kapı Geçiş Sistemleri Kartları
    INSERT INTO public.homepage_services (tab_id, title, description, image, link, sort_order) VALUES
    (tab_gecis, 'Şifreli Geçiş Panelleri', 'Ofis ve depo gibi özel alanlara yetkisiz girişleri engelleyen çözümler.', '/images/services/gecis-sifreli.jpg', '/hizmetler/kapi-gecis', 1),
    (tab_gecis, 'Turnike Sistemleri', 'Plaza, okul, spor salonu ve fabrika girişlerinde kontrollü geçiş.', '/images/services/gecis-turnike.jpg', '/hizmetler/kapi-gecis', 2),
    (tab_gecis, 'Otopark Bariyerleri', 'Hızlı geçiş (HGS/OGS) ve plaka tanıma entegreli araç bariyer otomasyonu.', '/images/services/gecis-bariyer.jpg', '/hizmetler/kapi-gecis', 3),
    (tab_gecis, 'Manyetik Kilitler', 'Cam ve ahşap kapılar için bas-aç butonlu dayanıklı kilit sistemleri.', '/images/services/gecis-manyetik.jpg', '/hizmetler/kapi-gecis', 4);

    -- IP Diafon Sistemleri Kartları
    INSERT INTO public.homepage_services (tab_id, title, description, image, link, sort_order) VALUES
    (tab_diafon, 'Akıllı İç Ekranlar', 'Daire içi iletişim için yüksek çözünürlüklü dokunmatik monitörler.', '/images/services/diafon-ekran.jpg', '/hizmetler/ip-diafon', 1),
    (tab_diafon, 'Dış Kapı Panelleri', 'Geniş açılı kameralı, şifreli ve kart okuyuculu şık dış ziller.', '/images/services/diafon-dispanel.jpg', '/hizmetler/ip-diafon', 2),
    (tab_diafon, 'Akıllı Ev Entegrasyonu', 'Cep telefonu ile uzaktan misafirle görüşme ve kapı açma imkanı.', '/images/services/diafon-akilli.jpg', '/hizmetler/ip-diafon', 3),
    (tab_diafon, 'Güvenlik Konsolu', 'Site yönetimi, komşular ve güvenlik görevlisiyle anında iletişim.', '/images/services/diafon-konsol.jpg', '/hizmetler/ip-diafon', 4);

    -- Restoran POS Yazılımı Kartları
    INSERT INTO public.homepage_services (tab_id, title, description, image, link, sort_order) VALUES
    (tab_pos, 'Sipariş ve Masa Yönetimi', 'Dokunmatik ekranlardan hızlı adisyon açma ve masa taşıma işlemleri.', '/images/services/pos-siparis.jpg', '/hizmetler/restoran-pos', 1),
    (tab_pos, 'Stok ve Maliyet Takibi', 'Satılan ürünlerin reçeteden düşmesiyle hassas depo ve maliyet kontrolü.', '/images/services/pos-stok.jpg', '/hizmetler/restoran-pos', 2),
    (tab_pos, 'Mobil Garson Terminali', 'El terminalleri veya tabletlerle masada hızlı sipariş alma kolaylığı.', '/images/services/pos-mobil.jpg', '/hizmetler/restoran-pos', 3),
    (tab_pos, 'Mutfak Ekranı (KDS)', 'Alınan siparişlerin anında mutfak ekranına düşmesiyle hızlı servis.', '/images/services/pos-mutfak.jpg', '/hizmetler/restoran-pos', 4);

    -- Network Çözümleri Kartları
    INSERT INTO public.homepage_services (tab_id, title, description, image, link, sort_order) VALUES
    (tab_network, 'Ağ Anahtarları (Switch)', 'Kameralar ve cihazlar için yüksek hızlı ve PoE destekli veri aktarımı.', '/images/services/network-switch.jpg', '/hizmetler/network', 1),
    (tab_network, 'Kablosuz Ağlar (Access Point)', 'Oteller ve ofisler için kesintisiz, geniş kapsama alanlı Wi-Fi çözümleri.', '/images/services/network-ap.jpg', '/hizmetler/network', 2),
    (tab_network, 'Firewall Çözümleri', 'Kurumsal ağınızı siber saldırılardan ve veri hırsızlığından koruyun.', '/images/services/network-firewall.jpg', '/hizmetler/network', 3),
    (tab_network, 'Yapısal Kablolama', 'Uzun ömürlü, standartlara uygun ve düzenli fiber/bakır altyapı projeleri.', '/images/services/network-kablo.jpg', '/hizmetler/network', 4);

    -- Kamera Markaları Kartları
    INSERT INTO public.homepage_services (tab_id, title, description, image, link, sort_order) VALUES
    (tab_markalar, 'Hikvision Çözümleri', 'Dünya liderinden her projeye uygun profesyonel güvenlik teknolojileri.', '/images/services/marka-hikvision.jpg', '/hizmetler/kamera-markalari', 1),
    (tab_markalar, 'Dahua Teknolojileri', 'Yenilikçi, yapay zeka destekli ve yüksek çözünürlüklü kamera sistemleri.', '/images/services/marka-dahua.jpg', '/hizmetler/kamera-markalari', 2),
    (tab_markalar, 'Haikon Sistemleri', 'Ekonomik fiyatlarla yüksek performans sunan güvenilir projeler.', '/images/services/marka-haikon.jpg', '/hizmetler/kamera-markalari', 3),
    (tab_markalar, 'Tiandy ve Diğerleri', 'Starlight teknolojisi ile geceyi gündüze çeviren uzman markalar.', '/images/services/marka-tiandy.jpg', '/hizmetler/kamera-markalari', 4);

END $$;
