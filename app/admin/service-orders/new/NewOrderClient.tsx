"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createDirectServiceOrder } from "../actions";
import { saveMaterial } from "../../stocks/actions";
import { AlertTriangle, Calendar, User, Tag, CheckCircle, Package, CreditCard, Plus, X } from "lucide-react";

type MaterialOption = {
  id: string;
  name: string;
  stock_quantity: number;
  selling_price: number;
};

export function NewOrderClient({ customers, materials: initialMaterials }: { customers: any[], materials: MaterialOption[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [materials, setMaterials] = useState(initialMaterials);

  const [customerId, setCustomerId] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  
  // Stock / Material Selection
  const [materialId, setMaterialId] = useState("");
  const [materialQty, setMaterialQty] = useState<number>(1);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [materialSaving, setMaterialSaving] = useState(false);
  const [newMaterialName, setNewMaterialName] = useState("");
  const [newMaterialStock, setNewMaterialStock] = useState(0);
  const [newMaterialPrice, setNewMaterialPrice] = useState(0);

  // Payment Status
  const [isPaid, setIsPaid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Nakit");
  const [servicePriceCurrency, setServicePriceCurrency] = useState<'TRY' | 'USD'>('TRY');

  // Calendar
  const [hasAppointment, setHasAppointment] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");

  const selectedMaterial = materials.find((material) => material.id === materialId);

  const handleMaterialChange = (id: string) => {
    setMaterialId(id);
    const material = materials.find((item) => item.id === id);
    if (material) {
      setServiceName(material.name);
      // Material price is added from the stock line. This field is only the
      // additional service/labor price, otherwise the product is counted twice.
      setServicePrice("0");
    }
  };

  const handleCreateMaterial = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newMaterialName.trim()) return;
    setMaterialSaving(true);
    setError("");

    const result = await saveMaterial({
      name: newMaterialName.trim(),
      stock_quantity: newMaterialStock,
      min_stock_level: 3,
      buying_price: 0,
      selling_price: newMaterialPrice,
      is_active: true,
    });

    if (!result.success || !result.id) {
      setError(result.error || "Yeni malzeme eklenemedi.");
      setMaterialSaving(false);
      return;
    }

    const material = {
      id: result.id,
      name: newMaterialName.trim(),
      stock_quantity: newMaterialStock,
      selling_price: newMaterialPrice,
    };
    setMaterials((current) => [...current, material].sort((a, b) => a.name.localeCompare(b.name, "tr")));
    handleMaterialChange(result.id);
    setServiceName(material.name);
    setServicePrice("0");
    setIsMaterialModalOpen(false);
    setNewMaterialName("");
    setNewMaterialStock(0);
    setNewMaterialPrice(0);
    setMaterialSaving(false);
  };

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
                onChange={(e) => handleMaterialChange(e.target.value)}
                className="h-12 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
              >
                <option value="">-- Stok Kullanılmayacak --</option>
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} (Stok: {m.stock_quantity} Adet)
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setIsMaterialModalOpen(true)}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-black text-cyan-700 hover:text-cyan-800"
              >
                <Plus className="h-4 w-4" /> Yeni ürün / malzeme ekle
              </button>
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
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-500 uppercase">Hizmet / İşçilik Fiyatı *</label>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setServicePriceCurrency('TRY')}
                  className={`h-7 px-3 rounded-lg text-xs font-black border-2 transition-all ${
                    servicePriceCurrency === 'TRY'
                      ? 'bg-cyan-600 border-cyan-700 text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  ₺ TL
                </button>
                <button
                  type="button"
                  onClick={() => setServicePriceCurrency('USD')}
                  className={`h-7 px-3 rounded-lg text-xs font-black border-2 transition-all ${
                    servicePriceCurrency === 'USD'
                      ? 'bg-amber-500 border-amber-600 text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  $ USD
                </button>
              </div>
            </div>
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
            {servicePriceCurrency === 'USD' && (
              <p className="mt-1 text-xs font-bold text-amber-600">$ USD cinsinden fiyat girildi. Muhasebede dolar olarak görünecektir.</p>
            )}
            {selectedMaterial && (
              <p className="mt-2 text-xs font-bold text-slate-500">
                Malzeme tutarı ayrıca eklenecek: {(Number(selectedMaterial.selling_price || 0) * materialQty).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
              </p>
            )}
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

      {isMaterialModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800">Yeni Ürün / Malzeme</h3>
              <button type="button" onClick={() => setIsMaterialModalOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-slate-200">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreateMaterial} className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase text-slate-500">Ürün adı *</label>
                <input required value={newMaterialName} onChange={(e) => setNewMaterialName(e.target.value)} className="mt-1 h-11 w-full rounded-xl border-2 border-slate-200 px-4 text-sm font-semibold outline-none focus:border-cyan-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black uppercase text-slate-500">Başlangıç stoku</label>
                  <input type="number" min="0" step="0.01" value={newMaterialStock} onChange={(e) => setNewMaterialStock(Number(e.target.value))} className="mt-1 h-11 w-full rounded-xl border-2 border-slate-200 px-4 text-sm font-semibold outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-slate-500">Satış fiyatı</label>
                  <input type="number" min="0" step="0.01" value={newMaterialPrice} onChange={(e) => setNewMaterialPrice(Number(e.target.value))} className="mt-1 h-11 w-full rounded-xl border-2 border-slate-200 px-4 text-sm font-semibold outline-none focus:border-cyan-500" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsMaterialModalOpen(false)} className="h-11 rounded-xl border-2 border-slate-200 px-5 text-sm font-black text-slate-600">Vazgeç</button>
                <button type="submit" disabled={materialSaving} className="h-11 rounded-xl bg-cyan-600 px-5 text-sm font-black text-white disabled:opacity-60">
                  {materialSaving ? "Ekleniyor..." : "Ekle ve Seç"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
