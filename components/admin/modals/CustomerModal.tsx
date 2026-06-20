import { useState, useEffect } from "react";
import { BaseModal } from "./BaseModal";
import { AlertCircle } from "lucide-react";
import { saveCustomer, deleteCustomer } from "@/app/admin/customers/actions";

export function CustomerModal({
  isOpen,
  onClose,
  customer,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  customer: any;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (customer) {
      setFormData(customer);
      setErrorMsg(null);
    }
  }, [customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await saveCustomer(formData);
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
    if (!confirm("Müşteriyi silmek istediğinize emin misiniz?")) return;
    
    setLoading(true);
    const res = await deleteCustomer(formData.id);
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
    <BaseModal isOpen={isOpen} onClose={onClose} title={formData.id ? "Müşteri Düzenle" : "Yeni Müşteri"}>
      {errorMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-bold text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-black text-slate-700">Müşteri Adı / Ünvanı *</label>
            <input
              type="text"
              required
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
            />
          </div>
          <div>
            <label className="block text-sm font-black text-slate-700">Tür *</label>
            <select
              required
              value={formData.type || "bireysel"}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
            >
              <option value="bireysel">Bireysel</option>
              <option value="kurumsal">Kurumsal</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-black text-slate-700">Telefon *</label>
            <input
              type="text"
              required
              value={formData.phone || ""}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
            />
          </div>
          <div>
            <label className="block text-sm font-black text-slate-700">E-posta</label>
            <input
              type="email"
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-black text-slate-700">Adres</label>
          <textarea
            value={formData.address || ""}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white p-4 h-24 text-sm outline-none focus:border-cyan-500 font-bold resize-none"
          />
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
