"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Phone, SlidersHorizontal } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { ButtonLink } from "@/components/ui/Button";
import { mainNavigation } from "@/data/navigation";
import { megaMenus, type MegaMenuKey } from "@/data/mega-menu";
import { whatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";
import type { NavigationItem } from "@/lib/db";

export function Header({ navigation = mainNavigation }: { navigation?: NavigationItem[] }) {
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
    <header
      ref={ref}
      onMouseLeave={() => setActiveMenu(null)}
      className="sticky top-0 z-50 bg-white border-b border-border"
    >
      <div className="flex h-[72px] w-full items-center sm:h-[80px] lg:h-[92px]">
        <div className="container-primesec flex w-full items-center justify-between gap-3 lg:gap-6">
          <div onMouseEnter={() => setActiveMenu(null)} className="shrink-0">
            <Logo dark={false} isHeader={true} />
          </div>

          {/* Desktop Navigation — visible at lg+ */}
          <nav className="hidden min-w-0 flex-1 items-center gap-0.5 lg:flex" aria-label="Ana menü">
            {navigation.map((item) => {
              const isOpen = activeMenu === item.menuKey;
              const canOpenMegaMenu = item.menuKey && item.menuKey in megaMenus;
              return (
                <div
                  key={item.href}
                  className="relative flex items-center"
                  onMouseEnter={() => setActiveMenu(canOpenMegaMenu ? (item.menuKey as MegaMenuKey) : null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-1.5 px-3 py-2 text-[13px] font-extrabold rounded-full transition-all duration-200 whitespace-nowrap",
                      isOpen
                        ? "bg-cyan-50 text-cyan-600 shadow-sm"
                        : "text-ink hover:bg-slate-50 hover:text-cyan-600"
                    )}
                  >
                    <span>{item.label}</span>
                    {canOpenMegaMenu ? (
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                          isOpen ? "rotate-180 text-cyan-600" : "text-ink-muted group-hover:text-cyan-600"
                        )}
                      />
                    ) : null}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Desktop CTAs — visible at lg+ */}
          <div
            className="hidden shrink-0 items-center gap-2 lg:flex"
            onMouseEnter={() => setActiveMenu(null)}
          >
            <ButtonLink
              href="/iletisim"
              variant="outlineBlue"
              size="sm"
              className="h-9 rounded-full border-border bg-transparent px-4 text-[13px] text-ink hover:border-cyan-500 hover:text-cyan-500 flex items-center gap-1.5 whitespace-nowrap"
            >
              <Phone className="h-3.5 w-3.5" /> Teklif Al
            </ButtonLink>
            <ButtonLink
              href="/kendi-sistemini-tasarla"
              size="sm"
              className="hidden xl:inline-flex h-9 rounded-full primesec-navy-action px-5 text-[13px] text-white font-bold hover:scale-[1.02] transition-all items-center gap-1.5 whitespace-nowrap"
            >
              Kendi Sistemini Tasarla <SlidersHorizontal className="h-3.5 w-3.5" />
            </ButtonLink>
          </div>

          {/* Mobile / Tablet — hamburger + optional WhatsApp pill */}
          <div className="flex shrink-0 items-center gap-2 lg:hidden" onMouseEnter={() => setActiveMenu(null)}>
            <ButtonLink
              href={whatsappUrl("Merhaba, PrimeSec Teknoloji'den bilgi almak istiyorum.")}
              variant="outlineBlue"
              size="sm"
              className="hidden rounded-full border-border text-ink sm:inline-flex text-[13px] h-9 px-4 whitespace-nowrap"
            >
              WhatsApp
            </ButtonLink>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink hover:border-cyan-500 transition-colors"
              aria-label="Menüyü aç"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      {activeMenu ? <MegaMenu menuKey={activeMenu} onNavigate={() => setActiveMenu(null)} /> : null}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} navigation={navigation} />
    </header>
  );
}
