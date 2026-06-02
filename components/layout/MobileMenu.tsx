"use client";

import Link from "next/link";
import { ChevronDown, Phone, SlidersHorizontal, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, ButtonLink } from "@/components/ui/Button";
import { mainNavigation } from "@/data/navigation";
import { megaMenus, type MegaMenuKey } from "@/data/mega-menu";
import { whatsappUrl } from "@/lib/whatsapp";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      document.body.classList.add("mobile-menu-open");
    } else {
      document.body.classList.remove("mobile-menu-open");
    }
    return () => {
      document.body.classList.remove("mobile-menu-open");
    };
  }, [open]);

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
            className="fixed inset-0 z-[120] bg-ink/40 backdrop-blur-sm lg:hidden"
            role="dialog"
            aria-modal="true"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            className="fixed right-0 top-0 z-[121] flex h-full w-[min(420px,90%)] flex-col bg-surface lg:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-5">
              <div className="flex items-center gap-2">
                <div className="h-8 w-1 rounded-full primesec-navy-action" />
                <span className="text-lg font-extrabold text-ink">Menü</span>
              </div>
              <button
                aria-label="Menüyü kapat"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink hover:bg-white hover:text-primary-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {mainNavigation.map((item, idx) => (
                  <div
                    key={item.href}
                    className="overflow-hidden rounded-2xl border border-border bg-white"
                  >
                    {item.menuKey ? (
                      <>
                        <button
                          onClick={() => setActive(active === item.menuKey ? null : item.menuKey)}
                          className="flex w-full items-center justify-between p-4 text-left font-bold text-ink hover:text-primary-600"
                        >
                          <span>{item.label}</span>
                          <ChevronDown
                            className={`h-4 w-4 text-primary-600 duration-300 ${active === item.menuKey ? "rotate-180" : ""
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
                              className="overflow-hidden border-t border-border bg-surface"
                            >
                              <div className="space-y-1 p-3">
                                <Link
                                  href={item.href}
                                  onClick={onClose}
                                  className="block rounded-xl px-4 py-2.5 text-sm font-bold text-primary-600 hover:bg-white"
                                >
                                  Tümünü Gör
                                </Link>
                                {megaMenus[item.menuKey as MegaMenuKey].personas.map((sub) => (
                                  <Link
                                    key={sub.href}
                                    href={sub.href}
                                    onClick={onClose}
                                    className="block rounded-xl px-4 py-2.5 text-sm font-medium text-ink-muted hover:bg-white hover:text-primary-600"
                                  >
                                    {sub.title}
                                  </Link>
                                ))}
                                {megaMenus[item.menuKey as MegaMenuKey].items.slice(0, 6).map((sub) => (
                                  <Link
                                    key={sub.href}
                                    href={sub.href}
                                    onClick={onClose}
                                    className="block rounded-xl px-4 py-2.5 text-sm font-medium text-ink-muted hover:bg-white hover:text-primary-600"
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
                        className="block p-4 font-bold text-ink hover:text-primary-600"
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-border bg-white p-5">
              <div className="space-y-3">
                <Button
                  variant="outlineBlue"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    onClose();
                    window.dispatchEvent(new Event("open-contact-popup"));
                  }}
                >
                  <Phone className="h-5 w-5" /> Teklif Al
                </Button>
                <Button
                  variant="whatsapp"
                  size="lg"
                  className="w-full gap-2"
                  onClick={() => {
                    onClose();
                    window.dispatchEvent(new Event("open-contact-popup"));
                  }}
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </Button>
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
