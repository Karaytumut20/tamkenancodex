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
    "contact.phone",
    "contact.whatsapp",
    "contact.email",
    "contact.address",
    "contact.city",
    "site.name",
    "site.legalName",
    "site.url",
    "site.description",
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
        title="📞 İletişim Bilgileri"
        description="Telefon, WhatsApp, e-posta ve adres bilgilerinizi buradan güncelleyin."
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
