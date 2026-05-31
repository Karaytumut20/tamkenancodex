import { CreditCard, Headphones, ShieldCheck, Sparkles } from "lucide-react";

const items = [
  ["%100 Orijinal Ürün Garantisi", "Yetkili ve güvenilir marka seçenekleri", ShieldCheck],
  ["2 Yıl Garanti", "Kurulum sonrası güvence", Sparkles],
  ["7/24 Teknik Destek", "Arıza ve kullanım desteği", Headphones],
  ["Güvenli Alışveriş", "KVKK uyumlu teklif süreci", CreditCard],
];

export function TrustBar() {
  return (
    <section className="bg-transparent py-10">
      <div className="container-primesec grid gap-5 rounded-[30px] border border-border bg-white p-7 md:grid-cols-2 xl:grid-cols-4 shadow-[0_18px_50px_rgba(15,23,42,0.04)]">
        {items.map(([title, subtitle, Icon]) => (
          <div key={title as string} className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-primary-600 shrink-0">
              <Icon className="h-6 w-6" />
            </span>
            <span>
              <span className="block font-extrabold text-ink">{title as string}</span>
              <span className="text-sm text-ink-muted">{subtitle as string}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
