"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="hero-bg relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4 font-sans overflow-hidden">
      
      {/* ── BACKGROUND GLOWS ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[20%] w-[60vw] h-[50vh] bg-[radial-gradient(circle_at_center,_rgba(0,107,255,0.2)_0%,_transparent_70%)] blur-[100px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[50vw] h-[50vh] bg-[radial-gradient(circle_at_center,_rgba(24,191,255,0.12)_0%,_transparent_70%)] blur-[90px]" />
      </div>

      <div className="relative z-10 max-w-md mx-auto flex flex-col items-center">
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-red-950/20 text-red-500 mb-6"
        >
          <ShieldAlert className="w-8 h-8" />
        </motion.div>

        {/* 404 Title */}
        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-7xl font-extrabold text-white tracking-tight"
        >
          404
        </motion.h1>

        {/* Subtitle */}
        <motion.h2
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-4 text-xl font-bold text-white"
        >
          Aradığınız Sayfa Bulunamadı
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-2 text-[#b8c7dd] text-sm leading-relaxed"
        >
          Ulaşmaya çalıştığınız sayfa silinmiş, adı değiştirilmiş veya geçici olarak kullanım dışı bırakılmış olabilir.
        </motion.p>

        {/* Action Button */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row gap-3 w-full"
        >
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full px-6 h-12 rounded-full bg-white text-[#031a46] font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Home className="w-4 h-4" />
            Ana Sayfaya Dön
          </Link>
          <Link
            href="/iletisim"
            className="flex items-center justify-center w-full px-6 h-12 rounded-full border border-white/10 bg-white/5 text-white font-bold text-sm hover:bg-white/10 transition-all"
          >
            İletişime Geç
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
