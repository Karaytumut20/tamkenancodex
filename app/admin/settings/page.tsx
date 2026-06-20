import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SettingsForm } from "./SettingsForm";

const settingLabels: Record<string, { label: string; placeholder: string; helpText: string }> = {
  "site.name": {
    label: "Firma / Site Adı",
    placeholder: "PrimeSec Teknoloji",
    helpText: "Sitenizin başlığında görünecek isim.",
  },
  "site.legalName": {
    label: "Resmi Firma Adı",
    placeholder: "PrimeSec Güvenlik Teknolojileri A.Ş.",
    helpText: "Fatura ve resmi belgelerde kullanılan tam firma adı.",
  },
  "site.url": {
    label: "Site Adresi (URL)",
    placeholder: "https://primesecteknoloji.com",
    helpText: "Sitenizin internet adresi.",
  },
  "site.description": {
    label: "Site Açıklaması",
    placeholder: "Alarm, kamera ve güvenlik sistemleri...",
    helpText: "Google'da siteniz hakkında gösterilecek kısa açıklama.",
  },
  "contact.phone": {
    label: "📞 Telefon Numarası",
    placeholder: "+90 262 000 00 00",
    helpText: "Müşterilerin sizi arayacağı telefon numarası.",
  },
  "contact.whatsapp": {
    label: "💬 WhatsApp Numarası",
    placeholder: "905320000000",
    helpText: "Başına 90 koyarak yazın, boşluk ve tire olmadan. Örnek: 905321234567",
  },
  "contact.email": {
    label: "📧 E-posta Adresi",
    placeholder: "info@primesecteknoloji.com",
    helpText: "İletişim formu gönderilerinin geleceği e-posta.",
  },
  "contact.address": {
    label: "📍 Adres",
    placeholder: "Gebze, Kocaeli",
    helpText: "Firmanızın açık adresi.",
  },
  "contact.city": {
    label: "🏙️ Şehir",
    placeholder: "Kocaeli",
    helpText: "Firmanızın bulunduğu şehir.",
  },
  "contact.rep1.name": {
    label: "👤 1. Temsilci Adı",
    placeholder: "Kenan FINDIK",
    helpText: "İletişim panelindeki birinci temsilci ismi.",
  },
  "contact.rep1.phone": {
    label: "📞 1. Temsilci Telefon Numarası",
    placeholder: "+90 531 508 90 28",
    helpText: "Birinci temsilcinin aranacak telefon numarası.",
  },
  "contact.rep1.whatsapp": {
    label: "💬 1. Temsilci WhatsApp No",
    placeholder: "905315089028",
    helpText: "Boşluksuz ve baştaki sıfır olmadan (Örn: 905315089028).",
  },
  "contact.rep2.name": {
    label: "👤 2. Temsilci Adı",
    placeholder: "Ömer TEMEL",
    helpText: "İletişim panelindeki ikinci temsilci ismi.",
  },
  "contact.rep2.phone": {
    label: "📞 2. Temsilci Telefon Numarası",
    placeholder: "+90 551 954 26 05",
    helpText: "İkinci temsilcinin aranacak telefon numarası.",
  },
  "contact.rep2.whatsapp": {
    label: "💬 2. Temsilci WhatsApp No",
    placeholder: "905519542605",
    helpText: "Boşluksuz ve baştaki sıfır olmadan (Örn: 905519542605).",
  },
  "seo.ga_id": {
    label: "📊 Google Analytics ID (GA4)",
    placeholder: "G-XXXXXXXXXX",
    helpText: "Sitenize Google Analytics entegre etmek için GA4 kimliğini girin (örn: G-12345678).",
  },
  "seo.gtag_script": {
    label: "🖥️ Google GTag / Analytics İzleme Kodu (HTML)",
    placeholder: "<!-- Google tag (gtag.js) -->\n<script async src=\"https://www.googletagmanager.com/gtag/js?id=G-XXXXXX\"></script>\n...",
    helpText: "Google Analytics veya diğer izleme servislerinin size verdiği tüm izleme script kodunu (HTML <script> blokları dahil) buraya yapıştırabilirsiniz.",
  },
  "seo.gsc_verification": {
    label: "🔍 Google Search Console Doğrulama",
    placeholder: "google-site-verification kodu",
    helpText: "Google Search Console sahiplik doğrulaması için size verilen meta tag içeriğini girin.",
  },
  "popup.active": {
    label: "📢 Kampanya Pop-up Durumu",
    placeholder: "false",
    helpText: "Pop-up kampanyasının sitede gösterilip gösterilmeyeceğini belirler.",
  },
  "popup.title": {
    label: "📢 Pop-up Başlığı",
    placeholder: "Özel Kampanya",
    helpText: "Pop-up kutusunun en üstünde görünecek başlık.",
  },
  "popup.content": {
    label: "📝 Pop-up Açıklama Metni",
    placeholder: "Kısa bir süreliğine tüm güvenlik paketlerimizde indirim...",
    helpText: "Kampanyanızın detaylarını anlatan açıklama metni.",
  },
  "popup.image_url": {
    label: "🖼️ Pop-up Görsel Linki (Opsiyonel)",
    placeholder: "/images/primesec-hero-cctv-v2.png",
    helpText: "Pop-up içinde gösterilecek resim dosyasının adresi (örn: /images/logo.png).",
  },
  "popup.button_label": {
    label: "🔗 Buton Yazısı (Opsiyonel)",
    placeholder: "Hemen Keşif Al",
    helpText: "Pop-up butonunun üzerinde yazacak metin.",
  },
  "popup.button_url": {
    label: "🔗 Buton Linki (Opsiyonel)",
    placeholder: "/iletisim",
    helpText: "Butona tıklandığında gidilecek sayfa adresi.",
  },
  "popup.cooldown": {
    label: "⏳ Gösterim Sıklığı (Dakika)",
    placeholder: "10",
    helpText: "Pop-up kapatıldıktan kaç dakika sonra tekrar gösterilsin (Varsayılan: 10).",
  },
};

