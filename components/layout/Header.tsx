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
      className="sticky top-0 z-50 bg-white px-0 border-b border-border"
    >
      <div className="flex h-[84px] w-full items-center lg:h-[92px]">
        <div className="container-primesec flex w-full items-center justify-between gap-5">
          <div onMouseEnter={() => setActiveMenu(null)}>
            <Logo dark={false} />
          </div>
          <nav className="hidden items-center gap-1 lg:flex h-full" aria-label="Ana menü">
            {mainNavigation.map((item) => (
              <div key={item.href} className="relative h-full flex items-center" onMouseEnter={() => setActiveMenu((item.menuKey as MegaMenuKey) ?? null)}>
                <Link
                  href={item.href}
                  className="group relative flex h-full items-center gap-1.5 px-3 text-[13px] font-extrabold text-ink hover:text-primary-600 transition-colors"
                >
                  <span>{item.label}</span>
                  {item.menuKey ? <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${activeMenu === item.menuKey ? "rotate-180 text-primary-600" : "text-ink-muted"}`} /> : null}
                  <span className={`absolute bottom-0 left-3 right-3 h-[2.5px] primesec-navy-action transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left ${activeMenu === item.menuKey ? "scale-x-100" : ""}`} />
                </Link>
              </div>
            ))}
          </nav>
          <div className="hidden items-center gap-3 xl:flex" onMouseEnter={() => setActiveMenu(null)}>
            <ButtonLink href="/iletisim" variant="outlineBlue" size="sm" className="h-10 rounded-full border-border bg-transparent px-5 text-[13px] text-ink hover:border-primary-600 hover:text-primary-600 flex items-center">
              <Phone className="h-4 w-4" /> Teklif Al
            </ButtonLink>
            <ButtonLink href="/kendi-sistemini-tasarla" size="sm" className="h-10 rounded-full primesec-navy-action px-6 text-[13px] text-white font-bold hover:scale-[1.02] transition-all flex items-center">
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
