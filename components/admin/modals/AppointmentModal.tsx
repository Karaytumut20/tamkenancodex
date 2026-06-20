import { useState, useEffect } from "react";
import { BaseModal } from "./BaseModal";
import { AlertCircle } from "lucide-react";
import { saveAppointment, deleteAppointment } from "@/app/admin/calendar/actions";

export function AppointmentModal({
  isOpen,
  onClose,
  appointment,
  customers,
  employees,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  appointment: any;
  customers: any[];
  employees: any[];
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (appointment) {
      setFormData({
        ...appointment,
        customer_id: appointment.customer_id || appointment.customer?.id || "",
        employee_id: appointment.employee_id || appointment.employee?.id || "",
      });
      setErrorMsg(null);
    }
  }, [appointment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await saveAppointment(formData);
    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg(res.error || "Bir hata oluştu.");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!formData.id) return;
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    
    setLoading(true);
    const res = await deleteAppointment(formData.id);
    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg(res.error || "Silinemedi.");
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={formData.id ? "Randevu Düzenle" : "Yeni Randevu"}>
      {errorMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-bold text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-black text-slate-700">Müşteri *</label>
          <select
            required
            value={formData.customer_id || ""}
            onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
            className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
          >
            <option value="">-- Müşteri Seçin --</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-black text-slate-700">Tarih *</label>
            <input
              type="date"
              required
              value={formData.appointment_date || ""}
              onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
              className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
            />
          </div>
          <div>
            <label className="block text-sm font-black text-slate-700">Başlangıç *</label>
            <input
              type="time"
              required
              value={formData.start_time?.substring(0, 5) || ""}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
            />
          </div>
          <div>
            <label className="block text-sm font-black text-slate-700">Bitiş *</label>
            <input
              type="time"
              required
              value={formData.end_time?.substring(0, 5) || ""}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-black text-slate-700">Yapılacak Hizmet *</label>
            <input
              type="text"
              required
              value={formData.service_type || ""}
              onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
              className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
            />
          </div>
          <div>
            <label className="block text-sm font-black text-slate-700">Durum *</label>
            <select
              required
              value={formData.status || "Planlandı"}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
            >
              {["Planlandı", "Müşteri Arandı", "Yola Çıkıldı", "İşlem Başladı", "Malzeme Bekleniyor", "İşlem Tamamlandı", "İptal Edildi", "Ertelendi", "Tahsilat Bekleniyor"].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          {formData.id ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-4 h-10 rounded-xl bg-red-100 text-red-700 font-bold hover:bg-red-200"
            >
              Sil
            </button>
          ) : <div />}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 h-10 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 h-10 rounded-xl bg-cyan-600 text-white font-bold hover:bg-cyan-700"
            >
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </div>
      </form>
    </BaseModal>
  );
}
