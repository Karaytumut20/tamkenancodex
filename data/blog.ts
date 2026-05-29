export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  updatedAt: string;
  readTime: string;
  image: string;
  body: string[];
  faqs: { question: string; answer: string }[];
};

const titles = [
  ["ev-alarm-sistemi-secerken-nelere-dikkat-edilmeli", "Ev Alarm Sistemi Seçerken Nelere Dikkat Edilmeli?", "Alarm Sistemleri"],
  ["kocaeli-alarm-sistemleri-en-cok-tercih-edilen-cozumler", "Kocaeli Alarm Sistemleri İçin En Çok Tercih Edilen Çözümler", "Yerel Güvenlik Rehberleri"],
  ["istanbul-kamera-sistemleri-kurulum-rehberi", "İstanbul Kamera Sistemleri Kurulum Rehberi", "Kamera Sistemleri"],
  ["hikvision-kamera-sistemleri-nedir", "Hikvision Kamera Sistemleri Nedir?", "Kamera Sistemleri"],
  ["dahua-kamera-sistemleri-hangi-alanlarda-kullanilir", "Dahua Kamera Sistemleri Hangi Alanlarda Kullanılır?", "Kamera Sistemleri"],
  ["kablosuz-alarm-sistemi-avantajlari", "Kablosuz Alarm Sistemi Avantajları Nelerdir?", "Alarm Sistemleri"],
  ["is-yeri-alarm-sistemi-nasil-secilir", "İş Yeri Alarm Sistemi Nasıl Seçilir?", "Alarm Sistemleri"],
  ["cctv-kamera-ile-ip-kamera-arasindaki-farklar", "CCTV Kamera ile IP Kamera Arasındaki Farklar", "Karşılaştırmalar"],
  ["yangin-alarmi-neden-onemlidir", "Yangın Alarmı Neden Önemlidir?", "Yangın Güvenliği"],
  ["pdks-personel-takip-sistemi-nedir", "PDKS Personel Takip Sistemi Nedir?", "PDKS"],
  ["kapi-gecis-sistemleri-nerelerde-kullanilir", "Kapı Geçiş Sistemleri Nerelerde Kullanılır?", "Kapı Geçiş"],
  ["arac-takip-sistemi-isletmelere-ne-saglar", "Araç Takip Sistemi İşletmelere Ne Sağlar?", "Araç Takip"],
  ["akilli-ev-sistemleri-ile-guvenlik-nasil-artirilir", "Akıllı Ev Sistemleri ile Güvenlik Nasıl Artırılır?", "Akıllı Ev"],
  ["su-baskini-alarmi-ne-ise-yarar", "Su Baskını Alarmı Ne İşe Yarar?", "Satın Alma Rehberleri"],
  ["karbonmonoksit-gaz-dedektoru-neden-kullanilmali", "Karbonmonoksit Gaz Dedektörü Neden Kullanılmalı?", "Yangın Güvenliği"],
];

export const blogPosts: BlogPost[] = titles.map(([slug, title, category], index) => ({
  slug,
  title,
  category,
  description: `${title.replace("?", "")} konusunda doğru ürün seçimi, kurulum planı ve PrimeSec Teknoloji yaklaşımını sade şekilde inceleyin.`,
  date: `2026-05-${String(10 + (index % 15)).padStart(2, "0")}`,
  updatedAt: "2026-05-28",
  readTime: `${5 + (index % 4)} dk`,
  image: category.includes("Kamera") ? "/images/kamera-sistemi.svg" : category.includes("Akıllı") ? "/images/akilli-ev.svg" : "/images/blog-security.svg",
  body: [
    "Güvenlik sistemi seçimi yalnızca cihaz sayısından ibaret değildir. Alanın giriş noktaları, kullanım alışkanlıkları, internet altyapısı ve takip beklentisi birlikte değerlendirilmelidir.",
    "Doğru projede alarm, kamera, yangın ihbar, kapı geçiş ve network altyapısı birbirini tamamlar. PrimeSec Teknoloji, keşiften kuruluma kadar bu parçaları tek plan içinde ele alır.",
    "Satın alma aşamasında marka, garanti, teknik servis ve mobil kullanım deneyimi mutlaka incelenmelidir. Ucuz ama desteksiz bir sistem uzun vadede daha yüksek maliyet oluşturabilir.",
  ],
  faqs: [
    { question: "Bu konuda keşif gerekli mi?", answer: "Evet, doğru güvenlik planı için alanın fiziksel yapısını ve kullanım senaryosunu görmek önemlidir." },
    { question: "PrimeSec hangi markalarla çalışır?", answer: "Hikvision, Dahua, Ajax, Paradox, DSC, Teknim, UNV, Reolink ve benzeri güvenilir markalarla çözüm sunar." },
  ],
}));

export const blogCategories = Array.from(new Set(blogPosts.map((post) => post.category)));
