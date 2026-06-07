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
      <div className="container-primesec rounded-[28px] border border-white/10 primesec-navy-surface p-6 md:p-7">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 xl:grid-cols-5">
          {stats.map(([value, label, Icon]) => (
            <div key={label as string} className="flex items-center gap-3 sm:gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-primary-600 sm:h-11 sm:w-11">
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
              <span>
                <span className="block text-xl font-extrabold text-white sm:text-2xl">{value as string}</span>
                <span className="text-xs font-semibold text-white/70 sm:text-sm">{label as string}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
