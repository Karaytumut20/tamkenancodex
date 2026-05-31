import { Headphones, MapPinned, ShieldCheck, Smile, Timer } from "lucide-react";

const stats = [
  ["10+", "Yıl Sektör Deneyimi", ShieldCheck],
  ["5.000+", "Mutlu Müşteri", Smile],
  ["7/24", "Teknik Destek", Headphones],
  ["%98", "Müşteri Memnuniyeti", Timer],
  ["TR", "Hızlı Servis Ağı", MapPinned],
];

export function StatsBand() {
  return (
    <section className="bg-transparent py-10">
      <div className="container-primesec rounded-[28px] border border-border bg-white p-7 shadow-[0_20px_70px_rgba(15,23,42,0.04)]">
        <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-5">
          {stats.map(([value, label, Icon]) => (
            <div key={label as string} className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface text-primary-600">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-2xl font-extrabold text-ink">{value as string}</span>
                <span className="text-sm font-semibold text-ink-muted">{label as string}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
