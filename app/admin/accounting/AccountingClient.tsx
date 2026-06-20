"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, User } from "lucide-react";

type Props = {
  orders: any[];
  customers: any[];
};

const money = (value: number) => value.toLocaleString("tr-TR", { style: "currency", currency: "TRY" });

export function AccountingClient({ orders, customers }: Props) {
  const [q, setQ] = useState("");
  const [customerId, setCustomerId] = useState("");

  const filtered = useMemo(() => orders.filter((o) => {
    const query = q.toLowerCase();
    const searchMatch =
      o.order_number.toLowerCase().includes(query) ||
      (o.customer?.name && o.customer.name.toLowerCase().includes(query));
    
    const customerMatch = !customerId || o.customer?.id === customerId;
    return searchMatch && customerMatch;
  }), [orders, q, customerId]);

  const { totalSales, totalCollected, totalCost, receivable } = useMemo(() => {
    const s = filtered.reduce((sum, row) => sum + Number(row.grand_total || 0), 0);
    const col = filtered.reduce((sum, row) => sum + Number(row.paid_amount || 0), 0);
    const cost = filtered.reduce((sum, row) => sum + Number(row.total_cost || 0), 0);
    return { totalSales: s, totalCollected: col, totalCost: cost, receivable: Math.max(0, s - col) };
  }, [filtered]);

  return (
    <div className="space-y-6">
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

      <div className="rounded-2xl border-2 border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 p-5"><h2 className="font-black text-slate-800">İş Emri Finans Durumu</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500">
              <tr><th className="p-4">İş Emri</th><th className="p-4">Müşteri</th><th className="p-4">İşlem</th><th className="p-4">Tahsilat</th><th className="p-4">Kalan</th><th className="p-4">Kâr</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">Kayıt bulunamadı.</td>
                </tr>
              )}
              {filtered.slice(0, 100).map((row: any) => {
                const remaining = Math.max(0, Number(row.grand_total || 0) - Number(row.paid_amount || 0));
                return (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="p-4"><Link className="font-black text-cyan-700 hover:underline" href={`/admin/service-orders/${row.id}`}>{row.order_number}</Link></td>
                    <td className="p-4 font-semibold">
                      <Link href={`/admin/customers/${row.customer?.id}`} className="hover:text-cyan-600 transition-colors">
                        {row.customer?.name || "-"}
                      </Link>
                    </td>
                    <td className="p-4 font-bold">{money(Number(row.grand_total || 0))}</td>
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
    </div>
  );
}
