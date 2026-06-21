"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createDirectServiceOrder } from "../actions";
import { AlertTriangle, Calendar, User, Tag, CheckCircle, Package, CreditCard } from "lucide-react";

export function NewOrderClient({ customers, materials }: { customers: any[], materials: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [customerId, setCustomerId] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  
  // Stock / Material Selection
  const [materialId, setMaterialId] = useState("");
  const [materialQty, setMaterialQty] = useState<number>(1);

  // Payment Status
  const [isPaid, setIsPaid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Nakit");

  // Calendar
  const [hasAppointment, setHasAppointment] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");

  // Auto-fill service name & price if material is selected
  useEffect(() => {
    if (materialId) {
      const mat = materials.find(m => m.id === materialId);
      if (mat) {
        setServiceName(mat.name);
        setServicePrice((Number(mat.selling_price || 0) * materialQty).toString());
      }
    }
  }, [materialId, materialQty, materials]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!customerId) {
      setError("Lütfen bir müşteri seçin.");
      setLoading(false);
      return;
    }

    const price = Number(servicePrice);
    if (isNaN(price)) {
      setError("Geçerli bir fiyat girin.");
      setLoading(false);
      return;
    }

    if (hasAppointment && (!appointmentDate || !startTime)) {
      setError("Lütfen takvim için tarih ve saat seçin.");
      setLoading(false);
      return;
    }

    const res = await createDirectServiceOrder({
      customer_id: customerId,
      service_name: serviceName,
      service_price: price,
      appointment_date: hasAppointment ? appointmentDate : undefined,
      start_time: hasAppointment ? startTime : undefined,
      material_id: materialId || undefined,
      material_quantity: materialQty,
      is_paid: isPaid,
      payment_method: paymentMethod
    });

    if (res.success) {
      router.push(`/admin/service-orders/${res.order_id}`);
    } else {
      setError(res.error || "Beklenmeyen bir hata oluştu.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 text-sm font-semibold">
          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. CUSTOMER & PRODUCT/SERVICE */}
        <div className="space-y-5">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <User className="h-5 w-5 text-cyan-600" /> 1. Müşteri ve İşlem Bilgisi
          </h3>
          
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500 uppercase">Müşteri Seçin *</label>
            <select
              required
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="h-12 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="">-- Müşteri Seçiniz --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.phone ? `(${c.phone})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-1"><Package className="h-4 w-4" /> Stoktan Malzeme Seçimi (Opsiyonel)</label>
              <select
                value={materialId}
                onChange={(e) => setMaterialId(e.target.value)}
                className="h-12 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
              >
                <option value="">-- Stok Kullanılmayacak --</option>
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} (Stok: {m.stock_quantity} {m.unit})
                  </option>
                ))}
              </select>
            </div>

            {materialId && (
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase">Kullanılacak Miktar</label>
                <input
                  type="number"
                  min="1"
                  value={materialQty}
                  onChange={(e) => setMaterialQty(Number(e.target.value))}
                  className="h-12 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500 uppercase">İşlem / Hizmet Adı *</label>
            <input
              required
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="Örn: Kamera Bakımı, Güvenlik Kamerası Satışı"
              className="h-12 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500 uppercase">Hizmet / Satış Fiyatı (TL) *</label>
            <div className="relative">
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={servicePrice}
                onChange={(e) => setServicePrice(e.target.value)}
                placeholder="0.00"
                className="h-12 w-full pl-10 pr-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
              />
              <Tag className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* 2. PAYMENT */}
        <div className="space-y-5 pt-2">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <CreditCard className="h-5 w-5 text-emerald-600" /> 2. Tahsilat & Ödeme
          </h3>
          
          <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="mt-0.5">
              <input
                type="checkbox"
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
                className="h-5 w-5 text-emerald-600 border-2 border-slate-300 rounded focus:ring-emerald-500"
              />
            </div>
            <div>
              <p className="text-sm font-black text-slate-800">Ödeme Peşin Alındı</p>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">İşaretlerseniz muhasebeye tahsilat kaydı otomatik düşülecektir.</p>
            </div>
          </label>

          {isPaid && (
            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
              <label className="text-xs font-black text-slate-500 uppercase">Ödeme Yöntemi</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-12 w-full px-4 rounded-xl border-2 border-emerald-200 bg-emerald-50/30 text-sm font-semibold outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="Nakit">Nakit</option>
                <option value="Kredi Kartı">Kredi Kartı</option>
                <option value="Banka Havalesi">Banka Havalesi / EFT</option>
              </select>
            </div>
          )}
        </div>

        {/* 3. CALENDAR */}
        <div className="space-y-5 pt-2">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Calendar className="h-5 w-5 text-indigo-600" /> 3. Randevu & Takvim
          </h3>
          
          <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="mt-0.5">
              <input
                type="checkbox"
                checked={hasAppointment}
                onChange={(e) => setHasAppointment(e.target.checked)}
                className="h-5 w-5 text-indigo-600 border-2 border-slate-300 rounded focus:ring-indigo-500"
              />
            </div>
            <div>
              <p className="text-sm font-black text-slate-800">İleri Tarihli İşlem (Takvime Ekle)</p>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Eğer işlem hemen tamamlanmadıysa, takvime randevu olarak ekleyin.</p>
            </div>
          </label>

          {hasAppointment && (
            <div className="grid gap-4 sm:grid-cols-2 p-5 rounded-xl border-2 border-indigo-100 bg-indigo-50/50 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-indigo-700 uppercase">Tarih *</label>
                <input
                  type="date"
                  required={hasAppointment}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="h-12 w-full px-4 rounded-xl border-2 border-indigo-200 bg-white text-sm font-semibold outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-indigo-700 uppercase">Başlangıç Saati *</label>
                <input
                  type="time"
                  required={hasAppointment}
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="h-12 w-full px-4 rounded-xl border-2 border-indigo-200 bg-white text-sm font-semibold outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          )}
        </div>

        {/* SUBMIT */}
        <div className="border-t border-slate-100 pt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="h-14 px-8 rounded-xl bg-cyan-600 border-2 border-cyan-700 text-white text-sm font-black hover:bg-cyan-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            {loading ? "Kaydediliyor..." : (
              <>
                <CheckCircle className="h-5 w-5" /> İşlemi Tamamla ve Kaydet
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
