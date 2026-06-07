import Link from "next/link";
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
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-400/30 primesec-navy-chip text-cyan-400 text-xs font-bold tracking-wider uppercase mb-4">
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
                    <div key={idx} className="flex gap-4 items-start group p-4 rounded-2xl border border-white/5 bg-white/[0.02] md:hover:bg-white/10 md:hover:border-cyan-400/30 transition-all duration-300">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl primesec-navy-chip border border-white/10 text-cyan-400 md:group-hover:border-cyan-400/50 md:group-hover:shadow-lg md:group-hover:shadow-cyan-500/20 transition-all duration-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base md:group-hover:text-cyan-300 transition-colors">{feat.title}</h4>
                        <p className="mt-1.5 text-xs text-[#b8c7dd] md:group-hover:text-white/80 leading-relaxed transition-colors">{feat.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: CTA Buttons & Quick Note */}
            <div className="xl:col-span-4 flex flex-col justify-between bg-gradient-to-br from-white/[0.08] to-white/[0.03] border border-white/15 rounded-[28px] p-6 md:p-8 backdrop-blur-md shadow-xl md:hover:shadow-2xl md:hover:border-white/30 md:hover:from-white/[0.12] md:hover:to-white/[0.06] transition-all duration-300">
              <div>
                <h3 className="font-extrabold text-xl text-white">Hemen Başlayın</h3>
                <p className="mt-2 text-xs text-[#b8c7dd] leading-relaxed">
                  Birkaç dakikada ihtiyacınızı belirleyin, keşif ekibimiz sizinle iletişime geçsin.
                </p>
              </div>

              <div className="flex flex-col gap-3 my-6">
                <Link
                  href="/kendi-sistemini-tasarla"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl font-bold h-[58px] px-6 text-base bg-white text-primary-600 border border-transparent md:hover:bg-cyan-100 md:hover:shadow-lg md:hover:scale-[1.02] md:active:scale-[0.98] transition-all duration-200"
                >
                  Kendi Sistemini Tasarla <ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
                <ButtonLink
                  href={whatsappUrl("Merhaba, PrimeSec Teknoloji ile güvenlik sistemimi planlamak istiyorum.")}
                  variant="whatsapp"
                  size="lg"
                  className="w-full justify-center flex items-center gap-2"
                >
                  <svg className="h-5 w-5 fill-current shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp'tan Yaz
                </ButtonLink>
              </div>

              <div className="pt-4 border-t border-white/10 text-center">
                <p className="text-[11px] text-[#b8c7dd]/70 flex items-center justify-center gap-1.5">
                  <span className="text-[#3d6b93]">▲</span> Keşif ve danışmanlık hizmetimiz tamamen ücretsizdir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
