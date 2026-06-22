"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Boxes,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Phone,
  X,
  Tags,
  AppWindow,
  SlidersHorizontal,
  HelpCircle,
  Calendar,
  Users,
  Wrench,
  Package,
  Contact,
  BarChart3,
  Receipt,
  Building2,
} from "lucide-react";
import { signOutAdmin } from "@/lib/admin/actions";
import type { AdminProfile } from "@/lib/admin/auth";

const navItems = [
  { href: "/admin", label: "Ana Sayfa", icon: Home, desc: "Genel durum" },
  { href: "/admin/calendar", label: "Takvim", icon: Calendar, desc: "Randevu planı" },
  { href: "/admin/customers", label: "Müşteriler", icon: Users, desc: "Müşteri rehberi", roles: ["super_admin", "editor", "support", "viewer"] },
  { href: "/admin/service-orders", label: "İş Emirleri", icon: Wrench, desc: "Servis formları" },
  { href: "/admin/stocks", label: "Stok & Malzeme", icon: Package, desc: "Stok miktarları", roles: ["super_admin", "editor", "support", "viewer"] },
  { href: "/admin/employees", label: "Personeller", icon: Contact, desc: "Çalışma saatleri", roles: ["super_admin", "editor", "viewer"] },
  { href: "/admin/reports", label: "Raporlar", icon: BarChart3, desc: "Kâr & performans", roles: ["super_admin", "support", "viewer"] },
  { href: "/admin/accounting", label: "Muhasebe", icon: Receipt, desc: "Tahsilat & alacaklar", roles: ["super_admin", "support", "viewer"] },
  { href: "/admin/leads", label: "Gelen Mesajlar", icon: MessageCircle, desc: "Müşteri talepleri", roles: ["super_admin", "editor", "support", "viewer"] },
  { href: "/admin/products", label: "Ürünler", icon: Boxes, desc: "Ürün yönetimi", roles: ["super_admin", "editor", "viewer"] },
  { href: "/admin/brands", label: "Markalar", icon: Tags, desc: "Marka yönetimi", roles: ["super_admin", "editor", "viewer"] },
  { href: "/admin/references", label: "Referanslarımız", icon: Building2, desc: "Firma ve logolar", roles: ["super_admin", "editor", "viewer"] },
  { href: "/admin/mega-menu", label: "Mega Menüler", icon: AppWindow, desc: "Navbar menüleri", roles: ["super_admin", "editor", "viewer"] },
  { href: "/admin/system-builder", label: "Sistem Tasarla", icon: SlidersHorizontal, desc: "Sihirbaz ayarları", roles: ["super_admin", "editor", "viewer"] },
  { href: "/admin/homepage/featured-products", label: "Öne Çıkanlar", icon: Boxes, desc: "Ana sayfa ürünleri", roles: ["super_admin", "editor", "viewer"] },
  { href: "/admin/homepage/services", label: "Hizmet Alanları", icon: AppWindow, desc: "Ana sayfa hizmetleri", roles: ["super_admin", "editor", "viewer"] },
  { href: "/admin/faqs", label: "Sık Sorulan Sorular", icon: HelpCircle, desc: "Soru ve cevaplar", roles: ["super_admin", "editor", "viewer"] },
  { href: "/admin/blog", label: "Blog Yazıları", icon: BookOpen, desc: "Haber ve yazılar", roles: ["super_admin", "editor", "viewer"] },
  { href: "/admin/settings", label: "Site & Genel Ayarlar", icon: Phone, desc: "Pop-up, iletişim vb.", roles: ["super_admin", "editor", "viewer"] },
];

export function AdminShell({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile: AdminProfile;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const visibleNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(profile.role);
  });

  const renderNavLink = (item: (typeof navItems)[0]) => {
    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href + "/"));
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={item.href}
        prefetch={false}
        onMouseEnter={() => router.prefetch(item.href)}
        onFocus={() => router.prefetch(item.href)}
        onClick={() => setMobileMenuOpen(false)}
        className={`flex items-center gap-3 rounded-2xl px-3 lg:px-5 py-3 lg:py-4 text-sm lg:text-lg font-black transition-all ${
          isActive
            ? "bg-cyan-600 text-white shadow-lg"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-white" : "text-cyan-600"}`} />
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
          {visibleNavItems.map(renderNavLink)}
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
                {visibleNavItems.map(renderNavLink)}
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
        <main className="px-4 py-6 lg:px-8 lg:py-8 w-full">
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
  showBackButton = false,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  showBackButton?: boolean;
}) {
  const router = useRouter();
  
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        {showBackButton && (
          <button
            onClick={() => router.back()}
            className="mt-1 shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-lg border-2 border-slate-200 bg-white text-slate-500 hover:border-cyan-500 hover:text-cyan-600 transition-colors shadow-sm"
            title="Geri Dön"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <div>
          <h2 className="text-2xl font-black text-slate-900 md:text-3xl leading-none">{title}</h2>
          {description ? <p className="mt-1 text-sm text-slate-500 font-semibold">{description}</p> : null}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function requireSuperAdmin(profile: AdminProfile) {
  // redirect is standard Next.js redirect
}
