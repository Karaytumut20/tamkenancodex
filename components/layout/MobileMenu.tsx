"use client";

import Link from "next/link";
import { ChevronDown, Phone, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { mainNavigation } from "@/data/navigation";
import { megaMenus, type MegaMenuKey } from "@/data/mega-menu";
import { whatsappUrl } from "@/lib/whatsapp";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[120] bg-navy-1000/40 backdrop-blur-sm lg:hidden"
            role="dialog"
            aria-modal="true"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-[121] flex h-full w-[min(420px,90%)] flex-col bg-white shadow-2xl lg:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div className="flex items-center gap-2">
                <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary-600 to-primary-400" />
                <span className="text-lg font-extrabold text-navy-900">Menü</span>
              </div>
              <button
                aria-label="Menüyü kapat"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-navy-900   hover:bg-primary-50 hover:text-primary-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {mainNavigation.map((item, idx) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50/50 shadow-sm"
                  >
                    {item.menuKey ? (
                      <>
                        <button
                          onClick={() => setActive(active === item.menuKey ? null : item.menuKey)}
                          className="flex w-full items-center justify-between p-4 text-left font-bold text-navy-900  hover:text-primary-600"
                        >
                          <span>{item.label}</span>
                          <ChevronDown
                            className={`h-4 w-4 text-primary-500  duration-300 ${
                              active === item.menuKey ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {item.menuKey && active === item.menuKey && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden border-t border-gray-100 bg-white/80"
                            >
                              <div className="space-y-1 p-3">
                                {megaMenus[item.menuKey as MegaMenuKey].personas.map((sub) => (
                                  <Link
                                    key={sub.href}
                                    href={sub.href}
                                    onClick={onClose}
                                    className="block rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700  hover:bg-primary-50 hover:text-primary-600"
                                  >
                                    {sub.title}
                                  </Link>
                                ))}
                                {megaMenus[item.menuKey as MegaMenuKey].items.slice(0, 6).map((sub) => (
                                  <Link
                                    key={sub.href}
                                    href={sub.href}
                                    onClick={onClose}
                                    className="block rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700  hover:bg-primary-50 hover:text-primary-600"
                                  >
                                    {sub.title}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        onClick={onClose}
                        href={item.href}
                        className="block p-4 font-bold text-navy-900  hover:text-primary-600"
                      >
                        {item.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-100 bg-gradient-to-br from-gray-50 to-white p-5">
              <div className="space-y-3">
                <ButtonLink
                  href="/iletisim"
                  variant="outlineBlue"
                  size="lg"
                  className="w-full shadow-sm"
                >
                  <Phone className="h-5 w-5" /> Teklif Al
                </ButtonLink>
                <ButtonLink
                  href={whatsappUrl("Merhaba, PrimeSec Teknoloji'den teklif almak istiyorum.")}
                  variant="whatsapp"
                  size="lg"
                  className="w-full"
                >
                  WhatsApp
                </ButtonLink>
                <ButtonLink
                  href="/kendi-sistemini-tasarla"
                  size="lg"
                  className="w-full"
                >
                  <SlidersHorizontal className="h-5 w-5" /> Kendi Sistemini Tasarla
                </ButtonLink>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
