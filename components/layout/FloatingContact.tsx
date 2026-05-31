"use client";

import { useState } from "react";
import { Phone, MessageCircle, X, ChevronRight, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { representatives } from "@/data/site";

export function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* ── POPUP MODAL ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile to click-close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm md:hidden"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-16 right-0 w-[340px] overflow-hidden rounded-3xl border border-border bg-white p-5 shadow-[0_20px_50px_rgba(3,13,33,0.15)]"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="font-extrabold text-ink text-lg leading-tight">İletişime Geçin</h3>
                  <p className="text-xs text-ink-muted mt-0.5">Sizi doğrudan temsilcilerimize yönlendiriyoruz</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-ink hover:bg-primary-50 hover:text-primary-600 transition-colors border border-border"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {representatives.map((rep) => (
                  <div key={rep.name} className="rounded-2xl border border-border bg-surface p-4 hover:border-primary-300 transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-ink text-sm">{rep.name}</h4>
                        <p className="text-[11px] font-bold text-primary-600 uppercase tracking-wider">{rep.role}</p>
                      </div>
                    </div>

                    <div className="mt-3.5 grid grid-cols-2 gap-2">
                      <a
                        href={`tel:${rep.phone.replace(/\s+/g, "")}`}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2.5 text-xs font-bold text-ink hover:border-primary-600 hover:text-primary-600 transition-colors shadow-sm"
                      >
                        <Phone className="h-3.5 w-3.5 text-primary-600" />
                        Hemen Ara
                      </a>
                      <a
                        href={`https://wa.me/${rep.whatsapp}?text=${encodeURIComponent(
                          `Merhaba ${rep.name}, PrimeSec Teknoloji web sitenizden ulaşıyorum. Güvenlik sistemleri hakkında bilgi alabilir miyim?`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-primary-600 px-3 py-2.5 text-xs font-bold text-white hover:bg-primary-500 transition-colors shadow-sm"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t border-border pt-3 text-center">
                <a
                  href="/kendi-sistemini-tasarla"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-500 transition-colors"
                >
                  Ücretsiz Fiyat Teklifi Hesapla <ChevronRight className="h-3 w-3" />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── FLOATING BUTTON ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-[0_8px_30px_rgb(0,107,255,0.4)] hover:bg-primary-500 hover:scale-105 active:scale-95 transition-all outline-none"
        aria-label="İletişim paneli"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-20" />
              <MessageSquare className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
