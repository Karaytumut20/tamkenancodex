import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight, Building2, CheckCircle2, ClipboardCheck, MapPinned, Radar } from "lucide-react";

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

const steps = [
  "Riskli noktalar işaretlenir",
  "Doğru cihaz ve kablolama seçilir",
  "Kurulum sonrası kullanıcı eğitimi verilir",
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
              <ButtonLink
                href="/kendi-sistemini-tasarla"
                size="lg"
                className="bg-white text-[#031a46] transition-all duration-200 hover:bg-cyan-100"
              >
                Sistemini Tasarla
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink
                href="/kamera-sistemleri"
                size="lg"
                variant="secondaryDark"
                className="border-white/25 text-white hover:border-cyan-300/60 hover:text-cyan-100"
              >
                Kamera Sistemleri
              </ButtonLink>
            </div>
          </div>

          <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-md xl:w-[520px]">
            {zones.map((zone) => {
              const Icon = zone.icon;
              return (
                <div key={zone.title} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-300/20 primesec-navy-chip text-cyan-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-white">{zone.title}</p>
                    <p className="mt-1 text-xs leading-6 text-[#b8c7dd]">{zone.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-md md:p-5">
          <div className="grid gap-3 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[#00D46A]" />
              <span className="text-sm font-bold text-white/85">{step}</span>
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
