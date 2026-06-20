import { products } from "@/data/products";

export type ServicePage = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  heroImage: string;
  category: string;
  keywords: string[];
  benefits: string[];
  useCases: (string | { title: string; description: string })[];
  process: string[];
  faqs: { question: string; answer: string }[];
  heroTitle?: string;
  heroDescription?: string;
  introTitle?: string;
  introContent?: string;
  deepDive?: { title: string; text: string }[];
};

const baseFaq = (topic: string) => [
  { question: `${topic} için keşif yapıyor musunuz?`, answer: "Evet, alanın risk yapısını görmeden ezbere paket önermiyoruz; keşif sonrası doğru sistemi planlıyoruz." },
  { question: "Kurulumdan sonra destek veriliyor mu?", answer: "Evet, bakım, arıza ve kullanım desteği PrimeSec hizmet sürecinin parçasıdır." },
];

export const services: ServicePage[] = [
  {
    slug: "alarm-sistemleri",
    title: "Alarm Sistemleri",
    metaTitle: "Alarm Sistemleri | PrimeSec Teknoloji",
    description: "Ev ve iş yerleri için hırsız alarm, kablosuz sensör, siren ve mobil bildirim destekli güvenlik sistemleri kuruyoruz.",
    heroImage: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    category: "Alarm Sistemleri",
    keywords: ["Hırsız alarm", "Alarm sistemleri", "Ev güvenlik sistemleri"],
    benefits: [
      "7/24 kesintisiz koruma ve caydırıcılık",
      "Mobil uygulama üzerinden uzaktan yönetim ve anlık bildirim",
      "Mekanın mimari yapısına göre özel sensör yerleşimi",
      "Kablolu ve kablosuz gelişmiş hibrit panel altyapısı"
    ],
    useCases: [
      "Daire ve müstakil villa güvenliği",
      "Mağaza, ofis ve ticari işletmeler",
      "Depo, ardiye ve sanayi tesisleri",
      "Kamu kurumları ve idari binalar"
    ],
    process: ["Risk analizi ve keşif", "Projelendirme", "Montaj ve devreye alma", "Kullanıcı eğitimi"],
    faqs: baseFaq("Alarm sistemleri"),
    introTitle: "Hırsız Alarm Sistemleri ile Kesintisiz Güvenlik",
    introContent: "Hırsız alarm sistemleri, mülkünüzün en hassas noktalarını koruma altına alan bir güvenlik kalkanıdır. PrimeSec olarak, standart çözümler yerine alanınızın giriş çıkış noktalarını, kör noktalarını ve potansiyel sızma yollarını analiz ederek projelendirme yapıyoruz.\n\nYüksek sesli dış alan sirenleri ve anlık mobil bildirim desteği sayesinde hırsızlık girişimlerini henüz başlama aşamasındayken önler ve caydırıcılık sağlarsınız.",
    deepDive: [
      {
        title: "Doğru Sensör Konumlandırması",
        text: "Manyetik kontaklar, hareket dedektörleri ve cam kırılma sensörleri gibi ekipmanları evcil hayvanlarınızın hareketlerini göz ardı edecek şekilde akıllıca konumlandırıyoruz."
      },
      {
        title: "7/24 Alarm İzleme Entegrasyonu",
        text: "Sistemlerimiz, herhangi bir alarm durumunda polis, itfaiye ve ambulans yönlendirmesi yapan profesyonel Alarm İzleme Merkezlerine entegre edilebilir."
      },
      {
        title: "Akıllı Güvenlik Senaryoları",
        text: "Eve giriş ve çıkış saatlerinize göre otomatik devreye girme, yangın ve su baskını dedektörleriyle entegre çalışarak tam koruma sağlar."
      }
    ]
  },
  {
    slug: "alarm-sistemleri/ev-alarm-sistemleri",
    title: "Ev Alarm Sistemleri",
    metaTitle: "Ev Alarm Sistemleri | PrimeSec Teknoloji",
    description: "Daire, villa, bahçe katı ve yazlıklar için akıllı ev alarm sistemleriyle sevdiklerinizi 7/24 koruyun.",
    heroImage: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    category: "Alarm Sistemleri",
    keywords: ["Ev alarm sistemleri", "Ev güvenlik sistemleri"],
    benefits: [
      "Pencere ve kapılar için tam çevre koruması",
      "Su baskını, gaz kaçağı ve duman algılama entegrasyonu",
      "Kullanımı son derece kolay akıllı tuş takımı ve şifre paneli",
      "Çocuklar ve evcil hayvanlara özel akıllı hareket filtreleme"
    ],
    useCases: [
      "Bahçe katı ve giriş katı daireler",
      "Müstakil villalar ve yazlık konutlar",
      "Uzun süre boş bırakılan yazlık evler",
      "Şehir merkezindeki yüksek katlı apartman daireleri"
    ],
    process: ["Ev keşfi", "Giriş noktaları risk analizi", "Sensör montajı", "Mobil uygulama eşleştirme"],
    faqs: baseFaq("Ev alarm sistemleri"),
    introTitle: "Eviniz ve Sevdikleriniz İçin Sıcak Güvenlik Çemberi",
    introContent: "Ev güvenlik sistemleri sadece malınızı değil, en değerli varlıklarınızı korur. PrimeSec Ev Alarm Çözümleri, siz evdeyken 'Ev İçi Mod' (Stay Mode) sayesinde sadece dış kapı ve pencereleri koruyarak evinizin içinde özgürce hareket etmenize olanak tanır.\n\nAkıllı gaz, duman ve su sızıntı dedektörleriyle zenginleştirilebilen altyapımız sayesinde evinizde oluşabilecek diğer tüm acil durumlara karşı da hazırlıklı olursunuz.",
    deepDive: [
      {
        title: "Ev İçi ve Dışı Ayrı Koruma Modları",
        text: "Gece uyurken sadece dış pencereleri ve kapıları aktif hale getirerek evinizin içinde güvenle ve alarmı tetiklemeden yürüyebilirsiniz."
      },
      {
        title: "Hayvan Dostu (PET) Dedektörler",
        text: "Belirli bir kiloya kadar olan evcil hayvanlarınızın hareketlerini analiz ederek yanlış alarmların tamamen önüne geçer."
      },
      {
        title: "Tehdit Anında Hızlı Panik Butonu",
        text: "Herhangi bir panik, acil sağlık veya tehdit durumunda tuş takımı veya mobil uygulama üzerindeki tek butonla merkeze sinyal gönderir."
      }
    ]
  },
  {
    slug: "alarm-sistemleri/is-yeri-alarm-sistemleri",
    title: "İş Yeri Alarm Sistemleri",
    metaTitle: "İş Yeri Alarm Sistemleri | PrimeSec Teknoloji",
    description: "Mağaza, ofis, depo ve atölyeler için hırsız alarm, kamera ve panik butonu entegre iş yeri güvenliği.",
    heroImage: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    category: "Alarm Sistemleri",
    keywords: ["İş yeri alarm sistemi", "İş yeri güvenlik sistemleri"],
    benefits: [
      "Mesai saatleri dışında 7/24 tam çevre koruması",
      "Sirenlerin yanı sıra anlık sessiz alarm gönderme yeteneği",
      "Farklı departmanlara göre bölge (Partition) bazlı yetkilendirme",
      "Personel giriş ve çıkış saatlerinin detaylı raporlanması"
    ],
    useCases: [
      "Perakende mağazaları ve showroomlar",
      "Depolar ve lojistik saklama alanları",
      "Ofisler, klinikler ve eczaneler",
      "Kuyumcular ve döviz büroları"
    ],
    process: ["İş yeri keşfi", "Hassas ve değerli eşya oda analizi", "Kurulum", "Personel yetkilendirmesi"],
    faqs: baseFaq("İş yeri alarm sistemleri"),
    introTitle: "İş Yerinizi ve Ticari Varlıklarınızı Güvenceye Alın",
    introContent: "İş yerlerinin güvenliği, işletmenin devamlılığı için kritiktir. PrimeSec İş Yeri Alarm Çözümleri, kilitli kasalar, depolar ve ofis giriş kapıları için en gelişmiş dedektör altyapısını kurar.\n\nSistemin hangi personel tarafından saat kaçta kurulup kapatıldığını mobil uygulama üzerinden anlık bildirimlerle takip edebilir, yetkilendirmeleri departman bazında sınırlandırabilirsiniz.",
    deepDive: [
      {
        title: "Bölge (Partition) Bazlı Yönetim",
        text: "İş yerinizdeki muhasebe bölümü veya depo gibi alanları, diğer ofis çalışanları içerideyken dahi bağımsız olarak kurup kilitleyebilirsiniz."
      },
      {
        title: "Sessiz Panik Buton Entegrasyonu",
        text: "Herhangi bir gasp veya tehdit anında tezgah altı butonlar yardımıyla siren çalmadan doğrudan emniyet birimlerine sessiz ihbar gönderir."
      },
      {
        title: "Detaylı Raporlama Arayüzü",
        text: "Hangi kapının ne zaman açıldığını, hangi personelin sistemi saat kaçta devre dışı bıraktığını bulut yazılımımızdan raporlayabilirsiniz."
      }
    ]
  },
  {
    slug: "kamera-sistemleri",
    title: "Kamera Sistemleri",
    metaTitle: "Kamera Sistemleri | PrimeSec Teknoloji",
    description: "CCTV kamera, IP kamera, kayıt cihazı ve uzaktan izleme çözümleriyle alanlarınızı net ve kesintisiz izleyin.",
    heroImage: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
    category: "Kamera Sistemleri",
    keywords: ["Kamera sistemleri", "CCTV kamera", "IP kamera"],
    benefits: [
      "Yüksek çözünürlüklü kesintisiz görüntü kaydı",
      "Gece görüşü ve yapay zeka tabanlı hareket algılama",
      "Uzaktan anlık canlı izleme ve geçmiş kayıt arama",
      "Kör noktaları sıfıra indiren profesyonel kamera konumlandırması"
    ],
    useCases: [
      "Ev ve apartman kamera sistemleri",
      "Mağaza ve perakende alan izleme",
      "Fabrika, depo ve endüstriyel tesisler",
      "Site ve çevre güvenlik izleme altyapıları"
    ],
    process: ["Kör nokta analizi", "Kamera ve lens seçimi", "Kablolama ve montaj", "Kayıt ve mobil yazılım ayarları"],
    faqs: baseFaq("Kamera sistemleri"),
    introTitle: "Yüksek Çözünürlüklü Güvenlik Kamerası Çözümleri",
    introContent: "Güvenlik kamerası sistemleri, bir olayın anlık olarak takip edilmesini ve geriye dönük delil olarak saklanmasını sağlar. PrimeSec olarak, alanınızın ışık durumuna ve mesafelerine göre doğru lens ve gece görüş kızılötesi (IR) led sayılarına sahip profesyonel kameralar seçiyoruz.\n\nHarekete duyarlı kayıt teknolojisi sayesinde depolama alanından tasarruf eder, aradığınız geçmiş kayda dakikalar içinde ulaşırsınız.",
    deepDive: [
      {
        title: "Yapay Zeka Destekli Analiz",
        text: "Kameranın görüş alanına giren insan ve araçları ayırt ederek, sadece gerçek tehdit durumlarında alarm almanızı sağlar."
      },
      {
        title: "Gelişmiş Gece Görüş Teknolojisi",
        text: "Zifiri karanlık ortamlarda dahi kızılötesi veya ColorVu teknolojisiyle renkli ve yüksek çözünürlüklü görüntüler elde edersiniz."
      },
      {
        title: "Güvenli Bulut ve Yerel Yedekleme",
        text: "Kayıt cihazına ek olarak önemli görüntüleri buluta yedekleyebilir, fiziksel çalınma veya hasar risklerine karşı koruma sağlarsınız."
      }
    ]
  },
  {
    slug: "kamera-sistemleri/cctv-kamera",
    title: "CCTV Kamera Sistemleri",
    metaTitle: "CCTV Kamera Sistemleri | PrimeSec Teknoloji",
    description: "CCTV kamera sistemleriyle ev, mağaza, depo ve ofisler için ekonomik ve güvenilir görüntü güvenliği sağlayın.",
    heroImage: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
    category: "Kamera Sistemleri",
    keywords: ["CCTV kamera", "Güvenlik kamerası sistemleri"],
    benefits: [
      "Ekonomik ve bütçe dostu depolama ve kayıt altyapısı",
      "Dış mekan koşullarına tam uyumlu dayanıklı kamera kasaları",
      "Analog HD altyapı sayesinde mevcut kabloları kullanabilme kolaylığı",
      "İnternet bağlantısı ile uzaktan mobil canlı izleme desteği"
    ],
    useCases: [
      "Küçük işletmeler ve mahalle dükkanları",
      "Apartman ve bina ortak alanları",
      "Ofisler ve çalışma alanları",
      "Otoparklar ve bina çevre güvenlikleri"
    ],
    process: ["Keşif", "Analog HD kamera seçimi", "DVR kayıt cihazı kurulumu", "Mobil izleme testi"],
    faqs: baseFaq("CCTV kamera sistemleri"),
    introTitle: "Ekonomik ve Dayanıklı CCTV Kamera Çözümleri",
    introContent: "CCTV (Analog HD) kamera sistemleri, yüksek maliyetlere girmeden stabil ve uzun ömürlü görüntü kaydı almak isteyen işletmeler için idealdir. Coaxial kablolar üzerinden yüksek çözünürlüklü görüntü aktarabilen bu sistemler, özellikle eski altyapısı hazır olan binalarda kablo maliyetini sıfıra indirir.\n\nPrimeSec CCTV çözümleriyle bütçenizi zorlamadan geniş alanları 7/24 izleme altında tutabilir, DVR kayıt cihazı üzerinden aylarca geriye dönük arşiv yapabilirsiniz.",
    deepDive: [
      {
        title: "Kolay Altyapı Entegrasyonu",
        text: "Mevcut analog kablolarınız üzerinden Full HD çözünürlüğe kadar görüntü aktarabilen kameralarla revizyon maliyetlerini düşürür."
      },
      {
        title: "7/24 Stabil Bağlantı",
        text: "IP kameralar gibi network bant genişliğini işgal etmeyen doğrudan bağlantı mimarisiyle sıfır gecikmeli izleme sunar."
      },
      {
        title: "DVR Kayıt Teknolojisi",
        text: "Hibrit kayıt cihazları sayesinde hem analog kameraları hem de sınırlı sayıda IP kamerayı tek ekrandan yönetme esnekliği sağlar."
      }
    ]
  },
  {
    slug: "kamera-sistemleri/ip-kamera",
    title: "IP Kamera Sistemleri",
    metaTitle: "IP Kamera Sistemleri | PrimeSec Teknoloji",
    description: "PoE destekli IP kamera sistemleriyle yüksek çözünürlüklü, ölçeklenebilir ve akıllı video altyapısı kurun.",
    heroImage: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
    category: "Kamera Sistemleri",
    keywords: ["IP kamera", "Network kamera"],
    benefits: [
      "PoE desteği sayesinde tek kablo (Cat6) üzerinden hem güç hem data aktarımı",
      "4K ve üzeri ultra yüksek çözünürlüklü net görüntü kalitesi",
      "Sınır ihlali, kişi sayma ve plaka tanıma gibi akıllı analizler",
      "Tamamen dijital, kolayca büyütülebilir network mimarisi"
    ],
    useCases: [
      "Geniş fabrikalar, üretim tesisleri ve depolar",
      "Kurumsal holding ofisleri ve plazalar",
      "Büyük siteler ve toplu konut çevre koruma projeleri",
      "Lojistik ve sevkiyat merkezleri"
    ],
    process: ["Ağ analizi", "Kamera ve PoE Switch konumlandırması", "NVR kayıt cihazı montajı", "Akıllı analiz yazılım entegrasyonu"],
    faqs: baseFaq("IP kamera sistemleri"),
    introTitle: "Ultra Çözünürlüklü ve Akıllı IP Kamera Çözümleri",
    introContent: "IP Kamera sistemleri, dijital ağ teknolojisi (network) üzerinde çalışır ve güvenlik kamerası standartlarında geleceğin teknolojisini temsil eder. Her kameranın bağımsız bir ağ cihazı olduğu bu sistemlerde, Cat6 kablolarla ağa bağlanan kameralar PoE (Power over Ethernet) switchlerden doğrudan beslenir.\n\nPrimeSec IP kamera çözümleri; plaka tanıma, kayıp nesne algılama, yüz analizi ve sınır ihlali gibi yapay zeka yetenekleriyle güvenliğinizi en üst seviyeye taşır.",
    deepDive: [
      {
        title: "Tek Kablo ile Kolay Montaj",
        text: "Kameraların çalışması için ek elektrik kablosuna ihtiyaç duyulmaz; PoE switch yardımıyla internet kablosu üzerinden beslenirler."
      },
      {
        title: "Gelişmiş Yapay Zeka Analizi",
        text: "Belirlenen sanal sınırları aşan insanları algılayıp doğrudan güvenlik odasına veya cep telefonunuza uyarı gönderir."
      },
      {
        title: "Ölçeklenebilir Esnek Yapı",
        text: "Sisteme yeni kamera eklemek için kayıt cihazına kadar kablo çekmeye gerek yoktur; en yakın network switch'e bağlanması yeterlidir."
      }
    ]
  },
  {
    slug: "akilli-ev-sistemleri",
    title: "Akıllı Ev Sistemleri",
    metaTitle: "Akıllı Ev Sistemleri | PrimeSec Teknoloji",
    description: "Akıllı ev sistemleriyle güvenlik, konfor ve enerji yönetimini tek mobil ekranda birleştirin.",
    heroImage: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    category: "Akıllı Ev Sistemleri",
    keywords: ["Akıllı ev", "Ev otomasyonu", "Akıllı aydınlatma", "PrimeSec Akıllı Ev"],
    benefits: [
      "Tek bir mobil uygulama üzerinden tüm evin kontrolü",
      "Kişiselleştirilebilir senaryo bazlı aydınlatma ve iklimlendirme",
      "Tehlike anında su ve gaz vanalarını otomatik kesme koruması",
      "Gereksiz çalışan cihazları kapatarak yüksek enerji tasarrufu"
    ],
    useCases: [
      "Müstakil lüks villalar ve yazlıklar",
      "Modern rezidans daireleri",
      "Akıllı ofis ve toplantı odası projeleri",
      "Uzun süre boş kalan tatil konutları"
    ],
    process: [
      "Kullanıcı alışkanlıkları ve ihtiyaç analizi",
      "Altyapı protokol seçimi (KNX kablolu veya Zigbee kablosuz)",
      "Akıllı modüllerin ve anahtarların montajı",
      "Kişiselleştirilmiş senaryoların yazılım ayarları"
    ],
    faqs: [
      {
        question: "Akıllı ev sistemleri mevcut evlere kurulabilir mi?",
        answer: "Evet, kablosuz Zigbee protokolü kullanan modüllerimiz sayesinde kırma dökme yapmadan mevcut evinizi akıllı eve dönüştürebiliyoruz."
      },
      {
        question: "İnternet kesildiğinde sistem çalışmaya devam eder mi?",
        answer: "Yerel senaryolar ve anahtarlar internet olmasa da çalışmaya devam eder; ancak uzaktan erişim ve mobil bildirimler için aktif internet gerekir."
      }
    ],
    introTitle: "Hayatınızı Kolaylaştıran Akıllı Ev Teknolojileri",
    introContent: "Akıllı ev sistemleri, evinizi sadece uzaktan kontrol etmenizi sağlamaz; evin sizin alışkanlıklarınıza göre kararlar almasına imkan tanır. PrimeSec Akıllı Ev Çözümleriyle 'Evden Çıkış' senaryosunu başlattığınızda; tüm ışıklar söner, panjurlar kapanır, kombi tasarruf moduna geçer ve su/gaz vanaları güvenlik amacıyla otomatik kapatılır.\n\nEvinizde oluşan bir su sızıntısında sistem suyu keser ve cep telefonunuza anında uyarı göndererek büyük hasarların önüne geçer.",
    deepDive: [
      {
        title: "Konforlu İklimlendirme Kontrolü",
        text: "Klima ve kombi derecelerini dış ortam sıcaklığına veya evde olup olmadığınıza göre otomatik olarak ayarlar."
      },
      {
        title: "Tehlike Anında Otomatik Önlem",
        text: "Gaz kaçaklarında veya su sızıntılarında ana vanaları otomatik kapatarak evinizin emniyetini sağlar."
      },
      {
        title: "Zaman Ayarlı Akıllı Panjurlar",
        text: "Güneşin doğuş ve batış saatlerine veya belirlediğiniz rutinlere göre perdelerinizi ve panjurlarınızı yönetir."
      }
    ]
  },
  {
    slug: "yangin-ihbar-sistemleri",
    title: "Yangın İhbar Sistemleri",
    metaTitle: "Yangın İhbar Sistemleri | PrimeSec Teknoloji",
    description: "Duman, ısı ve yangın risklerini erken algılayan profesyonel yangın ihbar çözümleri kuruyoruz.",
    heroImage: "https://images.unsplash.com/photo-1516216621161-0b57ff39dc4c?auto=format&fit=crop&w=800&q=80",
    category: "Yangın İhbar Sistemleri",
    keywords: ["Yangın ihbar", "Duman dedektörü", "Yangın alarm sistemi", "Adresli yangın sistemi"],
    benefits: [
      "Erken aşamada duman, ısı ve gaz algılama hassasiyeti",
      "Adresli paneller sayesinde yangının çıktığı tam odayı nokta atışı görebilme",
      "Havalandırma, asansör ve acil yönlendirme sistemleriyle entegrasyon",
      "Hızlı müdahale için alarm izleme merkezi ve itfaiye entegrasyonu"
    ],
    useCases: [
      "Fabrikalar ve endüstriyel üretim tesisleri",
      "Depolar ve lojistik saklama alanları",
      "Ofisler, iş hanları ve ticari binalar",
      "Oteller, yurtlar ve konaklama tesisleri"
    ],
    process: [
      "Bina yangın yönetmeliği standart analizi",
      "Dedektör, buton ve siren konumlandırma planı",
      "Kablo çekimi ve panel montajı",
      "Duman testleriyle sistem testi ve teslimi"
    ],
    faqs: [
      {
        question: "Konvansiyonel ve Adresli sistem farkı nedir?",
        answer: "Konvansiyonel sistemler yangını bölge (zone) bazlı gösterirken, adresli sistemler tam olarak hangi odadaki dedektörün tetiklendiğini nokta atışı bildirir."
      },
      {
        question: "Dedektör bakımları ne sıklıkla yapılmalıdır?",
        answer: "Duman dedektörlerinin yılda en az bir kez toz temizliği ve test spreyleriyle kalibrasyon testlerinin yapılması önerilir."
      }
    ],
    introTitle: "Can ve Mal Güvenliği İçin Profesyonel Yangın İhbarı",
    introContent: "Yangın, saniyeler içinde geri dönülemez hasarlar verebilen en büyük risklerden biridir. PrimeSec Yangın Algılama ve İhbar Çözümleri, uluslararası standartlara (EN54) uygun ekipmanlarla erken algılama yapar. Yangının başladığı yeri tam olarak bildiren adresli sistemlerimiz sayesinde, itfaiye ve müdahale ekipleri binaya girdiklerinde doğrudan yangın kaynağına yönlenebilir.\n\nGaz kaçaklarını veya karbonmonoksit seviyelerini de takip eden gelişmiş dedektörlerimiz, tam koruma sağlar.",
    deepDive: [
      {
        title: "Nokta Atışı Adresli Algılama",
        text: "Panel üzerindeki ekranda '2. Kat Muhasebe Odası Duman Dedektörü' gibi detaylı konum bilgisi sunarak hızlı müdahaleyi sağlar."
      },
      {
        title: "Akıllı Senaryo Entegrasyonları",
        text: "Yangın anında asansörleri acil tahliye katına indirir, havalandırma kapaklarını açar ve manyetik kapıları serbest bırakır."
      },
      {
        title: "Uluslararası EN54 Standartları",
        text: "İtfaiye onaylı ve yangın yönetmeliklerine tamamen uygun, resmi denetimlerden sorunsuz geçen onaylı donanımlar."
      }
    ]
  },
  {
    slug: "arac-takip-sistemleri",
    title: "Araç Takip Sistemleri",
    metaTitle: "Araç Takip Sistemleri | PrimeSec Teknoloji",
    description: "CanBus uyumlu araç takip çözümleriyle filonuzu canlı izleyin, raporlayın ve güvenle yönetin.",
    heroImage: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=800&q=80",
    category: "Araç Takip Sistemleri",
    keywords: ["Araç takip", "Filo takibi", "GPS araç takip", "PrimeSec Araç Takip"],
    benefits: [
      "7/24 canlı GPS konumu, rota geçmişi ve hız takibi",
      "Gereksiz rölanti ve yakıt tüketimini minimuma indirme",
      "Güvenli sürüş analizi, sert fren ve hızlı viraj takipleri",
      "Belirlenen bölgelere (Geofence) giriş çıkış anlık bildirimleri"
    ],
    useCases: [
      "Lojistik, kargo ve dağıtım filoları",
      "Saha satış ve pazarlama ekiplerinin araçları",
      "Öğrenci servisleri ve personel taşıma araçları",
      "İş makineleri, kiralık araçlar ve ticari taksiler"
    ],
    process: [
      "Filo yapısının incelenmesi ve ihtiyaç analizi",
      "Araçlara GPS modüllerinin ve anten montajı",
      "Kullanıcı hesapları ve izleme platformu kurulumu",
      "Mobil uygulama ve web arayüz eğitimleri"
    ],
    faqs: [
      {
        question: "Araç takip yakıt kontrolü sağlar mı?",
        answer: "Evet, gereksiz rölantileri, rota dışı kullanımları ve ani hızlanmaları raporlayarak yakıt tüketiminde ortalama %15 ila %20 tasarruf sağlar."
      },
      {
        question: "Geçmişe dönük rapor alınabilir mi?",
        answer: "Sistemimiz araçların geçmiş 365 güne kadar olan tüm seyahat geçmişini, duraklamalarını ve hız raporlarını arşivler."
      }
    ],
    introTitle: "Filo Yönetiminde Tam Kontrol: GPS Araç Takip",
    introContent: "Araç takip sistemleri, saha operasyonlarınızı masanızın başından yönetmenizi sağlar. PrimeSec Araç Takip Çözümleri, CanBus entegrasyonu sayesinde sadece aracın konumunu değil, motor devrini, yakıt seviyesini ve servis zamanını da raporlar.\n\nSürücülerinizin hız limitlerini aşıp aşmadığını, gereksiz yere klimayı açık bırakıp rölantide bekleyip beklemediğini takip ederek işletme maliyetlerinizi ciddi oranda düşürürsünüz.",
    deepDive: [
      {
        title: "Canlı ve Hassas Konum Takibi",
        text: "GPS ve GLONASS uydularını aynı anda kullanarak dar sokaklarda veya tünel girişlerinde bile konum kaybı yaşatmaz."
      },
      {
        title: "Detaylı Sürücü Davranış Analizi",
        text: "Ani hızlanma, sert fren ve aşırı hız rutinlerini raporlayarak kaza risklerini ve araç yıpranma oranlarını azaltır."
      },
      {
        title: "Geofence (Sanal Güvenli Bölge)",
        text: "Araçlarınız belirlediğiniz şantiye, depo veya şehir dışına çıktığı anda cep telefonunuza anlık bildirim gönderir."
      }
    ]
  },
  {
    slug: "personel-takip-pdks",
    title: "Personel Takip PDKS",
    metaTitle: "Personel Takip PDKS | PrimeSec Teknoloji",
    description: "Personel giriş çıkışlarını kartlı, şifreli veya biyometrik terminallerle güvenilir şekilde takip edin.",
    heroImage: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80",
    category: "Personel Takip PDKS",
    keywords: ["PDKS", "Personel takip sistemi", "Yüz tanıma pdks", "Kartlı pdks"],
    benefits: [
      "Personel giriş ve çıkış saatlerinin hatasız, otomatik raporlanması",
      "Yüz tanıma, parmak izi, kartlı ve şifreli terminal seçenekleri",
      "Piyasadaki popüler muhasebe ve İK programlarıyla tam entegrasyon",
      "Gecikme, erken çıkış, devamsızlık ve fazla mesailerin anlık takibi"
    ],
    useCases: [
      "Çok vardiyalı çalışan fabrikalar ve şantiyeler",
      "Plazalar ve kurumsal şirket ofisleri",
      "Restoran zincirleri ve perakende mağazaları",
      "Kamu binaları, hastaneler ve eğitim kurumları"
    ],
    process: [
      "Çalışan sayısı, vardiya yapısı ve kapı analizi",
      "Biometrik veya kartlı terminal montajı",
      "PDKS raporlama yazılımı kurulumu",
      "İK ve muhasebe departmanlarına sistem eğitimi"
    ],
    faqs: [
      {
        question: "Yazılım entegrasyonu var mı?",
        answer: "Evet, PDKS cihazlarımız ve yazılımımız piyasadaki popüler ön muhasebe ve İK programlarıyla veri alışverişi yapabilmektedir."
      },
      {
        question: "Biyometrik verilerin saklanması KVKK'ya uygun mu?",
        answer: "Cihazlarımız parmak izi veya yüz resmini değil, bu verilerden türetilen matematiksel şablon kodlarını saklar. Bu şablonlardan geri fotoğraf üretilemez, bu yönüyle KVKK uyumluluğu kolaylaşır."
      }
    ],
    introTitle: "Verimli İş Gücü Yönetimi: Personel Takip PDKS",
    introContent: "Personel Takip (PDKS) sistemleri, işletmelerde çalışma disiplinini sağlarken bordro ve hak ediş hesaplamalarını hatasız yapmanızı sağlar. PrimeSec PDKS Çözümleri, temassız ve hızlı yüz tanıma teknolojisi sayesinde personelin kuyruk oluşturmadan hızlıca geçiş yapmasına olanak tanır.\n\nYazılımımız üzerinden vardiya planlamaları yapabilir, izinleri ve resmi tatilleri sisteme girerek ay sonunda tek tuşla maaş bordrosuna esas raporlar alabilirsiniz.",
    deepDive: [
      {
        title: "Hızlı Temassız Yüz Tanıma",
        text: "Maske veya gözlük olsa dahi personeli 0.2 saniye gibi rekor bir sürede tanıyarak hızlı geçiş imkanı sunar."
      },
      {
        title: "KVKK Uyumlu Güvenli Şifreleme",
        text: "Biyometrik bilgileri şifreli veri şablonlarına dönüştürerek saklar; kişisel verilerin korunması kanununa tam uyumludur."
      },
      {
        title: "Esnek Vardiya ve Mesai Hesaplama",
        text: "Gece vardiyaları, esnek çalışma saatleri ve parça başı fazla mesaileri işletmenizin kurallarına göre hesaplar."
      }
    ]
  },
  {
    slug: "kapi-gecis-sistemleri",
    title: "Kapı Geçiş Sistemleri",
    metaTitle: "Kapı Geçiş Sistemleri | PrimeSec Teknoloji",
    description: "Kartlı geçiş, şifreli erişim ve turnike entegrasyonlarıyla kontrollü alan güvenliği sağlayın.",
    heroImage: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80",
    category: "Kapı Geçiş Sistemleri",
    keywords: ["Kartlı geçiş", "Turnike sistemi", "Manyetik kilit", "Geçiş kontrol"],
    benefits: [
      "Yetkisiz kişilerin kritik odalara girişini kesin olarak engelleme",
      "Personel bazında oda ve saat bazlı geçiş yetkilendirmesi",
      "Kapıların açık kalma durumlarının yazılımdan uzaktan izlenebilmesi",
      "Yangın ve deprem gibi acil durumlarda kilitlerin otomatik serbest kalması"
    ],
    useCases: [
      "Server odaları ve bilgi işlem merkezleri",
      "Yönetici ve muhasebe departman ofisleri",
      "Değerli evrak ve malzeme depoları",
      "Apartman, site ve residence ana giriş kapıları"
    ],
    process: [
      "Kapı yapısının (cam, ahşap, demir) ve kilit tipinin analizi",
      "Kart okuyucu, turnike ve manyetik kilit montajı",
      "Yazılımdan geçiş grupları ve yetki tanımları",
      "Acil çıkış buton entegrasyonu ve testler"
    ],
    faqs: [
      {
        question: "Elektrik kesilirse kapılar kilitli mi kalır?",
        answer: "Sistemde akü yedeklemesi bulunur. Akü bitse dahi acil çıkış butonları veya mekanik kollar kapıyı içeriden her zaman açacak şekilde tasarlanır."
      },
      {
        question: "Kart yerine telefonla geçiş yapılabilir mi?",
        answer: "Evet, Bluetooth veya NFC destekli okuyucularımız sayesinde kullanıcılar akıllı telefonlarını okutarak da geçiş yapabilirler."
      }
    ],
    introTitle: "Kontrollü Alanlar: Geçiş Kontrol Sistemleri",
    introContent: "Kapı Geçiş Sistemleri, işletmelerde veya sitelerde 'kimin, nereye, ne zaman' girebileceğini belirlemenizi sağlar. PrimeSec olarak, cam kapılar için elektromanyetik kilitler, ahşap kapılar için solenoid kilitler ve kurumsal girişler için turnike sistemleri kuruyoruz.\n\nTüm geçiş hareketleri merkezi yazılımda loglanır. Hangi kartın saat kaçta server odasına girmeye çalıştığını anlık olarak izleyebilir ve yetkisiz kart denemelerinde sistemin alarm vermesini sağlayabilirsiniz.",
    deepDive: [
      {
        title: "Elektromanyetik Kilit Çözümleri",
        text: "300 kg ila 500 kg tutma gücüne sahip profesyonel mıknatıslı kilitlerle kapıların zorlanarak açılmasını önler."
      },
      {
        title: "Oda ve Zaman Bazlı Kısıtlama",
        text: "Temizlik görevlilerinin sadece belirli gün ve saatlerde, mühendislerin ise 7/24 belirli kapılardan geçmesini sağlar."
      },
      {
        title: "Merkezi Log ve Raporlama",
        text: "Hangi personelin hangi kapıları kullandığını, kapının ne kadar süre açık kaldığını yazılımdan izleyebilirsiniz."
      }
    ]
  },
  {
    slug: "network-cozumleri",
    title: "Network Çözümleri",
    metaTitle: "Network Çözümleri | PrimeSec Teknoloji",
    description: "Kamera, POS, ofis ve güvenlik cihazları için stabil network altyapısı tasarlıyor ve kuruyoruz.",
    heroImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
    category: "Network Çözümleri",
    keywords: ["Network kurulumu", "Yapısal kablolama", "Wi-Fi güçlendirme", "PrimeSec Network"],
    benefits: [
      "Yüksek veri akışı gerektiren cihazlar için kesintisiz ağ altyapısı",
      "Kameralar için özel olarak optimize edilmiş PoE network switchleri",
      "Geniş alanlarda kopma yaşatmayan kesintisiz Wi-Fi Roaming altyapısı",
      "Siber saldırılara karşı koruma sağlayan Firewall ve ağ güvenliği"
    ],
    useCases: [
      "Kurumsal plazalar ve geniş ofis alanları",
      "Fabrikalar, endüstriyel sahalar ve depolar",
      "Akıllı ev ve geniş arazi villa projeleri",
      "Oteller, kafeler ve restoran ortak kullanım ağları"
    ],
    process: [
      "Mevcut internet hızı, cihaz sayısı ve kapsama alanı keşfi",
      "Kabinet, patch panel ve kablolama güzergahı tasarımı",
      "Switch, Firewall ve Access Point montajı",
      "Roaming kararlılık ve hız testleri"
    ],
    faqs: [
      {
        question: "Wi-Fi Roaming nedir?",
        answer: "Roaming, evde veya ofiste dolaşırken internetinizin kesilmeden en yakın sinyal veren Access Point cihazına otomatik ve hissettirmeden geçiş yapmasıdır."
      },
      {
        question: "Kablolama neden önemlidir?",
        answer: "Doğru kategoriye (Cat6/Cat7) sahip kaliteli kablolar, sinyal kaybını ve parazitleri önleyerek ağ hızınızı ve kamera görüntülerinin akıcılığını doğrudan etkiler."
      }
    ],
    introTitle: "Güvenli ve Kesintisiz Ağ Altyapısı: Network Çözümleri",
    introContent: "Kamera sistemlerinin akıcı çalışması, akıllı ev cihazlarının hızlı yanıt vermesi ve ofis içi dosya paylaşımı tamamen alt ağın (network) kalitesine bağlıdır. PrimeSec Network Çözümleriyle, kablolamadan başlayarak switch konfigürasyonlarına, IP dağılımlarından firewall ayarlarına kadar profesyonel ağ projeleri tasarlıyoruz.\n\nGeniş alanlarda 'sinyal çekmiyor' sorununu ortadan kaldırmak için, tek SSID üzerinden çalışan kesintisiz Access Point altyapıları kuruyoruz.",
    deepDive: [
      {
        title: "Kesintisiz Wi-Fi Roaming (Geçiş)",
        text: "Evinizde veya şirketinizde yürürken telefonunuz ağdan kopmaz; en güçlü sinyale sahip Access Point'e arka planda geçer."
      },
      {
        title: "Gelişmiş Cat6/Cat7 Yapısal Kablolama",
        text: "Yüksek hızlı ve parazitsiz veri transferi için standartlara uygun kablo kanalları ve patch paneller kullanıyoruz."
      },
      {
        title: "Siber Güvenlik ve Firewall Yönetimi",
        text: "Şirket verilerinizi dışarıdan gelebilecek siber saldırılara karşı koruyan gelişmiş güvenlik duvarı cihazları konumlandırıyoruz."
      }
    ]
  },
  {
    slug: "arac-kamerasi",
    title: "Araç Kamerası",
    metaTitle: "Araç Kamerası | PrimeSec Teknoloji",
    description: "Araç içi ve dışı kayıt çözümleriyle yolculuklarınızı ve filonuzu kayıt altında tutun.",
    heroImage: "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80",
    category: "Araç Kamerası",
    keywords: ["Araç kamerası", "Araç içi kayıt", "Mobil DVR", "Taksi kamerası"],
    benefits: [
      "Yolculukların 7/24 kesintisiz yüksek çözünürlüklü kaydı",
      "G-Sensör (darbe sensörü) yardımıyla kaza anını otomatik kilitleme",
      "Hem araç içini hem de yol durumunu kaydeden çift yönlü çekim",
      "Entegre GPS modülüyle videoya hız ve konum verilerini damgalama"
    ],
    useCases: [
      "Ticari taksiler ve toplu taşıma araçları",
      "Lojistik tırları ve kargo kamyonları",
      "Bireysel binek otomobiller ve motosikletler",
      "Okul servisleri ve personel taşıma minibüsleri"
    ],
    process: [
      "Araç içi doğru kamera açısı ve görüş alanı tespiti",
      "Kamera ve mobil kayıt cihazının (MDVR) montajı",
      "Gizli döşeme altı kablolama ve sigorta bağlantıları",
      "Kayıt kararlılığı ve mobil erişim testleri"
    ],
    faqs: [
      {
        question: "Araç kamerası aküyü bitirir mi?",
        answer: "Hayır, akü koruma modüllerimiz sayesinde araç stop ettiğinde voltaj belirli bir seviyenin altına düşerse kamera enerjiyi otomatik keser."
      },
      {
        question: "Kaza anı kayıtları silinir mi?",
        answer: "Hayır, G-Sensör (darbe sensörü) sarsıntı algıladığı anda o ana ait videoyu ayrı bir klasöre kilitler ve döngüsel kayıt sırasında üzerine yazılmasını engeller."
      }
    ],
    introTitle: "Yol Güvenliği ve Kanıt: Profesyonel Araç Kameraları",
    introContent: "Araç kameraları, trafikte karşılaşabileceğiniz olumsuz durumlarda, kazalarda ve sigorta süreçlerinde en büyük hukuki kanıtınızdır. PrimeSec Araç Kamerası Çözümleri, sadece ön camı değil, araç içini ve arka yolu da kaydeden çok yönlü kamera yapılandırmaları sunar.\n\nFilo sahipleri için sunduğumuz mobil DVR (MDVR) çözümlerimiz sayesinde, merkez ofisinizden tüm araçların canlı kameralarını harita konumuyla birlikte gerçek zamanlı izleyebilirsiniz.",
    deepDive: [
      {
        title: "Mobil DVR ile Uzaktan Canlı İzleme",
        text: "Araç içine kurulan SIM kartlı kayıt ünitesi yardımıyla aracın canlı görüntüsünü internetten izleyebilir ve indirebilirsiniz."
      },
      {
        title: "Darbe Sensörlü Akıllı Koruma",
        text: "Park halindeyken dahi araca bir darbe geldiğinde kamerayı uyandırıp kayıt başlatarak faili meçhul hasarları önler."
      },
      {
        title: "Geniş Açı ve Yüksek Gece Görüşü",
        text: "140 derece ve üzeri geniş lensler sayesinde yan şeritleri de kapsar, WDR teknolojisiyle gece tabela ve plakaları net okur."
      }
    ]
  },
  {
    slug: "ip-diafon-sistemleri",
    title: "IP Diafon Sistemleri",
    metaTitle: "IP Diafon Sistemleri | PrimeSec Teknoloji",
    description: "Apartman, site ve ofisler için görüntülü IP diafon ve interkom sistemleri kuruyoruz.",
    heroImage: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=800&q=80",
    category: "IP Diafon Sistemleri",
    keywords: ["IP diafon", "Görüntülü diafon", "Villa diafon", "Apartman interkom"],
    benefits: [
      "Evde olmasanız dahi zilinizi çalan kişiyi telefondan görüntülü yanıtlama",
      "Daireler, güvenlik odası ve kapıcı arasında sınırsız ücretsiz görüşme",
      "Dış zil panelinden şifre, RFID kart veya yüz tanıma ile anahtarsız geçiş",
      "Daire içi monitörden IP güvenlik kameralarını canlı izleyebilme"
    ],
    useCases: [
      "Toplu konut projeleri, siteler ve apartmanlar",
      "Müstakil lüks villalar ve özel mülkler",
      "Girişi sınırlandırılmış kurumsal ofis ve plazalar",
      "Rezidans projeleri ve konsiyerj bağlantılı binalar"
    ],
    process: [
      "Binadaki mevcut kablo altyapısının (Cat6) incelenmesi",
      "Dış kapı zil paneli ve daire içi ekran monitör montajları",
      "Ağ switch yapılandırması ve daire numarası eşleştirmeleri",
      "Mobil uygulama aktivasyonu ve ses/görüntü testleri"
    ],
    faqs: [
      {
        question: "Evde yokken zil çalarsa ne olur?",
        answer: "Zil çaldığında cep telefonunuza anlık arama gelir. Ziyaretçiyle görüntülü konuşabilir ve isterseniz kapıyı uzaktan açabilirsiniz."
      },
      {
        question: "Eski kablolar kullanılabilir mi?",
        answer: "IP diafon sistemleri Cat6 network kablosu ile çalışır. Eski analog kablolama varsa, özel dönüştürücülerle veya kablo yenilemeyle kurulum yapılır."
      }
    ],
    introTitle: "Görüntülü İletişim ve Güvenlik: IP Diafon",
    introContent: "IP Diafon ve interkom sistemleri, bina giriş güvenliğini tamamen dijitalleştirir. PrimeSec IP interkom çözümleri, dairenizin içine kurulan şık dokunmatik ekranlar üzerinden sadece kapıyı açmanızı sağlamaz; sitenin ortak alan kameralarını izlemenize ve güvenlikle mesajlaşmanıza da imkan tanır.\n\nMisafiriniz geldiğinde ve siz evde yokken çalan zil cep telefonunuza yönlenir, misafirinizle görüntülü konuşarak kapıyı açabilirsiniz.",
    deepDive: [
      {
        title: "Akıllı Telefon Yönlendirmesi",
        text: "Zil çaldığında dünyanın neresinde olursanız olun telefonunuza çağrı düşer, görüntülü görüşüp kapıyı açabilirsiniz."
      },
      {
        title: "Anahtarsız Şifreli ve Kartlı Geçiş",
        text: "Dış zil paneline tanımlı RFID anahtarlıklar, şifreler veya yüz tanıma özelliğiyle kapınızı anahtarsız açarsınız."
      },
      {
        title: "Kameralarla Entegre Ekran",
        text: "Daire içi monitörünüz üzerinden otoparkı, çocuk parkını veya kapı önündeki kameraları tek dokunuşla canlı izleyebilirsiniz."
      }
    ]
  },
  {
    slug: "restoran-pos-yazilimi",
    title: "Restoran POS Yazılımı",
    metaTitle: "Restoran POS Yazılımı | PrimeSec Teknoloji",
    description: "Restoran ve kafeler için sipariş, masa, ödeme ve operasyon yönetimini hızlandıran POS çözümleri.",
    heroImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
    category: "Restoran POS Yazılımı",
    keywords: ["Restoran POS", "Adisyon yazılımı", "Restoran otomasyonu", "Mobil sipariş"],
    benefits: [
      "Çok hızlı sipariş alma, adisyon açma ve masa taşıma işlemleri",
      "Garson tabletleri ile masadan doğrudan mutfak yazıcısına sipariş",
      "Hassas stok takibi, ürün reçeteleri ve hammadde düşüm kontrolleri",
      "Yemeksepeti, Trendyol Yemek, Getir Yemek entegrasyonuyla tek ekran kontrolü"
    ],
    useCases: [
      "Alakart restoranlar, kafeler ve pastaneler",
      "Hızlı tüketim (Fast-Food) ve paket servis noktaları",
      "Barlar, publar, gece kulüpleri ve eğlence merkezleri",
      "Kahve dükkanları ve fırın zincirleri"
    ],
    process: [
      "İşletmenin iş akışı, masa düzeni ve yazıcı noktalarının analizi",
      "Dokunmatik terminallerin, termal yazıcıların ve tabletlerin montajı",
      "Menü, fiyat listesi ve stok/reçete verilerinin sisteme girilmesi",
      "Kasa ve garson personeline uygulamalı kullanım eğitimleri"
    ],
    faqs: [
      {
        question: "İnternet kesildiğinde sistem durur mu?",
        answer: "Hayır, POS sistemimiz lokal sunucu mimarisiyle çalıştığı için internet kesilse de işletme içi sipariş ve adisyon süreci kesintisiz devam eder."
      },
      {
        question: "Bulut tabanlı raporlama var mı?",
        answer: "Evet, patron paneli sayesinde şubelerinizin ciro, stok ve satış raporlarını cep telefonunuzdan veya webden anlık izleyebilirsiniz."
      }
    ],
    introTitle: "İşletmenizi Hızlandırın: Restoran POS Çözümleri",
    introContent: "Hızlı servis ve doğru hesap yönetimi, restoran işletmeciliğinde başarının anahtarıdır. PrimeSec Restoran POS Otomasyonu, karmaşık adisyon süreçlerini basitleştirir. Garson el terminallerinden girilen bir sipariş anında mutfaktaki yazıcıdan veya ekrandan çıkar, böylece sipariş kayıpları ve zaman gecikmeleri tamamen sıfırlanır.\n\nEntegre paket servis modülü sayesinde arayan müşteriyi tanır, eski siparişlerini görebilir ve hızlıca paket adisyonu açabilirsiniz.",
    deepDive: [
      {
        title: "Mutfak Yazıcı ve Ekran Entegrasyonu",
        text: "Sipariş alındığı anda içecekler bara, yemekler mutfak yazıcısına ayrı ayrı yönlenerek servis karmaşasını önler."
      },
      {
        title: "Detaylı Reçete ve Hammadde Takibi",
        text: "Satılan her porsiyonda reçeteye göre un, et, sebze gibi hammaddeleri stoktan otomatik düşer ve fire takibi sağlar."
      },
      {
        title: "Yemek Platformları ile Entegre",
        text: "Trendyol, Getir ve Yemeksepeti siparişlerini tek bir POS ekranında toplar, otomatik onaylar ve adisyona işler."
      }
    ]
  }
];

export function getServiceProducts(category: string) {
  return products.filter((product) => product.category === category).slice(0, 4);
}
