"use client";

import { useActionState } from "react";
import { saveSetting } from "./actions";

type SettingItem = {
  key: string;
  id: string | null;
  currentValue: string;
  label: string;
  placeholder: string;
  helpText: string;
};

function SettingCard({ item }: { item: SettingItem }) {
  const isTextArea = item.key === "seo.gtag_script" || item.key === "site.description" || item.key === "popup.content";
  
  if (item.key === "popup.active") {
    return (
      <div className="rounded-xl border-2 border-slate-200 bg-white p-5 shadow-sm">
        <label className="block">
          <span className="text-lg font-black text-slate-800">{item.label}</span>
          {item.helpText && (
            <span className="block text-sm font-medium text-slate-400 mt-1">{item.helpText}</span>
          )}
          <select
            name={item.key}
            defaultValue={item.currentValue || "false"}
            className="mt-3 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-14 text-base font-semibold outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-colors"
          >
            <option value="true">Aktif (Sitede Gösterilsin)</option>
            <option value="false">Pasif (Gösterilmesin)</option>
          </select>
        </label>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border-2 border-slate-200 bg-white p-5 shadow-sm ${isTextArea ? "md:col-span-2" : ""}`}>
      <label className="block">
        <span className="text-lg font-black text-slate-800">{item.label}</span>
        {item.helpText && (
          <span className="block text-sm font-medium text-slate-400 mt-1">{item.helpText}</span>
        )}
        {isTextArea ? (
          <textarea
            name={item.key}
            defaultValue={item.currentValue}
            placeholder={item.placeholder}
            rows={item.key === "popup.content" ? 3 : 6}
            className="mt-3 w-full rounded-xl border-2 border-slate-200 bg-white p-4 text-base font-semibold outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-colors font-mono text-sm"
          />
        ) : (
          <input
            type={item.key === "popup.cooldown" ? "number" : "text"}
            name={item.key}
            defaultValue={item.currentValue}
            placeholder={item.placeholder}
            className="mt-3 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-14 text-base font-semibold outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-colors"
          />
        )}
      </label>
    </div>
  );
}

export function SettingsForm({ items }: { items: SettingItem[] }) {
  const [state, formAction] = useActionState(saveSetting, { success: false, error: null });

  // Split into contact, site, seo and popup groups
  const whatsappItems = items.filter((i) => i.key.includes(".whatsapp"));
  const contactItems = items.filter((i) => i.key.startsWith("contact.") && !i.key.includes(".whatsapp"));
  const siteItems = items.filter((i) => i.key.startsWith("site."));
  const seoItems = items.filter((i) => i.key.startsWith("seo."));
  const popupItems = items.filter((i) => i.key.startsWith("popup."));

  return (
    <form action={formAction} className="space-y-6">
      {state.success && (
        <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4 text-base font-black text-emerald-700">
          ✅ Bilgileriniz başarıyla kaydedildi!
        </div>
      )}
      {state.error && (
        <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 text-base font-black text-red-700">
          ❌ {state.error}
        </div>
      )}

      {/* Pop-up Campaign info */}
      <section className="border-b-2 border-slate-100 pb-6">
        <h3 className="text-xl font-black text-slate-800 mb-3">📢 Anasayfa Kampanya Pop-up Ayarları</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {popupItems.map((item) => (
            <SettingCard key={item.key} item={item} />
          ))}
        </div>
      </section>

      {/* Contact info */}
      <section className="border-b-2 border-slate-100 pb-6">
        <div className="mb-3">
          <h3 className="text-xl font-black text-slate-800">💬 Tüm WhatsApp'ları Yönet</h3>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Genel site butonunu ve temsilcilere özel WhatsApp hatlarını tek yerden yönetin.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {whatsappItems.map((item) => (
            <SettingCard key={item.key} item={item} />
          ))}
        </div>
      </section>

      {/* Contact info */}
      <section className="border-b-2 border-slate-100 pb-6">
        <h3 className="text-xl font-black text-slate-800 mb-3">📞 İletişim Bilgileri</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {contactItems.map((item) => (
            <SettingCard key={item.key} item={item} />
          ))}
        </div>
      </section>

      {/* Site info */}
      <section className="border-b-2 border-slate-100 pb-6">
        <h3 className="text-xl font-black text-slate-800 mb-3">🌐 Firma Bilgileri</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {siteItems.map((item) => (
            <SettingCard key={item.key} item={item} />
          ))}
        </div>
      </section>

      {/* SEO & Tracking */}
      <section>
        <h3 className="text-xl font-black text-slate-800 mb-3">📊 SEO & İzleme Kodları</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {seoItems.map((item) => (
            <SettingCard key={item.key} item={item} />
          ))}
        </div>
      </section>

      {/* Save */}
      <div className="sticky bottom-4 z-10">
        <button
          type="submit"
          className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-xl bg-cyan-600 border-2 border-cyan-700 px-10 text-base font-black text-white hover:bg-cyan-700 transition-all shadow-lg"
        >
          💾 Bilgileri Kaydet
        </button>
      </div>
    </form>
  );
}
