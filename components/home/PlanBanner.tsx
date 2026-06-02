import { ButtonLink } from "@/components/ui/Button";
import { whatsappUrl } from "@/lib/whatsapp";
import { Compass, ShieldCheck, Headphones, Settings, ArrowRight } from "lucide-react";

export function PlanBanner() {
  return (
    <section className="hero-bg py-16 md:py-24 relative overflow-hidden">
      {/* Background radial glow - WhyPrimeSec ile aynı */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(circle_at_center,_rgba(0,107,255,0.15)_0%,_transparent_70%)] blur-[95px]" />
      </div>

      <div className="container-primesec relative z-10">
        <div className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-md p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
          {/* Decorative subtle grid background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />

          <div className="relative z-10 grid gap-10 xl:grid-cols-12 items-center">
            {/* Left Column: Title & Description & Features Grid */}
            <div className="xl:col-span-8 space-y-8">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#1683FF]/30 primesec-navy-chip text-[#b8c7dd] text-xs font-bold tracking-wider uppercase mb-4">
                  BİRLİKTE TASARLAYALIM
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-[-0.04em] leading-tight">
                  Güvenlik sisteminizi birlikte planlayalım
                </h2>
                <p className="mt-4 text-base md:text-lg text-[#b8c7dd] leading-relaxed max-w-3xl">
                  PrimeSec uzmanları keşiften kuruluma kadar doğru ürün, doğru lokasyon ve doğru bütçe dengesini kurar.
                </p>
              </div>

              {/* Value Proposition Grid */}
              <div className="grid gap-6 sm:grid-cols-2 pt-4">
                {[
                  {
                    icon: Compass,
                    title: "Ücretsiz Keşif & Analiz",
                    desc: "Mekanınızda riskli noktaları ücretsiz tespit ediyor ve projelendiriyoruz.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Birebir Danışmanlık",
                    desc: "Sizin ihtiyaçlarınıza ve bütçenize en uygun ekipmanları seçiyoruz.",
                  },
                  {
                    icon: Settings,
                    title: "Profesyonel Kurulum",
                    desc: "Sertifikalı teknik kadromuzla temiz ve sorunsuz montaj sağlıyoruz.",
                  },
                  {
                    icon: Headphones,
                    title: "7/24 Teknik Destek",
                    desc: "Satış sonrasında da kesintisiz izleme ve anında servis desteği sunuyoruz.",
                  },
                ].map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <div key={idx} className="flex gap-4 items-start group p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-300">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl primesec-navy-chip border border-white/10 text-cyan-400 group-hover:border-cyan-400/50 group-hover:shadow-lg group-hover:shadow-cyan-500/20 transition-all duration-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors">{feat.title}</h4>
                        <p className="mt-1.5 text-xs text-[#b8c7dd] group-hover:text-white/80 leading-relaxed transition-colors">{feat.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: CTA Buttons & Quick Note */}
            <div className="xl:col-span-4 flex flex-col gap-4 bg-gradient-to-br from-white/[0.08] to-white/[0.03] border border-white/15 rounded-[28px] p-6 md:p-8 backdrop-blur-md self-start shadow-xl hover:shadow-2xl hover:border-white/30 hover:from-white/[0.12] hover:to-white/[0.06] transition-all duration-300">
              <h3 className="font-extrabold text-xl text-white">Hemen Başlayın</h3>
              <p className="text-xs text-[#b8c7dd] leading-relaxed">
                Birkaç dakikada ihtiyacınızı belirleyin, keşif ekibimiz sizinle iletişime geçsin.
              </p>

              <div className="flex flex-col gap-3 mt-2">
                <ButtonLink
                  href="/kendi-sistemini-tasarla"
                  size="lg"
                  className="w-full primesec-navy-action border border-primary-500/30 text-white hover:border-primary-400/50 hover:shadow-lg hover:shadow-primary-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 justify-center gap-2"
                >
                  Kendi Sistemini Tasarla <ArrowRight className="h-4 w-4" />
                </ButtonLink>
                <ButtonLink
                  href={whatsappUrl("Merhaba, PrimeSec Teknoloji ile güvenlik sistemimi planlamak istiyorum.")}
                  size="lg"
                  className="w-full bg-gradient-to-r from-[#00D46A] to-[#00B85A] border border-[#00D46A]/50 text-white transition-all duration-200 justify-center"
                >
                  WhatsApp'tan Yaz
                </ButtonLink>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 text-center">
                <p className="text-[11px] text-[#b8c7dd]/70 flex items-center justify-center gap-1.5">
                  <span className="text-[#FF8A00]">▲</span> Keşif ve danışmanlık hizmetimiz tamamen ücretsizdir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
