"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Boxes,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Phone,
  X,
  Tags,
} from "lucide-react";
import { signOutAdmin } from "@/lib/admin/actions";
import type { AdminProfile } from "@/lib/admin/auth";

const navItems = [
  { href: "/admin", label: "Ana Sayfa", icon: Home, desc: "Genel durum" },
  { href: "/admin/leads", label: "Gelen Mesajlar", icon: MessageCircle, desc: "Müşteri talepleri" },
  { href: "/admin/products", label: "Ürünler", icon: Boxes, desc: "Ürün ekle / düzenle" },
  { href: "/admin/brands", label: "Markalar", icon: Tags, desc: "Marka yönetimi" },
  { href: "/admin/blog", label: "Blog Yazıları", icon: BookOpen, desc: "Haber ve yazılar" },
  { href: "/admin/settings", label: "İletişim Bilgileri", icon: Phone, desc: "Telefon, adres" },
];

export function AdminShell({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile: AdminProfile;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderNavLink = (item: (typeof navItems)[0]) => {
    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href + "/"));
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setMobileMenuOpen(false)}
        className={`flex items-center gap-4 rounded-2xl px-5 py-4 text-lg font-black transition-all ${
          isActive
            ? "bg-cyan-600 text-white shadow-lg"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        <Icon className={`h-6 w-6 shrink-0 ${isActive ? "text-white" : "text-cyan-600"}`} />
        <div>
          <span className="block leading-tight">{item.label}</span>
          <span className={`block text-xs font-semibold ${isActive ? "text-cyan-100" : "text-slate-400"}`}>{item.desc}</span>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col bg-white border-r-2 border-slate-200 shadow-sm lg:flex">
        <div className="p-6 border-b-2 border-slate-100">
          <Link href="/admin" className="block">
            <span className="text-2xl font-black text-slate-800">PrimeSec</span>
            <span className="block text-xs font-black uppercase tracking-widest text-cyan-600 mt-0.5">YÖNETİM PANELİ</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map(renderNavLink)}
        </nav>

        <div className="border-t-2 border-slate-100 p-4">
          <div className="mb-3 px-2">
            <p className="text-sm font-black text-slate-800 truncate">{profile.full_name ?? "Yönetici"}</p>
          </div>
          <form action={signOutAdmin}>
            <button className="flex w-full h-12 items-center justify-center gap-2 rounded-xl border-2 border-red-200 bg-red-50 text-base font-black text-red-600 hover:bg-red-100 transition-colors">
              <LogOut className="h-5 w-5" />
              Çıkış Yap
            </button>
          </form>
        </div>
      </aside>

      {/* Main area */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-30 border-b-2 border-slate-200 bg-white px-4 py-3 lg:px-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="inline-flex h-12 w-12 items-center justify-center rounded-xl border-2 border-slate-200 lg:hidden"
                aria-label="Menü"
              >
                <Menu className="h-6 w-6 text-slate-700" />
              </button>
              <h1 className="text-xl font-black text-slate-800 lg:text-2xl">PrimeSec Yönetim</h1>
            </div>
            <p className="hidden sm:block text-sm font-bold text-slate-500">{profile.full_name ?? "Yönetici"}</p>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="fixed inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
            <nav className="relative flex w-80 max-w-full flex-col bg-white shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b-2 border-slate-100">
                <span className="text-xl font-black text-slate-800">PrimeSec</span>
                <button onClick={() => setMobileMenuOpen(false)} className="h-10 w-10 flex items-center justify-center rounded-xl border-2 border-slate-200">
                  <X className="h-5 w-5 text-slate-600" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {navItems.map(renderNavLink)}
              </div>
              <div className="border-t-2 border-slate-100 p-4">
                <form action={signOutAdmin}>
                  <button className="flex w-full h-12 items-center justify-center gap-2 rounded-xl border-2 border-red-200 bg-red-50 text-base font-black text-red-600 hover:bg-red-100 transition-colors">
                    <LogOut className="h-5 w-5" />
                    Çıkış Yap
                  </button>
                </form>
              </div>
            </nav>
          </div>
        )}

        {/* Content */}
        <main className="px-4 py-6 lg:px-8 lg:py-8 max-w-5xl">
          {children}
        </main>
      </div>
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-black text-slate-900 md:text-3xl">{title}</h2>
        {description ? <p className="mt-1 text-sm text-slate-500 font-semibold">{description}</p> : null}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function requireSuperAdmin(profile: AdminProfile) {
  // redirect is standard Next.js redirect
}
