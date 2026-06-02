"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";

type ServiceCard = {
  title: string;
  description: string;
  href: string;
  image: string;
  category: string;
};

const services: ServiceCard[] = [
  { title: "CCTV Kamera", description: "Yüksek çözünürlüklü kamera ve kayıt sistemleri.", href: "/kamera-sistemleri/cctv-kamera", image: "/images/kamera-sistemi.svg", category: "Kamera" },
  { title: "Hırsız Alarm", description: "Ev ve iş yerleri için 7/24 alarm koruması.", href: "/alarm-sistemleri", image: "/images/alarm-sistemi.svg", category: "Alarm" },
  { title: "Akıllı Ev Sistemleri", description: "Konfor ve güvenliği tek uygulamada yönetin.", href: "/akilli-ev-sistemleri", image: "/images/akilli-ev.svg", category: "Akıllı Ev" },
  { title: "Network Çözümleri", description: "Kamera ve ofis cihazları için stabil altyapı.", href: "/network-cozumleri", image: "/images/network.svg", category: "Network" },
  { title: "Yangın İhbar", description: "Erken algılama ve profesyonel yangın ihbar çözümleri.", href: "/yangin-ihbar-sistemleri", image: "/images/yangin-alarm.svg", category: "Alarm" },
  { title: "Personel Takip PDKS", description: "Personel giriş çıkışlarını raporlayan sistemler.", href: "/personel-takip-pdks", image: "/images/pdks.svg", category: "Kurumsal" },
  { title: "Kapı Geçiş Sistemleri", description: "Kartlı geçiş ve kontrollü erişim çözümleri.", href: "/kapi-gecis-sistemleri", image: "/images/pdks.svg", category: "Kurumsal" },
  { title: "Araç Takip", description: "Filo ve araç güvenliği için canlı takip.", href: "/arac-takip-sistemleri", image: "/images/arac-takip.svg", category: "Kurumsal" },
];

const tabs = ["Tümü", "Kamera", "Alarm", "Akıllı Ev", "Kurumsal", "Network"];

