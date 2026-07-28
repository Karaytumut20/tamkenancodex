import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { saveEmployee } from "@/app/admin/employees/actions";
import { BaseModal } from "./BaseModal";

export function EmployeeModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedEmployee?: any) => void;
}) {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    role_title: "",
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setFormData({
      full_name: "",
      phone: "",
      email: "",
      role_title: "",
      is_active: true,
    });
    setLoading(false);
    setErrorMessage("");
  }, [isOpen]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const result = await saveEmployee(formData);
    if (!result.success) {
      setErrorMessage(result.error || "Personel eklenemedi.");
      setLoading(false);
      return;
    }

    onSuccess(result.employee);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Yeni Personel Ekle">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {errorMessage}
          </div>
        )}

        <div>
          <label htmlFor="quick-employee-name" className="block text-sm font-black text-slate-700">Ad Soyad *</label>
          <input
            id="quick-employee-name"
            required
            value={formData.full_name}
            onChange={(event) => setFormData({ ...formData, full_name: event.target.value })}
            className="mt-2 h-12 w-full rounded-xl border-2 border-slate-200 px-4 text-sm font-bold outline-none focus:border-cyan-500"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="quick-employee-phone" className="block text-sm font-black text-slate-700">Telefon</label>
            <input
              id="quick-employee-phone"
              type="tel"
              value={formData.phone}
              onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
              className="mt-2 h-12 w-full rounded-xl border-2 border-slate-200 px-4 text-sm font-bold outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label htmlFor="quick-employee-email" className="block text-sm font-black text-slate-700">E-posta</label>
            <input
              id="quick-employee-email"
              type="email"
              value={formData.email}
              onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              className="mt-2 h-12 w-full rounded-xl border-2 border-slate-200 px-4 text-sm font-bold outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="quick-employee-role" className="block text-sm font-black text-slate-700">Görevi / Rolü</label>
          <input
            id="quick-employee-role"
            value={formData.role_title}
            onChange={(event) => setFormData({ ...formData, role_title: event.target.value })}
            placeholder="Kamera ustası, teknisyen vb."
            className="mt-2 h-12 w-full rounded-xl border-2 border-slate-200 px-4 text-sm font-bold outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-11 rounded-xl bg-slate-100 px-5 text-sm font-black text-slate-700 hover:bg-slate-200"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="h-11 rounded-xl bg-cyan-600 px-5 text-sm font-black text-white hover:bg-cyan-700 disabled:opacity-60"
          >
            {loading ? "Ekleniyor..." : "Ekle ve Seç"}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
