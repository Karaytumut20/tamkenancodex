export type MegaMenuKey = "alarm-sistemleri" | "akilli-ev-sistemleri" | "kamera-sistemleri";

export const megaMenus = {
  "alarm-sistemleri": {
    title: "Alarm Sistemleri",
    eyebrow: "Risk tipine gore secin",
    insightTitle: "Ev ve is yerleri icin akilli alarm akislari",
    insight:
      "Hirsizlik, yangin, su baskini ve panik senaryolarini tek panelde toplayan alarm mimarisiyle alaninizi 7/24 izlenebilir hale getirin.",
    personas: [
      { title: "Ev Sahibi", description: "Daire, villa ve yazliklar icin pratik koruma", href: "/alarm-sistemleri/ev-alarm-sistemleri" },
      { title: "Isletme", description: "Magaza, ofis ve depo icin caydirici alarm", href: "/alarm-sistemleri/is-yeri-alarm-sistemleri" },
      { title: "Kurumsal", description: "Cok alanli projeler icin genisletilebilir yapi", href: "/alarm-sistemleri" },
    ],
    items: [
      { title: "Ev Alarm Sistemleri", href: "/alarm-sistemleri/ev-alarm-sistemleri", image: "/images/alarm-sistemi.svg" },
      { title: "Is Yeri Alarm Sistemleri", href: "/alarm-sistemleri/is-yeri-alarm-sistemleri", image: "/images/local-security.svg" },
      { title: "PrimeSec Plus", href: "/urunler/primesec-plus-kamerali-alarm-paketi", image: "/images/alarm-sistemi.svg" },
      { title: "Manyetik Kontak", href: "/urunler/manyetik-kontak-alarm-sensoru", image: "/images/manyetik-kontak.svg" },
      { title: "Su Baskini Alarmi", href: "/urunler/su-baskini-alarmi", image: "/images/alarm-sistemi.svg" },
      { title: "Yangin Alarmi", href: "/urunler/yangin-ihbar-dedektoru", image: "/images/yangin-alarm.svg" },
    ],
  },
  "akilli-ev-sistemleri": {
    title: "Akilli Ev Sistemleri",
    eyebrow: "Konfor ve guvenlik",
    insightTitle: "Akilli ev urunlerini guvenlik sistemine baglayin",
    insight:
      "Akilli zil, video takip, kilit, aydinlatma ve enerji kontrolunu mobil uygulama odakli entegre bir deneyime donusturun.",
    personas: [
      { title: "Akilli Yasam", description: "Ev otomasyonu ve uzaktan kontrol", href: "/akilli-ev-sistemleri" },
      { title: "Kapida Guvenlik", description: "Akilli zil ve kilit cozumleri", href: "/urunler/akilli-zil" },
      { title: "Video Takip", description: "Anlik bildirimli akilli izleme", href: "/urunler/akilli-video-takip-sistemi" },
    ],
    items: [
      { title: "Akilli Video", href: "/urunler/akilli-video-takip-sistemi", image: "/images/akilli-ev.svg" },
      { title: "Akilli Kilit", href: "/akilli-ev-sistemleri", image: "/images/smart-lock.svg" },
      { title: "Akilli Zil", href: "/urunler/akilli-zil", image: "/images/akilli-ev.svg" },
      { title: "Akilli Priz", href: "/akilli-ev-sistemleri", image: "/images/akilli-ev.svg" },
      { title: "Akilli Aydinlatma", href: "/akilli-ev-sistemleri", image: "/images/akilli-ev.svg" },
      { title: "Akilli Termostat", href: "/akilli-ev-sistemleri", image: "/images/akilli-ev.svg" },
    ],
  },
  "kamera-sistemleri": {
    title: "Kamera Sistemleri",
    eyebrow: "Canli izleme ve kayit",
    insightTitle: "CCTV, IP kamera ve marka bazli kamera cozumleri",
    insight:
      "Kameralarin gorus acisi, kayit altyapisi, network durumu ve mobil izleme ihtiyacini birlikte planlayarak net goruntu saglayin.",
    personas: [
      { title: "CCTV Kamera", description: "Ekonomik ve guvenilir kamera kurulumu", href: "/kamera-sistemleri/cctv-kamera" },
      { title: "IP Kamera", description: "PoE ve network tabanli profesyonel izleme", href: "/kamera-sistemleri/ip-kamera" },
      { title: "Marka Cozumleri", description: "Hikvision, Dahua, UNV ve Reolink", href: "/kamera-sistemleri" },
    ],
    items: [
      { title: "KameramPro", href: "/kamera-sistemleri", image: "/images/kamera-sistemi.svg" },
      { title: "CCTV Kamera", href: "/kamera-sistemleri/cctv-kamera", image: "/images/kamera-sistemi.svg" },
      { title: "IP Kamera", href: "/kamera-sistemleri/ip-kamera", image: "/images/kamera-sistemi.svg" },
      { title: "Hikvision Kamera Sistemleri", href: "/urunler/hikvision-cctv-kamera-sistemi", image: "/images/kamera-sistemi.svg" },
      { title: "Dahua Kamera Sistemleri", href: "/urunler/dahua-ip-kamera-sistemi", image: "/images/kamera-sistemi.svg" },
      { title: "Akilli Video", href: "/urunler/akilli-video-takip-sistemi", image: "/images/akilli-ev.svg" },
    ],
  },
} as const;
