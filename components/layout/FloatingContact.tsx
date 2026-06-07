"use client";

import { useState, useEffect } from "react";
import { Phone, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { representatives } from "@/data/site";

export function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleOpenEvent() {
      setIsOpen(true);
    }
    window.addEventListener("open-contact-popup", handleOpenEvent);
    return () => {
      window.removeEventListener("open-contact-popup", handleOpenEvent);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans floating-contact-container">
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
              className="absolute bottom-16 right-0 w-[min(calc(100vw-3rem),340px)] overflow-hidden rounded-3xl border border-border bg-white p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="font-extrabold text-ink text-lg leading-tight">İletişime Geçin</h3>
                  <p className="text-xs text-ink-muted mt-0.5">Sizi doğrudan temsilcilerimize yönlendiriyoruz</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-ink hover:bg-white hover:text-primary-600 transition-colors border border-border"
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
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2.5 text-xs font-bold text-ink hover:border-primary-600 hover:text-primary-600 transition-colors"
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
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] hover:bg-[#20c35a] px-3 py-2.5 text-xs font-bold text-white transition-colors"
                      >
                        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
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
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={() => setIsOpen(true)}
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-[#5BFF72] to-[#08C735] text-white shadow-lg shadow-[#08C735]/30 ring-4 ring-white/80 hover:scale-105 active:scale-95 transition-all outline-none"
            aria-label="İletişim paneli"
          >
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#23E04E] opacity-20" />
            <svg
              className="relative h-8 w-8"
              viewBox="0 0 64 64"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fill="currentColor"
                d="M32 11C18.8 11 8 20.1 8 31.3c0 7.1 4.3 13.4 10.9 17.1l-2.8 9.1 10.4-5.3c1.8.4 3.6.6 5.5.6 13.2 0 24-9.1 24-20.4S45.2 11 32 11Z"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
