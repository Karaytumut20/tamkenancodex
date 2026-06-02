import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight, Building2, ClipboardCheck, MapPinned, Radar } from "lucide-react";

const zones = [
  {
    icon: Building2,
    title: "Ev ve villa",
    desc: "Kamera, alarm ve akıllı ev senaryoları tek panelde planlanır.",
  },
  {
    icon: MapPinned,
    title: "Mağaza ve ofis",
    desc: "Giriş, kasa, depo ve personel alanları ayrı risk seviyeleriyle ele alınır.",
  },
  {
    icon: Radar,
    title: "Site ve tesis",
    desc: "Çevre güvenliği, otopark, geçiş kontrol ve kayıt altyapısı birlikte kurulur.",
  },
];

export function SystemBuilderCTA() {
  return (
    <section className="hero-bg relative overflow-hidden py-16 text-white md:py-24">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,_rgba(0,107,255,0.15)_0%,_transparent_70%)] blur-[95px]" />
      </div>

      <div className="container-primesec relative z-10">
        <div className="grid gap-10 xl:grid-cols-[1fr_auto] xl:items-center">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-white/[0.06] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-cyan-300">
              <ClipboardCheck className="h-4 w-4" />
              İhtiyaca göre çözüm
            </span>
            <h2 className="mt-5 text-[clamp(30px,3.2vw,50px)] font-extrabold leading-[1.02] tracking-[-0.04em]">
              Her mekan için aynı paket değil, net bir güvenlik haritası.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#b8c7dd] md:text-lg">
              Kameranın göreceği açı, alarm sensörünün konumu ve kayıt altyapısının kapasitesi birlikte düşünüldüğünde sistem uzun ömürlü olur. PrimeSec, ihtiyacınızı paket ismiyle değil mekanın gerçek kullanımıyla eşleştirir.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/kendi-sistemini-tasarla"
                className="inline-flex items-center justify-center gap-2 rounded-xl font-bold h-[58px] px-6 text-base bg-white text-[#031a46] transition-all duration-200 hover:bg-cyan-100 hover:text-[#031a46] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                Sistemini Tasarla
                <ArrowRight className="h-4 w-4" />
              </Link>
              <ButtonLink
                href="/kamera-sistemleri"
                size="lg"
                variant="secondaryDark"
                className="border-white/25 text-white hover:border-cyan-500 hover:text-cyan-400 transition-all duration-200"
              >
                Kamera Sistemleri
              </ButtonLink>
            </div>
          </div>

          <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-md xl:w-[520px]">
            {zones.map((zone) => {
              const Icon = zone.icon;
              return (
                <div key={zone.title} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-cyan-500/30 p-4 transition-all duration-300 group">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-300/20 primesec-navy-chip text-cyan-300 group-hover:border-cyan-400 group-hover:text-cyan-400 group-hover:scale-105 transition-all duration-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-white group-hover:text-cyan-300 transition-colors">{zone.title}</p>
                    <p className="mt-1 text-xs leading-6 text-[#b8c7dd]">{zone.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
