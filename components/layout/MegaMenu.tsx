"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronRight, MessageCircle } from "lucide-react";
import { megaMenus, type MegaMenuKey } from "@/data/mega-menu";
import type { MegaMenuData } from "@/lib/db";

type Props = {
  menuKey: MegaMenuKey;
  onNavigate?: () => void;
  /** Pre-fetched dynamic data from server. Falls back to static if null. */
  menuData?: MegaMenuData | null;
};

export function MegaMenu({ menuKey, onNavigate, menuData }: Props) {
  // Use dynamic data if available, otherwise fall back to static
  const menu = menuData ?? megaMenus[menuKey];

  if (!menu) return null;

  return (
    <div className="absolute left-0 top-full z-50 hidden w-screen border-y border-border bg-white lg:block overflow-hidden">
      <div className="container-primesec grid min-h-[330px] grid-cols-12">

        <div className="col-span-8 border-r border-border py-6 pr-7">
          <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.14em] text-primary-600">{menu.eyebrow}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {menu.items.map((item) => (
              <Link
                href={item.href}
                key={item.href + item.title}
                onClick={onNavigate}
                className="group grid grid-cols-[54px_1fr_auto] items-center gap-4 rounded-xl border border-transparent px-4 hover:border-border hover:bg-slate-50/70 hover:translate-x-1 transition-all duration-300 py-2.5"
              >
                <span className="relative h-11 w-11 overflow-hidden rounded-xl bg-white border border-border group-hover:border-cyan-500/30 group-hover:bg-white transition-colors duration-300">
                  <Image src={item.image} alt={item.title} fill sizes="44px" className="object-contain p-2" />
                </span>
                <span className="text-[15px] font-bold text-ink group-hover:text-cyan-600 transition-colors min-w-0 truncate">{item.title}</span>
                <ChevronRight className="h-4 w-4 text-ink-muted group-hover:text-cyan-500 group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </div>
        <aside className="col-span-4 flex flex-col py-6 pl-6">
          <div className="group flex h-full flex-col justify-between rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50/50 p-6 border border-cyan-100/60 hover:border-cyan-300 hover:shadow-md transition-all duration-300 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-cyan-100/50 blur-2xl group-hover:bg-cyan-200/50 transition-colors"></div>
            <div className="relative z-10">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-cyan-600 group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300">
                <MessageCircle className="h-5 w-5" />
              </div>
              <h3 className="text-[19px] font-extrabold leading-tight tracking-tight text-slate-800">
                {menu.insightTitle}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
                {menu.insight}
              </p>
            </div>
            <Link
              href="/iletisim"
              onClick={onNavigate}
              className="relative z-10 mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-4 text-sm font-bold text-slate-700 transition-all hover:bg-cyan-600 hover:border-cyan-600 hover:text-white"
            >
              İletişime Geçin
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
