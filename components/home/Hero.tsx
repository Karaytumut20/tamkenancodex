"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="hero-bg relative min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-16 lg:py-0 font-sans">
      
      {/* Background radial glow - WhyPrimeSec/SystemBuilderCTA ile tutarlı */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(circle_at_center,_rgba(0,107,255,0.15)_0%,_transparent_70%)] blur-[95px]" />
      </div>

      <div className="container-primesec relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Column: Text & Buttons */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-[6px] rounded-full border border-[#1683FF]/30 primesec-navy-chip backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-cyan-500" />
            <span className="text-[12px] font-bold text-[#b8c7dd] tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              GÜVENLİK SİSTEMLERİ TEKNOLOJİSİ
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-[clamp(2.25rem,5vw,4rem)] leading-[1.1] font-extrabold tracking-[-0.04em] text-white max-w-[650px]">
            Güvenlik Vizyonunuzu <br />
            <span className="gradient-text">Yeniden Tasarlayın</span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-[16px] md:text-[18px] text-[#B8C7DD] font-medium max-w-[600px] leading-relaxed">
            PrimeSec, eviniz ve işletmeniz için yapay zeka entegrasyonlu CCTV kamera, hırsız alarm ve akıllı otomasyon sistemlerini tek noktadan yönetmenizi sağlar.
          </p>

          {/* Feature List - SystemBuilderCTA tarzında kartlar */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[600px] mx-auto lg:mx-0">
            {[
              { icon: CheckCircle2, text: "Yapay Zeka Analizli Kameralar" },
              { icon: CheckCircle2, text: "7/24 Kesintisiz Alarm İzleme" },
              { icon: CheckCircle2, text: "Mobil Uygulama Kontrolü" },
              { icon: CheckCircle2, text: "Ücretsiz Profesyonel Keşif" }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex gap-3 items-start group p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-300">
                  <Icon className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors">{item.text}</span>
                </div>
              );
            })}
          </div>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4 w-full">
            <Link
              href="/iletisim"
              className="group relative inline-flex items-center justify-center px-8 py-4 rounded-full primesec-navy-action border border-primary-500/30 text-white font-bold text-[15px] hover:border-primary-400/50 hover:shadow-lg hover:shadow-primary-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Hemen Keşif Al
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/kendi-sistemini-tasarla"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/15 bg-white/5 text-white font-bold text-[15px] hover:bg-white/[0.12] hover:border-white/30 hover:shadow-lg hover:shadow-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 backdrop-blur-sm"
            >
              Kendi Sistemini Tasarla
            </Link>
          </div>
        </div>

        {/* Right Column: Static Image */}
        <div className="lg:col-span-5 w-full flex justify-center items-center relative">
          <div className="w-full max-w-[450px] lg:max-w-none relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-primary-600/10">
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
