"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, User, Trash2, CheckCircle2, AlertTriangle, ExternalLink, DollarSign } from "lucide-react";
import { deleteServiceOrder, approveServiceOrderPayment } from "../service-orders/actions";

type Props = {
  orders: any[];
  customers: any[];
};

const moneyTRY = (value: number) => value.toLocaleString("tr-TR", { style: "currency", currency: "TRY" });
const moneyUSD = (value: number) => value.toLocaleString("en-US", { style: "currency", currency: "USD" });

function formatMoney(value: number, currency: string = "TRY") {
  return currency === "USD" ? moneyUSD(value) : moneyTRY(value);
}

export function AccountingClient({ orders: initialOrders, customers }: Props) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [q, setQ] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const filtered = useMemo(() => orders.filter((o) => {
    const query = q.toLowerCase();
    const searchMatch =
      o.order_number.toLowerCase().includes(query) ||
      (o.customer?.name && o.customer.name.toLowerCase().includes(query));
    
    const customerMatch = !customerId || o.customer?.id === customerId;
    return searchMatch && customerMatch;
  }), [orders, q, customerId]);

  const aggregates = useMemo(() => {
    let trySales = 0, tryCollected = 0, tryCost = 0;
    let usdSales = 0, usdCollected = 0, usdCost = 0;

    filtered.forEach((row) => {
      const currency = row.labor_price_currency || "TRY";
      const grandTotal = Number(row.grand_total || 0);
      const paidAmount = Number(row.paid_amount || 0);
      const totalCost = Number(row.total_cost || 0);

      if (currency === "USD") {
        usdSales += grandTotal;
        usdCollected += paidAmount;
        usdCost += totalCost;
      } else {
        trySales += grandTotal;
        tryCollected += paidAmount;
        tryCost += totalCost;
      }
    });

    return {
      try: {
        sales: trySales,
        collected: tryCollected,
        receivable: Math.max(0, trySales - tryCollected),
        cost: tryCost,
      },
      usd: {
        sales: usdSales,
        collected: usdCollected,
        receivable: Math.max(0, usdSales - usdCollected),
        cost: usdCost,
      }
    };
  }, [filtered]);

  const handleDelete = async (id: string, orderNumber: string) => {
    if (!confirm(`"${orderNumber}" numaralı iş emrini muhasebe kayıtlarından silmek istiyor musunuz?`)) return;
    setActionLoading(id);
    setErrorMsg("");
    const res = await deleteServiceOrder(id);
    if (res.success) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
      setSuccessMsg("İş emri başarıyla silindi.");
      setTimeout(() => setSuccessMsg(""), 3000);
      router.refresh();
    } else {
      setErrorMsg(res.error || "Silme işlemi başarısız.");
    }
    setActionLoading(null);
  };

  const handleApprove = async (id: string, customerId: string, orderNumber: string) => {
    if (!confirm(`"${orderNumber}" numaralı iş emrinin kalan tutarını tahsil edildi olarak onaylamak istiyor musunuz?`)) return;
    setActionLoading(id);
    setErrorMsg("");
    const res = await approveServiceOrderPayment(id, customerId);
    if (res.success) {
      setSuccessMsg("Tahsilat onaylandı ve kaydedildi.");
      setTimeout(() => setSuccessMsg(""), 3000);
      router.refresh();
    } else {
      setErrorMsg(res.error || "Onaylama işlemi başarısız.");
    }
    setActionLoading(null);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        {/* TRY Summary Block */}
        <div className="rounded-3xl border-2 border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="text-base">🇹🇷</span> Türk Lirası (TL) Kasası
          </h3>
          <div className="grid gap-3 grid-cols-2">
            {[
              ["Faturalanan", aggregates.try.sales, "text-slate-900", "TRY"],
              ["Tahsil Edilen", aggregates.try.collected, "text-emerald-700", "TRY"],
              ["Kalan Alacak", aggregates.try.receivable, "text-rose-700", "TRY"],
              ["Toplam Maliyet", aggregates.try.cost, "text-amber-700", "TRY"],
            ].map(([label, value, color, curr]) => (
              <div key={String(label)} className="bg-slate-50/55 p-3.5 rounded-xl border border-slate-100">
                <p className="text-[10px] font-black uppercase text-slate-400">{label}</p>
                <p className={`mt-1 text-lg font-black ${color}`}>
                  {formatMoney(Number(value), String(curr))}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* USD Summary Block */}
        <div className="rounded-3xl border-2 border-amber-200 bg-amber-50/10 p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-amber-800 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-amber-100">
            <span className="text-base">🇺🇸</span> Amerikan Doları (USD) Kasası
          </h3>
          <div className="grid gap-3 grid-cols-2">
            {[
              ["Faturalanan", aggregates.usd.sales, "text-slate-900", "USD"],
              ["Tahsil Edilen", aggregates.usd.collected, "text-emerald-700", "USD"],
              ["Kalan Alacak", aggregates.usd.receivable, "text-rose-700", "USD"],
              ["Toplam Maliyet", aggregates.usd.cost, "text-amber-700", "USD"],
            ].map(([label, value, color, curr]) => (
              <div key={String(label)} className="bg-amber-50/30 p-3.5 rounded-xl border border-amber-100/50">
                <p className="text-[10px] font-black uppercase text-slate-400">{label}</p>
                <p className={`mt-1 text-lg font-black ${color}`}>
                  {formatMoney(Number(value), String(curr))}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 text-sm font-semibold">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 text-sm font-semibold">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="İş emri no veya müşteri adı arayın..."
            className="h-11 w-full pl-10 pr-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
          />
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto items-center">
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="h-11 px-3 rounded-xl border-2 border-slate-200 bg-white text-xs font-semibold outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="">Tüm Müşteriler</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border-2 border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 p-5 flex items-center justify-between">
          <h2 className="font-black text-slate-800">İş Emri Finans Durumu</h2>
          <span className="text-xs font-bold text-slate-400">{filtered.length} kayıt</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500">
              <tr>
                <th className="p-4">İş Emri</th>
                <th className="p-4">Müşteri</th>
                <th className="p-4">İşlem Tutarı</th>
                <th className="p-4">Tahsilat</th>
                <th className="p-4">Kalan</th>
                <th className="p-4">Kâr</th>
                <th className="p-4">Durum</th>
                <th className="p-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 font-medium">Kayıt bulunamadı.</td>
                </tr>
              )}
              {filtered.slice(0, 100).map((row: any) => {
                const remaining = Math.max(0, Number(row.grand_total || 0) - Number(row.paid_amount || 0));
                const isFullyPaid = remaining <= 0 && Number(row.grand_total || 0) > 0;
                const isLoading = actionLoading === row.id;
                return (
                  <tr key={row.id} className={`hover:bg-slate-50 transition-colors ${isLoading ? "opacity-50" : ""}`}>
                    <td className="p-4">
                      <Link className="font-black text-cyan-700 hover:underline" href={`/admin/service-orders/${row.id}`}>
                        {row.order_number}
                      </Link>
                    </td>
                    <td className="p-4 font-semibold">
                      <Link href={`/admin/customers/${row.customer?.id}`} className="hover:text-cyan-600 transition-colors">
                        {row.customer?.name || "-"}
                      </Link>
                    </td>
                    <td className="p-4 font-bold">{formatMoney(Number(row.grand_total || 0), row.labor_price_currency)}</td>
                    <td className="p-4">
                      <span className="text-emerald-700 font-bold block">{formatMoney(Number(row.paid_amount || 0), row.labor_price_currency)}</span>
                      {row.labor_price_currency === "USD" && (
                        <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5 mt-0.5">
                          <DollarSign className="h-3 w-3" /> USD İşlem
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`font-bold ${remaining > 0 ? "text-rose-700" : "text-emerald-600"}`}>
                        {formatMoney(remaining, row.labor_price_currency)}
                      </span>
                      {isFullyPaid && (
                        <span className="block text-[9px] font-extrabold uppercase px-1 py-0.5 rounded mt-0.5 w-max bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Ödendi
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-bold">{formatMoney(Number(row.net_profit || 0), row.labor_price_currency)}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        row.status === "Tamamlandı"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : row.status === "İptal Edildi"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-cyan-50 text-cyan-700 border border-cyan-200"
                      }`}>
                        {row.status || "—"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        {/* Detay */}
                        <Link
                          href={`/admin/service-orders/${row.id}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                          title="Düzenle / Detay"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                        {/* Onayla (tahsilat tamamla) */}
                        {!isFullyPaid && remaining > 0 && (
                          <button
                            onClick={() => handleApprove(row.id, row.customer?.id, row.order_number)}
                            disabled={isLoading}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 transition-colors disabled:opacity-50"
                            title="Tahsilatı Onayla (Tamamını Ödenmiş Yap)"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {/* Sil */}
                        <button
                          onClick={() => handleDelete(row.id, row.order_number)}
                          disabled={isLoading}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 transition-colors disabled:opacity-50"
                          title="Sil"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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
