import Link from "next/link";
import { Search, Plus, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ServiceOrdersListClient } from "./ServiceOrdersListClient";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ q?: string; status?: string; pay_status?: string }>;

export default async function ServiceOrdersPage({ searchParams }: { searchParams: SearchParams }) {
  const supabase = await createSupabaseServerClient();
  const params = await searchParams;
  const q = params.q || "";
  const statusFilter = params.status || "";
  const payStatusFilter = params.pay_status || "";

  // Query service orders with customer and appointment info
  let query = supabase
    .from("service_orders")
    .select(`
      id, order_number, created_at, total_cost, grand_total, paid_amount, status, labor_price_currency,
      customer:customer_id (id, name, phone, type),
      appointment:appointment_id (appointment_date, start_time, service_type)
    `)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(250);

  if (statusFilter) {
    query = query.eq("status", statusFilter);
  }

  const { data: rawOrders } = await query;
  let orders = rawOrders || [];

  // Client-side text search
  if (q) {
    const qLower = q.toLowerCase();
    orders = orders.filter((o: any) =>
      o.order_number.toLowerCase().includes(qLower) ||
      (o.customer?.name && o.customer.name.toLowerCase().includes(qLower)) ||
      (o.customer?.phone && o.customer.phone.toLowerCase().includes(qLower)) ||
      (o.appointment?.service_type && o.appointment.service_type.toLowerCase().includes(qLower))
    );
  }

  // Payment status filter
  if (payStatusFilter) {
    orders = orders.filter((o: any) => {
      const remaining = Number(o.grand_total) - Number(o.paid_amount);
      if (payStatusFilter === "tümü_odendi") {
        return remaining <= 0 && Number(o.grand_total) > 0;
      } else if (payStatusFilter === "kismi") {
        return Number(o.paid_amount) > 0 && remaining > 0;
      } else if (payStatusFilter === "odenmedi") {
        return Number(o.paid_amount) === 0 && Number(o.grand_total) > 0;
      } else if (payStatusFilter === "tahsilat_bekliyor") {
        return remaining > 0;
      }
      return true;
    });
  }

  // Statistics counters
  const pendingCount = orders.filter(o => o.status !== "Tamamlandı" && o.status !== "İptal Edildi").length;
  const completedCount = orders.filter(o => o.status === "Tamamlandı").length;
  const totalUncollected = orders.reduce((sum, o) => {
    const remaining = Math.max(0, Number(o.grand_total) - Number(o.paid_amount));
    const currency = o.labor_price_currency || 'TRY';
    return sum + (currency === 'USD' ? remaining * 34 : remaining);
  }, 0);

  return (
    <ProtectedAdminPage>
      <AdminPageHeader
        title="🛠️ İş Emirleri & Servis Takibi"
        description="Müşteri şikayetleri, kullanılan malzemeler, işçilik maliyeti ve tahsilat takibini yapın."
        action={
          <Link
            href="/admin/service-orders/new"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-cyan-600 border-2 border-cyan-700 px-6 text-base font-black text-white hover:bg-cyan-700 transition-colors"
          >
            <Plus className="h-5 w-5" /> Yeni İş Emri Oluştur
          </Link>
        }
      />

      {/* Overview Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-6">
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600 border border-yellow-100">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase">Aktif İşler</p>
            <p className="text-2xl font-black text-slate-800 mt-0.5">{pendingCount} Adet</p>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase">Tamamlanan İşler</p>
            <p className="text-2xl font-black text-slate-800 mt-0.5">{completedCount} Adet</p>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
            <AlertTriangle className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase">Toplam Kalan Alacak</p>
            <p className="text-2xl font-black text-rose-600 mt-0.5">
              {totalUncollected.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm mb-6 space-y-4">
        <form className="flex flex-col gap-4 md:flex-row md:items-end">
          {/* Search bar */}
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-black text-slate-500 uppercase">Arama</label>
            <div className="relative">
              <input
                name="q"
                defaultValue={q}
                placeholder="Müşteri adı, iş emri no veya hizmet türü ara..."
                className="h-11 w-full pl-10 pr-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
              />
              <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
            </div>
          </div>

          {/* Status filter */}
          <div className="w-full md:w-48 space-y-1.5">
            <label className="text-xs font-black text-slate-500 uppercase">Servis Durumu</label>
            <select
              name="status"
              defaultValue={statusFilter}
              className="h-11 w-full px-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="">Tümü</option>
              <option value="Taslak">Taslak</option>
              <option value="İşlem Başladı">İşlem Başladı</option>
              <option value="Malzeme Bekleniyor">Malzeme Bekleniyor</option>
              <option value="Tamamlandı">Tamamlandı</option>
              <option value="İptal Edildi">İptal Edildi</option>
            </select>
          </div>

          {/* Payment status filter */}
          <div className="w-full md:w-48 space-y-1.5">
            <label className="text-xs font-black text-slate-500 uppercase">Ödeme Durumu</label>
            <select
              name="pay_status"
              defaultValue={payStatusFilter}
              className="h-11 w-full px-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="">Tümü</option>
              <option value="tahsilat_bekliyor">Tahsilat Bekleyenler</option>
              <option value="odenmedi">Ödenmeyenler</option>
              <option value="kismi">Kısmi Ödenenler</option>
              <option value="tümü_odendi">Tamamı Ödenenler</option>
            </select>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              type="submit"
              className="h-11 px-5 rounded-xl bg-slate-800 text-white text-sm font-black hover:bg-slate-900 transition-colors shrink-0"
            >
              Filtrele
            </button>
            {(q || statusFilter || payStatusFilter) && (
              <Link
                href="/admin/service-orders"
                className="h-11 px-4 rounded-xl border-2 border-slate-200 hover:bg-slate-50 flex items-center justify-center text-xs font-black text-slate-500 shrink-0"
              >
                Sıfırla
              </Link>
            )}
          </div>
        </form>
      </div>

      {/* Orders Table with Edit & Delete Buttons */}
      <ServiceOrdersListClient orders={orders as any} />
    </ProtectedAdminPage>
  );
}
