import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Award, ChevronRight, Headphones, SlidersHorizontal, Sparkles, Wrench } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const trust = [
  { label: "7/24 Destek", icon: Headphones },
  { label: "Ücretsiz Keşif", icon: Sparkles },
  { label: "2 Yıl Garanti", icon: Award },
  { label: "Hızlı Kurulum", icon: Wrench },
];

export function Hero() {
  return (
    <section className="hero-bg py-4">
      <Container className="bg-transparent">
        <div className="desktop-grid min-h-[560px] items-center pb-6 pt-6 lg:pb-8 lg:pt-8">
          <div className="col-span-4 md:col-span-8 xl:col-span-5">
            <h1 className="max-w-3xl text-[clamp(40px,5vw,74px)] font-black leading-[0.94] tracking-[-0.065em] text-white">
              Sizin İçin Tasarlanan Akıllı Güvenlik Çözümleri
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-ink-lightMuted md:text-base">
              Akıllı kamera, alarm ve güvenlik ürünleriyle eviniz ve iş yeriniz için sade, güçlü ve entegre çözümler tasarlıyoruz.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <HeroCta href="/urunler" icon={<SlidersHorizontal className="h-5 w-5" />} title="Ürünler" subtitle="Kataloğu incele" primary />
            </div>
          </div>
          <div className="col-span-4 mt-10 md:col-span-8 xl:col-span-7 xl:mt-0">
            <div className="relative mx-auto h-[330px] max-w-[760px] md:h-[470px]">
              <div className="absolute left-[33%] top-[30%] z-10 rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white shadow-[0_12px_35px_rgba(0,0,0,0.20)] backdrop-blur-sm">
                7/24 GÜVENLİK
              </div>
              <div className="absolute right-[8%] top-[24%] h-[210px] w-[350px] rotate-[-18deg] rounded-[34px] bg-primary-600 shadow-[0_32px_80px_rgba(0,107,255,0.28)] md:h-[260px] md:w-[430px]" />
              <Image src="/images/primesec-hero-guvenlik-sistemleri.svg" alt="PrimeSec kamera alarm ve akıllı ev güvenlik cihazları" fill priority className="object-contain drop-shadow-[0_35px_70px_rgba(15,23,42,0.22)]" unoptimized />
            </div>
          </div>
          <div className="col-span-4 md:col-span-8 xl:col-span-12">
            <div className="grid gap-3 md:grid-cols-[1fr_310px]">
              <div className="flex items-center rounded-[20px] bg-white/10 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.20)] backdrop-blur-sm">
                <div className="flex flex-wrap items-center gap-4">
                  {trust.slice(0, 3).map((item) => (
                    <span key={item.label} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-extrabold text-white">
                      <item.icon className="h-4 w-4 text-primary-300" /> {item.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-[20px] bg-primary-600 p-4 text-white shadow-[0_18px_50px_rgba(0,107,255,0.28)]">
                <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-white/65">PrimeSec</p>
                <div className="mt-2 flex items-center justify-between gap-4">
                  <span className="text-sm font-extrabold">Teklifinizi birlikte netleştirelim.</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary-600">
                    <ChevronRight className="h-5 w-5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function HeroCta({ href, icon, title, subtitle, primary = false }: { href: string; icon: ReactNode; title: string; subtitle: string; primary?: boolean }) {
  return (
    <ButtonLink href={href} size="lg" variant={primary ? "primary" : "outlineBlue"} className={primary ? "rounded-full bg-primary-600 shadow-none" : "rounded-full border-[#CBD3DF] bg-white text-ink hover:bg-ink hover:text-white"}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">{icon}</span>
      <span className="text-left">
        <span className="block text-sm font-extrabold leading-tight">{title}</span>
        <span className="block text-xs font-semibold opacity-70">{subtitle}</span>
      </span>
    </ButtonLink>
  );
}
