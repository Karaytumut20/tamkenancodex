import { useState, useEffect } from "react";
import { BaseModal } from "./BaseModal";
import { AlertCircle } from "lucide-react";
import { saveMaterial, deleteMaterial } from "@/app/admin/stocks/actions";
import { calculateWarrantyEndDate, formatMaterialDate } from "@/lib/admin/material-warranty";

export function StockModal({
  isOpen,
  onClose,
  material,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  material: any;
  onSuccess: (savedMaterial?: any) => void;
}) {
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setFormData(material ?? {
      stock_quantity: 0,
      min_stock_level: 3,
      buying_price: "",
      selling_price: "",
      supplier: "",
      purchase_date: "",
      purchase_invoice_number: "",
      warranty_months: "",
      is_active: true,
    });
    setErrorMsg(null);
    setLoading(false);
  }, [material, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const normalizedFormData = {
      ...formData,
      stock_quantity: Number(formData.stock_quantity || 0),
      min_stock_level: Number(formData.min_stock_level || 0),
      buying_price: Number(formData.buying_price || 0),
      selling_price: Number(formData.selling_price || 0),
      warranty_months: Math.max(0, Math.trunc(Number(formData.warranty_months || 0))),
    };
    const res = await saveMaterial(normalizedFormData);
    if (res.success) {
      onSuccess({ ...normalizedFormData, id: res.id });
      onClose();
    } else {
      setErrorMsg(res.error || "Bir hata oluştu.");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!formData.id) return;
    if (!confirm("Bu malzemeyi silmek istediğinize emin misiniz?")) return;
    
    setLoading(true);
    const res = await deleteMaterial(formData.id);
    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg(res.error || "Silinemedi.");
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  const warrantyEndDate = calculateWarrantyEndDate(
    formData.purchase_date,
    formData.warranty_months,
  );

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={formData.id ? "Stok Düzenle" : "Yeni Malzeme"}>
      {errorMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-bold text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="stock-name" className="block text-sm font-black text-slate-700">Malzeme Adı *</label>
          <input
            id="stock-name"
            type="text"
            required
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
          />
        </div>

        <div>
          <label htmlFor="stock-category" className="block text-sm font-black text-slate-700">Kategori <span className="text-xs text-slate-400">(İsteğe bağlı)</span></label>
          <input
            id="stock-category"
            type="text"
            value={formData.category || ""}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="stock-brand" className="block text-sm font-black text-slate-700">Marka <span className="text-xs text-slate-400">(İsteğe bağlı)</span></label>
            <input
              id="stock-brand"
              type="text"
              value={formData.brand || ""}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
            />
          </div>
          <div>
            <label htmlFor="stock-model" className="block text-sm font-black text-slate-700">Model <span className="text-xs text-slate-400">(İsteğe bağlı)</span></label>
            <input
              id="stock-model"
              type="text"
              value={formData.model || ""}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="stock-quantity" className="block text-sm font-black text-slate-700">Mevcut Stok <span className="text-xs text-slate-400">(İsteğe bağlı)</span></label>
            <input
              id="stock-quantity"
              type="number"
              value={formData.stock_quantity ?? ""}
              onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
              className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
            />
          </div>
          <div>
            <label htmlFor="stock-minimum" className="block text-sm font-black text-slate-700">Kritik Stok <span className="text-xs text-slate-400">(İsteğe bağlı)</span></label>
            <input
              id="stock-minimum"
              type="number"
              value={formData.min_stock_level ?? ""}
              onChange={(e) => setFormData({ ...formData, min_stock_level: Number(e.target.value) })}
              className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-200 bg-cyan-50/50 p-4">
          <div className="mb-3">
            <h4 className="text-sm font-black text-slate-800">Kimden ve Kaça Aldım?</h4>
            <p className="mt-1 text-xs font-semibold text-slate-500">Satın alma ve garanti alanlarının tamamı isteğe bağlıdır.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="stock-supplier" className="block text-sm font-black text-slate-700">Tedarikçi Firma</label>
              <input
                id="stock-supplier"
                type="text"
                value={formData.supplier || ""}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="Ürünü aldığınız firma"
                className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
              />
            </div>
            <div>
              <label htmlFor="stock-buying-price" className="block text-sm font-black text-slate-700">Alış Fiyatım (TL)</label>
              <input
                id="stock-buying-price"
                type="number"
                min="0"
                step="0.01"
                value={formData.buying_price ?? ""}
                onChange={(e) => setFormData({
                  ...formData,
                  buying_price: e.target.value === "" ? "" : Number(e.target.value),
                })}
                placeholder="Örn: 1250"
                className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
              />
            </div>
            <div>
              <label htmlFor="stock-purchase-date" className="block text-sm font-black text-slate-700">Alış Tarihi</label>
              <input
                id="stock-purchase-date"
                type="date"
                value={formData.purchase_date || ""}
                onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
              />
            </div>
            <div>
              <label htmlFor="stock-invoice-number" className="block text-sm font-black text-slate-700">Fatura / İrsaliye No</label>
              <input
                id="stock-invoice-number"
                type="text"
                value={formData.purchase_invoice_number || ""}
                onChange={(e) => setFormData({ ...formData, purchase_invoice_number: e.target.value })}
                placeholder="İsteğe bağlı"
                className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
              />
            </div>
            <div>
              <label htmlFor="stock-warranty-months" className="block text-sm font-black text-slate-700">Garanti Süresi (Ay)</label>
              <input
                id="stock-warranty-months"
                type="number"
                min="0"
                step="1"
                value={formData.warranty_months ?? ""}
                onChange={(e) => setFormData({
                  ...formData,
                  warranty_months: e.target.value === "" ? "" : Number(e.target.value),
                })}
                className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
              />
            </div>
          </div>
          {warrantyEndDate && (
            <p className="mt-3 text-xs font-black text-emerald-700">
              Alış tarihine göre garanti bitişi: {formatMaterialDate(warrantyEndDate)}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="stock-selling-price" className="block text-sm font-black text-slate-700">
            Satış Fiyatım (TL) <span className="text-xs text-slate-400">(İsteğe bağlı)</span>
          </label>
          <input
            id="stock-selling-price"
            type="number"
            min="0"
            step="0.01"
            value={formData.selling_price ?? ""}
            onChange={(e) => setFormData({
              ...formData,
              selling_price: e.target.value === "" ? "" : Number(e.target.value),
            })}
            placeholder="Daha sonra da girebilirsiniz"
            className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <h4 className="text-sm font-black text-slate-800">Diğer Malzeme Bilgileri</h4>
          <p className="mt-1 text-xs font-semibold text-slate-500">Bu alanların tamamı isteğe bağlıdır.</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="stock-sku" className="block text-sm font-black text-slate-700">Stok Kodu (SKU)</label>
              <input
                id="stock-sku"
                type="text"
                value={formData.sku || ""}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
              />
            </div>
            <div>
              <label htmlFor="stock-barcode" className="block text-sm font-black text-slate-700">Barkod</label>
              <input
                id="stock-barcode"
                type="text"
                value={formData.barcode || ""}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
              />
            </div>
            <div>
              <label htmlFor="stock-location" className="block text-sm font-black text-slate-700">Stok Konumu</label>
              <input
                id="stock-location"
                type="text"
                value={formData.location || ""}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Örn: Raf A-3"
                className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
              />
            </div>
            <div>
              <label htmlFor="stock-description" className="block text-sm font-black text-slate-700">Açıklama / Not</label>
              <input
                id="stock-description"
                type="text"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 h-12 text-sm outline-none focus:border-cyan-500 font-bold"
              />
            </div>
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
