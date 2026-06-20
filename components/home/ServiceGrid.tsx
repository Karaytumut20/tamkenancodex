"use client";

import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useMemo, useState, useRef, useEffect } from "react";
import { cn } from "@/lib/cn";

type ServiceCard = {
  title: string;
  description: string;
  href: string;
  image: string;
  category: string;
};

const defaultServices: ServiceCard[] = [
  { title: "CCTV Kamera", description: "Yüksek çözünürlüklü kamera ve kayıt sistemleri.", href: "/kamera-sistemleri/cctv-kamera", image: "/images/kamera-sistemi.svg", category: "Kamera" },
  { title: "Hırsız Alarm", description: "Ev ve iş yerleri için 7/24 alarm koruması.", href: "/alarm-sistemleri", image: "/images/alarm-sistemi.svg", category: "Alarm" },
  { title: "Yangın İhbar", description: "Erken algılama ve profesyonel yangın ihbar çözümleri.", href: "/yangin-ihbar-sistemleri", image: "/images/yangin-alarm.svg", category: "Alarm" },
  { title: "Araç Takip", description: "Filo ve araç güvenliği için canlı takip.", href: "/arac-takip-sistemleri", image: "/images/arac-takip.svg", category: "Kurumsal" },
  { title: "Araç Kamerası", description: "Araç içi ve dışı kayıt çözümleriyle yolculuklarınızı kayıt altında tutun.", href: "/arac-kamerasi", image: "/images/arac-takip.svg", category: "Kamera" },
  { title: "Personel Takip PDKS", description: "Personel giriş çıkışlarını raporlayan sistemler.", href: "/personel-takip-pdks", image: "/images/pdks.svg", category: "Kurumsal" },
  { title: "Kapı Geçiş Sistemleri", description: "Kartlı geçiş ve kontrollü erişim çözümleri.", href: "/kapi-gecis-sistemleri", image: "/images/pdks.svg", category: "Kurumsal" },
  { title: "IP Diafon Sistemleri", description: "Apartman, site ve ofisler için görüntülü IP diafon çözümleri.", href: "/ip-diafon-sistemleri", image: "/images/akilli-ev.svg", category: "Akıllı Ev" },
  { title: "Restoran POS Yazılımı", description: "Restoran ve kafeler için sipariş, masa ve ödeme çözümleri.", href: "/restoran-pos-yazilimi", image: "/images/network.svg", category: "Kurumsal" },
  { title: "Network Çözümleri", description: "Kamera ve ofis cihazları için stabil altyapı.", href: "/network-cozumleri", image: "/images/network.svg", category: "Network" },
];

const defaultTabs = ["Tümü", "Kamera", "Alarm", "Akıllı Ev", "Kurumsal", "Network"];

interface ServiceGridProps {
  dynamicData?: {
    tabs: any[];
    services: any[];
  };
}

