"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createDirectServiceOrder } from "../actions";
import { AlertTriangle, Calendar, User, Tag, CheckCircle } from "lucide-react";

export function NewOrderClient({ customers }: { customers: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [customerId, setCustomerId] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [hasAppointment, setHasAppointment] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");

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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <User className="h-5 w-5 text-cyan-600" /> Müşteri ve Hizmet Bilgisi
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
            {customers.length === 0 && (
              <p className="text-xs text-rose-500 font-medium">Sistemde kayıtlı müşteri yok. Önce müşteri eklemelisiniz.</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500 uppercase">Ürün veya Hizmet Adı *</label>
            <input
              required
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="Örn: Kamera Bakımı, Network Kurulumu"
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

        <div className="pt-6">
          <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="mt-0.5">
              <input
                type="checkbox"
                checked={hasAppointment}
                onChange={(e) => setHasAppointment(e.target.checked)}
                className="h-5 w-5 text-cyan-600 border-2 border-slate-300 rounded focus:ring-cyan-500"
              />
            </div>
            <div>
              <p className="text-sm font-black text-slate-800">İleri Tarihli Bir Hizmet (Takvime Ekle)</p>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Eğer bu hizmet daha sonra yapılacaksa takvime randevu olarak ekleyebilirsiniz.</p>
            </div>
          </label>
        </div>

        {hasAppointment && (
          <div className="space-y-4 p-5 rounded-xl border-2 border-cyan-100 bg-cyan-50/50">
            <h3 className="text-sm font-black text-cyan-800 flex items-center gap-2 mb-4">
              <Calendar className="h-4 w-4" /> Takvim Detayları
            </h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-cyan-700 uppercase">Tarih *</label>
                <input
                  type="date"
                  required={hasAppointment}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="h-12 w-full px-4 rounded-xl border-2 border-cyan-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-cyan-700 uppercase">Başlangıç Saati *</label>
                <input
                  type="time"
                  required={hasAppointment}
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="h-12 w-full px-4 rounded-xl border-2 border-cyan-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-slate-100 pt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="h-12 px-8 rounded-xl bg-cyan-600 border-2 border-cyan-700 text-white text-sm font-black hover:bg-cyan-700 transition-colors flex items-center gap-2"
          >
            {loading ? "Oluşturuluyor..." : (
              <>
                <CheckCircle className="h-5 w-5" /> İş Emrini Başlat
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
