import Link from "next/link";
import { Search, Wrench, Calendar, Plus, FileText, ArrowRight, UserCheck, CheckCircle2, AlertTriangle, AlertCircle, Clock } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { AdminPageHeader } from "@/components/admin/AdminShell";

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
      *,
      customer:customer_id (id, name, phone, type),
      appointment:appointment_id (appointment_date, start_time, service_type)
    `)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (statusFilter) {
    query = query.eq("status", statusFilter);
  }

  const { data: rawOrders } = await query;
  let orders = rawOrders || [];

  // Client-side text search (since joined relation search is simpler to filter/regex or post-process here)
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
  const totalCount = orders.length;
  const pendingCount = orders.filter(o => o.status !== "Tamamlandı" && o.status !== "İptal Edildi").length;
  const completedCount = orders.filter(o => o.status === "Tamamlandı").length;
  const totalUncollected = orders.reduce((sum, o) => sum + Math.max(0, Number(o.grand_total) - Number(o.paid_amount)), 0);

  return (
    <ProtectedAdminPage>
      <AdminPageHeader
        title="🛠️ İş Emirleri & Servis Takibi"
        description="Müşteri şikayetleri, kullanılan malzemeler, işçilik maliyeti ve tahsilat takibini yapın."
        action={
          <Link
            href="/admin/calendar"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-cyan-600 border-2 border-cyan-700 px-6 text-base font-black text-white hover:bg-cyan-700 transition-colors"
          >
            <Plus className="h-5 w-5" /> Yeni İş Emri (Takvimden)
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

      {/* Orders Table */}
      {orders.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <Wrench className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-lg font-black text-slate-700">İş Emri Bulunamadı</h3>
          <p className="mt-2 text-sm font-semibold text-slate-400">
            Kriterlerinize uygun bir iş emri bulunamadı. Yeni bir randevu oluşturup iş emri başlatabilirsiniz.
          </p>
          <Link
            href="/admin/calendar"
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-cyan-600 text-white px-5 text-sm font-black hover:bg-cyan-700 transition-colors"
          >
            Randevu Takvimine Git
          </Link>
        </div>
      ) : (
        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-black text-xs uppercase">
                  <th className="p-4">No & Tarih</th>
                  <th className="p-4">Müşteri</th>
                  <th className="p-4">Hizmet Türü</th>
                  <th className="p-4">Maliyet</th>
                  <th className="p-4">Satış Tutarı</th>
                  <th className="p-4">Kalan Tutar</th>
                  <th className="p-4">Durum</th>
                  <th className="p-4 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {orders.map((o: any) => {
                  const remaining = Number(o.grand_total || 0) - Number(o.paid_amount || 0);
                  const isOverdue = remaining > 0 && o.status === 'Tamamlandı';

                  return (
                    <tr key={o.id} className="hover:bg-slate-50">
                      <td className="p-4">
                        <span className="block font-black text-slate-800">{o.order_number}</span>
                        <span className="block text-[10px] font-bold text-slate-400 mt-0.5 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {o.appointment?.appointment_date || o.created_at.split('T')[0]}
                        </span>
                      </td>
                      <td className="p-4">
                        <Link href={`/admin/customers/${o.customer?.id}`} className="font-extrabold text-slate-800 hover:text-cyan-600 block transition-colors">
                          {o.customer?.name}
                        </Link>
                        <span className="block text-[10px] text-slate-400 mt-0.5">{o.customer?.phone}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-slate-700 font-bold block truncate max-w-[150px]" title={o.appointment?.service_type || "Direkt İş Emri"}>
                          {o.appointment?.service_type || "Hizmet Belirtilmemiş"}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-500">
                        {Number(o.total_cost || 0).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                      </td>
                      <td className="p-4 font-black text-slate-800">
                        {Number(o.grand_total || 0).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                      </td>
                      <td className="p-4">
                        <span className={`font-black ${remaining > 0 ? (isOverdue ? 'text-red-600' : 'text-slate-700') : 'text-emerald-600'}`}>
                          {remaining.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                        </span>
                        {remaining > 0 && (
                          <span className={`block text-[9px] font-extrabold uppercase px-1 py-0.5 rounded mt-0.5 w-max ${
                            isOverdue ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {isOverdue ? 'Tahsilat Gecikti' : 'Ödeme Bekliyor'}
                          </span>
                        )}
                        {remaining <= 0 && Number(o.grand_total || 0) > 0 && (
                          <span className="block text-[9px] font-extrabold uppercase px-1 py-0.5 rounded mt-0.5 w-max bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Ödendi
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          o.status === 'Tamamlandı' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : o.status === 'İptal Edildi'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : o.status === 'Malzeme Bekleniyor'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/admin/service-orders/${o.id}`}
                          className="inline-flex h-9 items-center justify-center gap-1 rounded-xl bg-slate-100 px-4 text-xs font-black text-slate-700 hover:bg-slate-200 transition-colors"
                        >
                          Yönet <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ProtectedAdminPage>
  );
}
