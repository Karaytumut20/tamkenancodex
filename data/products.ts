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
    image: "/images/alarm-sistemi.svg",
    tags: ["En Popüler", "Kablosuz", "Mobil Uyumlu"],
    features: [
      { title: "Mobil uygulama kontrolü", description: "" },
      { title: "Kameralı doğrulama", description: "" },
      { title: "Anında bildirim", description: "" },
      { title: "Genişletilebilir sensör yapısı", description: "" },
    ],
    specs: [
      { title: "Bağlantı", description: "Wi-Fi / GSM" },
      { title: "Garanti", description: "2 Yıl" },
      { title: "Kullanım", description: "Ev ve iş yeri" },
      { title: "Kurulum", description: "Profesyonel montaj" }
    ],
    benefits: [],
    faqs: [
      { question: "PrimeSec Plus internetsiz çalışır mı?", answer: "GSM yedekleme ile kritik bildirimler internet kesintilerinde de sürdürülebilir." },
      { question: "Paket genişletilebilir mi?", answer: "Evet, manyetik kontak, panik butonu, su baskını ve kamera seçenekleri eklenebilir." },
    ],
  },
  {
    slug: "hikvision-cctv-kamera-sistemi",
    name: "Hikvision CCTV Kamera Sistemi",
    code: "HK-CCTV-4MP",
    category: "Kamera Sistemleri",
    brand: "Hikvision",
    usage: ["Ev", "İş Yeri", "Depo"],
    description: "Yüksek çözünürlüklü kayıt, gece görüşü ve uzaktan izleme özellikli CCTV kamera sistemi.",
    image: "/images/kamera-sistemi.svg",
    tags: ["CCTV Kamera", "Gece Görüşü", "Uzaktan İzleme"],
    features: [
      { title: "4MP net görüntü", description: "" },
      { title: "NVR/DVR kayıt", description: "" },
      { title: "Mobil izleme", description: "" },
      { title: "Dış mekan dayanımı", description: "" },
    ],
    specs: [
      { title: "Çözünürlük", description: "4MP" },
      { title: "Kayıt", description: "NVR/DVR" },
      { title: "Garanti", description: "2 Yıl" },
      { title: "Marka", description: "Hikvision" }
    ],
    benefits: [],
    faqs: [{ question: "CCTV kamera uzaktan izlenebilir mi?", answer: "Evet, mobil uygulama ile canlı ve geçmiş kayıtlar takip edilebilir." }],
  },
  {
    slug: "dahua-ip-kamera-sistemi",
    name: "Dahua IP Kamera Sistemi",
    code: "DH-IP-5MP",
    category: "Kamera Sistemleri",
    brand: "Dahua",
    usage: ["İş Yeri", "Site", "Mağaza"],
    description: "IP tabanlı yüksek çözünürlüklü güvenlik kamerası ve kayıt altyapısı.",
    image: "/images/kamera-sistemi.svg",
    tags: ["IP Kamera", "PoE", "Akıllı Analiz"],
    features: [
      { title: "PoE ile kolay kurulum", description: "" },
      { title: "Hareket algılama", description: "" },
      { title: "Yüksek çözünürlük", description: "" },
      { title: "Uzaktan kayıt erişimi", description: "" },
    ],
    specs: [
      { title: "Çözünürlük", description: "5MP" },
      { title: "Bağlantı", description: "PoE" },
      { title: "Marka", description: "Dahua" },
      { title: "Kullanım", description: "Profesyonel" }
    ],
    benefits: [],
    faqs: [{ question: "IP kamera ile CCTV farkı nedir?", answer: "IP kameralar ağ üzerinden çalışır ve esnek kurulum imkanı sunar." }],
  },
  {
    slug: "akilli-video-takip-sistemi",
    name: "Akıllı Video Takip Sistemi",
    code: "PS-VIDEO-AI",
    category: "Akıllı Ev Sistemleri",
    brand: "PrimeSec",
    usage: ["Ev", "İş Yeri"],
    description: "Hareket algılama, akıllı bildirim ve canlı izleme özellikli video güvenlik çözümü.",
    image: "/images/akilli-ev.svg",
    tags: ["Akıllı Video", "Anında Bildirim"],
    features: [
      { title: "Canlı izleme", description: "" },
      { title: "Akıllı hareket analizi", description: "" },
      { title: "Bulut uyumlu kayıt", description: "" },
      { title: "Mobil bildirim", description: "" },
    ],
    specs: [
      { title: "Bağlantı", description: "Wi-Fi" },
      { title: "Bildirim", description: "Mobil" },
      { title: "Garanti", description: "2 Yıl" },
      { title: "Platform", description: "iOS / Android" }
    ],
    benefits: [],
    faqs: [{ question: "Akıllı video alarm ile çalışır mı?", answer: "Evet, alarm tetiklerinde video doğrulama için entegre edilebilir." }],
  },
  {
    slug: "akilli-zil",
    name: "Akıllı Zil",
    code: "PS-DOORBELL",
    category: "Akıllı Ev Sistemleri",
    brand: "PrimeSec",
    usage: ["Ev", "Ofis"],
    description: "Kapınıza gelenleri mobil cihazdan görmenizi ve konuşmanızı sağlayan akıllı zil.",
    image: "/images/akilli-ev.svg",
    tags: ["Görüntülü", "Mobil"],
    features: [
      { title: "Çift yönlü ses", description: "" },
      { title: "Gece görüşü", description: "" },
      { title: "Hareket algılama", description: "" },
      { title: "Mobil bildirim", description: "" },
    ],
    specs: [
      { title: "Bağlantı", description: "Wi-Fi" },
      { title: "Ses", description: "Çift yönlü" },
      { title: "Görüntü", description: "HD" },
      { title: "Kullanım", description: "İç/dış kapı" }
    ],
    benefits: [],
    faqs: [{ question: "Akıllı zil telefona bildirim gönderir mi?", answer: "Evet, kapı hareketlerinde ve zil çaldığında anlık bildirim gönderir." }],
  },
  {
    slug: "manyetik-kontak-alarm-sensoru",
    name: "Manyetik Kontak Alarm Sensörü",
    code: "PS-MAG-01",
    category: "Alarm Sistemleri",
    brand: "PrimeSec",
    usage: ["Kapı", "Pencere"],
    description: "Kapı ve pencere açılışlarını algılayan kablosuz alarm sensörü.",
    image: "/images/manyetik-kontak.svg",
    tags: ["Sensör", "Kablosuz"],
    features: [
      { title: "Kolay montaj", description: "" },
      { title: "Düşük pil tüketimi", description: "" },
      { title: "Anında alarm", description: "" },
      { title: "Kapı/pencere uyumu", description: "" },
    ],
    specs: [
      { title: "Bağlantı", description: "Kablosuz" },
      { title: "Pil", description: "Uzun ömürlü" },
      { title: "Kullanım", description: "Kapı/Pencere" },
      { title: "Garanti", description: "2 Yıl" }
    ],
    benefits: [],
    faqs: [{ question: "Manyetik kontak nereye takılır?", answer: "Kapı ve pencerelerin açılır kanatlarına profesyonel şekilde monte edilir." }],
  },
  {
    slug: "su-baskini-alarmi",
    name: "Su Baskını Alarmı",
    code: "PS-WATER-01",
    category: "Alarm Sistemleri",
    brand: "PrimeSec",
    usage: ["Ev", "Mutfak", "Banyo"],
    description: "Su kaçağı ve baskın riskini erken algılayan akıllı güvenlik sensörü.",
    image: "/images/alarm-sistemi.svg",
    tags: ["Su Baskını", "Akıllı Sensör"],
    features: [
      { title: "Erken uyarı", description: "" },
      { title: "Mobil bildirim", description: "" },
      { title: "Kablosuz çalışma", description: "" },
      { title: "Alarm entegrasyonu", description: "" },
    ],
    specs: [
      { title: "Bağlantı", description: "Kablosuz" },
      { title: "Bildirim", description: "Mobil" },
      { title: "Kullanım", description: "Islak hacimler" },
      { title: "Garanti", description: "2 Yıl" }
    ],
    benefits: [],
    faqs: [{ question: "Su baskını alarmı nerede kullanılmalı?", answer: "Banyo, mutfak, kombi ve tesisat riski olan alanlarda önerilir." }],
  },
  {
    slug: "yangin-ihbar-dedektoru",
    name: "Yangın İhbar Dedektörü",
    code: "PS-FIRE-01",
    category: "Yangın İhbar Sistemleri",
    brand: "Teknim",
    usage: ["Ev", "İş Yeri", "Depo"],
    description: "Duman ve yangın risklerini erken algılayan güvenilir yangın ihbar dedektörü.",
    image: "/images/yangin-alarm.svg",
    tags: ["Yangın İhbar", "Duman Dedektörü"],
    features: [
      { title: "Hızlı algılama", description: "" },
      { title: "Alarm paneli uyumu", description: "" },
      { title: "Düşük bakım", description: "" },
      { title: "Yüksek hassasiyet", description: "" },
    ],
    specs: [
      { title: "Tip", description: "Duman dedektörü" },
      { title: "Kullanım", description: "İç mekan" },
      { title: "Garanti", description: "2 Yıl" },
      { title: "Marka", description: "Teknim" }
    ],
    benefits: [],
    faqs: [{ question: "Yangın alarmı zorunlu mudur?", answer: "Birçok işletme türünde mevzuat ve sigorta şartları açısından kritik bir güvenlik kalemidir." }],
  },
  {
    slug: "pdks-personel-takip-terminali",
    name: "PDKS Personel Takip Terminali",
    code: "PS-PDKS-01",
    category: "Personel Takip PDKS",
    brand: "Inox",
    usage: ["İş Yeri", "Fabrika", "Ofis"],
    description: "Personel giriş çıkışlarını kart, şifre veya biyometrik doğrulama ile izleyen PDKS çözümü.",
    image: "/images/pdks.svg",
    tags: ["PDKS", "Biyometrik", "Raporlama"],
    features: [
      { title: "Detaylı rapor", description: "" },
      { title: "Kartlı geçiş", description: "" },
      { title: "Biyometrik seçenek", description: "" },
      { title: "Bordro entegrasyonuna hazır", description: "" },
    ],
    specs: [
      { title: "Doğrulama", description: "Kart / Parmak izi" },
      { title: "Rapor", description: "Var" },
      { title: "Kullanım", description: "İşletme" },
      { title: "Garanti", description: "2 Yıl" }
    ],
    benefits: [],
    faqs: [{ question: "PDKS bordro ile entegre olur mu?", answer: "Uygun yazılım altyapısı ile bordro süreçlerine veri sağlayabilir." }],
  },
  {
    slug: "network-altyapi-cozumu",
    name: "Network Altyapı Çözümü",
    code: "PS-NET-01",
    category: "Network Çözümleri",
    brand: "UNV",
    usage: ["İş Yeri", "Kamera Altyapısı", "Ofis"],
    description: "Kamera, alarm, POS ve ofis cihazları için güvenilir ağ altyapısı kurulumu.",
    image: "/images/network.svg",
    tags: ["Network", "Altyapı", "Kablolama"],
    features: [
      { title: "Keşif ve planlama", description: "" },
      { title: "Yapısal kablolama", description: "" },
      { title: "Switch kurulumu", description: "" },
      { title: "Performans testi", description: "" },
    ],
    specs: [
      { title: "Kapsam", description: "Keşif + kurulum" },
      { title: "Kullanım", description: "Kurumsal" },
      { title: "Test", description: "Var" },
      { title: "Garanti", description: "Proje bazlı" }
    ],
    benefits: [],
    faqs: [{ question: "Kamera sistemi için network gerekir mi?", answer: "IP kamera ve uzaktan izleme altyapılarında doğru network planı performansı doğrudan etkiler." }],
  },
];

export const productCategories = Array.from(new Set(products.map((product) => product.category)));
export const brands = ["Hikvision", "Dahua", "TTEC", "UNV", "Xmeye", "Reolink", "Inox", "Paradox", "DSC", "Teknim", "Ajax"];
