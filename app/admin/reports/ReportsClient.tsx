"use client";

import React, { useState } from "react";
import { 
  BarChart3, 
  Calendar, 
  Download, 
  Printer, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Briefcase, 
  Package, 
  AlertTriangle,
  FileSpreadsheet
} from "lucide-react";
import { dateKeyToLocalDate, toCalendarDateKey } from "@/lib/admin/calendar-date";

const formatMoney = (value: number, currency: string = "TRY") => {
  return currency === "USD"
    ? value.toLocaleString("en-US", { style: "currency", currency: "USD" })
    : value.toLocaleString("tr-TR", { style: "currency", currency: "TRY" });
};

type Props = {
  customers: any[];
  appointments: any[];
  serviceOrders: any[];
  employees: any[];
  payments: any[];
  orderMaterials: any[];
  stockMovements: any[];
};

export function ReportsClient({
  customers,
  appointments,
  serviceOrders,
  employees,
  payments,
  orderMaterials,
  stockMovements,
}: Props) {
  // Date Filters (default: current month)
  const defaultStart = new Date();
  defaultStart.setDate(1);
  const defaultEnd = new Date();
  
  const [startDate, setStartDate] = useState(toCalendarDateKey(defaultStart));
  const [endDate, setEndDate] = useState(toCalendarDateKey(defaultEnd));

  // Selected Report Category
  const [reportType, setReportType] = useState<
    | "gelir_gider"
    | "randevu_is"
    | "musteri_hizmet"
    | "borclu_musteriler"
    | "personel_performans"
    | "malzeme_kullanim"
    | "stok_hareket"
  >("gelir_gider");

  const start = dateKeyToLocalDate(startDate);
  start.setHours(0,0,0,0);
  const end = dateKeyToLocalDate(endDate);
  end.setHours(23,59,59,999);

  // Helper date checker
  const inRange = (dateStr: string) => {
    const d = new Date(dateStr);
    return d >= start && d <= end;
  };

  // -----------------------------------------------------------------
  // 1. Gelir & Gider Raporu
  // -----------------------------------------------------------------
  const filteredOrders = serviceOrders.filter((o) => o.created_at && inRange(o.created_at));
  
  let tryCiro = 0, tryCost = 0, tryNetProfit = 0, tryPaidAmount = 0;
  let usdCiro = 0, usdCost = 0, usdNetProfit = 0, usdPaidAmount = 0;

  filteredOrders.forEach((o) => {
    const currency = o.labor_price_currency || 'TRY';
    if (currency === 'USD') {
      usdCiro += Number(o.grand_total || 0);
      usdCost += Number(o.total_cost || 0) / 34; // Convert TRY cost to USD
      usdNetProfit += Number(o.net_profit || 0);
      usdPaidAmount += Number(o.paid_amount || 0);
    } else {
      tryCiro += Number(o.grand_total || 0);
      tryCost += Number(o.total_cost || 0);
      tryNetProfit += Number(o.net_profit || 0);
      tryPaidAmount += Number(o.paid_amount || 0);
    }
  });

  const tryRemainingReceivable = tryCiro - tryPaidAmount;
  const usdRemainingReceivable = usdCiro - usdPaidAmount;

  // -----------------------------------------------------------------
  // 2. Randevu & İş Raporu
  // -----------------------------------------------------------------
  const filteredAppointments = appointments.filter((a) => inRange(a.appointment_date));
  const planliCount = filteredAppointments.filter((a) => a.status === "Planlandı").length;
  const tamamlananCount = filteredAppointments.filter((a) => a.status === "İşlem Tamamlandı").length;
  const iptalCount = filteredAppointments.filter((a) => a.status === "İptal Edildi").length;

  // -----------------------------------------------------------------
  // 3. Müşteri Bazlı Hizmet Raporu
  // -----------------------------------------------------------------
  const customerReportData = customers.map((c) => {
    const cOrders = serviceOrders.filter((o) => o.customer_id === c.id && o.created_at && inRange(o.created_at));
    
    // TRY
    const tryBilled = cOrders
      .filter((o) => (o.labor_price_currency || 'TRY') === 'TRY')
      .reduce((sum, o) => sum + Number(o.grand_total || 0), 0);
    const tryPaid = payments
      .filter((p) => p.customer_id === c.id && (p.currency || 'TRY') === 'TRY' && inRange(p.payment_date))
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);
      
    // USD
    const usdBilled = cOrders
      .filter((o) => o.labor_price_currency === 'USD')
      .reduce((sum, o) => sum + Number(o.grand_total || 0), 0);
    const usdPaid = payments
      .filter((p) => p.customer_id === c.id && p.currency === 'USD' && inRange(p.payment_date))
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    return {
      name: c.name,
      phone: c.phone,
      type: c.type,
      totalServices: cOrders.length,
      tryBilled,
      tryPaid,
      tryBalance: tryBilled - tryPaid,
      usdBilled,
      usdPaid,
      usdBalance: usdBilled - usdPaid,
    };
  }).filter((c) => c.totalServices > 0 || c.tryBilled > 0 || c.tryPaid > 0 || c.usdBilled > 0 || c.usdPaid > 0);

  // -----------------------------------------------------------------
  // 4. Borçlu Müşteriler Raporu
  // -----------------------------------------------------------------
  const debtorReportData = customers.map((c) => {
    // Check all time balance for debtor report
    const cOrders = serviceOrders.filter((o) => o.customer_id === c.id && o.status !== "İptal Edildi");
    
    // TRY
    const tryBilled = cOrders
      .filter((o) => (o.labor_price_currency || 'TRY') === 'TRY')
      .reduce((sum, o) => sum + Number(o.grand_total || 0), 0);
    const tryPaid = payments
      .filter((p) => p.customer_id === c.id && (p.currency || 'TRY') === 'TRY')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);
      
    // USD
    const usdBilled = cOrders
      .filter((o) => o.labor_price_currency === 'USD')
      .reduce((sum, o) => sum + Number(o.grand_total || 0), 0);
    const usdPaid = payments
      .filter((p) => p.customer_id === c.id && p.currency === 'USD')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    return {
      name: c.name,
      phone: c.phone,
      type: c.type,
      tryBilled,
      tryPaid,
      tryBalance: tryBilled - tryPaid,
      usdBilled,
      usdPaid,
      usdBalance: usdBilled - usdPaid,
    };
  }).filter((c) => c.tryBalance > 0.01 || c.usdBalance > 0.01)
    .sort((a, b) => (b.tryBalance + b.usdBalance * 34) - (a.tryBalance + a.usdBalance * 34));

  // -----------------------------------------------------------------
  // 5. Personel Performans Raporu
  // -----------------------------------------------------------------
  const employeeReportData = employees.map((emp) => {
    const empApps = (appointments || []).filter(
      (a) => a.employee_id === emp.id || a.assistant_employee_id === emp.id
    );
    const appIds = empApps.map((a) => a.id);
    const empOrders = serviceOrders.filter(
      (o) => o.appointment_id && appIds.includes(o.appointment_id) && o.created_at && inRange(o.created_at)
    );

    const completed = empOrders.filter((o) => o.status === "Tamamlandı");
    const cancelled = empOrders.filter((o) => o.status === "İptal Edildi");

    const completedJobs = completed.length;
    const cancelledJobs = cancelled.length;
    let workHours = 0;
    let tryCiro = 0;
    let usdCiro = 0;
    let cost = 0;

    completed.forEach((o) => {
      workHours += Number(o.labor_hours || 0);
      const currency = o.labor_price_currency || 'TRY';
      if (currency === 'USD') {
        usdCiro += Number(o.grand_total || 0);
      } else {
        tryCiro += Number(o.grand_total || 0);
      }
      cost += Number(o.labor_cost || 0) + Number(o.employee_cost || 0);
    });

    return {
      name: emp.full_name,
      role: emp.role_title || "Teknisyen",
      completedJobs,
      cancelledJobs,
      workHours,
      tryCiro,
      usdCiro,
      cost,
    };
  });

  // -----------------------------------------------------------------
  // 6. Kullanılan Malzeme Raporu
  // -----------------------------------------------------------------
  const filteredOrderMaterials = orderMaterials.filter((m) => {
    const order = serviceOrders.find((o) => o.id === m.service_order_id);
    return order && order.created_at && inRange(order.created_at);
  });

  // Aggregate materials used
  const materialReportMap: { [key: string]: any } = {};
  filteredOrderMaterials.forEach((m) => {
    const key = `${m.name}-${m.brand || ""}`;
    if (!materialReportMap[key]) {
      materialReportMap[key] = {
        name: m.name,
        brand: m.brand || "-",
        model: m.model || "-",
        unit: m.unit,
        quantity: 0,
        buying: 0,
        selling: 0,
      };
    }
    materialReportMap[key].quantity += Number(m.quantity || 0);
    materialReportMap[key].buying += Number(m.total_buying_cost || 0);
    materialReportMap[key].selling += Number(m.total_selling_price || 0);
  });
  const materialReportData = Object.values(materialReportMap);

  // -----------------------------------------------------------------
  // 7. Stok Hareket Raporu
  // -----------------------------------------------------------------
  const filteredStockMovements = stockMovements.filter((sm) => inRange(sm.created_at));

  // -----------------------------------------------------------------
  // CSV Export Utility
  // -----------------------------------------------------------------
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: string[][] = [];
    const fileName = `rapor-${reportType}.csv`;

    if (reportType === "gelir_gider") {
      headers = ["Finansal Kalem", "Tutar (TL)", "Tutar (USD)"];
      rows = [
        ["Toplam Hasılat (Ciro)", tryCiro.toFixed(2), usdCiro.toFixed(2)],
        ["Toplam Alış & Hizmet Gideri (Maliyet)", tryCost.toFixed(2), usdCost.toFixed(2)],
        ["Net Kâr", tryNetProfit.toFixed(2), usdNetProfit.toFixed(2)],
        ["Tahsil Edilen Toplam Tutar", tryPaidAmount.toFixed(2), usdPaidAmount.toFixed(2)],
        ["Kalan Alacak / Borç", tryRemainingReceivable.toFixed(2), usdRemainingReceivable.toFixed(2)],
      ];
    } else if (reportType === "randevu_is") {
      headers = ["Tarih", "Müşteri Adı", "Hizmet Türü", "İş Emri No", "Servis Durumu"];
      rows = filteredAppointments.map((a) => {
        const order = serviceOrders.find((o) => o.appointment_id === a.id);
        return [
          a.appointment_date,
          a.customer?.name || "-",
          a.service_type,
          order?.order_number || "-",
          a.status,
        ];
      });
    } else if (reportType === "musteri_hizmet") {
      headers = [
        "Müşteri Adı", 
        "Müşteri Tipi", 
        "Hizmet Sayısı", 
        "Faturalandırılan (TL)", 
        "Ödenen (TL)", 
        "Bakiye (TL)", 
        "Faturalandırılan (USD)", 
        "Ödenen (USD)", 
        "Bakiye (USD)"
      ];
      rows = customerReportData.map((c) => [
        c.name,
        c.type,
        c.totalServices.toString(),
        c.tryBilled.toFixed(2),
        c.tryPaid.toFixed(2),
        c.tryBalance.toFixed(2),
        c.usdBilled.toFixed(2),
        c.usdPaid.toFixed(2),
        c.usdBalance.toFixed(2),
      ]);
    } else if (reportType === "borclu_musteriler") {
      headers = [
        "Müşteri Adı", 
        "Telefon", 
        "Müşteri Tipi", 
        "Toplam Fatura (TL)", 
        "Toplam Ödenen (TL)", 
        "Kalan Borç (TL)", 
        "Toplam Fatura (USD)", 
        "Toplam Ödenen (USD)", 
        "Kalan Borç (USD)"
      ];
      rows = debtorReportData.map((c) => [
        c.name,
        c.phone,
        c.type,
        c.tryBilled.toFixed(2),
        c.tryPaid.toFixed(2),
        c.tryBalance.toFixed(2),
        c.usdBilled.toFixed(2),
        c.usdPaid.toFixed(2),
        c.usdBalance.toFixed(2),
      ]);
    } else if (reportType === "personel_performans") {
      headers = ["Personel Adı", "Görevi", "Tamamlanan İş", "İptal Edilen", "Çalışma Süresi (Saat)", "Ciro (TL)", "Ciro (USD)", "Maliyet (TL)"];
      rows = employeeReportData.map((e) => [
        e.name,
        e.role,
        e.completedJobs.toString(),
        e.cancelledJobs.toString(),
        e.workHours.toString(),
        e.tryCiro.toFixed(2),
        e.usdCiro.toFixed(2),
        e.cost.toFixed(2),
      ]);
    } else if (reportType === "malzeme_kullanim") {
      headers = ["Malzeme Adı", "Marka/Model", "Kullanılan Miktar", "Toplam Alış (TL)", "Toplam Satış (TL)", "Kâr (TL)"];
      rows = materialReportData.map((m) => [
        m.name,
        `${m.brand} ${m.model}`,
        `${m.quantity} ${m.unit}`,
        m.buying.toFixed(2),
        m.selling.toFixed(2),
        (m.selling - m.buying).toFixed(2),
      ]);
    } else if (reportType === "stok_hareket") {
      headers = ["Tarih", "Malzeme Adı", "İşlem Türü", "Miktar", "Açıklama"];
      rows = filteredStockMovements.map((sm) => [
        new Date(sm.created_at).toLocaleString("tr-TR"),
        sm.materials?.name || "-",
        sm.type === "in" ? "Giriş" : sm.type === "out" ? "Çıkış" : "Düzeltme",
        sm.quantity.toString(),
        sm.description || "-",
      ]);
    }

    // Build CSV Content (with Excel UTF-8 BOM support for Turkish characters)
    const csvContent = 
      "\uFEFF" + 
      [headers.join(";"), ...rows.map((row) => row.map((val) => `"${val.replace(/"/g, '""')}"`).join(";"))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Date Filters & Export Toolbar */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
        
        {/* Date Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          <div className="space-y-2 w-full">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Başlangıç Tarihi</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-14 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-base font-semibold outline-none focus:border-cyan-500 transition-colors shadow-sm"
            />
          </div>
          <div className="space-y-2 w-full">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Bitiş Tarihi</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-14 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-base font-semibold outline-none focus:border-cyan-500 transition-colors shadow-sm"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            onClick={handleExportCSV}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-200 px-5 text-xs font-black text-slate-700 transition-colors"
          >
            <FileSpreadsheet className="h-5 w-5 text-emerald-600" /> Excel / CSV Dışa Aktar
          </button>
          
          <button
            onClick={() => window.print()}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 border-2 border-cyan-700 px-5 text-xs font-black text-white transition-colors"
          >
            <Printer className="h-5 w-5" /> Yazdır / PDF
          </button>
        </div>
      </div>

      {/* Grid: Navigation list of Report Types & Main Data view */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        
        {/* Navigation list */}
        <div className="lg:col-span-3">
          <nav className="bg-white border-2 border-slate-200 rounded-3xl p-2 shadow-sm flex overflow-x-auto lg:flex-col gap-1 scrollbar-none">
            {[
              { id: "gelir_gider", label: "Finans / Gelir-Gider", icon: DollarSign },
              { id: "randevu_is", label: "Randevu & İş Durumu", icon: Calendar },
              { id: "musteri_hizmet", label: "Müşteri Hizmet Sayıları", icon: Users },
              { id: "borclu_musteriler", label: "Borçlu Müşteriler", icon: AlertTriangle },
              { id: "personel_performans", label: "Personel Performansı", icon: Briefcase },
              { id: "malzeme_kullanim", label: "Kullanılan Malzemeler", icon: Package },
              { id: "stok_hareket", label: "Stok Hareket Raporu", icon: BarChart3 },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = reportType === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setReportType(t.id as any)}
                  className={`shrink-0 lg:shrink flex items-center gap-3 px-3 py-2.5 lg:px-4 lg:py-3 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                    isActive 
                      ? "bg-cyan-600 text-white shadow-md" 
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Table / Data Sheet */}
        <div className="lg:col-span-9 bg-white border-2 border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm min-h-[450px]">
          
          {/* CATEGORY 1: FINANS / GELIR-GIDER */}
          {reportType === "gelir_gider" && (
            <div className="space-y-8">
              <h3 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-3">Gelir, Gider ve Net Kâr Raporu</h3>

              <div className="grid gap-6 md:grid-cols-2">
                {/* TL Financials */}
                <div className="rounded-3xl border-2 border-slate-200 bg-white p-5 shadow-sm space-y-4">
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="text-base">🇹🇷</span> Türk Lirası (TL) Raporu
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                      <span className="text-xs font-black text-slate-400 uppercase">Hasılat (Ciro)</span>
                      <span className="text-base font-black text-slate-800">{formatMoney(tryCiro, "TRY")}</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                      <span className="text-xs font-black text-slate-400 uppercase">Maliyet & Giderler</span>
                      <span className="text-base font-black text-slate-800">{formatMoney(tryCost, "TRY")}</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                      <span className="text-xs font-black text-slate-400 uppercase">Net Kâr</span>
                      <span className={`text-base font-black ${tryNetProfit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{formatMoney(tryNetProfit, "TRY")}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      <div className="p-3 rounded-xl border border-slate-150 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase">Tahsil Edilen</p>
                        <p className="text-xs font-black text-emerald-600 mt-1">{formatMoney(tryPaidAmount, "TRY")}</p>
                      </div>
                      <div className="p-3 rounded-xl border border-slate-150 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase">Kalan Alacak</p>
                        <p className="text-xs font-black text-rose-600 mt-1">{formatMoney(tryRemainingReceivable, "TRY")}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* USD Financials */}
                <div className="rounded-3xl border-2 border-amber-200 bg-amber-50/10 p-5 shadow-sm space-y-4">
                  <h4 className="text-sm font-black text-amber-800 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-amber-100">
                    <span className="text-base">🇺🇸</span> Amerikan Doları (USD) Raporu
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-amber-50/20 p-3 rounded-xl border border-amber-100/50">
                      <span className="text-xs font-black text-slate-400 uppercase">Hasılat (Ciro)</span>
                      <span className="text-base font-black text-slate-800">{formatMoney(usdCiro, "USD")}</span>
                    </div>
                    <div className="flex justify-between items-center bg-amber-50/20 p-3 rounded-xl border border-amber-100/50">
                      <span className="text-xs font-black text-slate-400 uppercase">Maliyet & Giderler</span>
                      <span className="text-base font-black text-slate-800">{formatMoney(usdCost, "USD")}</span>
                    </div>
                    <div className="flex justify-between items-center bg-amber-50/20 p-3 rounded-xl border border-amber-100/50">
                      <span className="text-xs font-black text-slate-400 uppercase">Net Kâr</span>
                      <span className={`text-base font-black ${usdNetProfit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{formatMoney(usdNetProfit, "USD")}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-100/50">
                      <div className="p-3 rounded-xl border border-amber-150/50 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase">Tahsil Edilen</p>
                        <p className="text-xs font-black text-emerald-600 mt-1">{formatMoney(usdPaidAmount, "USD")}</p>
                      </div>
                      <div className="p-3 rounded-xl border border-amber-150/50 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase">Kalan Alacak</p>
                        <p className="text-xs font-black text-rose-600 mt-1">{formatMoney(usdRemainingReceivable, "USD")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CATEGORY 2: RANDEVU & IS DURUMU */}
          {reportType === "randevu_is" && (
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-3">Randevu & İş Durumu Raporu</h3>

              <div className="grid gap-3 sm:grid-cols-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Toplam Planlanan</p>
                  <p className="text-lg font-black text-slate-800 mt-1">{planliCount} Randevu</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Tamamlanan Servis</p>
                  <p className="text-lg font-black text-emerald-600 mt-1">{tamamlananCount} Servis</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">İptal Edilen</p>
                  <p className="text-lg font-black text-rose-600 mt-1">{iptalCount} Servis</p>
                </div>
              </div>

              <div className="overflow-x-auto pt-4">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-black uppercase">
                      <th className="p-3">Tarih</th>
                      <th className="p-3">Müşteri</th>
                      <th className="p-3">Hizmet Türü</th>
                      <th className="p-3">Durum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAppointments.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-600">{a.appointment_date}</td>
                        <td className="p-3 font-extrabold text-slate-800">{a.customer?.name}</td>
                        <td className="p-3 text-slate-700">{a.service_type}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            a.status === 'İşlem Tamamlandı' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CATEGORY 3: MUSTERI BAZLI HIZMET RAPORU */}
          {reportType === "musteri_hizmet" && (
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-3">Müşteri Bazlı Hizmet Raporu</h3>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-black uppercase">
                      <th className="p-3">Müşteri Adı</th>
                      <th className="p-3">Tip</th>
                      <th className="p-3">Hizmet Adedi</th>
                      <th className="p-3">Faturalandırılan</th>
                      <th className="p-3">Ödenen</th>
                      <th className="p-3">Bakiye</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customerReportData.map((c, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-3 font-extrabold text-slate-800">{c.name}</td>
                        <td className="p-3 text-slate-500 capitalize">{c.type}</td>
                        <td className="p-3 text-slate-700 font-bold">{c.totalServices} İş</td>
                        <td className="p-3 font-semibold text-slate-800">
                          <div className="block">{formatMoney(c.tryBilled, "TRY")}</div>
                          {c.usdBilled > 0 && <div className="block text-amber-600 font-bold">{formatMoney(c.usdBilled, "USD")}</div>}
                        </td>
                        <td className="p-3 font-semibold text-emerald-600">
                          <div className="block">{formatMoney(c.tryPaid, "TRY")}</div>
                          {c.usdPaid > 0 && <div className="block text-amber-600 font-bold">{formatMoney(c.usdPaid, "USD")}</div>}
                        </td>
                        <td className={`p-3 font-black`}>
                          <div className={c.tryBalance > 0.01 ? "text-rose-600" : "text-slate-800"}>{formatMoney(c.tryBalance, "TRY")}</div>
                          {c.usdBalance > 0.01 && <div className="text-rose-600 font-bold">{formatMoney(c.usdBalance, "USD")}</div>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CATEGORY 4: BORCLU MUSTERILER */}
          {reportType === "borclu_musteriler" && (
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-3">Toplam Borçlu Müşteri Listesi</h3>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-black uppercase">
                      <th className="p-3">Müşteri Adı</th>
                      <th className="p-3">Telefon</th>
                      <th className="p-3">Toplam Borç Tutar</th>
                      <th className="p-3">Yapılan Ödeme</th>
                      <th className="p-3 text-rose-600">Kalan Açık Bakiye</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {debtorReportData.map((c, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-3 font-extrabold text-slate-800">{c.name}</td>
                        <td className="p-3 text-slate-600">{c.phone}</td>
                        <td className="p-3 text-slate-700">
                          <div className="block">{formatMoney(c.tryBilled, "TRY")}</div>
                          {c.usdBilled > 0 && <div className="block text-amber-600 font-bold">{formatMoney(c.usdBilled, "USD")}</div>}
                        </td>
                        <td className="p-3 text-emerald-600">
                          <div className="block">{formatMoney(c.tryPaid, "TRY")}</div>
                          {c.usdPaid > 0 && <div className="block text-amber-600 font-bold">{formatMoney(c.usdPaid, "USD")}</div>}
                        </td>
                        <td className="p-3 font-black text-rose-600">
                          <div className="block">{formatMoney(c.tryBalance, "TRY")}</div>
                          {c.usdBalance > 0.01 && <div className="block text-rose-600 font-bold">{formatMoney(c.usdBalance, "USD")}</div>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CATEGORY 5: PERSONEL PERFORMANSI */}
          {reportType === "personel_performans" && (
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-3">Teknik Personel Performans Raporu</h3>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-black uppercase">
                      <th className="p-3">Personel</th>
                      <th className="p-3">Görevi</th>
                      <th className="p-3">Tamamlanan</th>
                      <th className="p-3">Süre (Saat)</th>
                      <th className="p-3">Oluşturduğu Ciro</th>
                      <th className="p-3">Toplam Maliyet</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {employeeReportData.map((e, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-3 font-extrabold text-slate-800">{e.name}</td>
                        <td className="p-3 text-slate-500">{e.role}</td>
                        <td className="p-3 font-bold text-slate-700">{e.completedJobs} İş</td>
                        <td className="p-3 text-slate-600">{e.workHours} Saat</td>
                        <td className="p-3 font-black text-emerald-600">
                          <div className="block">{formatMoney(e.tryCiro, "TRY")}</div>
                          {e.usdCiro > 0 && <div className="block text-amber-600 font-bold">{formatMoney(e.usdCiro, "USD")}</div>}
                        </td>
                        <td className="p-3 font-bold text-slate-500">
                          {e.cost.toLocaleString("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 0 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CATEGORY 6: KULLANILAN MALZEMELER */}
          {reportType === "malzeme_kullanim" && (
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-3">Servislerde Kullanılan Malzeme Raporu</h3>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-black uppercase">
                      <th className="p-3">Malzeme Adı</th>
                      <th className="p-3">Marka & Model</th>
                      <th className="p-3">Toplam Miktar</th>
                      <th className="p-3">Toplam Alış Maliyeti</th>
                      <th className="p-3">Toplam Müşteri Satış</th>
                      <th className="p-3">Net Kâr</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {materialReportData.map((m, i) => {
                      const profit = m.selling - m.buying;
                      return (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="p-3 font-extrabold text-slate-800">{m.name}</td>
                          <td className="p-3 text-slate-500">{m.brand} {m.model}</td>
                          <td className="p-3 font-bold text-slate-700">{m.quantity} {m.unit}</td>
                          <td className="p-3 font-semibold text-slate-500">
                            {m.buying.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                          </td>
                          <td className="p-3 font-semibold text-slate-800">
                            {m.selling.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                          </td>
                          <td className="p-3 font-black text-emerald-600">
                            {profit.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CATEGORY 7: STOK HAREKETLERI */}
          {reportType === "stok_hareket" && (
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-3">Stok Giriş & Çıkış Hareket Kayıtları</h3>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-black uppercase">
                      <th className="p-3">İşlem Tarihi</th>
                      <th className="p-3">Malzeme</th>
                      <th className="p-3">İşlem</th>
                      <th className="p-3">Miktar</th>
                      <th className="p-3">Açıklama</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStockMovements.map((sm) => (
                      <tr key={sm.id} className="hover:bg-slate-50">
                        <td className="p-3 text-slate-600">{new Date(sm.created_at).toLocaleString("tr-TR")}</td>
                        <td className="p-3 font-extrabold text-slate-800">{sm.materials?.name}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            sm.type === 'in' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : sm.type === 'out' 
                              ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {sm.type === "in" ? "Stok Girişi" : sm.type === "out" ? "Stok Çıkışı" : "Düzeltme"}
                          </span>
                        </td>
                        <td className="p-3 font-black text-slate-700">{Number(sm.quantity)} Adet</td>
                        <td className="p-3 text-slate-500 max-w-[200px] truncate" title={sm.description}>{sm.description || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
