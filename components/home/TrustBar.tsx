import { CreditCard, Headphones, ShieldCheck, Sparkles } from "lucide-react";

const items = [
  ["%100 Orijinal Ürün Garantisi", "Yetkili ve güvenilir marka seçenekleri", ShieldCheck],
  ["2 Yıl Garanti", "Kurulum sonrası güvence", Sparkles],
  ["7/24 Teknik Destek", "Arıza ve kullanım desteği", Headphones],
  ["Güvenli Alışveriş", "KVKK uyumlu teklif süreci", CreditCard],
];

export function TrustBar() {
  return (
    <section className="bg-transparent py-8 md:py-10">
      <div className="container-primesec grid gap-4 rounded-[30px] border border-border bg-white p-5 sm:grid-cols-2 md:gap-5 md:p-7 xl:grid-cols-4">
        {items.map(([title, subtitle, Icon]) => (
          <div key={title as string} className="flex items-center gap-3 sm:gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-primary-600 sm:h-12 sm:w-12">
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </span>
            <span>
              <span className="block text-sm font-extrabold text-ink sm:text-base">{title as string}</span>
              <span className="text-xs text-ink-muted sm:text-sm">{subtitle as string}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