function extractValue(jsonValue: unknown): string {
  if (typeof jsonValue === "string") return jsonValue;
  if (typeof jsonValue === "object" && jsonValue && "value" in jsonValue) {
    return String((jsonValue as { value?: unknown }).value ?? "");
  }
  if (typeof jsonValue === "object" && jsonValue) {
    // For seo.defaults or complex objects, just show a readable version
    try {
      return JSON.stringify(jsonValue, null, 2);
    } catch {
      return "";
    }
  }
  return String(jsonValue ?? "");
}

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .order("created_at", { ascending: true });

  const settings = (data ?? []) as { id: string; key: string; value: unknown }[];

  // Build a map of key -> { id, displayValue }
  const settingsMap = new Map<string, { id: string; displayValue: string }>();
  for (const s of settings) {
    settingsMap.set(s.key, {
      id: s.id,
      displayValue: extractValue(s.value),
    });
  }

  // Only show known, simple settings (hide seo.defaults and other technical ones)
  const visibleKeys = [
    "site.name",
    "site.legalName",
    "site.url",
    "site.description",
    "contact.phone",
    "contact.email",
    "contact.address",
    "contact.city",
    "contact.rep1.name",
    "contact.rep1.phone",
    "contact.rep1.whatsapp",
    "contact.rep2.name",
    "contact.rep2.phone",
    "contact.rep2.whatsapp",
    "seo.ga_id",
    "seo.gtag_script",
    "seo.gsc_verification",
    "popup.active",
    "popup.title",
    "popup.content",
    "popup.image_url",
    "popup.button_label",
    "popup.button_url",
    "popup.cooldown",
  ];

  const items = visibleKeys.map((key) => {
    const meta = settingLabels[key] ?? { label: key, placeholder: "", helpText: "" };
    const existing = settingsMap.get(key);
    return {
      key,
      id: existing?.id ?? null,
      currentValue: existing?.displayValue ?? "",
      ...meta,
    };
  });

  return (
    <ProtectedAdminPage>
      <AdminPageHeader
        title="⚙️ Site & Genel Ayarlar"
        description="Pop-up kampanya, iletişim, adres ve SEO izleme kodlarını buradan yönetin."
      />

      {error && (
        <div className="mb-4 rounded-xl border-2 border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 font-bold">
          Ayarlar yüklenirken bir sorun oluştu. Lütfen sayfayı yenileyin.
        </div>
      )}

      <SettingsForm items={items} />
    </ProtectedAdminPage>
  );
}
