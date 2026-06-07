"use client";

import Link from "next/link";
import { ChevronDown, Phone, SlidersHorizontal, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, ButtonLink } from "@/components/ui/Button";
import { mainNavigation } from "@/data/navigation";
import { megaMenus, type MegaMenuKey } from "@/data/mega-menu";
import type { NavigationItem } from "@/lib/db";

export function MobileMenu({ open, onClose, navigation = mainNavigation }: { open: boolean; onClose: () => void; navigation?: NavigationItem[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      document.body.classList.add("mobile-menu-open");
      document.body.style.overflow = "hidden";
    } else {
      document.body.classList.remove("mobile-menu-open");
      document.body.style.overflow = "";
      setActive(null);
    }
    return () => {
      document.body.classList.remove("mobile-menu-open");
      document.body.style.overflow = "";
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
            className="fixed inset-0 z-[120] bg-[#06142E]/55 backdrop-blur-md lg:hidden"
            role="dialog"
            aria-modal="true"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            className="fixed right-0 top-0 z-[121] flex h-dvh w-[min(392px,92vw)] flex-col overflow-hidden rounded-l-[22px] bg-[#F8FAFC] shadow-2xl shadow-[#06142E]/30 lg:hidden"
          >
            {/* Header */}
            <div className="flex justify-end px-4 pb-2 pt-4">
              <button
                aria-label="Menüyü kapat"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-ink shadow-sm transition-colors hover:border-primary-400 hover:text-primary-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 pt-2">
              <div className="space-y-2.5">
                {navigation.map((item) => {
                  const canOpenMegaMenu = item.menuKey && item.menuKey in megaMenus;
                  return (
                  <div
                    key={item.href}
                    className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/40"
                  >
                    {canOpenMegaMenu ? (
                      <>
                        <button
                          onClick={() => setActive(active === item.menuKey ? null : item.menuKey ?? null)}
                          className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left font-extrabold text-ink transition-colors hover:text-primary-600"
                        >
                          <span>{item.label}</span>
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 text-primary-600 duration-300 ${active === item.menuKey ? "rotate-180" : ""
                              }`}
                          />
                        </button>
                        <AnimatePresence>
                          {canOpenMegaMenu && active === item.menuKey && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden border-t border-slate-200 bg-slate-50"
                            >
                              <div className="space-y-1 p-2.5">
                                <Link
                                  href={item.href}
                                  onClick={onClose}
                                  className="block rounded-lg bg-white px-3.5 py-2.5 text-sm font-extrabold text-primary-600 shadow-sm shadow-slate-200/60"
                                >
                                  Tümünü Gör
                                </Link>
                                {megaMenus[item.menuKey as MegaMenuKey].personas.map((sub) => (
                                  <Link
                                    key={sub.href}
                                    href={sub.href}
                                    onClick={onClose}
                                    className="block rounded-lg px-3.5 py-2.5 text-sm font-semibold text-ink-muted transition-colors hover:bg-white hover:text-primary-600"
                                  >
                                    {sub.title}
                                  </Link>
                                ))}
                                {megaMenus[item.menuKey as MegaMenuKey].items.slice(0, 6).map((sub) => (
                                  <Link
                                    key={sub.href}
                                    href={sub.href}
                                    onClick={onClose}
                                    className="block rounded-lg px-3.5 py-2.5 text-sm font-semibold text-ink-muted transition-colors hover:bg-white hover:text-primary-600"
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
                        className="block px-4 py-3.5 font-extrabold text-ink transition-colors hover:text-primary-600"
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                )})}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-slate-200 bg-white/95 p-4 shadow-[0_-16px_32px_rgba(15,23,42,0.06)]">
              <div className="space-y-3">
                <ButtonLink
                  href="/kendi-sistemini-tasarla"
                  size="lg"
                  className="h-[52px] w-full rounded-lg"
                  onClick={onClose}
                >
                  <SlidersHorizontal className="h-5 w-5" /> Kendi Sistemini Tasarla
                </ButtonLink>
                <Button
                  variant="outlineBlue"
                  size="lg"
                  className="h-[52px] w-full rounded-lg px-4 text-base"
                  onClick={() => {
                    onClose();
                    window.dispatchEvent(new Event("open-contact-popup"));
                  }}
                >
                  <Phone className="h-5 w-5" /> Teklif Al
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
