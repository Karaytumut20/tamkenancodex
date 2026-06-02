"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="hero-bg relative overflow-hidden pt-24 pb-10 font-sans sm:pt-28 sm:pb-14 lg:flex lg:min-h-screen lg:items-center lg:justify-center lg:py-0">
      
      {/* Background radial glow - WhyPrimeSec/SystemBuilderCTA ile tutarlı */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(circle_at_center,_rgba(0,107,255,0.15)_0%,_transparent_70%)] blur-[95px]" />
      </div>

      <div className="container-primesec relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-8">
        
        {/* Left Column: Text & Buttons */}
        <div className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">
          {/* Badge */}
          <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-[#1683FF]/30 px-3 py-[6px] primesec-navy-chip backdrop-blur-md sm:px-4 lg:mb-6">
            <span className="h-2 w-2 rounded-full bg-cyan-500" />
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-[#b8c7dd] sm:text-[12px]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              GÜVENLİK SİSTEMLERİ TEKNOLOJİSİ
            </span>
          </div>

          {/* Heading */}
          <h1 className="max-w-[650px] text-[36px] font-extrabold leading-[1.05] tracking-normal text-white sm:text-[44px] lg:text-[64px]">
            Güvenlik Vizyonunuzu <br />
            <span className="gradient-text">Yeniden Tasarlayın</span>
          </h1>

          {/* Description */}
          <p className="mt-4 max-w-[560px] text-[15px] font-medium leading-7 text-[#B8C7DD] sm:text-[16px] md:text-[18px] lg:mt-6">
            PrimeSec, eviniz ve işletmeniz için yapay zeka entegrasyonlu CCTV kamera, hırsız alarm ve akıllı otomasyon sistemlerini tek noktadan yönetmenizi sağlar.
          </p>

          {/* Buttons */}
          <div className="mt-6 flex w-full max-w-[336px] flex-col justify-center gap-3 sm:max-w-none sm:flex-row lg:mt-10 lg:justify-start lg:gap-4">
            <Link
              href="/iletisim"
              className="group relative inline-flex h-14 w-full items-center justify-center rounded-full border border-transparent bg-white px-6 text-[15px] font-bold text-primary-600 transition-all duration-200 md:hover:scale-[1.02] md:hover:bg-cyan-100 md:hover:shadow-lg md:active:scale-[0.98] sm:max-w-[244px]"
            >
              Hemen Keşif Al
              <ArrowRight className="w-4 h-4 ml-2 md:group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/kendi-sistemini-tasarla"
              className="inline-flex h-14 w-full items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 text-[15px] font-bold text-white backdrop-blur-sm transition-all duration-200 md:hover:scale-[1.02] md:hover:border-white/30 md:hover:bg-white/[0.12] md:hover:shadow-lg md:hover:shadow-white/10 md:active:scale-[0.98] sm:max-w-[244px]"
            >
              Kendi Sistemini Tasarla
            </Link>
          </div>

          {/* Feature List - SystemBuilderCTA tarzında kartlar */}
          <div className="mx-auto mt-6 grid max-w-[600px] grid-cols-2 gap-2.5 sm:gap-4 lg:mx-0 lg:mt-8">
            {[
              { icon: CheckCircle2, text: "Yapay Zeka Analizli Kameralar" },
              { icon: CheckCircle2, text: "7/24 Kesintisiz Alarm İzleme" },
              { icon: CheckCircle2, text: "Mobil Uygulama Kontrolü" },
              { icon: CheckCircle2, text: "Ücretsiz Profesyonel Keşif" }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="group flex items-start gap-2 rounded-lg border border-white/10 bg-white/[0.04] p-2.5 transition-all duration-300 md:hover:border-cyan-400/30 md:hover:bg-white/10 sm:gap-3 sm:rounded-xl sm:p-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400 sm:h-5 sm:w-5" />
                  <span className="text-left text-[12px] font-semibold leading-5 text-white/90 transition-colors md:group-hover:text-white sm:text-sm">
                    {item.text === "Ücretsiz Profesyonel Keşif" ? (
                      <>
                        <span className="whitespace-nowrap">Ücretsiz Profesyonel</span>
                        <span className="block">Keşif</span>
                      </>
                    ) : (
                      item.text
                    )}
                  </span>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Static Image */}
        <div className="relative flex w-full items-center justify-center lg:col-span-5">
          <div className="relative aspect-[4/3] w-full max-w-[330px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-primary-600/10 sm:max-w-[450px] lg:max-w-none">
            {/* Soft decorative glow behind the image */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(24,191,255,0.12)_0%,_rgba(0,107,255,0.08)_42%,_transparent_72%)] rounded-full filter blur-3xl pointer-events-none" />
            
            <Image
              src="/images/primesec-hero-human.png"
              alt="PrimeSec Güvenlik Sistemleri"
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        </div>

      </div>
    </section>
  );
}
