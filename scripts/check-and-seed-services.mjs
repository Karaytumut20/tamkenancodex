// Supabase'deki mevcut servisleri kontrol et ve sıfırdan ekle
// Çalıştır: node --env-file=.env.local scripts/check-and-seed-services.mjs

import { requireSupabaseAdminEnv } from './supabase-admin-env.mjs';

const { supabaseUrl: SUPABASE_URL, serviceRoleKey: SERVICE_KEY } = requireSupabaseAdminEnv();

const headers = {
  "apikey": SERVICE_KEY,
  "Authorization": `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=minimal",
};

async function supabase(path, method = "GET", body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: body ? headers : { ...headers, "Content-Type": undefined },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (method === "GET") {
    const data = await res.json();
    return data;
  }
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status}: ${text}`);
  return text;
}

async function main() {
  console.log("=== Mevcut Durum Kontrol ===\n");

  // Mevcut tabs'ı çek
  const tabs = await supabase("homepage_service_tabs?select=*&order=sort_order");
  console.log("Mevcut Sekmeler:", tabs.length);
  tabs.forEach(t => console.log(`  - [${t.id}] ${t.title} (sort: ${t.sort_order})`));

  // Mevcut services'i çek
  const services = await supabase("homepage_services?select=*&order=sort_order");
  console.log("\nMevcut Hizmet Kartları:", services.length);
  services.forEach(s => console.log(`  - [${s.tab_id}] ${s.title}`));

  if (tabs.length > 0) {
    console.log("\n⚠️  Zaten veriler var. Temizleyip yeniden ekliyorum...\n");
    
    // Servisleri sil
    await supabase("homepage_services?id=neq.00000000-0000-0000-0000-000000000000", "DELETE");
    // Tabları sil
    await supabase("homepage_service_tabs?id=neq.00000000-0000-0000-0000-000000000000", "DELETE");
    console.log("✅ Eski veriler temizlendi.");
  }

  console.log("\n=== Sekmeler Ekleniyor ===\n");

  // Sekmeleri ekle (id olmadan, Supabase otomatik UUID atar)
  const newTabsData = [
    { title: "Kamera",    sort_order: 10 },
    { title: "Alarm",     sort_order: 20 },
    { title: "Akıllı Ev", sort_order: 30 },
    { title: "Kurumsal",  sort_order: 40 },
    { title: "Network",   sort_order: 50 },
  ];

  // Prefer: return=representation ile id'leri geri alalım
  const insertTabsRes = await fetch(`${SUPABASE_URL}/rest/v1/homepage_service_tabs`, {
    method: "POST",
    headers: { ...headers, "Prefer": "return=representation" },
    body: JSON.stringify(newTabsData),
  });
  const insertedTabs = await insertTabsRes.json();
  console.log("Eklenen Sekmeler:");
  insertedTabs.forEach(t => console.log(`  ✅ [${t.id}] ${t.title}`));

  // Tab ID'lerini bul
  const tabMap = {};
  insertedTabs.forEach(t => { tabMap[t.title] = t.id; });

  console.log("\n=== Hizmet Kartları Ekleniyor ===\n");

  const newServices = [
    // KAMERA
    {
      tab_id: tabMap["Kamera"],
      title: "CCTV Kamera Sistemleri",
      description: "Analog, HD-CVI ve IP tabanlı CCTV kamera çözümleriyle evinizi, iş yerinizi ve tesislerinizi 7/24 güvenlik altına alın. Gece görüşlü, geniş açılı kameralar ve bulut destekli kayıt sistemleriyle her noktayı izleyin.",
      image: "/images/kamera-sistemi.svg",
      link: "/kamera-sistemleri/cctv-kamera",
      sort_order: 0,
    },
    {
      tab_id: tabMap["Kamera"],
      title: "Araç Kamerası Sistemleri",
      description: "Ön, arka ve kabin içi araç kameraları ile yolculuklarınızı HD kalitede kayıt altına alın. Kaza anında delil niteliğinde görüntü, sürücü davranış analizi ve park modu kaydıyla tam koruma sağlayın.",
      image: "/images/arac-takip.svg",
      link: "/arac-kamerasi",
      sort_order: 1,
    },
    // ALARM
    {
      tab_id: tabMap["Alarm"],
      title: "Hırsız Alarm Sistemleri",
      description: "Ev ve iş yeri güvenliğinde en etkili çözüm: kablosuz ve kablolu hırsız alarm sistemleri. Hareket sensörü, cam kırılma dedektörü ve 7/24 merkezi izleme ile yetkisiz girişlerde anında müdahale sağlayın.",
      image: "/images/alarm-sistemi.svg",
      link: "/alarm-sistemleri",
      sort_order: 0,
    },
    {
      tab_id: tabMap["Alarm"],
      title: "Yangın İhbar Sistemleri",
      description: "Duman, ısı ve alev dedektörleriyle yangını başlamadan önce tespit edin. EN 54 sertifikalı yangın ihbar panelleri, sesli-ışıklı uyarıcılar ve otomatik itfaiye bildirimiyle can ve mal güvenliğini en üst düzeyde koruyun.",
      image: "/images/yangin-alarm.svg",
      link: "/yangin-ihbar-sistemleri",
      sort_order: 1,
    },
    // AKILLI EV
    {
      tab_id: tabMap["Akıllı Ev"],
      title: "IP Diafon Sistemleri",
      description: "Görüntülü IP diafon ve interkom sistemleriyle apartman, site ve ofis girişlerini güvenli ve akıllı hale getirin. Mobil uygulama üzerinden kapıyı uzaktan açın, ziyaretçiyi görüntülü görüşmeyle karşılayın.",
      image: "/images/akilli-ev.svg",
      link: "/ip-diafon-sistemleri",
      sort_order: 0,
    },
    // KURUMSAL
    {
      tab_id: tabMap["Kurumsal"],
      title: "Araç Takip Sistemleri",
      description: "GPS tabanlı araç takip ve filo yönetimi sistemiyle araçlarınızın anlık konumunu, hız geçmişini ve rota analizini tek ekrandan izleyin. Yakıt tüketimini optimize edin, yetkisiz kullanımı önleyin.",
      image: "/images/arac-takip.svg",
      link: "/arac-takip-sistemleri",
      sort_order: 0,
    },
    {
      tab_id: tabMap["Kurumsal"],
      title: "Personel Takip & PDKS",
      description: "Parmak izi, yüz tanıma veya kartlı okuyucu tabanlı PDKS sistemleriyle personel giriş-çıkış takibini otomatize edin. Puantaj raporları, mesai hesaplaması ve İK entegrasyonuyla iş gücü yönetimini kolaylaştırın.",
      image: "/images/pdks.svg",
      link: "/personel-takip-pdks",
      sort_order: 1,
    },
    {
      tab_id: tabMap["Kurumsal"],
      title: "Kapı Geçiş Sistemleri",
      description: "Kartlı, şifreli veya biyometrik kapı geçiş sistemleriyle tesislerinize yetkisiz erişimi engelleyin. Turnike, bariyer ve elektrikli kilit çözümleriyle her giriş noktasını kontrol altında tutun.",
      image: "/images/pdks.svg",
      link: "/kapi-gecis-sistemleri",
      sort_order: 2,
    },
    {
      tab_id: tabMap["Kurumsal"],
      title: "Restoran POS Yazılımı",
      description: "Restoran, kafe ve fast food işletmeleri için dokunmatik ekranlı POS sistemi: masa yönetimi, QR menü, mutfak ekranı (KDS), online sipariş entegrasyonu ve anlık satış raporlarıyla işletmenizi dijitalleştirin.",
      image: "/images/network.svg",
      link: "/restoran-pos-yazilimi",
      sort_order: 3,
    },
    // NETWORK
    {
      tab_id: tabMap["Network"],
      title: "Network Çözümleri",
      description: "Kamera, erişim kontrol ve ofis cihazları için profesyonel ağ altyapısı kurun. Yönetilebilir switch, PoE switch, fiber optik çözümler ve Wi-Fi erişim noktalarıyla kesintisiz ve güvenli bağlantı sağlayın.",
      image: "/images/network.svg",
      link: "/network-cozumleri",
      sort_order: 0,
    },
  ];

  const insertServicesRes = await fetch(`${SUPABASE_URL}/rest/v1/homepage_services`, {
    method: "POST",
    headers: { ...headers, "Prefer": "return=representation" },
    body: JSON.stringify(newServices),
  });
  const insertedServices = await insertServicesRes.json();
  
  if (!Array.isArray(insertedServices)) {
    console.error("❌ Servis ekleme hatası:", insertedServices);
    process.exit(1);
  }

  console.log("Eklenen Hizmet Kartları:");
  insertedServices.forEach(s => console.log(`  ✅ ${s.title}`));

  console.log("\n🎉 TAMAMLANDI!");
  console.log(`   ${insertedTabs.length} sekme + ${insertedServices.length} kart Supabase'e eklendi.`);
  console.log(`\n   Admin panelini yenileyin: http://localhost:3001/admin/homepage/services`);
}

main().catch(err => { console.error("❌ Hata:", err); process.exit(1); });
