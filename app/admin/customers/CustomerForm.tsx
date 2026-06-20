"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveCustomer } from "./actions";

type CustomerFormData = {
  id?: string;
  name: string;
  type: 'bireysel' | 'kurumsal';
  contact_person?: string;
  phone: string;
  phone_secondary?: string;
  email?: string;
  tax_number?: string;
  tax_office?: string;
  address?: string;
  city?: string;
  district?: string;
  location_link?: string;
  notes?: string;
  is_active?: boolean;
};

type Props = {
  initialData?: CustomerFormData;
  onSuccess?: () => void;
};

export function CustomerForm({ initialData, onSuccess }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState<CustomerFormData>(initialData || {
    name: "",
    type: "bireysel",
    contact_person: "",
    phone: "",
    phone_secondary: "",
    email: "",
    tax_number: "",
    tax_office: "",
    address: "",
    city: "İstanbul",
    district: "",
    location_link: "",
    notes: "",
    is_active: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setErrorMsg("Ad Soyad ve Telefon alanları zorunludur.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const res = await saveCustomer(formData);
    if (res.success) {
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/customers");
        router.refresh();
      }
    } else {
      setErrorMsg(res.error || "Müşteri kaydedilirken hata oluştu.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMsg && (
        <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 text-sm font-extrabold text-red-800">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Customer Type Toggle */}
      <div>
        <label className="block text-sm font-black text-slate-700">Müşteri Tipi *</label>
        <div className="mt-3 flex gap-6">
          <label className="inline-flex items-center cursor-pointer font-extrabold text-slate-700">
            <input
              type="radio"
              name="type"
              value="bireysel"
              checked={formData.type === "bireysel"}
              onChange={() => handleSelectChange("type", "bireysel")}
              className="mr-2.5 h-5 w-5 text-cyan-600 focus:ring-cyan-500"
            />
            Bireysel Müşteri
          </label>
          <label className="inline-flex items-center cursor-pointer font-extrabold text-slate-700">
            <input
              type="radio"
              name="type"
              value="kurumsal"
              checked={formData.type === "kurumsal"}
              onChange={() => handleSelectChange("type", "kurumsal")}
              className="mr-2.5 h-5 w-5 text-cyan-600 focus:ring-cyan-500"
            />
            Kurumsal Müşteri
          </label>
        </div>
      </div>

      {/* Name / Business Name */}
      <div>
        <label className="block text-sm font-black text-slate-700">
          {formData.type === "kurumsal" ? "Firma Ünvanı / Adı *" : "Adı Soyadı *"}
        </label>
        <input
          type="text"
          name="name"
          required
          value={formData.name || ""}
          onChange={handleChange}
          placeholder={formData.type === "kurumsal" ? "ABC Güvenlik Ltd. Şti." : "Ahmet Yılmaz"}
          className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-13 text-sm font-semibold outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-colors"
        />
      </div>

      {/* Contact Person (only for corporate) */}
      {formData.type === "kurumsal" && (
        <div>
          <label className="block text-sm font-black text-slate-700">Yetkili Kişi (Ad Soyad)</label>
          <input
            type="text"
            name="contact_person"
            value={formData.contact_person || ""}
            onChange={handleChange}
            placeholder="Mehmet Can"
            className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-13 text-sm font-semibold outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-colors"
          />
        </div>
      )}

      {/* Phone Numbers */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-black text-slate-700">Telefon Numarası *</label>
          <input
            type="tel"
            name="phone"
            required
            placeholder="Örn: 05321234567"
            value={formData.phone || ""}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-13 text-sm font-semibold outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-black text-slate-700">İkinci Telefon (Opsiyonel)</label>
          <input
            type="tel"
            name="phone_secondary"
            placeholder="Örn: 02620000000"
            value={formData.phone_secondary || ""}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-13 text-sm font-semibold outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-colors"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-black text-slate-700">E-posta Adresi</label>
        <input
          type="email"
          name="email"
          placeholder="örn: musteri@firma.com"
          value={formData.email || ""}
          onChange={handleChange}
          className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-13 text-sm font-semibold outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-colors"
        />
      </div>

      {/* Corporate billing details */}
      {formData.type === "kurumsal" && (
        <div className="grid gap-4 sm:grid-cols-2 bg-slate-50 border border-slate-200 rounded-2xl p-4">
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider">Vergi Dairesi</label>
            <input
              type="text"
              name="tax_office"
              value={formData.tax_office || ""}
              onChange={handleChange}
              placeholder="Gebze V.D."
              className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-11 text-xs font-semibold outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider">Vergi Numarası</label>
            <input
              type="text"
              name="tax_number"
              value={formData.tax_number || ""}
              onChange={handleChange}
              placeholder="1234567890"
              className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-11 text-xs font-semibold outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>
      )}

      {/* Address Details */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="block text-sm font-black text-slate-700">Açık Adres</label>
          <input
            type="text"
            name="address"
            placeholder="Mahalle, sokak, no, daire..."
            value={formData.address || ""}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-13 text-sm font-semibold outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-black text-slate-700">İlçe</label>
          <input
            type="text"
            name="district"
            placeholder="Gebze"
            value={formData.district || ""}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-13 text-sm font-semibold outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-colors"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-black text-slate-700">İl (Şehir)</label>
          <input
            type="text"
            name="city"
            value={formData.city || ""}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-13 text-sm font-semibold outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-black text-slate-700">Harita Konum Linki (Google Maps URL)</label>
          <input
            type="text"
            name="location_link"
            placeholder="https://maps.app.goo.gl/..."
            value={formData.location_link || ""}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-13 text-sm font-semibold outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-colors"
          />
        </div>
      </div>

      {/* Internal notes */}
      <div>
        <label className="block text-sm font-black text-slate-700">Müşteri Notları (Özel)</label>
        <textarea
          name="notes"
          value={formData.notes || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Müşteriye özel anlaşmalar, dikkat edilmesi gereken teknik detaylar..."
          className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white p-4 text-sm font-semibold outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-colors"
        />
      </div>

      {/* Active state (only on edit) */}
      {formData.id && (
        <div>
          <label className="block text-sm font-black text-slate-700">Müşteri Durumu</label>
          <select
            name="is_active"
            value={formData.is_active ? "true" : "false"}
            onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === "true" }))}
            className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
          >
            <option value="true">Aktif</option>
            <option value="false">Pasif</option>
          </select>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-6 text-sm font-black text-slate-600 hover:bg-slate-50 transition-colors"
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 items-center justify-center rounded-xl bg-cyan-600 border-2 border-cyan-700 px-8 text-sm font-black text-white hover:bg-cyan-700 transition-colors"
        >
          {loading ? "Kaydediliyor..." : "💾 Müşteriyi Kaydet"}
        </button>
      </div>
    </form>
  );
}
