import type { ServicePage } from "@/data/services";

const locationEntries = [
  ["pendik-alarm-sistemleri", "Pendik Alarm Sistemleri", "Pendik bölgesindeki ev, villa, ofis ve iş yerleriniz için 7/24 kesintisiz koruma sunan hırsız alarm ve yangın ihbar sistemlerinin kurulumu ve satış sonrası desteği.", "Pendik", "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80"],
  ["tuzla-kamera-sistemleri", "Tuzla Kamera Sistemleri", "Tuzla bölgesindeki fabrikalar, endüstriyel tesisler, depolar ve konut projeleri için profesyonel IP/CCTV kamera sistemleri projelendirme ve montaj hizmetleri.", "Tuzla", "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80"],
  ["kartal-guvenlik-sistemleri", "Kartal Güvenlik Sistemleri", "Kartal bölgesinde entegre alarm, kamera, PDKS (personel takip), kartlı geçiş ve network altyapı çözümlermi tek çatı altında planlayıp hayata geçiriyoruz.", "Kartal", "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80"],
  ["kocaeli-alarm-sistemleri", "Kocaeli Alarm Sistemleri", "Kocaeli'de ev ve iş yerleri için alarm, kamera ve akıllı güvenlik sistemlerinde keşif ve teklif alın.", "Kocaeli"],
  ["kocaeli-kamera-sistemleri", "Kocaeli Kamera Sistemleri", "Kocaeli kamera sistemleri kurulumu için CCTV, IP kamera ve uzaktan izleme çözümlerini PrimeSec ile planlayın.", "Kocaeli"],
  ["kocaeli-guvenlik-sistemleri", "Kocaeli Güvenlik Sistemleri", "Kocaeli güvenlik sistemleri için alarm, kamera, yangın ihbar, PDKS ve network çözümlerini tek yerden alın.", "Kocaeli"],
  ["istanbul-alarm-sistemleri", "İstanbul Alarm Sistemleri", "İstanbul'da daire, villa, mağaza ve ofisler için akıllı alarm sistemleri ve hızlı kurulum desteği.", "İstanbul"],
  ["istanbul-kamera-sistemleri", "İstanbul Kamera Sistemleri", "İstanbul kamera sistemleri kurulumunda IP kamera, CCTV ve kayıt altyapısı için profesyonel keşif.", "İstanbul"],
  ["istanbul-guvenlik-sistemleri", "İstanbul Güvenlik Sistemleri", "İstanbul güvenlik sistemleri için alarm, kamera ve akıllı ev çözümlerini entegre şekilde kuruyoruz.", "İstanbul"],
  ["gebze-alarm-sistemleri", "Gebze Alarm Sistemleri", "Gebze alarm sistemleri için iş yeri, depo, fabrika ve evlere özel güvenlik projeleri hazırlıyoruz.", "Gebze"],
  ["gebze-kamera-sistemleri", "Gebze Kamera Sistemleri", "Gebze kamera sistemleri kurulumu için yüksek çözünürlüklü CCTV ve IP kamera seçeneklerini inceleyin.", "Gebze"],
  ["izmit-alarm-sistemleri", "İzmit Alarm Sistemleri", "İzmit alarm sistemleriyle ev, mağaza ve ofislerinizi mobil bildirimli güvenlik altyapısıyla koruyun.", "İzmit"],
  ["izmit-kamera-sistemleri", "İzmit Kamera Sistemleri", "İzmit kamera sistemleri kurulumunda keşif, doğru kamera konumu ve uzaktan izleme desteği.", "İzmit"],
  ["darica-guvenlik-sistemleri", "Darıca Güvenlik Sistemleri", "Darıca güvenlik sistemleri için alarm, kamera ve akıllı çözümleri bölgenizin ihtiyacına göre planlayın.", "Darıca"],
  ["cayirova-kamera-sistemleri", "Çayırova Kamera Sistemleri", "Çayırova kamera sistemleri için mağaza, depo ve üretim alanlarına uygun CCTV/IP kamera çözümleri.", "Çayırova"],
  ["maltepe-alarm-sistemleri", "Maltepe Alarm Sistemleri", "Maltepe alarm sistemleri kurulumunda daire, villa ve iş yerlerine özel güvenlik planı oluşturun.", "Maltepe"],
];

export const locations: ServicePage[] = locationEntries.map(([slug, title, description, city, customHeroImage]) => ({
  slug,
  title,
  metaTitle: `${title} | PrimeSec Teknoloji`,
  description,
  heroImage: customHeroImage || (slug.includes("kamera") ? "/images/kamera-sistemi.svg" : "/images/local-security.svg"),
  category: slug.includes("kamera") ? "Kamera Sistemleri" : (slug.includes("alarm") ? "Alarm Sistemleri" : "Güvenlik Sistemleri"),
  keywords: [title, `${city} güvenlik sistemleri`, "PrimeSec Teknoloji"],
  benefits: [
    `${city} ve çevresine hızlı keşif planı`,
    "Ev ve iş yeri için ayrı risk analizi",
    "Alarm, kamera ve akıllı sistem entegrasyonu",
    "Kurulum sonrası teknik destek",
  ],
  useCases: [`${city} konut projeleri`, `${city} mağaza ve ofisleri`, "Depo, üretim ve ortak alanlar", "Kamu kurumları ve okul projeleri"],
  process: ["Bölge ihtiyacının analizi", "Ürün ve kamera/sensör planı", "Kurulum ve mobil ayarlar", "Bakım ve destek"],
  faqs: [
    { question: `${city} için keşif süreci nasıl ilerler?`, answer: "İhtiyaç bilgilerinizi aldıktan sonra uygun gün ve saat için keşif planı oluştururuz." },
    { question: "Yerel servis desteği var mı?", answer: "PrimeSec Teknoloji yakın hizmet ağında kurulum ve satış sonrası destek sağlar." },
  ],
}));
