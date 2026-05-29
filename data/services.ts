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
  useCases: string[];
  process: string[];
  faqs: { question: string; answer: string }[];
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
    heroImage: "/images/alarm-sistemi.svg",
    category: "Alarm Sistemleri",
    keywords: ["Hırsız alarm", "Alarm sistemleri", "Ev güvenlik sistemleri"],
    benefits: ["7/24 algılama ve caydırıcılık", "Mobil uygulama ile uzaktan kontrol", "Mekana göre sensör planı", "Kablolu ve kablosuz seçenekler"],
    useCases: ["Daire ve villa güvenliği", "Mağaza ve ofis alarmı", "Depo ve atölye güvenliği"],
    process: ["Ücretsiz keşif", "Risk analizi", "Kurulum ve test", "Kullanım eğitimi"],
    faqs: baseFaq("Alarm sistemleri"),
  },
  {
    slug: "alarm-sistemleri/ev-alarm-sistemleri",
    title: "Ev Alarm Sistemleri",
    metaTitle: "Ev Alarm Sistemleri | PrimeSec Teknoloji",
    description: "Daire, villa, bahçe katı ve yazlıklar için akıllı ev alarm sistemleriyle sevdiklerinizi 7/24 koruyun.",
    heroImage: "/images/alarm-sistemi.svg",
    category: "Alarm Sistemleri",
    keywords: ["Ev alarm sistemleri", "Ev güvenlik sistemleri"],
    benefits: ["Kapı ve pencere koruması", "Su baskını ve yangın sensörü ekleme", "Akıllı zil ve kamera entegrasyonu", "Kullanımı kolay mobil kontrol"],
    useCases: ["Bahçe katı daireler", "Müstakil evler", "Uzun süre boş kalan evler"],
    process: ["Ev keşfi", "Kat ve giriş analizi", "Sensör planı", "Hızlı kurulum"],
    faqs: baseFaq("Ev alarm sistemleri"),
  },
  {
    slug: "alarm-sistemleri/is-yeri-alarm-sistemleri",
    title: "İş Yeri Alarm Sistemleri",
    metaTitle: "İş Yeri Alarm Sistemleri | PrimeSec Teknoloji",
    description: "Mağaza, ofis, depo ve atölyeler için hırsız alarm, kamera ve panik butonu entegre iş yeri güvenliği.",
    heroImage: "/images/alarm-sistemi.svg",
    category: "Alarm Sistemleri",
    keywords: ["İş yeri alarm sistemi", "İş yeri güvenlik sistemleri"],
    benefits: ["Mesai dışı güvenlik", "Panik butonu ve siren seçenekleri", "Kameralı alarm doğrulama", "Yetkilendirilmiş kullanıcı yönetimi"],
    useCases: ["Mağazalar", "Depolar", "Ofisler", "Klinikler"],
    process: ["İş yeri keşfi", "Risk ve giriş noktası analizi", "Kurulum", "Yetki tanımları"],
    faqs: baseFaq("İş yeri alarm sistemleri"),
  },
  {
    slug: "kamera-sistemleri",
    title: "Kamera Sistemleri",
    metaTitle: "Kamera Sistemleri | PrimeSec Teknoloji",
    description: "CCTV kamera, IP kamera, kayıt cihazı ve uzaktan izleme çözümleriyle alanlarınızı net ve kesintisiz izleyin.",
    heroImage: "/images/kamera-sistemi.svg",
    category: "Kamera Sistemleri",
    keywords: ["Kamera sistemleri", "CCTV kamera", "IP kamera"],
    benefits: ["Yüksek çözünürlüklü görüntü", "Gece görüşü ve hareket algılama", "Mobil canlı izleme", "Doğru kamera konumlandırma"],
    useCases: ["Ev kamera sistemi", "Mağaza kamera sistemi", "Site ve apartman kamera sistemi"],
    process: ["Kör nokta analizi", "Kamera planı", "Kablolama ve montaj", "Kayıt ve mobil ayar"],
    faqs: baseFaq("Kamera sistemleri"),
  },
  {
    slug: "kamera-sistemleri/cctv-kamera",
    title: "CCTV Kamera Sistemleri",
    metaTitle: "CCTV Kamera Sistemleri | PrimeSec Teknoloji",
    description: "CCTV kamera sistemleriyle ev, mağaza, depo ve ofisler için ekonomik ve güvenilir görüntü güvenliği sağlayın.",
    heroImage: "/images/kamera-sistemi.svg",
    category: "Kamera Sistemleri",
    keywords: ["CCTV kamera", "Güvenlik kamerası sistemleri"],
    benefits: ["Uygun maliyetli kayıt", "Dış mekan uyumlu kamera", "DVR kayıt altyapısı", "Mobil izleme"],
    useCases: ["Küçük işletmeler", "Apartman ortak alanları", "Dükkanlar"],
    process: ["Keşif", "Kamera seçimi", "DVR kurulumu", "Mobil izleme testi"],
    faqs: baseFaq("CCTV kamera sistemleri"),
  },
  {
    slug: "kamera-sistemleri/ip-kamera",
    title: "IP Kamera Sistemleri",
    metaTitle: "IP Kamera Sistemleri | PrimeSec Teknoloji",
    description: "PoE destekli IP kamera sistemleriyle yüksek çözünürlüklü, ölçeklenebilir ve akıllı video altyapısı kurun.",
    heroImage: "/images/kamera-sistemi.svg",
    category: "Kamera Sistemleri",
    keywords: ["IP kamera", "Network kamera"],
    benefits: ["PoE ile sade kurulum", "Yüksek çözünürlük", "Akıllı video analizi", "Esnek ağ mimarisi"],
    useCases: ["Fabrika ve depo", "Kurumsal ofis", "Site güvenliği"],
    process: ["Network analizi", "Kamera ve switch planı", "NVR kurulumu", "Performans testi"],
    faqs: baseFaq("IP kamera sistemleri"),
  },
  ...[
    ["akilli-ev-sistemleri", "Akıllı Ev Sistemleri", "Akıllı ev sistemleriyle güvenlik, konfor ve enerji yönetimini tek mobil ekranda birleştirin.", "/images/akilli-ev.svg", "Akıllı Ev Sistemleri"],
    ["yangin-ihbar-sistemleri", "Yangın İhbar Sistemleri", "Duman, ısı ve yangın risklerini erken algılayan profesyonel yangın ihbar çözümleri kuruyoruz.", "/images/yangin-alarm.svg", "Yangın İhbar Sistemleri"],
    ["arac-takip-sistemleri", "Araç Takip Sistemleri", "CanBus uyumlu araç takip çözümleriyle filonuzu canlı izleyin, raporlayın ve güvenle yönetin.", "/images/arac-takip.svg", "Araç Takip Sistemleri"],
    ["arac-kamerasi", "Araç Kamerası", "Araç içi ve dışı kayıt çözümleriyle yolculuklarınızı ve filonuzu kayıt altında tutun.", "/images/arac-takip.svg", "Araç Kamerası"],
    ["personel-takip-pdks", "Personel Takip PDKS", "Personel giriş çıkışlarını kartlı, şifreli veya biyometrik terminallerle güvenilir şekilde takip edin.", "/images/pdks.svg", "Personel Takip PDKS"],
    ["kapi-gecis-sistemleri", "Kapı Geçiş Sistemleri", "Kartlı geçiş, şifreli erişim ve turnike entegrasyonlarıyla kontrollü alan güvenliği sağlayın.", "/images/pdks.svg", "Kapı Geçiş Sistemleri"],
    ["ip-diafon-sistemleri", "IP Diafon Sistemleri", "Apartman, site ve ofisler için görüntülü IP diafon ve interkom sistemleri kuruyoruz.", "/images/akilli-ev.svg", "IP Diafon Sistemleri"],
    ["restoran-pos-yazilimi", "Restoran POS Yazılımı", "Restoran ve kafeler için sipariş, masa, ödeme ve operasyon yönetimini hızlandıran POS çözümleri.", "/images/network.svg", "Restoran POS Yazılımı"],
    ["network-cozumleri", "Network Çözümleri", "Kamera, POS, ofis ve güvenlik cihazları için stabil network altyapısı tasarlıyor ve kuruyoruz.", "/images/network.svg", "Network Çözümleri"],
  ].map(([slug, title, description, heroImage, category]) => ({
    slug,
    title,
    metaTitle: `${title} | PrimeSec Teknoloji`,
    description,
    heroImage,
    category,
    keywords: [title, "Güvenlik sistemleri", "PrimeSec Teknoloji"],
    benefits: ["Anahtar teslim proje yönetimi", "İhtiyaca uygun ürün seçimi", "Profesyonel kurulum", "Satış sonrası destek"],
    useCases: ["Evler", "İş yerleri", "Kurumsal alanlar", "Ortak kullanım alanları"],
    process: ["Keşif", "Projelendirme", "Kurulum", "Test ve teslim"],
    faqs: baseFaq(title),
  })),
];

export function getServiceProducts(category: string) {
  return products.filter((product) => product.category === category).slice(0, 4);
}
