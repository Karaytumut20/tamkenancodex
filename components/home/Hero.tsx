"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-[#031a46] text-center px-4 font-sans pt-20 pb-10">
      
      {/* ── FRAMER STYLE BACKGROUND GRADIENTS ── */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-end overflow-hidden">
         {/* Center Bottom Deep Blue Glow */}
         <div className="absolute bottom-[-30%] w-[150vw] md:w-[100vw] h-[80vh] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#0044FF]/40 via-[#0066FF]/10 to-transparent blur-[80px]" />
         
         {/* Bottom Left Deep Purple/Navy */}
         <div className="absolute bottom-[0%] left-[-20%] w-[60vw] h-[60vh] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#0C2556]/60 via-[#031a46]/20 to-transparent blur-[100px]" />
         
         {/* Bottom Right Bright Cyan */}
         <div className="absolute bottom-[5%] right-[-10%] w-[50vw] h-[60vh] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00C2FF]/20 via-[#0088FF]/5 to-transparent blur-[90px]" />
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Badge (Check out our 2023 Recap equivalent) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <div className="inline-flex items-center px-4 py-[6px] rounded-full border border-white/10 bg-[#081C44]/50 backdrop-blur-md">
            <span className="text-[12px] font-medium text-white/70 tracking-wide">
               Yeni nesil entegrasyonu keşfedin
            </span>
          </div>
        </motion.div>

        {/* Headline (The internet is your canvas equivalent) */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(2.5rem,10vw,8.5rem)] leading-[1.05] font-bold tracking-[-0.04em] md:tracking-[-0.05em] text-white max-w-[1100px]"
        >
          Güvenlik vizyonu
          <br className="hidden sm:block" />
          yeniden tasarlandı.
        </motion.h1>

        {/* Subhead (Framer is where teams... equivalent) */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 md:mt-8 text-[15px] md:text-[18px] text-[#A1A1AA] font-medium max-w-[700px] leading-relaxed tracking-[-0.01em]"
        >
          PrimeSec, işletmelerin ve evlerin kusursuz güvenliği tasarlayıp <br className="hidden sm:block" /> uçtan uca yönettiği yerdir.
        </motion.p>

        {/* CTA Area with Framer Particles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-10 md:mt-12"
        >
          {/* Framer Dust/Particles */}
          <div className="absolute inset-0 -z-10 pointer-events-none flex justify-center">
             <div className="absolute top-[-30px] left-[10px] w-[2px] h-[2px] bg-white rounded-full animate-pulse" style={{ animationDuration: '2s' }} />
             <div className="absolute top-[-10px] left-[-40px] w-[1.5px] h-[1.5px] bg-[#00D0FF] rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
             <div className="absolute top-[20px] right-[-45px] w-[2px] h-[2px] bg-[#0055FF] rounded-full animate-pulse" style={{ animationDuration: '2.5s' }} />
             <div className="absolute bottom-[-15px] left-[30px] w-[1px] h-[1px] bg-white/60 rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
             <div className="absolute top-[-50px] right-[20px] w-[1.5px] h-[1.5px] bg-[#00C2FF] rounded-full animate-pulse" style={{ animationDuration: '3.5s' }} />
          </div>

          {/* Glowing Pill Button */}
          <Link
            href="/iletisim"
            className="group relative inline-flex items-center justify-center px-6 py-[14px] md:px-8 md:py-[16px] rounded-full bg-white text-[#031a46] font-semibold text-[14px] md:text-[15px] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Hemen İletişime Geç
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
