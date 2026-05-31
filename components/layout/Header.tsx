"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Phone, Search, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "@/components/layout/Logo";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { ButtonLink } from "@/components/ui/Button";
import { mainNavigation } from "@/data/navigation";
import { megaMenus, type MegaMenuKey } from "@/data/mega-menu";
import { whatsappUrl } from "@/lib/whatsapp";

export function Header() {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<MegaMenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    setActiveMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setActiveMenu(null);
    }
    function onClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setActiveMenu(null);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, []);

  return (
    <motion.header
      ref={ref}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      onMouseLeave={() => setActiveMenu(null)}
      className="sticky top-0 z-50 bg-white px-0 py-0 border-b border-border"
    >
      <div className="flex h-[72px] w-full items-center lg:h-[76px]">
        <div className="container-primesec flex w-full items-center justify-between gap-5">
          <div onMouseEnter={() => setActiveMenu(null)}>
            <Logo dark={false} />
          </div>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Ana menü">
            {mainNavigation.map((item) => (
              <div key={item.href} className="relative" onMouseEnter={() => setActiveMenu((item.menuKey as MegaMenuKey) ?? null)}>
                <Link
                  href={item.href}
                  className="group relative flex h-9 items-center gap-1 rounded-full px-3 text-[12px] font-bold text-ink hover:text-primary-600 transition-colors"
                >
                  {item.label}
                  {item.menuKey ? <ChevronDown className={`h-3.5 w-3.5 ${activeMenu === item.menuKey ? "rotate-180 text-primary-600" : "text-ink-lighter"}`} /> : null}
                </Link>
              </div>
            ))}
          </nav>
          <div className="hidden items-center gap-3 xl:flex" onMouseEnter={() => setActiveMenu(null)}>
            <ButtonLink href="/iletisim" variant="outlineBlue" size="sm" className="h-8 rounded-full border-border bg-transparent px-4 text-xs text-ink hover:border-primary-600 hover:text-primary-600">
              <Phone className="h-4 w-4" /> Teklif Al
            </ButtonLink>
            <ButtonLink href="/kendi-sistemini-tasarla" size="sm" className="h-8 rounded-full bg-primary-600 px-5 text-xs text-white font-bold hover:bg-primary-500 hover:scale-105 transition-all">
              Kendi Sistemini Tasarla <SlidersHorizontal className="h-4 w-4" />
            </ButtonLink>
          </div>
          <div className="flex items-center gap-2 xl:hidden" onMouseEnter={() => setActiveMenu(null)}>
            <ButtonLink href={whatsappUrl("Merhaba, PrimeSec Teknoloji'den bilgi almak istiyorum.")} variant="outlineBlue" size="sm" className="hidden rounded-full border-border text-ink sm:inline-flex">
              WhatsApp
            </ButtonLink>
            <button className="rounded-full border border-border p-3 text-ink lg:hidden hover:border-primary-600 transition-colors" aria-label="Menüyü aç" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      {activeMenu ? <MegaMenu menuKey={activeMenu} onNavigate={() => setActiveMenu(null)} /> : null}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </motion.header>
  );
}
