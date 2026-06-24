"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Edit3, Trash2, ArrowRight, Calendar, CheckCircle2, 
  AlertTriangle, AlertCircle, Clock, Wrench
} from "lucide-react";
import { deleteServiceOrder } from "./actions";

type Order = {
  id: string;
  order_number: string;
  created_at: string;
  total_cost: number;
  grand_total: number;
  paid_amount: number;
  status: string;
  customer?: { id: string; name: string; phone: string; type: string } | null;
  appointment?: { appointment_date: string; start_time: string; service_type: string } | null;
};

export function ServiceOrdersListClient({ orders: initialOrders }: { orders: Order[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleDelete = async (id: string, orderNumber: string) => {
    if (!confirm(`"${orderNumber}" numaralı iş emrini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) return;
    setDeletingId(id);
    setErrorMsg("");
    const res = await deleteServiceOrder(id);
    if (res.success) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
      startTransition(() => router.refresh());
    } else {
      setErrorMsg(res.error || "İş emri silinemedi.");
    }
    setDeletingId(null);
  };

  if (orders.length === 0) {
    return (
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
    );
  }

  return (
    <div className="space-y-3">
      {errorMsg && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 text-sm font-semibold">
          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-black text-xs uppercase">
                <th className="p-4">No &amp; Tarih</th>
                <th className="p-4">Müşteri</th>
                <th className="p-4">Hizmet Türü</th>
                <th className="p-4">Maliyet</th>
                <th className="p-4">Satış Tutarı</th>
                <th className="p-4">Kalan Tutar</th>
                <th className="p-4">Durum</th>
                <th className="p-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {orders.map((o) => {
                const remaining = Number(o.grand_total || 0) - Number(o.paid_amount || 0);
                const isOverdue = remaining > 0 && o.status === 'Tamamlandı';
                const isDeleting = deletingId === o.id;

                return (
                  <tr key={o.id} className={`hover:bg-slate-50 transition-colors ${isDeleting ? "opacity-50" : ""}`}>
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
                      <div className="inline-flex items-center gap-1">
                        <Link
                          href={`/admin/service-orders/${o.id}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          title="Düzenle / Yönet"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(o.id, o.order_number)}
                          disabled={isDeleting || isPending}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 transition-colors disabled:opacity-50"
                          title="Sil"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
