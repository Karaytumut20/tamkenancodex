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
  return (
    <div className="rounded-xl border-2 border-slate-200 bg-white p-5 shadow-sm">
      <label className="block">
        <span className="text-lg font-black text-slate-800">{item.label}</span>
        {item.helpText && (
          <span className="block text-sm font-medium text-slate-400 mt-1">{item.helpText}</span>
        )}
        <input
          type="text"
          name={item.key}
          defaultValue={item.currentValue}
          placeholder={item.placeholder}
          className="mt-3 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-14 text-base font-semibold outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-colors"
        />
      </label>
    </div>
  );
}

export function SettingsForm({ items }: { items: SettingItem[] }) {
  const [state, formAction] = useActionState(saveSetting, { success: false, error: null });

  // Split into contact and site groups
  const contactItems = items.filter((i) => i.key.startsWith("contact."));
  const siteItems = items.filter((i) => i.key.startsWith("site."));

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

      {/* Contact info */}
      <section>
        <h3 className="text-xl font-black text-slate-800 mb-3">📞 İletişim Bilgileri</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {contactItems.map((item) => (
            <SettingCard key={item.key} item={item} />
          ))}
        </div>
      </section>

      {/* Site info */}
      <section>
        <h3 className="text-xl font-black text-slate-800 mb-3">🌐 Firma Bilgileri</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {siteItems.map((item) => (
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
