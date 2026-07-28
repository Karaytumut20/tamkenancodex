import { useState, useEffect } from "react";
import { BaseModal } from "./BaseModal";
import { AlertCircle, UserPlus } from "lucide-react";
import { saveAppointment, deleteAppointment } from "@/app/admin/calendar/actions";
import { CustomerModal } from "./CustomerModal";
import { EmployeeModal } from "./EmployeeModal";

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
  const [customerOptions, setCustomerOptions] = useState(customers);
  const [employeeOptions, setEmployeeOptions] = useState(employees);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Istanbul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
    setFormData(appointment ? {
      ...appointment,
      customer_id: appointment.customer_id || appointment.customer?.id || "",
      employee_id: appointment.employee_id || appointment.employee?.id || "",
      priority: appointment.priority || "normal",
      status: appointment.status || "Planlandı",
    } : {
      customer_id: "",
      employee_id: "",
      appointment_date: today,
      start_time: "09:00",
      end_time: "10:00",
      service_type: "",
      priority: "normal",
      status: "Planlandı",
      collection_amount: 0,
      collection_currency: "TRY",
    });
    setErrorMsg(null);
    setLoading(false);
    setCustomerOptions(customers);
    setEmployeeOptions(employees);
    setIsCustomerModalOpen(false);
    setIsEmployeeModalOpen(false);
  }, [appointment, customers, employees, isOpen]);

  const handleCustomerCreated = (savedCustomer?: any) => {
    if (!savedCustomer?.id) return;
    setCustomerOptions((current) => (
      [...current.filter((customer) => customer.id !== savedCustomer.id), savedCustomer]
        .sort((a, b) => String(a.name).localeCompare(String(b.name), "tr"))
    ));
    setFormData((current: any) => ({ ...current, customer_id: savedCustomer.id }));
  };

  const handleEmployeeCreated = (savedEmployee?: any) => {
    if (!savedEmployee?.id) return;
    setEmployeeOptions((current) => (
      [...current.filter((employee) => employee.id !== savedEmployee.id), savedEmployee]
        .sort((a, b) => String(a.full_name).localeCompare(String(b.full_name), "tr"))
    ));
    setFormData((current: any) => ({ ...current, employee_id: savedEmployee.id }));
  };

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
    <>
      <BaseModal isOpen={isOpen} onClose={onClose} title={formData.id ? "Randevu Düzenle" : "Yeni Randevu"}>
      {errorMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-bold text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="appointment-customer" className="block text-sm font-black text-slate-700">Müşteri *</label>
          <select
            id="appointment-customer"
            required
            value={formData.customer_id || ""}
            onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
            className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
          >
            <option value="">-- Müşteri Seçin --</option>
            {customerOptions.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setIsCustomerModalOpen(true)}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-black text-cyan-700 hover:text-cyan-800"
          >
            <UserPlus className="h-4 w-4" /> Müşteri listede yoksa buradan ekle
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="appointment-date" className="block text-sm font-black text-slate-700">Tarih *</label>
            <input
              id="appointment-date"
              type="date"
              required
              value={formData.appointment_date || ""}
              onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
              className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
            />
          </div>
          <div>
            <label htmlFor="appointment-start" className="block text-sm font-black text-slate-700">Başlangıç *</label>
            <input
              id="appointment-start"
              type="time"
              required
              value={formData.start_time?.substring(0, 5) || ""}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
            />
          </div>
          <div>
            <label htmlFor="appointment-end" className="block text-sm font-black text-slate-700">Bitiş *</label>
            <input
              id="appointment-end"
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
            <label htmlFor="appointment-service" className="block text-sm font-black text-slate-700">Yapılacak Hizmet *</label>
            <input
              id="appointment-service"
              type="text"
              required
              value={formData.service_type || ""}
              onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
              className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
            />
          </div>
          <div>
            <label htmlFor="appointment-status" className="block text-sm font-black text-slate-700">Durum *</label>
            <select
              id="appointment-status"
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

        <div className="rounded-2xl border-2 border-emerald-100 bg-emerald-50/60 p-4">
          <div className="grid gap-4 sm:grid-cols-[1fr_130px]">
            <div>
              <label htmlFor="dashboard-appointment-collection-amount" className="block text-sm font-black text-slate-700">
                Alınacak Tutar
              </label>
              <input
                id="dashboard-appointment-collection-amount"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                placeholder="Örn: 5000,00"
                value={formData.collection_amount ?? ""}
                onChange={(e) => setFormData({
                  ...formData,
                  collection_amount: e.target.value === "" ? 0 : Number(e.target.value),
                })}
                className="mt-2 w-full rounded-xl border-2 border-emerald-200 bg-white px-4 h-12 text-sm outline-none focus:border-emerald-500 font-bold"
              />
            </div>
            <div>
              <label htmlFor="dashboard-appointment-collection-currency" className="block text-sm font-black text-slate-700">
                Para Birimi
              </label>
              <select
                id="dashboard-appointment-collection-currency"
                value={formData.collection_currency || "TRY"}
                onChange={(e) => setFormData({ ...formData, collection_currency: e.target.value })}
                className="mt-2 w-full rounded-xl border-2 border-emerald-200 bg-white px-4 h-12 text-sm outline-none focus:border-emerald-500 font-bold"
              >
                <option value="TRY">₺ TL</option>
                <option value="USD">$ USD</option>
              </select>
            </div>
          </div>
          <p className="mt-2 text-xs font-semibold text-emerald-700">
            İş emrine ve muhasebedeki bekleyen tahsilata otomatik aktarılır.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="appointment-employee" className="block text-sm font-black text-slate-700">Atanan Personel</label>
            <select
              id="appointment-employee"
              value={formData.employee_id || ""}
              onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
              className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
            >
              <option value="">-- Personel Atanmadı --</option>
              {employeeOptions.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.full_name}{employee.role_title ? ` (${employee.role_title})` : ""}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setIsEmployeeModalOpen(true)}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-black text-cyan-700 hover:text-cyan-800"
            >
              <UserPlus className="h-4 w-4" /> Personel listede yoksa buradan ekle
            </button>
          </div>
          <div>
            <label htmlFor="appointment-priority" className="block text-sm font-black text-slate-700">Öncelik *</label>
            <select
              id="appointment-priority"
              required
              value={formData.priority || "normal"}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
            >
              <option value="normal">Normal</option>
              <option value="önemli">Önemli</option>
              <option value="acil">Acil</option>
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

      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        customer={null}
        onSuccess={handleCustomerCreated}
      />
      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        onSuccess={handleEmployeeCreated}
      />
    </>
  );
}
