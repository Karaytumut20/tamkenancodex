import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const money = (value: number) => value.toLocaleString("tr-TR", { style: "currency", currency: "TRY" });

export default async function AccountingPage() {
  const supabase = await createSupabaseServerClient();
  const { data: orders } = await supabase
    .from("service_orders")
    .select("id, order_number, grand_total, paid_amount, total_cost, net_profit, status, created_at, customer:customer_id(id,name)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  const rows = orders || [];
  const totalSales = rows.reduce((sum, row) => sum + Number(row.grand_total || 0), 0);
  const totalCollected = rows.reduce((sum, row) => sum + Number(row.paid_amount || 0), 0);
  const totalCost = rows.reduce((sum, row) => sum + Number(row.total_cost || 0), 0);
  const receivable = Math.max(0, totalSales - totalCollected);

  return (
    <ProtectedAdminPage>
      <AdminPageHeader title="Muhasebe & Tahsilat" description="İş emirleri, müşteriler, maliyetler ve tahsilatlar tek finansal görünümde." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        {[
          ["Faturalanan / İşlem Tutarı", totalSales, "text-slate-900"],
          ["Tahsil Edilen", totalCollected, "text-emerald-700"],
          ["Kalan Alacak", receivable, "text-rose-700"],
          ["Toplam Maliyet", totalCost, "text-amber-700"],
        ].map(([label, value, color]) => (
          <div key={String(label)} className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase text-slate-400">{label}</p>
            <p className={`mt-2 text-2xl font-black ${color}`}>{money(Number(value))}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border-2 border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 p-5"><h2 className="font-black text-slate-800">İş Emri Finans Durumu</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500">
              <tr><th className="p-4">İş Emri</th><th className="p-4">Müşteri</th><th className="p-4">İşlem</th><th className="p-4">Tahsilat</th><th className="p-4">Kalan</th><th className="p-4">Kâr</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.slice(0, 100).map((row: any) => {
                const remaining = Math.max(0, Number(row.grand_total || 0) - Number(row.paid_amount || 0));
                return (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="p-4"><Link className="font-black text-cyan-700 hover:underline" href={`/admin/service-orders/${row.id}`}>{row.order_number}</Link></td>
                    <td className="p-4 font-semibold">{row.customer?.name || "-"}</td>
                    <td className="p-4">{money(Number(row.grand_total || 0))}</td>
                    <td className="p-4 text-emerald-700 font-bold">{money(Number(row.paid_amount || 0))}</td>
                    <td className="p-4 text-rose-700 font-bold">{money(remaining)}</td>
                    <td className="p-4 font-bold">{money(Number(row.net_profit || 0))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedAdminPage>
  );
}
