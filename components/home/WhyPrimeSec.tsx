import { Container } from "@/components/ui/Container";
import { Award, Zap, Users, Clock } from "lucide-react";

const reasons = [
  {
    icon: Award,
    title: "15+ Yıllık Deneyim",
    desc: "Binlerce müşteriye profesyonel güvenlik çözümleri sunuyoruz.",
  },
  {
    icon: Zap,
    title: "Hızlı Kurulum",
    desc: "Keşiften kuruluma 24-48 saat içinde tamamlıyoruz.",
  },
  {
    icon: Users,
    title: "Bizzat Danışmanlık",
    desc: "Sizin ihtiyacınıza özel sistem tasarımı yapıyoruz.",
  },
  {
    icon: Clock,
    title: "7/24 Destek",
    desc: "Satış sonrası da kesintisiz teknik destek sunuyoruz.",
  },
];

export function WhyPrimeSec() {
  return (
    <section className="hero-bg py-16 md:py-24 text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(circle_at_center,_rgba(0,107,255,0.15)_0%,_transparent_70%)] blur-[95px]" />
      </div>

      <Container>
        <div className="relative z-10 text-center max-w-3xl mx-auto mb-12">
          <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-cyan-400">Neden Biz?</p>
          <h2 className="mt-3 text-[clamp(30px,3.2vw,48px)] font-extrabold leading-none tracking-[-0.045em] text-white">
            Neden PrimeSec Teknoloji?
          </h2>
          <p className="mt-4 text-base leading-7 text-white/80">
            Güvenlik sistemlerini sadece cihaz montajı olarak değil, uzun vadeli bir yaşam ve iş alanı koruma mimarisi olarak görüyoruz.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <div
                key={reason.title}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 md:hover:bg-white/10 transition-all duration-300 group flex items-center gap-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/10 text-cyan-400 md:group-hover:bg-white/20 transition-all duration-300">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white leading-snug">{reason.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">{reason.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