export function ServiceGrid({ dynamicData }: ServiceGridProps) {
  // Veritabanında veri yoksa varsayılanları kullan
  const hasDynamicData = dynamicData && dynamicData.tabs && dynamicData.tabs.length > 0;
  
  const tabs = useMemo(() => {
    return hasDynamicData 
      ? ["Tümü", ...dynamicData.tabs.map(t => t.title)] 
      : defaultTabs;
  }, [dynamicData, hasDynamicData]);
    
  const services = hasDynamicData
    ? dynamicData.services.map(s => {
        const tab = dynamicData.tabs.find(t => t.id === s.tab_id);
        return {
          title: s.title,
          description: s.description || "",
          href: s.link || "#",
          image: s.image || "/images/kamera-sistemi.svg",
          category: tab ? tab.title : "Tümü"
        };
      })
    : defaultServices;

  const [tab, setTab] = useState("Tümü");
  const filtered = useMemo(() => (tab === "Tümü" ? services : services.filter((service) => service.category === tab)), [tab, services]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (el) {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setCanScrollLeft(scrollLeft > 1);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkScroll();
      // Use standard delay to ensure elements are layout-complete
      const timer = setTimeout(checkScroll, 100);
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        clearTimeout(timer);
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [tabs]);

  const scrollTabs = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (el) {
      const scrollAmount = 200;
      el.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const visible = useMemo(() => {
    return filtered;
  }, [filtered]);

  return (
    <section className="bg-[#FFFFFF] relative overflow-hidden py-16 md:py-24">
      {/* Background Decorations */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 right-1/4 w-[600px] h-[300px] bg-[radial-gradient(circle_at_center,_rgba(0,107,255,0.08)_0%,_transparent_70%)] blur-[95px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[250px] bg-[radial-gradient(circle_at_center,_rgba(24,191,255,0.08)_0%,_transparent_70%)] blur-[95px]" />
      </div>

      <div className="container-primesec relative z-10">
        <div className="mb-10 flex flex-col items-start gap-6">
          <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-[#FFFFFF] shrink-0">
                <span className="h-4 w-4 rounded-full border-4 border-cyan-500" />
              </span>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-cyan-500">PrimeSec hizmetleri</p>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-[-0.03em] text-ink">Güvenlik hizmet alanları</h2>
          </div>
          
          <div className="relative w-full">
            {/* Left Scroll Gradient Overlay */}
            <div
              className={cn(
                "absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-10 transition-opacity duration-300",
                canScrollLeft ? "opacity-100" : "opacity-0"
              )}
            />
            {/* Right Scroll Gradient Overlay */}
            <div
              className={cn(
                "absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-10 transition-opacity duration-300",
                canScrollRight ? "opacity-100" : "opacity-0"
              )}
            />

            {/* Left Scroll Button */}
            {canScrollLeft && (
              <button
                onClick={() => scrollTabs("left")}
                className="absolute left-1 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white shadow-md text-ink hover:text-cyan-500 hover:border-cyan-500 transition-all duration-200"
                aria-label="Sola kaydır"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}

            {/* Right Scroll Button */}
            {canScrollRight && (
              <button
                onClick={() => scrollTabs("right")}
                className="absolute right-1 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white shadow-md text-ink hover:text-cyan-500 hover:border-cyan-500 transition-all duration-200"
                aria-label="Sağa kaydır"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}

            {/* Tabs List */}
            <div
              ref={scrollRef}
              onScroll={checkScroll}
              className="flex items-center gap-2 overflow-x-auto max-w-full -mx-4 px-4 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden whitespace-nowrap flex-nowrap scroll-smooth py-1"
            >
              {tabs.map((item) => (
                <button
                  key={item}
                  onClick={() => setTab(item)}
                  className={cn(
                    "h-8 rounded-full px-4 text-xs font-extrabold transition-all duration-200 shrink-0", 
                    tab === item 
                      ? "primesec-navy-action text-white border border-transparent !shadow-none" 
                      : "border border-border md:hover:border-cyan-500 bg-white text-ink-muted md:hover:text-cyan-500 md:hover:bg-cyan-50/10"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_1fr_minmax(0,330px)]">
          {/* Mobile & Tablet: Horizontal Scroll */}
          <div className="xl:hidden overflow-x-auto -mx-4 sm:-mx-5 md:-mx-8 pt-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-4 px-4 sm:px-5 md:px-8" style={{ scrollSnapType: 'x mandatory' }}>
              {filtered.map((service, index) => (
                <div
                  key={service.title}
                  className={cn(
                    "group flex flex-col justify-start min-h-[200px] w-[280px] md:w-[320px] flex-shrink-0 overflow-hidden rounded-[24px] border border-border md:hover:border-cyan-500 md:hover:shadow-lg transition-all duration-300 bg-white p-5 md:hover:-translate-y-1"
                  )}
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <h3 className="text-xl font-black leading-tight tracking-[-0.04em] text-ink break-words">{service.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-muted break-words">{service.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: Grid */}
          <div className="hidden xl:grid gap-4 md:grid-cols-2 xl:col-span-2 content-start">
            {visible.map((service, index) => {
              if ("placeholder" in service && service.placeholder) {
                return (
                  <div
                    key={service.title}
                    className="hidden min-h-[245px] rounded-[24px] border border-dashed border-[#D8DDE6] bg-[#FFFFFF] md:block"
                  />
                );
              }
              return (
                <div
                  key={service.title}
                  className={cn(
                    "group flex flex-col justify-start min-h-[245px] overflow-hidden rounded-[24px] border border-border md:hover:border-cyan-500 md:hover:shadow-lg transition-all duration-300 bg-white p-5 md:hover:-translate-y-1"
                  )}
                >
                  <h3 className="text-2xl font-black leading-tight tracking-[-0.04em] text-ink break-words">{service.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-muted break-words">{service.description}</p>
                </div>
              );
            })}
          </div>

          <aside className="flex min-h-[300px] flex-col justify-between rounded-[28px] border border-white/10 primesec-navy-surface p-7 text-white shadow-xl md:hover:shadow-2xl md:hover:border-cyan-300/40 transition-all duration-300 xl:min-h-[506px]">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-white/65">PrimeSec Plan</p>
              <h3 className="mt-4 text-3xl font-black leading-tight tracking-[-0.045em]">Güvenliğinizi Kendiniz Tasarlayın</h3>
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
