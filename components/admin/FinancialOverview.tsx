"use client";

import { useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";

export type FinancialOverviewOrder = {
  id: string;
  created_at: string;
  grand_total: number | string | null;
  paid_amount: number | string | null;
  total_cost: number | string | null;
  labor_price_currency?: string | null;
};

export type FinancialOverviewPayment = {
  service_order_id?: string | null;
  payment_date: string;
  amount: number | string;
  currency?: string | null;
};

type Props = {
  orders: FinancialOverviewOrder[];
  payments: FinancialOverviewPayment[];
  usdTryRate: number;
};

const moneyTRY = (value: number) =>
  value.toLocaleString("tr-TR", { style: "currency", currency: "TRY" });
const moneyUSD = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });

function formatMoney(value: number, currency: "TRY" | "USD") {
  return currency === "USD" ? moneyUSD(value) : moneyTRY(value);
}

function getCurrentTurkeyMonth() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  return year && month ? `${year}-${month}` : new Date().toISOString().slice(0, 7);
}

function monthKey(value?: string | null) {
  return value && /^\d{4}-\d{2}/.test(value) ? value.slice(0, 7) : null;
}

function monthLabel(value: string) {
  const [year, month] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("tr-TR", {
    month: "long",
    year: "numeric",
    timeZone: "Europe/Istanbul",
  }).format(new Date(Date.UTC(year, month - 1, 1, 12)));
}

export function FinancialOverview({ orders, payments, usdTryRate }: Props) {
  const currentMonth = useMemo(getCurrentTurkeyMonth, []);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const safeUsdTryRate = Number.isFinite(usdTryRate) && usdTryRate > 0 ? usdTryRate : 1;

  const aggregates = useMemo(() => {
    const result = {
      try: { sales: 0, collected: 0, receivable: 0, cost: 0 },
      usd: { sales: 0, collected: 0, receivable: 0, cost: 0 },
    };
    const orderMap = new Map(orders.map((order) => [order.id, order]));

    for (const order of orders) {
      const currency = order.labor_price_currency === "USD" ? "USD" : "TRY";
      const grandTotal = Number(order.grand_total || 0);
      const paidAmount = Number(order.paid_amount || 0);

      // Kalan alacak devreden güncel bakiyedir; ay filtresinden etkilenmez.
      result[currency.toLowerCase() as "try" | "usd"].receivable += Math.max(0, grandTotal - paidAmount);

      if (monthKey(order.created_at) !== selectedMonth) continue;

      result[currency.toLowerCase() as "try" | "usd"].sales += grandTotal;
      const totalCost = Number(order.total_cost || 0);
      result[currency.toLowerCase() as "try" | "usd"].cost +=
        currency === "USD" ? totalCost / safeUsdTryRate : totalCost;
    }

    for (const payment of payments) {
      if (monthKey(payment.payment_date) !== selectedMonth) continue;
      if (!payment.service_order_id) continue;

      const order = orderMap.get(payment.service_order_id);
      if (!order) continue;

      const orderCurrency = order.labor_price_currency === "USD" ? "USD" : "TRY";
      const paymentCurrency = payment.currency === "USD" ? "USD" : "TRY";
      let amount = Number(payment.amount || 0);

      if (paymentCurrency !== orderCurrency) {
        amount = paymentCurrency === "USD"
          ? amount * safeUsdTryRate
          : amount / safeUsdTryRate;
      }

      result[orderCurrency.toLowerCase() as "try" | "usd"].collected += amount;
    }

    return result;
  }, [orders, payments, safeUsdTryRate, selectedMonth]);

  const selectedPeriodLabel = monthLabel(selectedMonth);

  const renderCashbox = (currency: "TRY" | "USD") => {
    const values = currency === "TRY" ? aggregates.try : aggregates.usd;
    const isUsd = currency === "USD";
    const cards = [
      ["Faturalanan", values.sales, "text-slate-900"],
      ["Tahsil Edilen", values.collected, "text-emerald-700"],
      ["Kalan Alacak", values.receivable, "text-rose-700"],
      ["Toplam Maliyet", values.cost, "text-amber-700"],
    ] as const;

    return (
      <div className={`rounded-3xl border-2 p-5 shadow-sm space-y-4 ${isUsd ? "border-amber-200 bg-amber-50/10" : "border-slate-200 bg-white"}`}>
        <h3 className={`flex items-center gap-2 border-b pb-2 text-sm font-black uppercase tracking-wider ${isUsd ? "border-amber-100 text-amber-800" : "border-slate-100 text-slate-800"}`}>
          <span className="text-base" aria-hidden="true">{isUsd ? "🇺🇸" : "🇹🇷"}</span>
          {isUsd ? "Amerikan Doları (USD) Kasası" : "Türk Lirası (TL) Kasası"}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {cards.map(([label, value, color]) => {
            const isReceivable = label === "Kalan Alacak";
            return (
              <div key={label} className={`rounded-xl border p-3.5 ${isUsd ? "border-amber-100/50 bg-amber-50/30" : "border-slate-100 bg-slate-50/55"}`}>
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <p className="text-[10px] font-black uppercase text-slate-400">{label}</p>
                  {isReceivable && (
                    <span className="rounded-full bg-white px-1.5 py-0.5 text-[8px] font-black uppercase text-rose-500 ring-1 ring-rose-100">
                      Devreden bakiye
                    </span>
                  )}
                </div>
                <p className={`mt-1 text-lg font-black ${color}`}>
                  {formatMoney(Number(value), currency)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section className="space-y-4" aria-label="Finansal dönem özeti">
      <div className="flex flex-col gap-3 rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black text-slate-800">Aylık Finans Özeti</p>
          <p className="mt-0.5 text-xs font-semibold text-slate-500">
            Faturalanan, tahsil edilen ve maliyet: {selectedPeriodLabel}. Kalan alacak devreden güncel bakiyedir.
          </p>
        </div>
        <label className="flex shrink-0 items-center gap-2 text-xs font-black text-slate-600">
          <CalendarDays className="h-4 w-4 text-cyan-600" />
          <span>Ay seç</span>
          <input
            type="month"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
            className="h-10 min-w-44 rounded-xl border-2 border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none transition-colors focus:border-cyan-500"
            aria-label="Finansal özet ayı"
          />
        </label>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {renderCashbox("TRY")}
        {renderCashbox("USD")}
      </div>
    </section>
  );
}
