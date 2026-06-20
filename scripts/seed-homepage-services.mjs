// Hizmetleri veritabanına ekle
// Çalıştır: node scripts/seed-homepage-services.mjs

const BASE_URL = "http://localhost:3001";

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Tab ID'leri
const tabIds = {
  kamera: uuid(),
  alarm: uuid(),
  akilliev: uuid(),
  kurumsal: uuid(),
  network: uuid(),
};

const tabs = [
  { id: tabIds.kamera,   title: "Kamera",    sort_order: 0 },
  { id: tabIds.alarm,    title: "Alarm",     sort_order: 1 },
  { id: tabIds.akilliev, title: "Akıllı Ev", sort_order: 2 },
  { id: tabIds.kurumsal, title: "Kurumsal",  sort_order: 3 },
  { id: tabIds.network,  title: "Network",   sort_order: 4 },
];

const services = [
  {
    id: uuid(),
    tab_id: tabIds.kamera,
    title: "CCTV Kamera Sistemleri",
    description:
      "Analog, HD-CVI ve IP tabanlı CCTV kamera çözümleriyle evinizi, iş yerinizi ve tesislerinizi 7/24 güvenlik altına alın. Gece görüşlü, geniş açılı kameralar ve bulut destekli kayıt sistemleriyle her noktayı izleyin.",
    image: "/images/kamera-sistemi.svg",
    link: "/kamera-sistemleri/cctv-kamera",
    sort_order: 0,
  },
  {
    id: uuid(),
    tab_id: tabIds.kamera,
    title: "Araç Kamerası Sistemleri",
    description:
      "Ön, arka ve kabin içi araç kameraları ile yolculuklarınızı HD kalitede kayıt altına alın. Kaza anında delil niteliğinde görüntü, sürücü davranış analizi ve park modu kaydıyla tam koruma sağlayın.",
    image: "/images/arac-takip.svg",
    link: "/arac-kamerasi",
    sort_order: 1,
  },
  {
    id: uuid(),
    tab_id: tabIds.alarm,
    title: "Hırsız Alarm Sistemleri",
    description:
      "Ev ve iş yeri güvenliğinde en etkili çözüm: kablosuz ve kablolu hırsız alarm sistemleri. Hareket sensörü, cam kırılma dedektörü ve 7/24 merkezi izleme ile yetkisiz girişlerde anında müdahale sağlayın.",
    image: "/images/alarm-sistemi.svg",
    link: "/alarm-sistemleri",
    sort_order: 0,
  },
  {
    id: uuid(),
    tab_id: tabIds.alarm,
    title: "Yangın İhbar Sistemleri",
    description:
      "Duman, ısı ve alev dedektörleriyle yangını başlamadan önce tespit edin. EN 54 sertifikalı yangın ihbar panelleri, sesli-ışıklı uyarıcılar ve otomatik itfaiye bildirimiyle can ve mal güvenliğini en üst düzeyde koruyun.",
    image: "/images/yangin-alarm.svg",
    link: "/yangin-ihbar-sistemleri",
    sort_order: 1,
  },
  {
    id: uuid(),
    tab_id: tabIds.akilliev,
    title: "IP Diafon Sistemleri",
    description:
      "Görüntülü IP diafon ve interkom sistemleriyle apartman, site ve ofis girişlerini güvenli ve akıllı hale getirin. Mobil uygulama üzerinden kapıyı uzaktan açın, ziyaretçiyi görüntülü görüşmeyle karşılayın.",
    image: "/images/akilli-ev.svg",
    link: "/ip-diafon-sistemleri",
    sort_order: 0,
  },
  {
    id: uuid(),
    tab_id: tabIds.kurumsal,
    title: "Araç Takip Sistemleri",
    description:
      "GPS tabanlı araç takip ve filo yönetimi sistemiyle araçlarınızın anlık konumunu, hız geçmişini ve rota analizini tek ekrandan izleyin. Yakıt tüketimini optimize edin, yetkisiz kullanımı önleyin.",
    image: "/images/arac-takip.svg",
    link: "/arac-takip-sistemleri",
    sort_order: 0,
  },
  {
    id: uuid(),
    tab_id: tabIds.kurumsal,
    title: "Personel Takip & PDKS",
    description:
      "Parmak izi, yüz tanıma veya kartlı okuyucu tabanlı PDKS sistemleriyle personel giriş-çıkış takibini otomatize edin. Puantaj raporları, mesai hesaplaması ve İK entegrasyonuyla iş gücü yönetimini kolaylaştırın.",
    image: "/images/pdks.svg",
    link: "/personel-takip-pdks",
    sort_order: 1,
  },
  {
    id: uuid(),
    tab_id: tabIds.kurumsal,
    title: "Kapı Geçiş Sistemleri",
    description:
      "Kartlı, şifreli veya biyometrik kapı geçiş sistemleriyle tesislerinize yetkisiz erişimi engelleyin. Turnike, bariyer ve elektrikli kilit çözümleriyle her giriş noktasını kontrol altında tutun.",
    image: "/images/pdks.svg",
    link: "/kapi-gecis-sistemleri",
    sort_order: 2,
  },
  {
    id: uuid(),
    tab_id: tabIds.kurumsal,
    title: "Restoran POS Yazılımı",
    description:
      "Restoran, kafe ve fast food işletmeleri için dokunmatik ekranlı POS sistemi: masa yönetimi, QR menü, mutfak ekranı (KDS), online sipariş entegrasyonu ve anlık satış raporlarıyla işletmenizi dijitalleştirin.",
    image: "/images/network.svg",
    link: "/restoran-pos-yazilimi",
    sort_order: 3,
  },
  {
    id: uuid(),
    tab_id: tabIds.network,
    title: "Network Çözümleri",
    description:
      "Kamera, erişim kontrol ve ofis cihazları için profesyonel ağ altyapısı kurun. Yönetilebilir switch, PoE switch, fiber optik çözümler ve Wi-Fi erişim noktalarıyla kesintisiz ve güvenli bağlantı sağlayın.",
    image: "/images/network.svg",
    link: "/network-cozumleri",
    sort_order: 0,
  },
];

async function seed() {
  console.log("🚀 Hizmetler veritabanına ekleniyor...\n");

  const res = await fetch(`${BASE_URL}/api/admin/homepage/services`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tabs, services }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ Hata:", res.status, text);
    process.exit(1);
  }

  const json = await res.json();
  console.log("✅ Başarıyla kaydedildi!", json);
  console.log(`\n📋 Özet:`);
  console.log(`   - ${tabs.length} sekme eklendi: ${tabs.map(t => t.title).join(", ")}`);
  console.log(`   - ${services.length} hizmet kartı eklendi`);
}

seed().catch((err) => {
  console.error("Beklenmeyen hata:", err);
  process.exit(1);
});
