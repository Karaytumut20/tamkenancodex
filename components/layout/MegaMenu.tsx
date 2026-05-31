"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { megaMenus, type MegaMenuKey } from "@/data/mega-menu";

type Props = {
  menuKey: MegaMenuKey;
  onNavigate?: () => void;
};

export function MegaMenu({ menuKey, onNavigate }: Props) {
  const menu = megaMenus[menuKey];

  return (
    <div className="absolute left-0 top-full z-50 hidden w-screen border-y border-border bg-white lg:block">
      <div className="container-primesec grid min-h-[330px] grid-cols-12">
        <div className="col-span-4 border-r border-border py-6 pr-6 xl:col-span-4">
          <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.14em] text-primary-600">{menu.eyebrow}</p>
          <div className="space-y-4">
            {menu.personas.map((persona, index) => (
              <Link
                href={persona.href}
                key={persona.title}
                onClick={onNavigate}
                className={`group flex min-h-[86px] items-center justify-between rounded-xl border px-5 hover:bg-surface transition-colors ${
                  index === 0 ? "border-primary-500 bg-white" : "border-border bg-white"
                }`}
              >
                <span>
                  <span className="block text-lg font-extrabold text-ink">{persona.title}</span>
                  <span className="mt-1 block max-w-[260px] text-sm leading-5 text-ink-muted">{persona.description}</span>
                </span>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${index === 0 ? "border-primary-600 text-primary-600" : "border-border text-ink-muted group-hover:text-primary-600"}`}>
                  <ChevronRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
        <div className="col-span-5 border-r border-border py-6 px-7 xl:col-span-5">
          <div className="grid gap-3">
            {menu.items.map((item, index) => (
              <Link
                href={item.href}
                key={item.title}
                onClick={onNavigate}
                className={`group grid min-h-[58px] grid-cols-[54px_1fr_auto] items-center gap-4 rounded-lg px-4 hover:bg-surface transition-colors ${
                  index === 1 ? "bg-surface" : ""
                }`}
              >
                <span className="relative h-11 w-11 overflow-hidden rounded-xl bg-surface border border-border">
                  <Image src={item.image} alt="" fill className="object-contain p-2" unoptimized />
                </span>
                <span className="text-[15px] font-bold text-ink group-hover:text-primary-600">{item.title}</span>
                <ChevronRight className="h-4 w-4 text-ink-lighter group-hover:text-primary-600" />
              </Link>
            ))}
          </div>
        </div>
        <aside className="col-span-3 flex flex-col justify-between py-7 pl-7">
          <div>
            <h3 className="max-w-[280px] text-2xl font-extrabold leading-tight tracking-[-0.03em] text-ink">{menu.insightTitle}</h3>
            <p className="mt-4 max-w-[300px] text-sm leading-6 text-ink-muted">{menu.insight}</p>
          </div>
          <Link
            href="/kendi-sistemini-tasarla"
            onClick={onNavigate}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white transition-colors"
            aria-label={`${menu.title} icin sistem tasarla`}
          >
            <ArrowUpRight className="h-5 w-5" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
