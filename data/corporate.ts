export type CorporatePage = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  body: string[];
  cta: string;
};

export const corporatePages: CorporatePage[] = [
  {
    slug: "kurumsal",
    title: "Kurumsal",
    metaTitle: "Kurumsal | PrimeSec Teknoloji",
    description: "PrimeSec Teknoloji'nin güvenlik sistemleri yaklaşımı, hizmet standartları ve kurumsal çalışma modeli.",
    body: ["PrimeSec Teknoloji, ev ve iş yerleri için alarm, kamera, akıllı ev, yangın ihbar, PDKS ve network çözümlerini anahtar teslim sunar.", "Her projede keşif, doğru ürün seçimi, profesyonel kurulum ve satış sonrası destek birlikte ele alınır."],
    cta: "Kurumsal güvenlik ihtiyaçlarınızı birlikte planlayalım.",
  },
  {
    slug: "hakkimizda",
    title: "Hakkımızda",
    metaTitle: "Hakkımızda | PrimeSec Teknoloji",
    description: "PrimeSec Teknoloji, modern güvenlik sistemlerini erişilebilir, güvenilir ve sürdürülebilir hale getirir.",
    body: ["Güvenlik teknolojilerini yalnızca cihaz kurulumu olarak değil, uzun vadeli bir koruma mimarisi olarak görüyoruz.", "Kocaeli ve İstanbul başta olmak üzere konut, ticari alan ve kurumsal projelerde ihtiyaç odaklı çözümler geliştiriyoruz."],
    cta: "PrimeSec uzmanlığıyla tanışın.",
  },
  {
    slug: "iletisim",
    title: "İletişim",
    metaTitle: "İletişim | PrimeSec Teknoloji",
    description: "PrimeSec Teknoloji ile telefon, WhatsApp, e-posta veya iletişim formu üzerinden hızlıca teklif alın.",
    body: ["Güvenlik sisteminiz için keşif, ürün bilgisi veya teknik destek talebinizi bize iletebilirsiniz.", "Ekibimiz ihtiyaçlarınızı dinleyerek en uygun alarm, kamera ve akıllı güvenlik planını hazırlar."],
    cta: "Teklif ve keşif için bize ulaşın.",
  },
  {
    slug: "kvkk",
    title: "KVKK Aydınlatma Metni",
    metaTitle: "KVKK | PrimeSec Teknoloji",
    description: "PrimeSec Teknoloji kişisel verileri yalnızca hizmet, teklif ve iletişim süreçleri kapsamında işler.",
    body: ["Kişisel verileriniz teklif, keşif, destek ve iletişim süreçlerini yürütmek amacıyla işlenir.", "Veri güvenliği için makul teknik ve idari tedbirler uygulanır; talepleriniz için iletişim kanallarımızı kullanabilirsiniz."],
    cta: "Veri güvenliği sorularınız için iletişime geçin.",
  },
  {
    slug: "gizlilik-politikasi",
    title: "Gizlilik Politikası",
    metaTitle: "Gizlilik Politikası | PrimeSec Teknoloji",
    description: "PrimeSec Teknoloji web sitesi kullanımında gizlilik ve veri güvenliği ilkelerini inceleyin.",
    body: ["Web sitemizde paylaştığınız bilgiler, talebinizi yanıtlamak ve hizmet kalitesini artırmak için kullanılır.", "Bilgileriniz yetkisiz erişime karşı korunur ve mevzuata uygun şekilde saklanır."],
    cta: "Gizlilikle ilgili sorularınızı paylaşın.",
  },
  {
    slug: "cerez-politikasi",
    title: "Çerez Politikası",
    metaTitle: "Çerez Politikası | PrimeSec Teknoloji",
    description: "PrimeSec Teknoloji web sitesi çerez kullanımı ve tercih yönetimi hakkında bilgi alın.",
    body: ["Çerezler site performansını ölçmek, güvenli oturum sağlamak ve kullanıcı deneyimini iyileştirmek için kullanılabilir.", "Tarayıcı ayarlarınızdan çerez tercihlerinizi dilediğiniz zaman yönetebilirsiniz."],
    cta: "Çerez tercihleri hakkında bilgi alın.",
  },
  {
    slug: "sikca-sorulan-sorular",
    title: "Sıkça Sorulan Sorular",
    metaTitle: "Sıkça Sorulan Sorular | PrimeSec Teknoloji",
    description: "Alarm, kamera, akıllı ev ve güvenlik sistemleri hakkında en sık sorulan soruların yanıtları.",
    body: ["Keşif, kurulum, garanti, teknik destek ve ürün seçimi hakkında merak edilen temel başlıkları bu sayfada topladık.", "Daha detaylı bilgi için PrimeSec ekibinden doğrudan destek alabilirsiniz."],
    cta: "Sorunuzun yanıtını birlikte netleştirelim.",
  },
];
