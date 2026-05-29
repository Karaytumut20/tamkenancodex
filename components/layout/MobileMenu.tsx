"use client";

import Link from "next/link";
import { ChevronDown, Phone, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { mainNavigation } from "@/data/navigation";
import { megaMenus, type MegaMenuKey } from "@/data/mega-menu";
import { whatsappUrl } from "@/lib/whatsapp";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [active, setActive] = useState<string | null>("alarm-sistemleri");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-navy-1000/80 backdrop-blur-xl lg:hidden" role="dialog" aria-modal="true">
      <div className="ml-auto flex h-full w-[min(420px,100%)] flex-col bg-navy-950 p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <span className="font-extrabold">Menü</span>
          <button aria-label="Menüyü kapat" onClick={onClose} className="rounded-lg border border-white/15 p-2">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-8 space-y-3 overflow-y-auto">
          {mainNavigation.map((item) => (
            <div key={item.href} className="rounded-xl border border-white/10 bg-white/[0.03]">
              {item.menuKey ? (
                <button
                  onClick={() => setActive(active === item.menuKey ? null : item.menuKey)}
                  className="flex w-full items-center justify-between p-4 text-left font-bold"
                >
                  {item.label}
                  <ChevronDown className={`h-4 w-4 transition ${active === item.menuKey ? "rotate-180" : ""}`} />
                </button>
              ) : (
                <Link onClick={onClose} href={item.href} className="block p-4 font-bold">
                  {item.label}
                </Link>
              )}
              {item.menuKey && active === item.menuKey ? (
                <div className="border-t border-white/10 p-3">
                  {megaMenus[item.menuKey as MegaMenuKey].personas.map((sub) => (
                    <Link key={sub.href} href={sub.href} onClick={onClose} className="block rounded-lg px-3 py-2 text-sm text-ink-lightMuted hover:bg-white/10 hover:text-white">
                      {sub.title}
                    </Link>
                  ))}
                  {megaMenus[item.menuKey as MegaMenuKey].items.slice(0, 4).map((sub) => (
                    <Link key={sub.href} href={sub.href} onClick={onClose} className="block rounded-lg px-3 py-2 text-sm text-ink-lightMuted hover:bg-white/10 hover:text-white">
                      {sub.title}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <div className="mt-auto space-y-3 pt-6">
          <ButtonLink href="/iletisim" variant="secondaryDark" size="lg" className="w-full">
            <Phone className="h-5 w-5" /> Teklif Al
          </ButtonLink>
          <ButtonLink href={whatsappUrl("Merhaba, PrimeSec Teknoloji'den teklif almak istiyorum.")} variant="whatsapp" size="lg" className="w-full">
            WhatsApp
          </ButtonLink>
          <ButtonLink href="/kendi-sistemini-tasarla" size="lg" className="w-full">
            <SlidersHorizontal className="h-5 w-5" /> Kendi Sistemini Tasarla
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
