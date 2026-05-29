"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Award, Headphones, SlidersHorizontal, Sparkles, Wrench, Shield, ShieldCheck, ChevronDown, Activity, Camera, Key, Terminal, Cpu } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const trust = [
  { label: "7/24 Teknik Destek", icon: Headphones },
  { label: "Ücretsiz Keşif", icon: Sparkles },
  { label: "2 Yıl Garanti", icon: Award },
  { label: "Hızlı Kurulum", icon: Wrench },
];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLElement>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  const { scrollYProgress: mobileScrollYProgress } = useScroll({
    target: mobileRef,
    offset: ["start start", "end start"]
  });

  const smoothScroll = useSpring(scrollYProgress, {
    damping: 30,
    stiffness: 70,
    mass: 0.8
  });
  const smoothMobileScroll = useSpring(mobileScrollYProgress, {
    damping: 32,
    stiffness: 82,
    mass: 0.7
  });

  useEffect(() => {
    const mockLogs = [
      "CAM_01: Hareket algılandı",
      "SYS: Güvenlik duvarı aktif",
      "LOCKED: Giriş kapısı kilitli",
      "SENS: Koridor sensörü aktif",
      "CAM_02: Kızılötesi devrede",
      "NET: Güvenli bağlantı sağlandı",
    ];
    setLogs(mockLogs.slice(0, 3));

    const interval = setInterval(() => {
      setLogs((prev) => {
        const nextLog = mockLogs[Math.floor(Math.random() * mockLogs.length)];
        return [nextLog, ...prev.slice(0, 2)];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const textX = useTransform(smoothScroll, [0, 0.45], [0, -120]);
  const textOpacity = useTransform(smoothScroll, [0, 0.4], [1, 0]);
  const textScale = useTransform(smoothScroll, [0, 0.4], [1, 0.9]);

  const card1X = useTransform(smoothScroll, [0, 0.7], [0, -200]);
  const card1Y = useTransform(smoothScroll, [0, 0.7], [0, -150]);
  const card1RotateX = useTransform(smoothScroll, [0, 0.7], [20, 0]);
  const card1RotateY = useTransform(smoothScroll, [0, 0.7], [-35, 0]);
  const card1Scale = useTransform(smoothScroll, [0, 0.7], [0.85, 1.05]);

  const card2X = useTransform(smoothScroll, [0, 0.7], [0, 180]);
  const card2Y = useTransform(smoothScroll, [0, 0.7], [0, -130]);
  const card2RotateX = useTransform(smoothScroll, [0, 0.7], [20, 0]);
  const card2RotateY = useTransform(smoothScroll, [0, 0.7], [-35, 0]);
  const card2Scale = useTransform(smoothScroll, [0, 0.7], [0.85, 1.05]);

  const card3X = useTransform(smoothScroll, [0, 0.7], [0, -190]);
  const card3Y = useTransform(smoothScroll, [0, 0.7], [0, 150]);
  const card3RotateX = useTransform(smoothScroll, [0, 0.7], [20, 0]);
  const card3RotateY = useTransform(smoothScroll, [0, 0.7], [-35, 0]);
  const card3Scale = useTransform(smoothScroll, [0, 0.7], [0.85, 0.95]);

  const card4X = useTransform(smoothScroll, [0, 0.7], [0, 190]);
  const card4Y = useTransform(smoothScroll, [0, 0.7], [0, 140]);
  const card4RotateX = useTransform(smoothScroll, [0, 0.7], [20, 0]);
  const card4RotateY = useTransform(smoothScroll, [0, 0.7], [-35, 0]);
  const card4Scale = useTransform(smoothScroll, [0, 0.7], [0.85, 0.95]);

  const centerScale = useTransform(smoothScroll, [0, 0.7, 1], [0.7, 1.25, 2.2]);
  const centerOpacity = useTransform(smoothScroll, [0, 0.2, 0.8, 1], [0.3, 0.95, 0.95, 0]);
  const centerRotate = useTransform(smoothScroll, [0, 1], [0, 90]);

  const containerScale = useTransform(smoothScroll, [0.4, 0.9], [1, 0.85]);
  const containerY = useTransform(smoothScroll, [0.6, 1], [0, -50]);
  const indicatorOpacity = useTransform(smoothScroll, [0, 0.15], [1, 0]);
  const mobileCopyY = useTransform(smoothMobileScroll, [0, 0.34], [0, -170]);
  const mobileCopyOpacity = useTransform(smoothMobileScroll, [0, 0.2, 0.38], [1, 0.48, 0]);
  const mobileCopyScale = useTransform(smoothMobileScroll, [0, 0.34], [1, 0.9]);
  const mobileVisualY = useTransform(smoothMobileScroll, [0, 0.42, 1], [12, -174, -210]);
  const mobileVisualScale = useTransform(smoothMobileScroll, [0, 0.48, 1], [0.92, 1.16, 1.22]);
  const mobileVisualOpacity = useTransform(smoothMobileScroll, [0, 0.12, 0.9, 1], [0.84, 1, 1, 0.68]);
  const mobileRadarScale = useTransform(smoothMobileScroll, [0, 1], [0.82, 1.35]);
  const mobileCardAY = useTransform(smoothMobileScroll, [0, 0.7], [0, -22]);
  const mobileCardBY = useTransform(smoothMobileScroll, [0, 0.7], [0, 24]);
  const mobileHintOpacity = useTransform(smoothMobileScroll, [0, 0.18], [1, 0]);

  return (
    <>
    <section ref={mobileRef} className="relative h-[178svh] bg-slate-950 text-white lg:hidden">
      <div className="sticky top-[72px] h-[calc(100svh-72px)] overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-screen"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 40%, transparent 12%, rgba(2, 6, 23, 0.98) 86%),
              linear-gradient(rgba(14, 165, 233, 0.16) 1.2px, transparent 1.2px),
              linear-gradient(90deg, rgba(14, 165, 233, 0.16) 1.2px, transparent 1.2px)
            `,
            backgroundSize: "100% 100%, 30px 30px, 30px 30px",
            backgroundPosition: "center"
          }}
        />
        <div className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-primary-600/20 blur-[90px]" />

        <div className="container-primesec relative z-10 flex h-full flex-col justify-center py-5">
          <motion.div style={{ y: mobileCopyY, opacity: mobileCopyOpacity, scale: mobileCopyScale }} className="origin-top">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1.5">
              <Shield className="h-4 w-4 shrink-0 text-primary-400" />
              <span className="truncate text-[10px] font-bold uppercase tracking-wider text-primary-300">
                Yapay Zeka Destekli Güvenlik
              </span>
            </div>

            <h1 className="mt-5 text-[34px] font-extrabold leading-[1.02] tracking-[-0.035em] text-white min-[390px]:text-[38px]">
              Eviniz ve İş Yeriniz İçin
              <span className="mt-1 block bg-gradient-to-r from-primary-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                Akıllı Güvenlik Tasarımı
              </span>
            </h1>

            <p className="mt-4 text-[15px] font-medium leading-7 text-ink-lightMuted">
              Yeni nesil kamera, alarm ve otomasyon sistemlerini yaşam alanınıza göre özel olarak tasarlıyoruz.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <ButtonLink href="/kendi-sistemini-tasarla" size="lg" className="h-[52px] w-full rounded-xl bg-primary-600 px-5 text-sm font-extrabold text-white shadow-none hover:bg-primary-500">
                <SlidersHorizontal className="h-5 w-5" /> Kendi Sistemini Tasarla
              </ButtonLink>
              <ButtonLink href="/urunler" variant="outlineBlue" size="lg" className="h-[52px] w-full rounded-xl border-white/20 bg-white/5 px-5 text-sm font-bold text-white hover:bg-white hover:text-navy-950">
                Ürünleri İncele
              </ButtonLink>
            </div>
          </motion.div>

          <motion.div style={{ y: mobileVisualY, scale: mobileVisualScale, opacity: mobileVisualOpacity }} className="relative mt-5 h-[255px] origin-center overflow-hidden rounded-2xl border border-cyan-400/20 bg-slate-950/70">
            <motion.div style={{ scale: mobileRadarScale }} className="absolute left-1/2 top-1/2 flex h-48 w-48 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-500/20">
              <div className="absolute h-[72%] w-[72%] rounded-full border border-dashed border-cyan-400/20" />
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-950/30">
                <ShieldCheck className="h-7 w-7 text-cyan-400" />
              </div>
            </motion.div>

            <motion.div style={{ y: mobileCardAY }} className="absolute left-5 top-5 h-28 w-40 rounded-xl border border-slate-800/80 bg-slate-950/90 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
              <div className="mb-2 flex items-center gap-1.5 border-b border-slate-800 pb-1.5 font-mono text-[8px] font-bold text-cyan-400">
                <Camera className="h-3.5 w-3.5" />
                CAM_01
              </div>
              <div className="h-14 rounded-lg border border-slate-900 bg-[radial-gradient(circle,rgba(6,182,212,0.18)_0%,rgba(15,23,42,0.9)_70%)]" />
            </motion.div>

            <motion.div style={{ y: mobileCardBY }} className="absolute bottom-5 right-5 h-28 w-40 rounded-xl border border-slate-800/80 bg-slate-950/90 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
              <div className="mb-2 flex items-center gap-1.5 border-b border-slate-800 pb-1.5 font-mono text-[8px] font-bold text-cyan-400">
                <Activity className="h-3.5 w-3.5" />
                SENSORS
              </div>
              <div className="space-y-2">
                <span className="block h-2 rounded bg-cyan-400/50" />
                <span className="block h-2 w-2/3 rounded bg-white/15" />
                <span className="block h-2 w-4/5 rounded bg-white/10" />
              </div>
            </motion.div>
          </motion.div>

          <motion.div style={{ opacity: mobileHintOpacity }} className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
            <span>Kaydır</span>
            <ChevronDown className="h-4 w-4 text-primary-400" />
          </motion.div>
        </div>
      </div>
    </section>

    <div ref={containerRef} className="relative hidden h-[200vh] w-full bg-slate-950 lg:block">
      <div className="sticky top-0 z-10 flex h-screen w-full items-center overflow-hidden border-b border-white/5 bg-slate-950">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-screen"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, transparent 10%, rgba(2, 6, 23, 0.98) 90%),
              linear-gradient(rgba(14, 165, 233, 0.15) 1.5px, transparent 1.5px),
              linear-gradient(90deg, rgba(14, 165, 233, 0.15) 1.5px, transparent 1.5px)
            `,
            backgroundSize: "100% 100%, 32px 32px, 32px 32px",
            backgroundPosition: "center"
          }}
        />

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-full max-w-7xl -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-primary-600/10 via-cyan-500/5 to-transparent opacity-70" />

        <Container className="relative z-10 flex h-full w-full flex-col justify-center">
          <motion.div
            className="grid w-full gap-12 lg:grid-cols-12 lg:items-center"
            style={{ scale: containerScale, y: containerY }}
          >
            <motion.div
              className="flex origin-left flex-col items-start text-left lg:col-span-6"
              style={{
                x: textX,
                opacity: textOpacity,
                scale: textScale
              }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-3.5 py-1.5">
                <Shield className="h-4 w-4 text-primary-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary-300">
                  Yapay Zeka Destekli Güvenlik
                </span>
              </div>

              <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Eviniz ve İş Yeriniz İçin <br />
                <span className="bg-gradient-to-r from-primary-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                  Akıllı Güvenlik Tasarımı
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base font-medium leading-relaxed text-ink-lightMuted sm:text-lg">
                Yeni nesil kamera, alarm ve otomasyon sistemlerini yaşam alanınıza göre özel olarak tasarlıyoruz. PrimeSec ile her an güvendesiniz.
              </p>

              <div className="mt-8 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
                <ButtonLink href="/kendi-sistemini-tasarla" size="lg" className="rounded-xl bg-primary-600 px-8 py-4 text-base font-extrabold text-white shadow-none hover:bg-primary-500">
                  <SlidersHorizontal className="h-5 w-5" /> Kendi Sistemini Tasarla
                </ButtonLink>
                <ButtonLink href="/urunler" variant="outlineBlue" size="lg" className="rounded-xl border-white/20 bg-white/5 px-8 py-4 text-base font-bold text-white hover:bg-white hover:text-navy-950">
                  Ürünleri İncele
                </ButtonLink>
              </div>

              <div className="mt-16 w-full border-t border-white/10 pt-6">
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  {trust.map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-white/70">
                      <item.icon className="h-4 w-4 text-primary-400" />
                      <span className="text-xs font-semibold tracking-wide">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <div className="relative flex h-[480px] w-full items-center justify-center lg:col-span-6">
              <motion.div
                className="pointer-events-none absolute flex h-72 w-72 items-center justify-center rounded-full border border-cyan-500/20"
                style={{
                  scale: centerScale,
                  opacity: centerOpacity,
                  rotate: centerRotate
                }}
              >
                <div className="absolute inset-0 animate-[spin_6s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,transparent_60%,rgba(6,182,212,0.1))]" />
                <div className="absolute h-[80%] w-[80%] rounded-full border border-cyan-500/10" />
                <div className="absolute h-[50%] w-[50%] rounded-full border border-dashed border-cyan-400/20" />
                <div className="absolute flex h-16 w-16 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-950/20">
                  <ShieldCheck className="h-8 w-8 animate-pulse text-cyan-400" />
                </div>
              </motion.div>

              <div
                className="relative flex h-72 w-72 items-center justify-center"
                style={{
                  perspective: 1200,
                  transformStyle: "preserve-3d"
                }}
              >
                <motion.div
                  className="absolute z-20 h-40 w-56 rounded-2xl border border-slate-800/80 bg-slate-950/90 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl"
                  style={{
                    x: card1X,
                    y: card1Y,
                    rotateX: card1RotateX,
                    rotateY: card1RotateY,
                    scale: card1Scale,
                    transformStyle: "preserve-3d"
                  }}
                >
                  <div className="mb-2 flex items-center justify-between border-b border-slate-800 pb-1.5 font-mono text-[9px] text-cyan-400">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Camera className="h-3.5 w-3.5 text-cyan-400" />
                      <span>CAM_01: FRONT DOOR</span>
                    </div>
                    <span className="animate-pulse font-bold text-red-500">REC</span>
                  </div>
                  <div className="relative flex h-[80px] w-full items-center justify-center overflow-hidden rounded-lg border border-slate-900 bg-slate-950">
                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(6,182,212,0.15)_0%,transparent_100%)]" />
                    <div className="absolute h-[1px] w-[80%] bg-white/10" />
                    <div className="absolute h-[80%] w-[1px] bg-white/10" />
                    <svg className="h-[85%] w-[85%] text-cyan-400 opacity-40" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 20 L90 20 L80 80 L20 80 Z" stroke="currentColor" strokeWidth="1" />
                      <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="1" />
                    </svg>
                    <div className="absolute bottom-1 right-2 font-mono text-[7px] text-slate-500">
                      1080P HD // WDR
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute z-20 h-40 w-56 rounded-2xl border border-slate-800/80 bg-slate-950/90 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl"
                  style={{
                    x: card2X,
                    y: card2Y,
                    rotateX: card2RotateX,
                    rotateY: card2RotateY,
                    scale: card2Scale,
                    transformStyle: "preserve-3d"
                  }}
                >
                  <div className="mb-2 flex items-center justify-between border-b border-slate-800 pb-1.5 font-mono text-[9px] text-cyan-400">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Activity className="h-3.5 w-3.5 text-cyan-400" />
                      <span>SENSORS: ACTIVE</span>
                    </div>
                    <span className="font-bold text-emerald-400">ONLINE</span>
                  </div>
                  <div className="flex h-[80px] w-full flex-col justify-end rounded-lg border border-slate-900 bg-slate-950 p-2.5">
                    <div className="mb-1 flex justify-between font-mono text-[7px] text-slate-500">
                      <span>96% MATCH</span>
                      <span>FREQ: 2.4GHz</span>
                    </div>
                    <svg className="h-[45px] w-full text-cyan-500" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M0 20 Q15 5, 30 20 T60 20 T90 10 T100 20"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M0 20 Q15 5, 30 20 T60 20 T90 10 T100 20 L100 40 L0 40 Z"
                        fill="rgba(6, 182, 212, 0.05)"
                      />
                    </svg>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute z-10 h-48 w-44 rounded-2xl border border-slate-800/80 bg-slate-950/90 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl"
                  style={{
                    x: card3X,
                    y: card3Y,
                    rotateX: card3RotateX,
                    rotateY: card3RotateY,
                    scale: card3Scale,
                    transformStyle: "preserve-3d"
                  }}
                >
                  <div className="mb-2 flex items-center justify-between border-b border-slate-800 pb-1.5 font-mono text-[9px] text-cyan-400">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Key className="h-3.5 w-3.5 text-cyan-400" />
                      <span>CONTROL PAD</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 rounded-lg border border-slate-900 bg-slate-950 p-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <div key={num} className="flex h-6 w-full cursor-pointer items-center justify-center rounded border border-slate-800/50 bg-slate-900 font-mono text-[8px] text-slate-400 transition-colors hover:text-white">
                        {num}
                      </div>
                    ))}
                    <div className="flex h-6 cursor-pointer items-center justify-center rounded border border-slate-800/50 bg-slate-900 font-mono text-[8px] text-red-500">*</div>
                    <div className="flex h-6 cursor-pointer items-center justify-center rounded border border-slate-800/50 bg-slate-900 font-mono text-[8px] text-slate-400">0</div>
                    <div className="flex h-6 cursor-pointer items-center justify-center rounded border border-cyan-800/50 bg-cyan-950 font-mono text-[8px] text-cyan-400">#</div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute z-10 h-44 w-52 rounded-2xl border border-slate-800/80 bg-slate-950/90 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl"
                  style={{
                    x: card4X,
                    y: card4Y,
                    rotateX: card4RotateX,
                    rotateY: card4RotateY,
                    scale: card4Scale,
                    transformStyle: "preserve-3d"
                  }}
                >
                  <div className="mb-2 flex items-center justify-between border-b border-slate-800 pb-1.5 font-mono text-[9px] text-cyan-400">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                      <span>SYSTEM LOGS</span>
                    </div>
                  </div>
                  <div className="flex h-[100px] w-full flex-col gap-1.5 overflow-hidden rounded-lg border border-slate-900 bg-slate-950 p-2.5 font-mono text-[7px] text-slate-400">
                    {logs.map((log, index) => (
                      <div key={index} className="flex items-start gap-1">
                        <span className="font-bold text-cyan-500">&gt;</span>
                        <span className="truncate">{log}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </Container>

        <motion.div
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white/50"
          style={{ opacity: indicatorOpacity }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <span>Aşağı Kaydır</span>
          <ChevronDown className="h-4 w-4 text-primary-400" />
        </motion.div>
      </div>
    </div>
    </>
  );
}
