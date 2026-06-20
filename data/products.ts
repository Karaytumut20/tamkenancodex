export type Product = {
  slug: string;
  name: string;
  code: string;
  category: string;
  brand: string;
  usage: string[];
  description: string;
  longDescription?: string;
  image: string;
  tags: string[];
  features: { title: string; description: string }[];
  showFeatures?: boolean;
  specs: { title: string; description: string }[];
  specsTitle?: string;
  specsDescription?: string;
  showSpecs?: boolean;
  benefits: { title: string; description: string }[];
  benefitsTitle?: string;
  benefitsDescription?: string;
  showBenefits?: boolean;
  faqs: { question: string; answer: string }[];
  gallery?: string[];
  metaTitle?: string;
  metaDescription?: string;
  robotsIndex?: string;
  robotsFollow?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  schemaType?: string;
  jsonLd?: any;
  sitemapInclude?: boolean;
  redirectTo?: string;
  relatedProductIds?: string[];
};

export const products: Product[] = [
  {
    slug: "primesec-plus-kamerali-alarm-paketi",
    name: "PrimeSec Plus Kameralı Alarm Paketi",
    code: "PS-PLUS-001",
    category: "Alarm Sistemleri",
    brand: "PrimeSec",
    usage: ["Ev", "İş Yeri"],
    description: "Alarm, mobil bildirim ve akıllı video takibini tek pakette birleştiren premium güvenlik çözümü.",
    longDescription: "PrimeSec Plus Kameralı Alarm Paketi, modern ev ve iş yerleri için geliştirilmiş hepsi bir arada premium bir güvenlik sistemidir. Bu sistem, kablosuz hırsız alarm üniteleri, yüksek hassasiyetli hareket dedektörleri, kapı/pencere sensörleri ve akıllı video doğrulama kamerasını tek bir merkezde birleştirir. Tüm kontrolü elinizde tutmanızı sağlayan kullanıcı dostu bir mobil uygulama arayüzü ile birlikte gelir.\n\nSistem, herhangi bir ihlal durumunda sadece sesli siren çalmakla kalmaz; aynı zamanda entegre kameralı doğrulama teknolojisi sayesinde akıllı telefonunuza saniyeler içinde anlık video kaydı gönderir. Bu sayede yanlış alarmları kolayca ayırt edebilir, gerçek tehdit durumlarında ise emniyet güçlerine anında haber verebilirsiniz. GSM ve Wi-Fi çift hat yedekleme özelliği sayesinde internet kesilse bile alarm sinyalleriniz merkezimize ve telefonunuza ulaşmaya devam eder.\n\nSistem mimarisi tamamen modüler ve genişletilebilir yapıdadır. İhtiyacınıza göre su baskını sensörleri, gaz dedektörleri, duman algılayıcıları veya ek dış mekan kameraları sisteme saniyeler içinde eklenebilir. PrimeSec uzman ekibi tarafından profesyonel risk analizi yapılarak kurulan bu paket, yaşam alanlarınızda kesintisiz ve akıllı bir koruma kalkanı oluşturur.",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    tags: ["En Popüler", "Kablosuz", "Mobil Uyumlu", "Görüntülü Teyit"],
    features: [
      { title: "Mobil Uygulama Kontrolü", description: "iOS ve Android uygulaması üzerinden sistemi uzaktan kurun, devre dışı bırakın ve anlık durum raporlarını inceleyin." },
      { title: "Kameralı Doğrulama Teknolojisi", description: "Bir hareket algılandığında sistem otomatik olarak kısa bir video klip çekerek telefonunuza gönderir." },
      { title: "Çift Hat Yedekleme (Wi-Fi + GSM)", description: "Wi-Fi bağlantınız kesildiğinde dahili GSM modülü otomatik olarak devreye girerek kesintisiz koruma sağlar." },
      { title: "Genişletilebilir Sensör Yapısı", description: "Tek bir panele 100 adede kadar kablosuz dedektör, akıllı priz veya siren eklenebilir." },
    ],
    specs: [
      { title: "Bağlantı Türü", description: "Wi-Fi 802.11 b/g/n & 2G/4G GSM Hücresel Bağlantı" },
      { title: "Pil Ömrü (Dedektörler)", description: "Dahili pillerle 5 yıla varan çalışma ömrü" },
      { title: "Kapsama Alanı", description: "Açık alanda 1700 metreye kadar kablosuz iletişim" },
      { title: "Kamera Çözünürlüğü", description: "1080p Full HD, 120 Derece Geniş Açı ve Gece Görüşü" }
    ],
    specsTitle: "Üst Düzey Donanım Özellikleri",
    specsDescription: "En son kablosuz güvenlik protokolleri ve enerji tasarrufu teknolojileri ile donatılmış teknik altyapı detayları:",
    benefits: [
      { title: "Maddi ve Manevi Huzur", description: "Evde olmasanız bile sevdiklerinizin ve değerli eşyalarınızın güvende olduğunu bilmenin rahatlığını yaşayın." },
      { title: "Sıfır Kablo Kirliliği", description: "Tamamen kablosuz çalışan estetik üniteler sayesinde evinizde kırma dökme işlemleri yapılmadan kolayca kurulur." }
    ],
    benefitsTitle: "Neden PrimeSec Plus Tercih Edilmeli?",
    benefitsDescription: "Hayatınızı kolaylaştıran, kesintisiz çalışan bir koruma kalkanının size sağladığı temel avantajlar:",
    faqs: [
      { question: "PrimeSec Plus internet veya elektrik kesildiğinde çalışmaya devam eder mi?", answer: "Evet. Panel içerisindeki dahili yedek batarya elektrik kesintilerinde sistemi 15 saate kadar çalıştırır. İnternet kesildiğinde ise dahili GSM SIM kart modülü üzerinden sinyalleri göndermeye devam eder." },
      { question: "Evcil hayvanım varken alarmı kurabilir miyim?", answer: "Evet, sistemimizde kullanılan akıllı hareket dedektörleri 20 kg'a kadar olan evcil hayvanları algılamaz ve yanlış alarm üretmez." },
      { question: "Kurulum süreci nasıl işlemektedir?", answer: "Uzman mühendislerimiz öncelikle ücretsiz keşif ile en doğru noktaları belirler, ardından tamamen kablosuz olan temiz montajı 2 saat içinde gerçekleştirip size mobil uygulamayı teslim eder." }
    ],
    metaTitle: "PrimeSec Plus Kameralı Akıllı Alarm Paketi | PrimeSec",
    metaDescription: "Akıllı video doğrulamalı kablosuz alarm sistemi. Mobil uygulama kontrolü, çift hat yedekleme ve profesyonel montaj ile ev ve iş yeri güvenliğinde premium koruma.",
  },
  {
    slug: "hikvision-cctv-kamera-sistemi",
    name: "Hikvision CCTV Kamera Sistemi",
    code: "HK-CCTV-4MP",
    category: "Kamera Sistemleri",
    brand: "Hikvision",
    usage: ["Ev", "İş Yeri", "Depo", "Dış Mekan"],
    description: "Yüksek çözünürlüklü kayıt, gece görüşü ve uzaktan izleme özellikli profesyonel CCTV kamera sistemi.",
    longDescription: "Hikvision CCTV Kamera Sistemi, yüksek güvenlik gereksinimi duyan konutlar, ticari işletmeler ve endüstriyel sahalar için tasarlanmış profesyonel bir video izleme çözümüdür. Hikvision'ın öncü görüntüleme teknolojilerini barındıran bu sistem, 4 megapiksel ultra yüksek çözünürlük sunarak yüz teşhisi, plaka okuma ve detaylı çevre analizi gibi kritik ihtiyaçları en net şekilde karşılar.\n\nSistem, zifiri karanlıkta bile net ve renkli görüntüler elde etmenizi sağlayan gelişmiş gece görüş teknolojisiyle donatılmıştır. Dış mekan kameraları, IP67 sertifikası ile toz, şiddetli yağmur ve aşırı sıcak/soğuk gibi zorlu hava koşullarına tam dayanıklılık gösterir. NVR/DVR kayıt cihazı, en yeni H.265+ video sıkıştırma formatını kullanarak disk üzerinde maksimum depolama tasarrufu sunar ve geriye dönük aylarca kayıt tutmanıza imkan tanır.\n\nHik-Connect mobil uygulaması entegrasyonu sayesinde, dünyanın neresinde olursanız olun kameralarınızı canlı izleyebilir, geçmiş kayıtları geriye dönük tarayabilir ve şüpheli durumlarda telefonunuza anlık hareket bildirimleri alabilirsiniz. PrimeSec mühendisliğiyle projelendirilen bu sistem, mülkünüzün her köşesini kesintisiz izleme altına alır.",
    image: "https://images.unsplash.com/photo-1551806235-a05fbbd2a335?auto=format&fit=crop&w=800&q=80",
    tags: ["CCTV Kamera", "Gece Görüşü", "Uzaktan İzleme", "H.265+ Sıkıştırma"],
    features: [
      { title: "4MP Ultra HD Çözünürlük", description: "Detayları kaybetmeden geniş alanları gözetim altında tutun, dijital yakınlaştırmada bile netliği koruyun." },
      { title: "Akıllı Kızılötesi Gece Görüşü", description: "30 metreye kadar zifiri karanlıkta kızılötesi aydınlatma ile net siyah-beyaz veya EXIR teknolojisiyle kaliteli gece izleme." },
      { title: "IP67 Su ve Toz Dayanımı", description: "Zorlu dış ortam şartlarında arızasız, uzun ömürlü ve kararlı performans sunan metal kasa tasarımı." },
      { title: "H.265+ Akıllı Kodlama", description: "Görüntü kalitesinden ödün vermeden bant genişliği ve sabit disk depolama gereksinimini %80'e varan oranda azaltır." },
    ],
    specs: [
      { title: "Kamera Tipi", description: "Bullet veya Dome Dış/İç Mekan Kameralar" },
      { title: "Çözünürlük", description: "2560 x 1440 (4 Megapiksel)" },
      { title: "Depolama Kapasitesi", description: "1 TB'dan 10 TB'a kadar genişletilebilir WD Purple HDD altyapısı" },
      { title: "Lens Seçenekleri", description: "2.8mm ultra geniş açı veya 4mm odaklı lens seçenekleri" }
    ],
    specsTitle: "Teknik Donanım ve Sensör Altyapısı",
    specsDescription: "Hikvision'ın dünya lideri görüntüleme teknolojilerine ait teknik spesifikasyonlar:",
    benefits: [
      { title: "Caydırıcılık ve Kesin Kanıt", description: "Mülkünüzün dışarıdan görünen kameralarla korunması hırsızlık girişimlerini önler, olay anında ise hukuki kanıt sunar." },
      { title: "7/24 Kesintisiz Mobil Erişim", description: "Hik-Connect platformu ile gecikmesiz canlı yayın izleme ve hızlı geçmişe dönük kayıt oynatma imkanı." }
    ],
    benefitsTitle: "Hikvision CCTV ile Maksimum Güvenlik",
    benefitsDescription: "Neden dünyanın en çok tercih edilen kamera markasını PrimeSec kalitesiyle kullanmalısınız:",
    faqs: [
      { question: "Kayıtlar ne kadar süre geriye dönük saklanabilir?", answer: "Kullanılan sabit disk kapasitesine ve kamera sayısına bağlı olarak 15 günden 90 güne kadar geriye dönük kayıt saklanabilir. H.265+ sıkıştırma teknolojimiz bu süreyi maksimuma çıkarır." },
      { question: "Elektrik kesilirse kameralar kayıt yapmaya devam eder mi?", answer: "Elektrik kesintilerinde sistemin durmaması için projelerimizde kamera sistemine özel UPS (Kesintisiz Güç Kaynağı) entegre ediyoruz. Bu sayede elektrik gitse dahi sisteminiz saatlerce çalışır." },
      { question: "Kameralar internet olmadan da çalışır mı?", answer: "Evet, kameralar lokal kayıt cihazına bağlı olduğu sürece internet olmasa bile 7/24 kayıt yapmaya devam eder. İnternet yalnızca uzaktan izleme yapmak istediğinizde gereklidir." }
    ],
    metaTitle: "Hikvision 4MP CCTV Güvenlik Kamera Sistemi | PrimeSec",
    metaDescription: "Yüksek çözünürlüklü Hikvision CCTV kamera sistemleri. Gece görüşü, H.265+ kayıt ve mobil izleme özellikleri ile profesyonel dış ve iç mekan gözetim çözümleri.",
  },
  {
    slug: "dahua-ip-kamera-sistemi",
    name: "Dahua IP Kamera Sistemi",
    code: "DH-IP-5MP",
    category: "Kamera Sistemleri",
    brand: "Dahua",
    usage: ["İş Yeri", "Site", "Mağaza", "Fabrika"],
    description: "IP tabanlı yüksek çözünürlüklü güvenlik kamerası, PoE ağ altyapısı ve yapay zeka analizleri.",
    longDescription: "Dahua IP Kamera Sistemi, akıllı analiz yetenekleri ve ağ tabanlı esnek altyapısı ile özellikle orta ve büyük ölçekli işletmeler, siteler, mağazalar ve endüstriyel tesisler için ideal bir güvenlik çözümüdür. Geleneksel analog sistemlerden farklı olarak IP kameralar, her kameranın kendi başına bir bilgisayar gibi çalıştığı, verileri doğrudan dijital ağ üzerinden aktardığı gelişmiş bir mimariye sahiptir.\n\nSistem, Dahua'nın WizSense yapay zeka teknolojisini barındırır. Bu teknoloji; insan ve araçları diğer hareketli nesnelerden (yapraklar, hayvanlar, ışık değişimleri) ayırt ederek yalnızca gerçek bir tehdit algılandığında alarm üretir. PoE (Power over Ethernet) özelliği sayesinde, kameraların çalışması için ihtiyaç duyulan elektrik enerjisi ve veri akışı tek bir ethernet kablosu üzerinden taşınır, bu da kablolama maliyetlerini ve karmaşasını en aza indirir.\n\n5 megapiksel yüksek çözünürlüklü sensörler, geniş dinamik alan (WDR) teknolojisiyle birleşerek doğrudan güneş ışığı alan veya aşırı gölgeli ortamlarda bile yüz detaylarını ve renkleri net olarak yakalar. Akıllı sınır ihlali ve alan ihlali analizleri ile güvenliğinizi proaktif hale getirin.",
    image: "https://images.unsplash.com/photo-1524413840003-05074159f8f2?auto=format&fit=crop&w=800&q=80",
    tags: ["IP Kamera", "PoE Altyapı", "Yapay Zeka Analiz", "WizSense"],
    features: [
      { title: "5MP Yüksek Çözünürlüklü Sensör", description: "Geniş açılı mercekler ile en ince ayrıntıları, plakaları ve yüzleri yüksek doğrulukla tespit edin." },
      { title: "PoE (Power over Ethernet) Desteği", description: "Her kamera için ayrı adaptör taşımaya son. Tek bir CAT6 kablo ile hem güç hem veri aktarımı sağlayın." },
      { title: "Yapay Zeka WizSense Filtreleme", description: "Hatalı alarmları %95 oranında azaltarak sadece insan ve araç hareketlerinde bildirim alın." },
      { title: "120dB Gerçek WDR Teknolojisi", description: "Işık parlamalarını ve karanlık gölgeleri dengeleyerek her koşulda dengeli ve net görüntü üretimi." },
    ],
    specs: [
      { title: "Maksimum Çözünürlük", description: "2592 x 1944 piksel (5MP HD)" },
      { title: "Bağlantı Tipi", description: "RJ45 Ethernet, Cat6 Altyapısı" },
      { title: "Akıllı Analizler", description: "Sanal hat geçişi, alan ihlali, kayıp nesne algılama" },
      { title: "Gece Görüş Aralığı", description: "40 Metreye kadar akıllı IR gece görüş aydınlatması" }
    ],
    specsTitle: "Akıllı IP Donanım Özellikleri",
    specsDescription: "Dahua IP ekosisteminin sunduğu ileri düzey donanımsal ve yazılımsal altyapı özellikleri:",
    benefits: [
      { title: "Yapay Zeka Destekli Proaktif Koruma", description: "Sistem sadece kaydetmez, sanal sınır aşıldığında siren çaldırabilir veya telefonunuza anında uyarı gönderebilir." },
      { title: "Kolay Genişletilebilir Ağ Yapısı", description: "Mevcut lokal ağ (LAN) yapınıza switchler ekleyerek sistemi mesafeden bağımsız şekilde kolayca büyütebilirsiniz." }
    ],
    benefitsTitle: "Neden Dahua IP Tercih Edilmeli?",
    benefitsDescription: "Kurumsal ve geniş alan projelerinde IP teknolojisinin sunduğu avantajlar:",
    faqs: [
      { question: "PoE bağlantısının sağladığı en büyük avantaj nedir?", answer: "PoE teknolojisi kurulum temizliğini artırır. Priz arama zorunluluğunu ortadan kaldırarak kameranın sadece bir ethernet kablosu üzerinden beslenmesini sağlar." },
      { question: "İnsan ve araç ayrımı (WizSense) nasıl çalışır?", answer: "Kamera içindeki dahili yapay zeka işlemcisi, görüntüdeki nesnelerin piksel yapılarını analiz eder. Rüzgarla sallanan bir ağaç veya kedi geçişi alarm üretmezken, bir insan veya araç sınırı geçtiğinde sistem uyarı tetikler." },
      { question: "IP sistemler fiber altyapı ile uyumlu mudur?", answer: "Evet, IP tabanlı oldukları için network switchleri üzerinden fiber optik kablolama altyapılarına doğrudan entegre edilebilirler, bu da kilometrelerce mesafede veri kaybı olmadan çalışmayı sağlar." }
    ],
    metaTitle: "Dahua 5MP IP Akıllı Güvenlik Kamera Sistemi | PrimeSec",
    metaDescription: "Yapay zeka analizli Dahua IP kamera sistemleri. WizSense akıllı filtreleme, PoE kolay kurulum altyapısı ve yüksek çözünürlüklü 5MP net gece görüş çözümleri.",
  },
  {
    slug: "akilli-video-takip-sistemi",
    name: "Akıllı Video Takip Sistemi",
    code: "PS-VIDEO-AI",
    category: "Akıllı Ev Sistemleri",
    brand: "PrimeSec",
    usage: ["Ev", "İş Yeri", "Ofis"],
    description: "Bulut tabanlı, akıllı hareket analizi yapan ve mobil bildirimler gönderen yeni nesil video güvenlik çözümü.",
    longDescription: "Akıllı Video Takip Sistemi, geleneksel ve hantal kayıt cihazı gereksinimini ortadan kaldıran veya mevcut sistemlerinizi akıllı hale getiren, tamamen bulut entegrasyonlu ve yapay zeka tabanlı yeni nesil bir video güvenlik çözümüdür. Evinizde, ofisinizde veya mağazanızda olup biten her şeyi yüksek çözünürlüklü ve kesintisiz bir akışla mobil cihazınızdan izlemenizi sağlar.\n\nSistem, gelişmiş derin öğrenme algoritmaları sayesinde sıradan hareketler ile insan aktivitesi, paket teslimatı veya şüpheli beklemeler gibi önemli olayları ayırt eder. Algılanan kritik anlar bulut depolama sunucularına şifrelenmiş olarak anında yüklenir. Bu sayede, cihaz çalınsa veya zarar görse bile geçmiş kayıtlarınız güvende kalır.\n\nAkıllı ev ekosistemleriyle (Google Home, Amazon Alexa) tam uyumlu çalışan bu sistem, siz eve yaklaştığınızda gizlilik moduna geçebilir veya evden çıktığınızda otomatik olarak aktif hale gelebilir. Güçlü çift yönlü ses iletimi sayesinde uzaktan ortamdaki kişilerle canlı iletişim kurabilirsiniz.",
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
    tags: ["Akıllı Video", "Bulut Kayıt", "Çift Yönlü Ses", "Mobil Entegrasyon"],
    features: [
      { title: "Yapay Zeka Destekli Hareket Tespiti", description: "Evdeki evcil hayvanları, rüzgarı veya ışık parlamalarını filtreleyerek sadece önemli anlarda bildirim gönderir." },
      { title: "Şifrelendirilmiş Bulut Depolama", description: "Kayıtlarınızı fiziksel hırsızlık risklerine karşı koruyan, yüksek güvenlikli yerel bulut sunucularına anlık yedekleme." },
      { title: "Çift Yönlü Ses İletişimi", description: "Dahili hoparlör ve mikrofon ile uzaktan çocuklarınızla, evcil hayvanlarınızla veya kapıdaki kuryeyle konuşun." },
      { title: "Akıllı Senaryo Entegrasyonu", description: "Eve giriş/çıkış saatlerinize göre otomatik devreye girme veya çıkma (Geofencing teknolojisi)." },
    ],
    specs: [
      { title: "Bağlantı Altyapısı", description: "Dahili Wi-Fi (2.4 GHz & 5 GHz çift bant desteği)" },
      { title: "Görüntü Kalitesi", description: "1080p Full HD HDR Gece Görüşü" },
      { title: "Depolama Seçenekleri", description: "MicroSD Kart (256 GB) + Akıllı Bulut Depolama Üyeliği" },
      { title: "Güç Beslemesi", description: "Şarj edilebilir dahili batarya veya Micro USB kablolu güç" }
    ],
    specsTitle: "Yazılımsal ve Donanımsal Özellikler",
    specsDescription: "PrimeSec Akıllı Video ekosisteminin sunduğu teknolojik altyapı ve bağlantı protokolleri:",
    benefits: [
      { title: "Fiziksel Cihaz Hırsızlığına Karşı Koruma", description: "Hırsızlar kayıt cihazını çalsa dahi tüm video kayıtları bulut üzerinde güvendedir ve silinemez." },
      { title: "Anında Müdahale Şansı", description: "Herhangi bir şüpheli harekette telefonunuza gelen canlı video bildirimi sayesinde anında polisi arayabilir veya sesli uyarı verebilirsiniz." }
    ],
    benefitsTitle: "Yeni Nesil Video Güvenlik Deneyimi",
    benefitsDescription: "Klasik güvenlik kameralarının ötesinde, hayatınıza entegre olan akıllı çözümler:",
    faqs: [
      { question: "Bulut kayıt güvenli midir? Başkaları izleyebilir mi?", answer: "Bulut kayıtlarımız askeri düzeyde AES-256 şifreleme protokolüyle korunmaktadır. Kayıtlarınızı kendi şifreli mobil uygulamanız dışında hiç kimse, hatta servis sağlayıcılar dahi izleyemez." },
      { question: "İnternet kotasını çok fazla tüketir mi?", answer: "Hayır. Sistem sadece hareket algıladığı anlarda buluta veri yükler. Sabit durumlarda düşük bant genişliği kullanarak internet kotanızı ve hızınızı etkilemez." },
      { question: "Mevcut akıllı ev sistemimle uyumlu çalışır mı?", answer: "Evet, sistem Google Home, Apple HomeKit (uygun köprü ile) ve Amazon Alexa sesli asistanlarıyla tam entegre çalışabilir." }
    ],
    metaTitle: "Akıllı Video Takip ve Bulut Kamera Sistemi | PrimeSec",
    metaDescription: "Yapay zeka destekli akıllı video takip sistemi. Bulut tabanlı şifreli kayıt, çift yönlü ses iletişimi ve mobil bildirimler ile kesintisiz ev/ofis izleme.",
  },
  {
    slug: "akilli-zil",
    name: "Akıllı Zil",
    code: "PS-DOORBELL",
    category: "Akıllı Ev Sistemleri",
    brand: "PrimeSec",
    usage: ["Ev", "Ofis", "Villa"],
    description: "Kapınıza gelen ziyaretçileri dünyanın her yerinden cep telefonu ile görmenizi ve konuşmanızı sağlayan görüntülü akıllı zil.",
    longDescription: "Akıllı Zil (Video Doorbell), ev veya ofisinizin dış kapısını tamamen dijitalleştiren ve güvenli kılan üst segment bir akıllı ev ürünüdür. Kapı ziliniz çalındığında veya birisi kapınızın önüne yaklaştığında, sistem anında telefonunuza görüntülü arama şeklinde bildirim gönderir. Bu sayede evde olmasanız bile kapıdaki kişiyle canlı olarak görüntülü görüşme yapabilirsiniz.\n\nSistem, dahili geniş açılı HD kamerası, gürültü engelleyici çift yönlü mikrofonu ve yüksek güçlü hoparlörü ile kristal netliğinde iletişim sunar. Gece görüş yeteneği sayesinde karanlık kapı önlerinde bile ziyaretçileri net bir şekilde ayırt etmenizi sağlar.\n\nHırsızlık ve şüpheli durumlara karşı entegre PIR hareket dedektörüne sahip olan Akıllı Zil, kapınızın önünde uzun süre bekleyen şüpheli kişileri algılayıp telefonunuza uyarı göndererek kapı önü güvenliğini maksimuma taşır. PrimeSec kurulum kalitesiyle kapınıza estetik ve güvenlik katar.",
    image: "https://images.unsplash.com/photo-1563124803-b5104c4554b5?auto=format&fit=crop&w=800&q=80",
    tags: ["Akıllı Zil", "Görüntülü Görüşme", "Kapı Güvenliği", "PIR Sensör"],
    features: [
      { title: "Uzaktan Canlı Görüntülü Arama", description: "Zil çaldığında telefonunuz çalar; nerede olursanız olun kapıdaki kişiyi görün ve konuşun." },
      { title: "PIR Hareket Algılama", description: "Kapınızın önüne birisi yaklaştığı an, zil çalmasa dahi hareket algılanır ve telefonunuza anlık fotoğraf gönderilir." },
      { title: "Uzun Ömürlü Şarj Edilebilir Batarya", description: "Kablolama gerektirmeyen şarj edilebilir lityum bataryası ile tek şarjla 6 aya varan kablosuz kullanım." },
      { title: "Geniş Açı ve HDR Gece Görüşü", description: "160 derecelik ultra geniş açılı lens ve kızılötesi gece LED'leri ile her saatte net kapı önü takibi." },
    ],
    specs: [
      { title: "Kamera Çözünürlüğü", description: "1080p Full HD, HDR Desteği" },
      { title: "Bağlantı Türü", description: "Kablosuz Wi-Fi 2.4 GHz" },
      { title: "Ses Özelliği", description: "Gelişmiş yankı ve rüzgar gürültüsü engelleyici çift yönlü ses" },
      { title: "Montaj Tipi", description: "Duvara vidalama veya güçlü 3M yapışkanlı kolay montaj" }
    ],
    specsTitle: "Zarif Tasarım ve Teknik Detaylar",
    specsDescription: "Dış ortama dayanıklı şık gövdesiyle Akıllı Zil teknik donanım yapısı:",
    benefits: [
      { title: "Evde Yokken Bile Evde Görünün", description: "Kuryelere veya misafirlere uzaktan cevap vererek evde olduğunuz izlenimini yaratın, hırsızları uzak tutun." },
      { title: "Paket Güvenliği", description: "Kapınızın önüne bırakılan kargo paketlerinin çalınma riskine karşı anlık gözetim ve uyarı alın." }
    ],
    benefitsTitle: "Neden Akıllı Görüntülü Zil?",
    benefitsDescription: "Geleneksel kapı zillerinin ötesinde, kapınızı cebinize taşıyan sistemin sunduğu faydalar:",
    faqs: [
      { question: "Zil çalındığında telefonum kapalıysa ne olur?", answer: "Zil çalındığında sistem bulut üzerinden çağrı bırakır ve kapıdaki kişinin anlık fotoğrafını kaydeder. Telefonunuzu açtığınızda kimin geldiğini saat bilgisiyle görebilirsiniz." },
      { question: "Dış mekan koşullarına, yağmura dayanıklı mıdır?", answer: "Evet, Akıllı Zil gövdesi IP65 su geçirmezlik derecesine sahiptir. Yağmur, kar, toz ve doğrudan güneş ışığına tam dayanıklıdır." },
      { question: "Mevcut mekanik zil sesini de çalmaya devam eder mi?", answer: "Evet, paket içerisinden çıkan kablosuz iç zil ünitesini evinizde herhangi bir prize takarak telefonunuz yanınızda olmasa bile zil sesini ev içinde duyabilirsiniz." }
    ],
    metaTitle: "Akıllı Görüntülü Zil Sistemi (Video Doorbell) | PrimeSec",
    metaDescription: "Kapınıza gelenleri telefonunuzdan görün ve konuşun. 1080p HD kamera, kablosuz şarjlı kullanım, gece görüşü ve hareket algılamalı akıllı kapı zili.",
  },
  {
    slug: "manyetik-kontak-alarm-sensoru",
    name: "Manyetik Kontak Alarm Sensörü",
    code: "PS-MAG-01",
    category: "Alarm Sistemleri",
    brand: "PrimeSec",
    usage: ["Kapı", "Pencere", "Kasa", "Çekmece"],
    description: "Kapı ve pencerelerin açılışlarını milisaniyeler içinde algılayan kablosuz alarm dedektörü.",
    longDescription: "Manyetik Kontak Alarm Sensörü, bir güvenlik sisteminin en temel yapı taşlarından biridir. Görevi, koruma altına alınmış kapı, pencere, çelik kasa veya değerli çekmecelerin izinsiz olarak açılmasını algılamak ve milisaniyeler içinde alarm paneline sinyal göndermektir. İki parçadan oluşan bu sensör, manyetik alanın bozulması prensibiyle çalışır.\n\nPrimeSec Manyetik Kontak, minimal tasarımı sayesinde uygulandığı kapı ve pencerelerde estetik görünümü bozmaz. Tamamen kablosuz haberleşme protokolü kullandığı için duvarlarda kablo kanalları veya kırma dökme işlemleri gerektirmeden monte edilir. Gelişmiş şifreli radyo frekansı altyapısı, sinyal kırıcı (jammer) girişimlerine karşı korumalıdır.\n\nDahili sıcaklık sensörü ve kurcalama koruması (tamper) ile donatılmış olan sensör, yerinden sökülmeye çalışıldığında veya kapağı açıldığında alarm sistemi kurulu olmasa bile anında sabotaj alarmı tetikler. Düşük enerji tüketimi sayesinde tek bir pil ile yıllarca sorunsuz koruma sağlar.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    tags: ["Sensör", "Kablosuz Kontak", "Sabotaj Koruması", "Kapı Pencere Sensörü"],
    features: [
      { title: "Hassas Manyetik Algılama", description: "Kapı veya pencere 1.5 - 2 cm aralandığı an milisaniyeler içinde açılma durumunu panele iletir." },
      { title: "Kablosuz Güvenli İletişim", description: "Sinyal kopyalama ve engelleme girişimlerine karşı korumalı şifreli kablosuz iletişim teknolojisi." },
      { title: "Dahili Sabotaj (Tamper) Koruması", description: "Cihazın yerinden sökülmesi veya kapak kısmının açılması durumunda anında alarm tetikleme." },
      { title: "Yıllarca Süren Pil Ömrü", description: "Akıllı güç tüketim algoritması ile standart CR123A pille 5 yıla varan çalışma süresi." },
    ],
    specs: [
      { title: "Haberleşme Frekansı", description: "868 MHz Şifreli Çift Yönlü RF" },
      { title: "Algılama Eşiği", description: "Küçük mıknatıs ile 1cm, büyük mıknatıs ile 2cm" },
      { title: "Çalışma Sıcaklığı", description: "-10°C ile +40°C arası dayanım" },
      { title: "Dahili Sensör", description: "Ortam sıcaklığı ölçümü (Mobil uygulamada gösterilir)" }
    ],
    specsTitle: "Teknik Parametreler ve İletişim Protokolü",
    specsDescription: "Manyetik kontak ünitesinin donanımsal özellikleri ve haberleşme detayları:",
    benefits: [
      { title: "Erken Tehdit Algılama", description: "Hırsız henüz evinize veya iş yerinize adım atmadan, kapı veya pencereyi zorladığı anda alarm devreye girer." },
      { title: "Estetik ve Pratik Entegrasyon", description: "Beyaz ve koyu gri renk seçenekleri ile ahşap, PVC veya metal doğramalarla kusursuz görsel uyum." }
    ],
    benefitsTitle: "Neden Manyetik Kontak?",
    benefitsDescription: "Mülkünüzün dış sınırlarını korumada en etkili dedektör tipinin avantajları:",
    faqs: [
      { question: "Pillerin bittiğini nasıl anlayacağım?", answer: "Sensörlerin pil durumları alarm paneli tarafından sürekli izlenir. Pil seviyesi kritik seviyeye düştüğünde telefonunuza 'Düşük Pil' bildirimi gelir ve değiştirmeniz için yaklaşık 1-2 ay süreniz olur." },
      { question: "Demir veya çelik kapılara montaj yapılabilir mi?", answer: "Evet, ancak metal yüzeyler manyetik alanı etkileyebileceğinden, çelik kapılarda montaj sırasında özel yalıtım aparatları kullanılarak sağlıklı çalışması güvenceye alınır." },
      { question: "Pencereyi havalandırma modunda açık bırakıp alarmı kurabilir miyim?", answer: "Sistem üzerinden ilgili pencere sensörünü geçici olarak 'bypass' edebilir (devre dışı bırakabilir) ve diğer tüm sensörler aktifken evinizi güvenle kilitleyebilirsiniz." }
    ],
    metaTitle: "Kablosuz Manyetik Kontak Kapı/Pencere Sensörü | PrimeSec",
    metaDescription: "Kapı ve pencerelerin açılmasını anında algılayan şifreli kablosuz manyetik kontak sensörü. Sabotaj korumalı, uzun pil ömürlü alarm sistemi bileşeni.",
  },
  {
    slug: "su-baskini-alarmi",
    name: "Su Baskını Alarmı",
    code: "PS-WATER-01",
    category: "Alarm Sistemleri",
    brand: "PrimeSec",
    usage: ["Mutfak", "Banyo", "Kazan Dairesi", "Tesisat Odası"],
    description: "Tesisat kaçaklarını ve su baskınlarını ilk damlada algılayarak büyük hasarları önleyen kablosuz sensör.",
    longDescription: "Su Baskını Alarmı, banyo, mutfak, bodrum katı, kombi altları veya kritik tesisat odalarında meydana gelebilecek su sızıntılarını ve baskın risklerini erkenden tespit etmek için tasarlanmış hayat kurtarıcı bir erken uyarı sensörüdür. Ev veya iş yerinizde en çok maddi hasara yol açan olayların başında gelen su kaçakları, genellikle siz orada yokken başlar ve saatler sonra fark edilir.\n\nBu sensör, tabanında bulunan hassas altın kaplama kontak noktalarına su temas ettiği anda durumu algılar ve alarm panelinize sinyal gönderir. Akıllı vana entegrasyonu (opsiyonel) ile kullanıldığında, sistem sadece alarm vermekle kalmaz, aynı zamanda ana su vanasını otomatik olarak kapatarak su akışını anında keser.\n\nTamamen su geçirmez (IP65) gövde yapısına sahip olan sensör, hiçbir montaj veya vidalama gerektirmeden doğrudan yere bırakılarak kullanılır. Kablosuz haberleşme altyapısı sayesinde temizlik sırasında kolayca kaldırılabilir veya yeri değiştirilebilir.",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    tags: ["Su Baskını", "Kablosuz Dedektör", "Erken Uyarı", "Su Sızıntısı Sensörü"],
    features: [
      { title: "İlk Damlada Algılama", description: "Tabanındaki kontakların suyla temas etmesiyle saniyeler içinde alarm durumuna geçer." },
      { title: "Kablolamasız Serbest Yerleşim", description: "Vidalama veya kablo çekme derdi yok; çamaşır makinesi altına, lavabo altına veya kombi yanına bırakın." },
      { title: "Akıllı Vana Kapatma Entegrasyonu", description: "Su sızıntısı algılandığında ana vanaya bağlı röleyi tetikleyerek evdeki tüm suyu otomatik kesme imkanı." },
      { title: "IP65 Tam Su Geçirmezlik", description: "Su altında kalsa dahi çalışmaya devam eden ve oksitlenmeye karşı altın kaplama kontaklara sahip gövde." },
    ],
    specs: [
      { title: "Sensör Kontak Tipi", description: "Altın Kaplama 4 Adet Çift Yönlü Kontak Noktası" },
      { title: "Haberleşme Menzili", description: "Açık alanda 1300 metreye kadar kablosuz RF çekim gücü" },
      { title: "Boyutlar", description: "Minimalist, dar alanlara sığabilen 56 x 56 x 14 mm ebatlar" },
      { title: "Pil Türü", description: "2 adet AAA pil ile 5 yıla kadar kesintisiz çalışma" }
    ],
    specsTitle: "Ürün Donanımı ve Dayanıklılık Standartları",
    specsDescription: "Su sızıntı dedektörünün ıslak alanlarda çalışmak üzere tasarlanmış teknik detayları:",
    benefits: [
      { title: "Binlerce Liralık Hasarı Önleyin", description: "Parkelerin kabarmasını, alt kata su sızmasını ve pahalı elektronik eşyaların zarar görmesini başlangıç aşamasında engelleyin." },
      { title: "Tatillerde Gözünüz Arkada Kalmasın", description: "Siz uzaktayken oluşabilecek boru patlaması veya musluk unutulması gibi durumlarda anında telefonunuza bildirim alın." }
    ],
    benefitsTitle: "Neden Su Baskını Sensörü?",
    benefitsDescription: "Maddi hasarları oluşmadan engellemenin en pratik ve akıllı yolu:",
    faqs: [
      { question: "Sensör temizlik yaparken su temas ederse alarm çalar mı?", answer: "Evet, su temas ettiği anda alarm tetiklenir. Bu nedenle temizlik yaparken sensörü geçici olarak kaldırıp zemini kuruladıktan sonra tekrar yerine koyabilirsiniz." },
      { question: "Sensörün pili azaldığında su sızıntısını kaçırır mıyım?", answer: "Hayır. Pil seviyesi kritik duruma geldiğinde sistem size önceden bildirim gönderir. Ayrıca sensörün çalışır durumda olup olmadığı sistem tarafından periyodik test sinyalleriyle sürekli denetlenir." },
      { question: "Baskın bittikten sonra sensör kendi kendine sıfırlanır mı?", answer: "Evet, altındaki kontak noktaları kuruduktan veya silindikten sonra sensör otomatik olarak normal durumuna geri döner, manuel sıfırlama gerektirmez." }
    ],
    metaTitle: "Kablosuz Su Baskını ve Sızıntı Alarm Sensörü | PrimeSec",
    metaDescription: "Su kaçaklarını ilk damlada algılayan kablosuz su baskını alarmı. IP65 su geçirmez gövde, altın kaplama kontaklar ve otomatik vana kapatma desteği.",
  },
  {
    slug: "yangin-ihbar-dedektoru",
    name: "Yangın İhbar Dedektörü",
    code: "PS-FIRE-01",
    category: "Yangın İhbar Sistemleri",
    brand: "Teknim",
    usage: ["Ev", "Ofis", "Mutfak", "Depo", "Kazan Dairesi"],
    description: "Optik algılama hücresiyle dumani ve ani sıcaklık artışlarını erkenden tespit eden yangın ihbar dedektörü.",
    longDescription: "Yangın İhbar Dedektörü, can ve mal güvenliğini tehdit eden yangın felaketlerine karşı en kritik koruma ekipmanıdır. Teknim'in üst düzey optik duman algılama teknolojisine sahip bu dedektör, iç mekanlarda oluşabilecek sinsi duman yayılımlarını ve hızlı sıcaklık artışlarını en erken evrede yakalayarak yangının büyümeden söndürülmesine olanak tanır.\n\nDedektör, içerisindeki fotoelektrik algılama hücresi sayesinde gözle görülmeyen ince duman partiküllerine dahi son derece hassastır. Yanlış alarmları önlemek amacıyla toz, böcek veya ani rüzgar akımları gibi dış etkenleri filtreleyen özel bir algoritmaya sahiptir. 360 derece görüş açısına sahip indikatör LED'leri sayesinde cihazın aktif durumunu her açıdan görebilirsiniz.\n\nPrimeSec alarm sistemleriyle tam entegre veya bağımsız adresli/konvansiyonel hatlar üzerinde çalışabilen bu dedektör, yangın durumunda sadece evdeki sirenleri çalmakla kalmaz; aynı zamanda itfaiyeye ve belirlediğiniz kişilere anında mobil arama ve acil durum bildirimi gönderilmesini sağlar.",
    image: "https://images.unsplash.com/photo-1583907608222-774b74ab422f?auto=format&fit=crop&w=800&q=80",
    tags: ["Yangın İhbar", "Duman Dedektörü", "Isı Artış Sensörü", "Teknim"],
    features: [
      { title: "Fotoelektrik Duman Algılama", description: "Hızlı alevlenen yangınların yanı sıra içten içe yanan sinsi dumanları da yüksek doğrulukla tespit eder." },
      { title: "Sıcaklık Değişim Sensörü", description: "Dumansız ancak yüksek ısı yayan yangın tipleri için ani ısı artışlarını (58°C sınır) izler." },
      { title: "Hatalı Alarm Koruma Filtresi", description: "Toz ve geçici nem buharlarını analiz ederek gereksiz sirenlere ve panik durumlarına engel olur." },
      { title: "Sesli ve Işıklı Yerel Uyarı", description: "Merkezi panel dışında, dedektörün kendi üzerindeki yüksek sesli buzzer ve kırmızı LED ile yerel uyarı." },
    ],
    specs: [
      { title: "Algılama Teknolojisi", description: "Optik Fotoelektrik Hücre + Isı Artış Dedektörü" },
      { title: "Çalışma Voltajı", description: "9V - 30V DC Sabit Güç veya 10 Yıl Ömürlü Lityum Batarya" },
      { title: "Ses Seviyesi", description: "3 metre mesafede minimum 85 dB yerel ses şiddeti" },
      { title: "Standart Uyumları", description: "EN54-7 (Duman) ve EN54-5 (Isı) Avrupa Standartları onaylı" }
    ],
    specsTitle: "Teknik Standartlar ve Algılama Parametreleri",
    specsDescription: "Uluslararası yangın yönetmeliklerine ve güvenlik standartlarına tam uyumlu teknik yapı:",
    benefits: [
      { title: "Uykudayken Bile Tam Güvence", description: "Yangınların en tehlikeli olduğu gece saatlerinde yüksek sesli uyarısıyla sizi ve sevdiklerinizi uykudan uyandırarak hayat kurtarır." },
      { title: "İşletmeler İçin Yasal Zorunluluk", description: "İtfaiye ve ruhsat onay süreçlerinde gerekli olan resmi yangın yönetmelik standartlarını eksiksiz sağlar." }
    ],
    benefitsTitle: "Neden Optik Yangın Dedektörü?",
    benefitsDescription: "Can güvenliğinizi şansa bırakmamanız için yangın dedektörünün hayati faydaları:",
    faqs: [
      { question: "Mutfakta yemek pişerken dedektör sürekli çalar mı?", answer: "Mutfak gibi buhar ve yemek dumanı olabilecek alanlarda sadece duman algılayan optik dedektörler yerine, ani ısı artışını izleyen 'Isı Dedektörleri' konumlandırılarak gereksiz alarmların önüne geçilir." },
      { question: "Dedektörün bakımı veya temizliği nasıl yapılır?", answer: "Yılda en az bir kez dedektörün duman hücresindeki tozların kuru bir hava spreyi ile temizlenmesi önerilir. Cihaz, tozlanma seviyesi kritik düzeye geldiğinde 'Bakım Gerekli' sinyali verir." },
      { question: "Bağımsız pilli dedektör ile alarm paneline bağlı dedektör farkı nedir?", answer: "Bağımsız dedektör sadece oda içinde ses çıkarır. Alarm paneline bağlı dedektör ise siz evde yokken telefonunuza acil durum uyarısı gönderir ve izleme merkezine itfaiye yönlendirme sinyali iletir." }
    ],
    metaTitle: "Teknim Duman ve Yangın İhbar Dedektörü | PrimeSec",
    metaDescription: "EN54 standartlarında optik fotoelektrik duman ve ısı dedektörü. Hızlı yangın algılama hücresi, yerel siren uyarısı ve akıllı alarm paneli entegrasyonu.",
  },
  {
    slug: "pdks-personel-takip-terminali",
    name: "PDKS Personel Takip Terminali",
    code: "PS-PDKS-01",
    category: "Personel Takip PDKS",
    brand: "Inox",
    usage: ["İş Yeri", "Fabrika", "Ofis", "Şantiye"],
    description: "Personel giriş çıkış saatlerini parmak izi, yüz tanıma veya RFID kart ile takip eden, bordro yazılımlarıyla entegre çalışan PDKS cihazı.",
    longDescription: "PDKS (Personel Devam Kontrol Sistemi) Personel Takip Terminali, işletmelerin çalışan giriş-çıkış saatlerini, mesailerini, geç kalma veya erken ayrılma durumlarını yüksek doğrulukla denetlemek için kullandığı profesyonel bir otomasyon donanımıdır. Inox biyometrik okuma teknolojisiyle donatılmış bu terminal; parmak izi, yüz tanıma, şifre ve RFID kartlı geçiş seçeneklerini tek bir cihazda sunar.\n\nSistem, personelin giriş ve çıkış yaptığı anları saliseler içinde kaydeder ve bu verileri yerel ağ (LAN) üzerinden PDKS yazılımına aktarır. PDKS yazılımımız sayesinde ay sonunda tek tuşla personel maaş, fazla mesai, eksik çalışma ve izin raporları oluşturulabilir. Bu raporlar, mevcut muhasebe ve bordro programlarına doğrudan aktarılarak insan kaynakları departmanının iş yükünü %90 oranında azaltır.\n\nIP tabanlı haberleşme altyapısı sayesinde, farklı şubelerdeki terminaller tek bir merkezden online olarak izlenebilir. Sahte yüz veya taklit parmak izi girişimlerine karşı canlı doku tespiti yapan gelişmiş sensör yapısıyla işletmenizde disiplini ve verimliliği en üst düzeye çıkarır.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    tags: ["PDKS", "Yüz Tanıma", "Parmak İzi Okuyucu", "Bordro Entegrasyonu"],
    features: [
      { title: "Çoklu Doğrulama Seçenekleri", description: "Tek bir terminalde yüz tanıma, parmak izi, proximity kart ve şifreli giriş modlarının tamamı aktif olarak kullanılabilir." },
      { title: "Canlı Doku ve Maske Algılama", description: "Fotoğraf veya video ile yüz okutma hilelerini engelleyen, derinlik algılamalı çift kameralı yüz tanıma." },
      { title: "Çevrimdışı (Offline) Çalışma Modu", description: "İnternet veya ağ bağlantısı kesildiğinde dahi dahili belleğinde 100.000 log kaydını saklayabilir." },
      { title: "Otomatik Bordro Entegrasyonu", description: "Logo, Zirve, ETA ve diğer popüler ERP/muhasebe yazılımlarına doğrudan veri aktarım format desteği." },
    ],
    specs: [
      { title: "Kullanıcı Kapasitesi", description: "3.000 Yüz, 5.000 Parmak İzi, 10.000 Kart Kapasitesi" },
      { title: "Tanımlama Hızı", description: "0.2 saniyenin altında ultra hızlı yüz ve parmak izi okuma" },
      { title: "Ekran Tipi", description: "4.3 inç TFT Renkli Dokunmatik Ekran ve Sesli Türkçe Asistan" },
      { title: "Haberleşme Arayüzleri", description: "TCP/IP (Ethernet), USB Host, Röle Çıkışı (Turnike ve Kapı Tetikleme)" }
    ],
    specsTitle: "Donanımsal Özellikler ve Kapasite Bilgileri",
    specsDescription: "Orta ve büyük ölçekli işletmelerin tüm yoğun giriş-çıkış trafiğini kaldırabilecek yüksek performanslı teknik yapı:",
    benefits: [
      { title: "İş Gücü Kaybını Engelleyin", description: "Hatalı kart okutma veya arkadaşı yerine kart basma gibi suistimallerin tamamen önüne geçerek adil bir çalışma ortamı sağlayın." },
      { title: "Hızlı Maaş ve Hak Ediş Hesaplama", description: "Ay sonunda manuel puantaj hesaplama karmaşasına son verin, saatler süren bordro hazırlığını dakikalara indirin." }
    ],
    benefitsTitle: "Neden PDKS Terminali?",
    benefitsDescription: "Şirket verimliliğini ve personel devam kontrolünü optimize etmenin avantajları:",
    faqs: [
      { question: "Cihaz elektrik kesildiğinde verileri kaybeder mi?", answer: "Hayır. Terminalin içerisindeki dahili flash bellek (EEPROM) elektrik kesintilerinden etkilenmez, tüm giriş-çıkış verileri ve kullanıcı kayıtları güvenle saklanır." },
      { question: "PDKS cihazı kapı veya turnike açabilir mi?", answer: "Evet, cihazın üzerinde dahili kuru kontak röle çıkışı bulunur. Bu sayede yetkili personel yüzünü okuttuğunda turnikenin dönmesini veya kapıdaki manyetik kilidin açılmasını sağlayabilir." },
      { question: "Yüz tanıma sistemi karanlıkta çalışır mı?", answer: "Evet, cihaz üzerinde bulunan dahili kızılötesi (IR) LED aydınlatmalar sayesinde zifiri karanlık ortamlarda dahi yüz tanıma işlemi hatasız ve hızlı bir şekilde gerçekleşir." }
    ],
    metaTitle: "PDKS Personel Takip ve Yüz Tanıma Terminali | PrimeSec",
    metaDescription: "İşletmeler için biyometrik yüz tanıma ve parmak izli personel devam kontrol sistemi (PDKS). Bordro ve muhasebe yazılımlarıyla tam entegre puantaj çözümleri.",
  },
  {
    slug: "network-altyapi-cozumu",
    name: "Network Altyapı Çözümü",
    code: "PS-NET-01",
    category: "Network Çözümleri",
    brand: "UNV",
    usage: ["İş Yeri", "Ofis", "Fabrika", "Sistem Odası"],
    description: "Kamera, alarm, veri ve kurumsal iletişim cihazları için yüksek hızlı, güvenilir ve yapısal ağ kablolama altyapısı.",
    longDescription: "Network Altyapı Çözümü, modern işletmelerin can damarı olan veri iletişiminin, güvenlik kameralarının ve otomasyon sistemlerinin kesintisiz çalışması için kurulan profesyonel ağ altyapısı hizmetidir. UNV ve endüstri lideri diğer ağ ekipmanları kullanılarak projelendirilen bu hizmet, kablo karmaşasına son vererek yüksek hızlı ve kesintisiz bir yerel ağ (LAN) omurgası oluşturur.\n\nBir güvenlik sisteminin veya ofis bilgisayarlarının performansı, arkasındaki network altyapısının kalitesiyle doğrudan ilişkilidir. PrimeSec uzmanlığıyla yapılan yapısal kablolama (Cat6/Cat7/Fiber), kabinet düzenlemeleri, switch ve router kurulumları, veri paketlerinin kayıpsız iletilmesini sağlar. Bu sayede IP kameralarda donma, veri ağlarında yavaşlama veya bağlantı kopmaları gibi sorunlar tamamen elenir.\n\nSistem odanızdaki kablo karmaşasını düzenli patch panellerle etiketleyerek, ileride oluşabilecek arızaların tespiti ve giderilmesini dakikalar seviyesine indiriyoruz. Ağ güvenliğinizi de ön planda tutarak, misafir ve personel ağlarını (VLAN) birbirinden izole edip şirket içi siber güvenliğinizi güçlendiriyoruz.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    tags: ["Yapısal Kablolama", "Sistem Odası Kurulumu", "PoE Switch", "Fiber Optik"],
    features: [
      { title: "Profesyonel Yapısal Kablolama", description: "Cat6/Cat7 ve Fiber Optik kablolar ile elektromanyetik parazitlerden arındırılmış, gigabit hızında veri iletim hatları." },
      { title: "Sistem Odası ve Kabinet Düzenleme", description: "Karışık kabloların etiketlenmesi, patch panel sonlandırmaları ve rack kabinetlerin havalandırma standartlarına uygun montajı." },
      { title: "Yönetilebilir Switch ve VLAN Kurulumu", description: "Güvenlik kameralarının trafiğini şirket veri trafiğinden ayırarak bant genişliği optimizasyonu ve maksimum siber güvenlik." },
      { title: "Bölgesel Ağ Genişletme (Access Point)", description: "İş yerinizin her köşesinde kesintisiz ve yüksek hızlı kablosuz internet kapsama alanı kurulumu." },
    ],
    specs: [
      { title: "Kablo Standartları", description: "Halojen Free (Alev geciktirici) Cat6 UTP/FTP, Cat7 ve Çok Modlu (MultiMode) Fiber Kablolar" },
      { title: "Switch Desteği", description: "L2/L3 Yönetilebilir, PoE+ (Port başına 30W güç beslemeli) kurumsal ağ switchleri" },
      { title: "Ağ Güvenliği", description: "Güvenlik duvarı (Firewall) entegrasyonu, MAC adresi filtreleme ve izole misafir ağları" },
      { title: "Test ve Raporlama", description: "Fluke cihazları ile uçtan uca kablo performans ve bant genişliği doğrulama testleri" }
    ],
    specsTitle: "Kurumsal Ağ Donanım ve Altyapı Detayları",
    specsDescription: "İşletmenizin gelecekteki büyüme ihtiyaçlarını karşılayabilecek esneklikte tasarlanmış altyapı standartları:",
    benefits: [
      { title: "Sıfır Veri ve Görüntü Kaybı", description: "Yüksek bant genişliği sayesinde IP kameralardan gelen Full HD akışlar hiçbir takılma ve paket kaybı olmadan NVR cihazına kaydedilir." },
      { title: "Hızlı Arıza Tespiti", description: "Etiketlenmiş ve yapılandırılmış kablo hatları sayesinde, olası bir bağlantı probleminde hangi cihazın arızalı olduğu anında bulunur." }
    ],
    benefitsTitle: "Neden Profesyonel Network Altyapısı?",
    benefitsDescription: "Doğru tasarlanmış bir yerel ağ omurgasının şirket süreçlerine katkıları:",
    faqs: [
      { question: "Mevcut kablo kanallarını kullanabilir misiniz?", answer: "Keşif mühendislerimiz mevcut kablo kanallarının doluluk oranını ve elektromanyetik parazit riskini inceler. Eğer standartlara uygunsa maliyet tasarrufu için mevcut kanallar kullanılabilir." },
      { question: "Fiber optik kablolama hangi mesafelerde zorunludur?", answer: "Bakır Cat6 kablolar 90 metrenin üzerindeki mesafelerde sinyal zayıflaması yaşar. 90 metreyi aşan bloklar arası geçişlerde veri kaybını önlemek için fiber optik kablolama yapılması şarttır." },
      { question: "Sistem odası yangın riskine karşı nasıl korunur?", answer: "Sistem odası projelerimizde kabinet içine özel FM200 veya gazlı otomatik yangın söndürme sistemleri ve ısı/duman dedektörleri yerleştirerek veri merkezini tam koruma altına alıyoruz." }
    ],
    metaTitle: "Kurumsal Network Altyapısı ve Yapısal Kablolama | PrimeSec",
    metaDescription: "Güvenlik sistemleri ve kurumsal veri ağları için yapısal kablolama, sistem odası kurulumu, yönetilebilir switch ve fiber optik network çözümleri.",
  },
];

export const productCategories = Array.from(new Set(products.map((product) => product.category)));
export const brands = ["Hikvision", "Dahua", "TTEC", "UNV", "Xmeye", "Reolink", "Inox", "Paradox", "DSC", "Teknim", "Ajax"];