export function ServiceGrid() {
  const [tab, setTab] = useState("Tümü");
  const filtered = useMemo(() => (tab === "Tümü" ? services : services.filter((service) => service.category === tab)), [tab]);
  const visible = useMemo(() => {
    const list = [...filtered.slice(0, 4)];
    while (list.length < 4) {
      list.push({
        title: `placeholder-${list.length}`,
        description: "",
        href: "",
        image: "",
        category: "",
        placeholder: true,
      } as any);
    }
    return list;
  }, [filtered]);

  return (
    <section className="bg-[#FFFFFF] relative overflow-hidden px-3 py-16 md:py-24">
      {/* Background Decorations */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 right-1/4 w-[600px] h-[300px] bg-[radial-gradient(circle_at_center,_rgba(0,107,255,0.08)_0%,_transparent_70%)] blur-[95px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[250px] bg-[radial-gradient(circle_at_center,_rgba(24,191,255,0.08)_0%,_transparent_70%)] blur-[95px]" />
      </div>

      <div className="container-primesec relative z-10">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-[#FFFFFF]">
              <span className="h-4 w-4 rounded-full border-4 border-cyan-500" />
            </span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-cyan-500">PrimeSec hizmetleri</p>
              <h2 className="text-lg font-black tracking-[-0.03em] text-ink">Güvenlik hizmet alanları</h2>
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            {tabs.map((item) => (
              <button
                key={item}
                onClick={() => setTab(item)}
                className={cn("h-8 rounded-full px-4 text-xs font-extrabold transition-all duration-200", tab === item ? "primesec-navy-action text-white shadow-md md:hover:shadow-lg" : "border border-border md:hover:border-cyan-500 bg-white text-ink-muted md:hover:text-cyan-500 md:hover:bg-cyan-50/10")}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_1fr_330px]">
          {/* Mobile: Horizontal Scroll */}
          <div className="md:hidden -mx-3 px-3 overflow-x-auto pt-4 pb-4">
            <div className="flex gap-4" style={{ scrollSnapType: 'x mandatory' }}>
              {services.map((service, index) => (
                <Link
                  key={service.title}
                  href={service.href}
                  className={cn(
                    "group flex flex-col justify-between min-h-[260px] w-[280px] flex-shrink-0 overflow-hidden rounded-[24px] border border-border md:hover:border-cyan-500 md:hover:shadow-lg transition-all duration-300 bg-white p-5 md:hover:-translate-y-1"
                  )}
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold text-ink-muted">Hizmet</p>
                      <h3 className="mt-2 max-w-[220px] text-2xl font-black leading-tight tracking-[-0.04em] text-ink">{service.title}</h3>
                      <p className="mt-3 max-w-[260px] text-sm leading-6 text-ink-muted">{service.description}</p>
                    </div>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full primesec-navy-action text-white md:group-hover:bg-cyan-500 transition-colors duration-300">
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="relative mt-4 h-24 w-full flex-1">
                    <Image src={service.image} alt={`${service.title} hizmet görseli`} fill className="object-contain object-right-bottom" unoptimized />
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="inline-flex h-8 items-center justify-center rounded-full primesec-navy-action px-4 text-xs font-extrabold text-white md:group-hover:bg-cyan-500 transition-colors duration-300">İncele</span>
                    <span className="inline-flex h-8 items-center justify-center rounded-full bg-[#FFFFFF] px-4 text-xs font-extrabold text-ink-muted md:group-hover:text-cyan-500 transition-colors duration-300">Teklif Al</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop: Grid */}
          <div className="hidden md:grid gap-4 md:grid-cols-2 xl:col-span-2 content-start">
            {visible.map((service, index) => {
              if ("placeholder" in service && service.placeholder) {
                return (
                  <div
                    key={service.title}
                    className="hidden min-h-[260px] rounded-[24px] border border-dashed border-[#D8DDE6] bg-[#FFFFFF] md:block"
                  />
                );
              }
              return (
                <Link
                  key={service.title}
                  href={service.href}
                  className={cn(
                    "group flex flex-col justify-between min-h-[260px] overflow-hidden rounded-[24px] border border-border md:hover:border-cyan-500 md:hover:shadow-lg transition-all duration-300 bg-white p-5 md:hover:-translate-y-1"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold text-ink-muted">Hizmet</p>
                      <h3 className="mt-2 max-w-[220px] text-2xl font-black leading-tight tracking-[-0.04em] text-ink">{service.title}</h3>
                      <p className="mt-3 max-w-[260px] text-sm leading-6 text-ink-muted">{service.description}</p>
                    </div>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full primesec-navy-action text-white md:group-hover:bg-cyan-500 transition-colors duration-300">
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="relative mt-4 h-24 w-full flex-1">
                    <Image src={service.image} alt={`${service.title} hizmet görseli`} fill className="object-contain object-right-bottom" unoptimized />
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="inline-flex h-8 items-center justify-center rounded-full primesec-navy-action px-4 text-xs font-extrabold text-white md:group-hover:bg-cyan-500 transition-colors duration-300">İncele</span>
                    <span className="inline-flex h-8 items-center justify-center rounded-full bg-[#FFFFFF] px-4 text-xs font-extrabold text-ink-muted md:group-hover:text-cyan-500 transition-colors duration-300">Teklif Al</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <aside className="flex min-h-[506px] flex-col justify-between rounded-[28px] border border-white/10 primesec-navy-surface p-7 text-white shadow-xl md:hover:shadow-2xl md:hover:border-cyan-300/40 transition-all duration-300">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-white/65">PrimeSec Plan</p>
              <h3 className="mt-4 text-3xl font-black leading-tight tracking-[-0.045em]">Güvenliğinizi Kendiniz Tasarlayın</h3>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Alarm", "Kamera", "Network", "Destek"].map((item) => (
                  <span key={item} className="rounded-full bg-white/10 backdrop-blur-sm px-3 py-1.5 text-xs font-extrabold text-white border border-white/20">{item}</span>
                ))}
              </div>
              <p className="mt-6 text-sm leading-7 text-white/80">
                Alanınıza özel güvenlik planı oluşturun. PrimeSec ekibi kamera, alarm, akıllı ev ve teknik destek ihtiyaçlarını tek teklif içinde netleştirir.
              </p>
            </div>
            <div className="flex flex-col gap-2 mt-6">
              <Link href="/kendi-sistemini-tasarla" className="flex h-12 items-center justify-center rounded-full bg-white px-5 text-sm font-extrabold text-primary-600 md:hover:bg-cyan-500 md:hover:text-white md:hover:shadow-lg transition-all duration-300">
                Kendi Sistemini Tasarla
              </Link>
              <Link href="/iletisim" className="flex h-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-5 text-sm font-extrabold text-white md:hover:bg-cyan-500 md:hover:border-cyan-500 transition-all duration-300">
                Teklif Al
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
