import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { AdminTable } from "@/components/admin/AdminTable";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { getDashboardStats } from "@/lib/admin/data";
import { adminResources } from "@/lib/admin/resources";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const actions = [
    {
      href: "/admin/leads",
      title: "📩 Gelen Mesajlar",
      desc: "Müşterilerden gelen form mesajlarını görün",
      badge: stats.todayLeads > 0 ? `${stats.todayLeads} yeni` : null,
      bg: "bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100",
    },
    {
      href: "/admin/products",
      title: "📦 Ürünler",
      desc: "Ürün ekleyin veya düzenleyin",
      bg: "bg-blue-50 border-blue-200 text-blue-900 hover:bg-blue-100",
    },
    {
      href: "/admin/blog",
      title: "📰 Blog Yazıları",
      desc: "Yeni yazı paylaşın veya düzenleyin",
      bg: "bg-purple-50 border-purple-200 text-purple-900 hover:bg-purple-100",
    },
    {
      href: "/admin/settings",
      title: "📞 İletişim Bilgileri",
      desc: "Telefon ve adres bilgilerini güncelleyin",
      bg: "bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100",
    },
  ];

  return (
    <ProtectedAdminPage>
      <div className="space-y-8">
        {/* Welcome */}
        <section className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl p-6 text-white">
          <h2 className="text-2xl font-black md:text-3xl">Hoş Geldiniz! 👋</h2>
          <p className="mt-2 text-base font-medium text-cyan-100">
            Aşağıdaki butonlara tıklayarak sitenizi güncelleyebilirsiniz.
          </p>
        </section>

        {/* Actions */}
        <div className="grid gap-4 sm:grid-cols-2">
          {actions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className={`flex items-center justify-between rounded-2xl border-2 p-5 transition-colors ${a.bg}`}
            >
              <div>
                <span className="text-lg font-black flex items-center gap-2">
                  {a.title}
                  {a.badge && (
                    <span className="bg-emerald-600 text-white text-xs font-black px-2 py-0.5 rounded-full animate-pulse">
                      {a.badge}
                    </span>
                  )}
                </span>
                <span className="block text-sm font-medium mt-1 opacity-80">{a.desc}</span>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0" />
            </Link>
          ))}
        </div>

        {/* Quick stats */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <div className="rounded-xl bg-white border-2 border-slate-200 p-4 text-center">
            <p className="text-xs font-black text-slate-400 uppercase">Bugün Mesaj</p>
            <p className="text-3xl font-black text-slate-800 mt-1">{stats.todayLeads}</p>
          </div>
          <div className="rounded-xl bg-white border-2 border-slate-200 p-4 text-center">
            <p className="text-xs font-black text-slate-400 uppercase">Ürün Sayısı</p>
            <p className="text-3xl font-black text-slate-800 mt-1">{stats.quickStats.totalManagedContent}</p>
          </div>
          <div className="rounded-xl bg-white border-2 border-slate-200 p-4 text-center">
            <p className="text-xs font-black text-slate-400 uppercase">Blog Yazısı</p>
            <p className="text-3xl font-black text-slate-800 mt-1">{stats.posts}</p>
          </div>
          <div className="rounded-xl bg-white border-2 border-slate-200 p-4 text-center">
            <p className="text-xs font-black text-slate-400 uppercase">Hizmet</p>
            <p className="text-3xl font-black text-slate-800 mt-1">{stats.services}</p>
          </div>
        </div>

        {/* Latest leads */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-black text-slate-800">Son Gelen Mesajlar</h3>
            <Link href="/admin/leads" className="text-sm font-black text-cyan-600 hover:text-cyan-700">Tümü →</Link>
          </div>
          <AdminTable
            resource={{ ...adminResources.leads, canCreate: false, canEdit: true, canDelete: false }}
            rows={stats.latestLeads}
          />
        </section>
      </div>
    </ProtectedAdminPage>
  );
}
