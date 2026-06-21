BEGIN;

INSERT INTO public.categories (name, slug, type, description, sort_order, is_active)
VALUES
  ('Satın Alma Rehberleri', 'satin-alma-rehberleri', 'blog', 'Güvenlik sistemi seçim ve satın alma rehberleri.', 10, true),
  ('Yerel Güvenlik Rehberleri', 'yerel-guvenlik-rehberleri', 'blog', 'Kocaeli ve ilçeleri için yerel güvenlik rehberleri.', 20, true)
ON CONFLICT (slug) DO NOTHING;

WITH posts (
  title, slug, excerpt, content, cover_image_url, category_slug, reading_time,
  published_at, table_of_contents, faqs, meta_title, meta_description,
  cover_image_alt, category_name, tags, focus_keyword, secondary_keywords
) AS (
  VALUES
  (
    'Güvenlik Kamerası Kayıt Süresi Nasıl Hesaplanır?',
    'guvenlik-kamerasi-kayit-suresi-nasil-hesaplanir',
    'Kamera kayıt süresini; kamera sayısı, çözünürlük, FPS, sıkıştırma ve disk kapasitesine göre doğru hesaplayın.',
    $p1$Güvenlik kamerası kayıt süresi yalnızca diskin üzerinde yazan kapasiteye bakılarak belirlenemez. Kamera sayısı, görüntü çözünürlüğü, saniyedeki kare sayısı, gece sahnesindeki hareket miktarı ve kullanılan H.265 sıkıştırma teknolojisi toplam depolama ihtiyacını doğrudan etkiler.

Ev ve küçük iş yerlerinde genellikle 15 ila 30 gün arası kayıt hedeflenir. Depo, fabrika ve yoğun insan trafiği olan ticari alanlarda ise olayların geç fark edilme ihtimali nedeniyle daha uzun saklama süresi planlanabilir. Hareket algılamalı kayıt alan kazandırır; ancak kritik noktalarda kesintisiz kayıt daha güvenilir olabilir.

Doğru hesaplama için her kameranın ortalama bit hızı belirlenir, toplam kamera sayısıyla çarpılır ve istenen gün süresine göre disk kapasitesi hesaplanır. Diskin tamamını kullanmak yerine sistem payı ve olası kapasite farkları için güvenlik marjı bırakılmalıdır.

PrimeSec Teknoloji keşif sırasında kamera noktalarını, gerekli görüntü kalitesini ve hedef kayıt süresini birlikte değerlendirir. Böylece gereğinden büyük disk maliyeti veya olay anında kayıt bulunamaması riski önlenir.$p1$,
    '/images/kamera-sistemi.svg', 'satin-alma-rehberleri', '7 dk', '2026-06-12 09:00:00+03'::timestamptz,
    '[{"id":"kayit-suresi","title":"Kayıt süresini etkileyen faktörler"},{"id":"disk-hesabi","title":"Disk kapasitesi hesabı"}]'::jsonb,
    '[{"question":"1 TB disk kaç gün kamera kaydı tutar?","answer":"Kesin süre kamera sayısına, çözünürlüğe ve bit hızına bağlıdır; proje bazında hesaplanmalıdır."},{"question":"Kayıt dolunca ne olur?","answer":"NVR veya DVR en eski kaydı otomatik silerek yeni görüntüyü kaydetmeye devam eder."}]'::jsonb,
    'Kamera Kayıt Süresi Nasıl Hesaplanır? | PrimeSec',
    'Güvenlik kamerası kayıt süresini kamera sayısı, çözünürlük ve disk kapasitesine göre hesaplayın. Doğru NVR depolama planını öğrenin.',
    'Güvenlik kamerası kayıt süresi ve NVR disk hesabı', 'Kamera Sistemleri',
    ARRAY['kamera kayıt süresi','NVR disk hesabı','kamera depolama'],
    'kamera kayıt süresi', ARRAY['NVR disk kapasitesi','güvenlik kamerası kayıt hesabı']
  ),
  (
    'Gece Görüşlü Güvenlik Kamerası Seçim Rehberi',
    'gece-goruslu-guvenlik-kamerasi-secim-rehberi',
    'IR mesafesi, lens, aydınlatma ve renkli gece görüşü özelliklerine göre doğru gece görüşlü kamerayı seçin.',
    $p2$Gece görüşlü güvenlik kamerası seçerken yalnızca kutu üzerindeki IR mesafesine bakmak yeterli değildir. Kameranın yerleştirileceği yüzey, karşıdan gelen araç farları, ortam aydınlatması ve izlenecek alanın genişliği gerçek performansı belirler.

Klasik infrared kameralar karanlıkta siyah beyaz görüntü üretir. Renkli gece görüşü sunan modeller ise hassas sensör ve destekleyici beyaz ışık kullanarak kıyafet ve araç rengi gibi ayrıntıları koruyabilir. Ancak gereksiz güçlü aydınlatma komşu alanları rahatsız edebilir ve yansıma oluşturabilir.

Kamera duvara veya saçak altına yerleştirilirken IR ışığını geri yansıtacak yakın yüzeylerden kaçınılmalıdır. Örümcek ağı, kirli lens kapağı ve cam arkasından çekim gece görüntüsünü ciddi biçimde bozabilir.

PrimeSec, keşif sırasında gündüz ve gece ışık koşullarını birlikte inceler. Lens açısı, montaj yüksekliği ve gerekli IR mesafesi belirlenerek yüz ve plaka gibi kritik ayrıntıların okunabilir kalması hedeflenir.$p2$,
    '/images/kamera-sistemi.svg', 'satin-alma-rehberleri', '6 dk', '2026-06-13 09:00:00+03'::timestamptz,
    '[]'::jsonb,
    '[{"question":"IR kamera tamamen karanlıkta çalışır mı?","answer":"Evet, uygun IR aydınlatmaya sahip kameralar tamamen karanlık ortamda siyah beyaz görüntü üretebilir."},{"question":"Renkli gece görüşü her yerde gerekli mi?","answer":"Hayır. Renk bilgisinin olay analizi için kritik olduğu giriş, otopark ve kasa çevresi gibi noktalarda tercih edilmelidir."}]'::jsonb,
    'Gece Görüşlü Güvenlik Kamerası Rehberi | PrimeSec',
    'Gece görüşlü güvenlik kamerası seçerken IR mesafesi, lens, renkli gece görüşü ve doğru montaj hakkında bilmeniz gerekenleri inceleyin.',
    'Gece görüşlü güvenlik kamerası ile bina girişi', 'Kamera Sistemleri',
    ARRAY['gece görüşlü kamera','IR kamera','renkli gece görüşü'],
    'gece görüşlü güvenlik kamerası', ARRAY['IR kamera seçimi','renkli gece görüşü']
  ),
  (
    'Depo Güvenlik Kamera Sistemi Nasıl Planlanır?',
    'depo-guvenlik-kamera-sistemi-nasil-planlanir',
    'Depo girişleri, sevkiyat alanları, raf koridorları ve kör noktalar için kamera sistemi planlama rehberi.',
    $p3$Depo güvenliğinde kamera sistemi hem hırsızlık riskini azaltmak hem de sevkiyat ve iş güvenliği olaylarını incelemek için kullanılır. Yüksek tavan, uzun raf koridorları, değişken aydınlatma ve yoğun araç trafiği standart bir kamera kurulumundan daha dikkatli planlama gerektirir.

Ana giriş, personel kapısı, mal kabul, sevkiyat rampası ve değerli ürün alanları öncelikli noktalardır. Genel alanı izleyen geniş açılı kameraların yanında yüz, plaka veya paket etiketi gibi ayrıntıları kaydeden dar açılı kameralar da kullanılmalıdır.

Network altyapısında PoE switch kapasitesi, fiber omurga ihtiyacı ve elektrik kesintilerine karşı UPS planı birlikte ele alınır. Kayıt cihazı ve disk kapasitesi, deponun olay fark etme süresine göre belirlenmelidir.

PrimeSec Teknoloji, depo keşfinde kamera görüş açılarını ve kablo güzergahlarını önceden projelendirir. Bu yaklaşım kurulum sonrası kör noktaları ve gereksiz cihaz maliyetini azaltır.$p3$,
    '/images/network.svg', 'satin-alma-rehberleri', '7 dk', '2026-06-14 09:00:00+03'::timestamptz,
    '[]'::jsonb,
    '[{"question":"Depoda kaç kamera gerekir?","answer":"Kamera sayısı metrekareden çok giriş, koridor, sevkiyat ve kritik stok noktalarına göre keşifle belirlenir."},{"question":"Yüksek tavanda kamera görüntüsü yeterli olur mu?","answer":"Doğru lens ve montaj noktası seçilirse yeterli olur; yüz detayı gereken alanlarda daha alçak ek kameralar kullanılabilir."}]'::jsonb,
    'Depo Güvenlik Kamera Sistemi Planlama Rehberi',
    'Depo güvenlik kamera sistemi için giriş, raf, sevkiyat ve kör nokta planlamasını; PoE, kayıt ve UPS ihtiyaçlarıyla birlikte öğrenin.',
    'Depo raf koridorlarında güvenlik kamera sistemi', 'Kamera Sistemleri',
    ARRAY['depo kamera sistemi','depo güvenliği','kamera projesi'],
    'depo güvenlik kamera sistemi', ARRAY['depo kamera kurulumu','sevkiyat alanı kamera sistemi']
  ),
  (
    'Fabrika Kamera Sistemi Kurulumunda 8 Kritik Nokta',
    'fabrika-kamera-sistemi-kurulumunda-kritik-noktalar',
    'Fabrika sahasında üretim, giriş, çevre, depo ve iş güvenliği için kamera kurulumunda dikkat edilmesi gerekenler.',
    $p4$Fabrika kamera sistemi; bina güvenliği, üretim takibi ve iş kazalarının incelenmesi gibi farklı amaçlara hizmet eder. Bu nedenle her kameranın neyi göstermesi gerektiği proje başında tanımlanmalıdır.

Nizamiye, araç girişi, yükleme alanı, hammadde deposu, üretim hattı, acil çıkışlar, bina çevresi ve kritik makine noktaları temel izleme alanlarıdır. Plaka okuma ihtiyacı bulunan girişlerde genel izleme kamerasından ayrı bir kamera kullanılması daha güvenilir sonuç verir.

Toz, nem, titreşim ve yüksek sıcaklık cihaz seçimini etkiler. Dış ortam kameralarında uygun IP koruma sınıfı, uzun mesafelerde fiber altyapı ve sistem odasında kesintisiz güç kaynağı planlanmalıdır.

Yetkilendirilmiş kullanıcıların hangi kameraları izleyebileceği belirlenmeli, kayıt cihazı güvenli bir alanda tutulmalı ve uzaktan erişim güçlü parolalarla korunmalıdır. PrimeSec bu bileşenleri tek proje içinde planlar.$p4$,
    '/images/kamera-sistemi.svg', 'satin-alma-rehberleri', '8 dk', '2026-06-15 09:00:00+03'::timestamptz,
    '[]'::jsonb,
    '[{"question":"Fabrika kamera sistemi internet olmadan çalışır mı?","answer":"Evet, yerel kayıt devam eder. İnternet genellikle uzaktan izleme ve bildirimler için gereklidir."},{"question":"Fabrika sahasında fiber kablo gerekli mi?","answer":"Binalar veya switch noktaları arası mesafe uzunsa kararlı ve güvenli iletişim için fiber altyapı tercih edilebilir."}]'::jsonb,
    'Fabrika Kamera Sistemi Kurulumunda Kritik Noktalar',
    'Fabrika kamera sistemi kurarken nizamiye, üretim, depo ve çevre güvenliğini doğru planlayın. Network, kayıt ve kamera seçim rehberini inceleyin.',
    'Fabrika üretim alanı güvenlik kamerası kurulumu', 'Kamera Sistemleri',
    ARRAY['fabrika kamera sistemi','fabrika güvenliği','endüstriyel kamera'],
    'fabrika kamera sistemi', ARRAY['fabrika kamera kurulumu','endüstriyel güvenlik kamerası']
  ),
  (
    'Mağaza Hırsız Alarm Sistemi Nasıl Seçilir?',
    'magaza-hirsiz-alarm-sistemi-nasil-secilir',
    'Mağaza kapısı, vitrin, kasa ve depo alanı için doğru alarm sensörlerini ve uzaktan bildirim seçeneklerini inceleyin.',
    $p5$Mağaza hırsız alarm sistemi, mesai dışında izinsiz girişi en erken aşamada algılamalıdır. Kapı ve pencerelerde manyetik kontak, iç alanda hareket dedektörü, cam yüzeylerde cam kırılma sensörü kullanılabilir.

Vitrinli mağazalarda güneş, klima ve dış hareketlerin yanlış alarma yol açmaması için sensör teknolojisi ve konumu dikkatle seçilmelidir. Evcil hayvan bulunan işletmelerde uygun pet algılamalı dedektörler tercih edilebilir.

Alarm panelinin elektrik kesintisinde aküyle çalışması, GSM veya internet üzerinden bildirim göndermesi ve kullanıcı bazlı kurma kapama kaydı tutması işletme yönetimini kolaylaştırır. Panik butonu ve duman dedektörü gibi ek bileşenler aynı sisteme entegre edilebilir.

PrimeSec keşif hizmetinde riskli girişleri belirler, kamera ve alarm sistemini birlikte planlar. Kullanıcılara mobil uygulama ve acil durum senaryoları hakkında kurulum sonrası eğitim verir.$p5$,
    '/images/alarm-sistemi.svg', 'satin-alma-rehberleri', '6 dk', '2026-06-16 09:00:00+03'::timestamptz,
    '[]'::jsonb,
    '[{"question":"Mağaza alarmı elektrik kesilince çalışır mı?","answer":"Aküsü bakımlı ve doğru kapasitede olan alarm paneli elektrik kesintisinde belirli bir süre çalışmaya devam eder."},{"question":"Alarm telefona bildirim gönderir mi?","answer":"Uyumlu IP veya GSM modülü bulunan sistemler alarm ve kurma kapama bilgilerini mobil uygulamaya iletebilir."}]'::jsonb,
    'Mağaza Hırsız Alarm Sistemi Seçim Rehberi',
    'Mağaza hırsız alarm sistemi için manyetik kontak, hareket ve cam kırılma sensörü seçimini; mobil bildirim ve kurulum detaylarını öğrenin.',
    'Mağaza girişi için hırsız alarm sistemi sensörleri', 'Alarm Sistemleri',
    ARRAY['mağaza alarm sistemi','hırsız alarmı','iş yeri alarm sistemi'],
    'mağaza hırsız alarm sistemi', ARRAY['mağaza alarm kurulumu','iş yeri alarm sensörü']
  ),
  (
    'Villa Güvenlik Sistemi: Kamera ve Alarm Planı',
    'villa-guvenlik-sistemi-kamera-ve-alarm-plani',
    'Villa çevresi, bahçe, kapı ve iç mekan için kamera, alarm, interkom ve akıllı kilit sistemlerini birlikte planlayın.',
    $p6$Villa güvenlik sistemi yalnızca bina içini değil bahçe sınırını, araç girişini ve ana kapıyı da kapsamalıdır. Katmanlı güvenlik yaklaşımında kamera, alarm, görüntülü diafon ve aydınlatma birbirini tamamlar.

Dış çevrede insan ve araç ayrımı yapabilen kameralar gereksiz bildirimleri azaltabilir. Kapı ve pencerelerde manyetik kontaklar, bahçeye açılan alanlarda uygun hareket dedektörleri ve kritik bölümlerde duman veya su baskını sensörleri kullanılabilir.

Kamera açıları komşu mahremiyetini ihlal etmeyecek şekilde belirlenmeli, kayıt cihazı kolay ulaşılamayan bir noktada konumlandırılmalıdır. Elektrik kesintisinde modem, switch, NVR ve alarm panelini besleyecek UPS kapasitesi ayrıca hesaplanır.

PrimeSec, villa keşinde aile kullanım alışkanlıklarını ve evcil hayvan durumunu dikkate alır. Sistem tesliminde mobil izleme, alarm kurma kapama ve kullanıcı yetkileri birlikte yapılandırılır.$p6$,
    '/images/akilli-ev.svg', 'satin-alma-rehberleri', '7 dk', '2026-06-17 09:00:00+03'::timestamptz,
    '[]'::jsonb,
    '[{"question":"Villa için kamera mı alarm mı daha önemli?","answer":"En iyi sonuç iki sistemin birlikte planlanmasıyla elde edilir; alarm erken uyarı, kamera doğrulama ve kayıt sağlar."},{"question":"Bahçe kameraları yağmurdan etkilenir mi?","answer":"Uygun IP koruma sınıfına sahip dış ortam kameraları doğru montajla hava koşullarına dayanıklıdır."}]'::jsonb,
    'Villa Güvenlik Sistemi: Kamera ve Alarm Planı',
    'Villa güvenlik sistemi için kamera, alarm, diafon ve akıllı kilit planlamasını inceleyin. Bahçe ve bina güvenliğini birlikte tasarlayın.',
    'Villa bahçesi kamera ve alarm güvenlik sistemi', 'Güvenlik Sistemleri',
    ARRAY['villa güvenlik sistemi','villa kamera sistemi','villa alarm sistemi'],
    'villa güvenlik sistemi', ARRAY['villa kamera kurulumu','bahçe alarm sistemi']
  ),
  (
    'PoE Kamera Sistemi Nedir? Avantajları Nelerdir?',
    'poe-kamera-sistemi-nedir-avantajlari',
    'PoE kamera sisteminin nasıl çalıştığını, kablolama avantajlarını, switch kapasitesini ve kurulumda dikkat edilecek noktaları öğrenin.',
    $p7$PoE kamera sistemi, IP kameranın veri ve elektrik ihtiyacını tek bir network kablosu üzerinden karşılar. Bu yapı her kamera noktasına ayrı priz ve adaptör taşıma ihtiyacını azaltarak daha temiz ve merkezi bir kurulum sağlar.

PoE switch seçiminde yalnızca port sayısı değil toplam güç bütçesi de kontrol edilmelidir. Gece IR aydınlatması açıldığında kameraların enerji ihtiyacı artabilir. PTZ veya ısıtıcılı modeller standart kameralardan daha fazla güç tüketebilir.

Bakır ethernet kablosunda standart mesafe sınırlarına uyulmalı, kaliteli Cat6 kablo ve uygun sonlandırma kullanılmalıdır. Daha uzun mesafelerde ara switch, PoE extender veya fiber omurga planlanabilir.

Merkezi UPS kullanımı sayesinde PoE switch ve kayıt cihazı elektrik kesintisinde birlikte çalışmaya devam edebilir. PrimeSec, kamera sayısına ve cihaz güçlerine göre switch kapasitesini proje aşamasında hesaplar.$p7$,
    '/images/network.svg', 'satin-alma-rehberleri', '6 dk', '2026-06-18 09:00:00+03'::timestamptz,
    '[]'::jsonb,
    '[{"question":"PoE kamera için elektrik kablosu gerekir mi?","answer":"Hayır. Uyumlu kamera ve switch kullanıldığında enerji ve veri tek ethernet kablosundan taşınır."},{"question":"Her network switch PoE kamera çalıştırır mı?","answer":"Hayır. Switch PoE desteklemeli ve bağlanacak kameralar için yeterli port ve güç bütçesine sahip olmalıdır."}]'::jsonb,
    'PoE Kamera Sistemi Nedir? Avantajları Nelerdir?',
    'PoE kamera sistemi nedir, nasıl çalışır? Tek kabloyla enerji ve veri, PoE switch kapasitesi, mesafe ve UPS planlaması hakkında bilgi alın.',
    'PoE switch ve IP güvenlik kamerası bağlantısı', 'Kamera Sistemleri',
    ARRAY['PoE kamera sistemi','PoE switch','IP kamera kurulumu'],
    'PoE kamera sistemi', ARRAY['PoE switch seçimi','IP kamera kablolama']
  ),
  (
    'NVR Kayıt Cihazı Seçerken Nelere Dikkat Edilmeli?',
    'nvr-kayit-cihazi-secerken-nelere-dikkat-edilmeli',
    'Kanal sayısı, bant genişliği, disk yuvası, kamera çözünürlüğü ve uzaktan izleme özelliklerine göre NVR seçim rehberi.',
    $p8$NVR kayıt cihazı, IP kamera sisteminin merkezidir. Kamera sayısı kadar kanal bulunması temel gereksinimdir; ancak ileride eklenecek kameralar için boş kanal bırakmak sistemi daha uzun ömürlü hale getirir.

Toplam gelen bant genişliği, kameraların çözünürlük ve bit hızını karşılamalıdır. NVR cihazının 4K çıkış vermesi her kanalda istenen yüksek çözünürlüğü kaydedebileceği anlamına gelmeyebilir; teknik değerler birlikte incelenmelidir.

Disk yuvası sayısı ve desteklenen maksimum disk kapasitesi hedef kayıt süresini belirler. Kesintisiz kamera kaydı için masaüstü bilgisayar diski yerine video gözetim sistemleri için tasarlanmış diskler tercih edilmelidir.

Mobil uygulama, kullanıcı yetkilendirme, akıllı olay arama ve yedek alma kolaylığı günlük kullanımı etkiler. PrimeSec, NVR seçimini kamera projesi ve depolama hedefiyle birlikte yapar.$p8$,
    '/images/kamera-sistemi.svg', 'satin-alma-rehberleri', '7 dk', '2026-06-19 09:00:00+03'::timestamptz,
    '[]'::jsonb,
    '[{"question":"8 kanallı NVR cihazına kaç kamera bağlanır?","answer":"Genellikle en fazla 8 IP kamera bağlanır; ancak toplam bant genişliği ve desteklenen çözünürlük de kontrol edilmelidir."},{"question":"NVR internetsiz kayıt yapar mı?","answer":"Evet. Kamera ve NVR aynı yerel ağda olduğu sürece internet olmasa da yerel kayıt devam eder."}]'::jsonb,
    'NVR Kayıt Cihazı Seçim Rehberi | PrimeSec',
    'NVR kayıt cihazı seçerken kanal, bant genişliği, disk kapasitesi ve kamera çözünürlüğünü doğru planlayın. Uzman seçim rehberini okuyun.',
    'NVR kayıt cihazı ve güvenlik kamerası sistemi', 'Kamera Sistemleri',
    ARRAY['NVR kayıt cihazı','NVR seçimi','kamera kayıt cihazı'],
    'NVR kayıt cihazı', ARRAY['NVR kanal sayısı','NVR disk kapasitesi']
  ),
  (
    'Kablosuz Alarm Sisteminde Yanlış Alarm Nasıl Önlenir?',
    'kablosuz-alarm-sisteminde-yanlis-alarm-nasil-onlenir',
    'Kablosuz alarm sistemlerinde sensör konumu, pil bakımı, evcil hayvan ve kullanıcı ayarlarıyla yanlış alarmı azaltın.',
    $p9$Kablosuz alarm sisteminde yanlış alarm genellikle cihaz arızasından değil hatalı sensör konumu, zayıf pil, hareketli perde, klima hava akımı veya kullanıcı alışkanlıklarından kaynaklanır. Doğru keşif bu sorunların önemli bölümünü baştan engeller.

Hareket dedektörü doğrudan pencereye, ısı kaynağına veya klimaya bakmamalıdır. Evcil hayvan bulunan mekanlarda uygun ağırlık toleransına sahip sensör kullanılmalı ve montaj yüksekliği üretici tavsiyesine göre ayarlanmalıdır.

Manyetik kontaklar kapı ve pencere hareketinden etkilenmeyecek sağlam bir yüzeye monte edilmelidir. Düşük pil uyarıları ertelenmemeli, cihazlar belirli aralıklarla test edilmelidir. Alarm kurulduktan sonra mekanda biri kalıyorsa bölgesel kurma modu kullanılabilir.

PrimeSec kurulum sonrasında kullanıcılara doğru kurma kapama sırasını, mobil bildirimleri ve acil durumda izlenecek adımları anlatır. Düzenli bakım, sistemin güvenilirliğini korur.$p9$,
    '/images/alarm-sistemi.svg', 'satin-alma-rehberleri', '6 dk', '2026-06-20 09:00:00+03'::timestamptz,
    '[]'::jsonb,
    '[{"question":"Evcil hayvan alarmı tetikler mi?","answer":"Standart sensörleri tetikleyebilir. Uygun pet algılamalı sensör ve doğru montaj yanlış alarm riskini azaltır."},{"question":"Düşük pil yanlış alarma neden olur mu?","answer":"Zayıflayan pil iletişim sorunlarına yol açabilir. Panel uyarıları takip edilmeli ve piller zamanında değiştirilmelidir."}]'::jsonb,
    'Kablosuz Alarmda Yanlış Alarmı Önleme Rehberi',
    'Kablosuz alarm sisteminde yanlış alarmı; doğru sensör konumu, evcil hayvan ayarı, pil kontrolü ve kullanıcı eğitimiyle nasıl azaltacağınızı öğrenin.',
    'Kablosuz alarm hareket sensörü montajı', 'Alarm Sistemleri',
    ARRAY['kablosuz alarm sistemi','yanlış alarm','alarm sensörü'],
    'kablosuz alarm yanlış alarm', ARRAY['alarm sensörü konumu','pet algılamalı sensör']
  ),
  (
    'Darıca İş Yeri Kamera ve Alarm Sistemi Rehberi',
    'darica-is-yeri-kamera-ve-alarm-sistemi-rehberi',
    'Darıca bölgesindeki mağaza, ofis, depo ve üretim alanları için kamera ve alarm sistemini doğru planlama rehberi.',
    $p10$Darıca iş yeri kamera ve alarm sistemi planlanırken işletmenin çalışma saatleri, giriş sayısı, kasa veya değerli stok alanları ve çevre koşulları birlikte değerlendirilmelidir. Her işletmeye aynı cihaz paketini uygulamak kör nokta ve gereksiz maliyet oluşturabilir.

Kamera sistemi giriş, müşteri alanı, kasa, depo ve bina çevresini kapsayacak şekilde konumlandırılır. Alarm sisteminde kapı ve pencereler manyetik kontakla, iç alanlar uygun hareket sensörleriyle korunabilir. Kamera görüntüsü alarm bildiriminin doğrulanmasını kolaylaştırır.

İnternet kesilse bile yerel kamera kaydı ve alarm algılama çalışmaya devam edebilir. Uzaktan izleme ve mobil bildirim için stabil internet, elektrik kesintileri için NVR, modem, switch ve alarm panelini destekleyen UPS çözümü önerilir.

PrimeSec Teknoloji, Darıca ve yakın Kocaeli hizmet bölgelerinde ücretsiz keşif yapar. Riskli noktalar belirlendikten sonra cihaz listesi, kayıt süresi, kablolama ve kurulum planı işletmeye özel hazırlanır.$p10$,
    '/images/local-security.svg', 'yerel-guvenlik-rehberleri', '7 dk', '2026-06-21 09:00:00+03'::timestamptz,
    '[]'::jsonb,
    '[{"question":"Darıca iş yeri güvenlik sistemi keşfi ücretli mi?","answer":"PrimeSec yakın hizmet bölgelerinde ihtiyaç analizi ve proje keşfini ücretsiz olarak planlar."},{"question":"Kamera ve alarm aynı mobil uygulamadan yönetilir mi?","answer":"Seçilen marka ve entegrasyon yapısına göre tek veya uyumlu uygulamalar üzerinden yönetim sağlanabilir."}]'::jsonb,
    'Darıca İş Yeri Kamera ve Alarm Sistemleri | PrimeSec',
    'Darıca iş yeri kamera ve alarm sistemi için ücretsiz keşif, doğru kamera konumu, alarm sensörü, kayıt ve UPS planlaması hakkında yerel rehberi inceleyin.',
    'Darıca iş yeri kamera ve alarm sistemi kurulumu', 'Yerel Güvenlik Rehberleri',
    ARRAY['Darıca kamera sistemi','Darıca alarm sistemi','iş yeri güvenliği'],
    'Darıca iş yeri kamera sistemi', ARRAY['Darıca alarm sistemleri','Darıca güvenlik kamerası']
  )
)
INSERT INTO public.blog_posts (
  title, slug, excerpt, content, cover_image_url, category_id, reading_time,
  published_at, status, table_of_contents, faqs, meta_title, meta_description,
  canonical_url, cover_image_alt, category_name, tags, author_name,
  focus_keyword, secondary_keywords, robots_index, robots_follow,
  og_title, og_description, schema_type, sitemap_include, updated_at
)
SELECT
  p.title,
  p.slug,
  p.excerpt,
  p.content,
  p.cover_image_url,
  c.id,
  p.reading_time,
  p.published_at,
  'published',
  p.table_of_contents,
  p.faqs,
  p.meta_title,
  p.meta_description,
  'https://primesecteknoloji.com/blog/' || p.slug,
  p.cover_image_alt,
  p.category_name,
  p.tags,
  'PrimeSec Teknoloji',
  p.focus_keyword,
  p.secondary_keywords,
  'index',
  'follow',
  p.meta_title,
  p.meta_description,
  'Article',
  true,
  now()
FROM posts p
LEFT JOIN public.categories c ON c.slug = p.category_slug
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image_url = EXCLUDED.cover_image_url,
  category_id = EXCLUDED.category_id,
  reading_time = EXCLUDED.reading_time,
  published_at = EXCLUDED.published_at,
  status = EXCLUDED.status,
  table_of_contents = EXCLUDED.table_of_contents,
  faqs = EXCLUDED.faqs,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  canonical_url = EXCLUDED.canonical_url,
  cover_image_alt = EXCLUDED.cover_image_alt,
  category_name = EXCLUDED.category_name,
  tags = EXCLUDED.tags,
  author_name = EXCLUDED.author_name,
  focus_keyword = EXCLUDED.focus_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  robots_index = EXCLUDED.robots_index,
  robots_follow = EXCLUDED.robots_follow,
  og_title = EXCLUDED.og_title,
  og_description = EXCLUDED.og_description,
  schema_type = EXCLUDED.schema_type,
  sitemap_include = EXCLUDED.sitemap_include,
  updated_at = now();

COMMIT;
