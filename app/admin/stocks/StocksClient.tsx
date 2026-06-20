"use client";

import React, { useState } from "react";
import { 
  Package, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  Info,
  MapPin,
  Barcode,
  TrendingDown,
  Building,
  CheckCircle,
  RefreshCw,
  X
} from "lucide-react";
import { saveMaterial, deleteMaterial } from "./actions";
import { useRouter } from "next/navigation";

type Props = {
  materials: any[];
};

export function StocksClient({ materials }: Props) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  // Modal and Form States
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  const [formId, setFormId] = useState("");
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formBrand, setFormBrand] = useState("");
  const [formModel, setFormModel] = useState("");
  const [formBarcode, setFormBarcode] = useState("");
  const [formSku, setFormSku] = useState("");
  const [formQty, setFormQty] = useState(0);
  const [formMinLevel, setFormMinLevel] = useState(0);
  const [formBuyingPrice, setFormBuyingPrice] = useState(0);
  const [formSellingPrice, setFormSellingPrice] = useState(0);
  const [formSupplier, setFormSupplier] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formActive, setFormActive] = useState(true);

  // Get unique categories for filtering
  const categories = Array.from(
    new Set(materials.map((m) => m.category).filter(Boolean))
  );

  // Filter materials
  const filtered = materials.filter((m) => {
    const query = q.toLowerCase();
    const nameMatch = m.name.toLowerCase().includes(query);
    const barcodeMatch = m.barcode?.toLowerCase().includes(query);
    const skuMatch = m.sku?.toLowerCase().includes(query);
    const brandMatch = m.brand?.toLowerCase().includes(query);
    const modelMatch = m.model?.toLowerCase().includes(query);
    
    const textMatch = nameMatch || barcodeMatch || skuMatch || brandMatch || modelMatch;
    
    const catMatch = !categoryFilter || m.category === categoryFilter;
    
    const isLow = Number(m.stock_quantity) <= Number(m.min_stock_level);
    const lowMatch = !lowStockOnly || isLow;

    return textMatch && catMatch && lowMatch;
  });

  const lowStockCount = materials.filter(
    (m) => Number(m.stock_quantity) <= Number(m.min_stock_level)
  ).length;

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setFormId("");
    setFormName("");
    setFormCategory("");
    setFormBrand("");
    setFormModel("");
    setFormBarcode("");
    setFormSku("");
    setFormQty(0);
    setFormMinLevel(5);
    setFormBuyingPrice(0);
    setFormSellingPrice(0);
    setFormSupplier("");
    setFormLocation("");
    setFormDesc("");
    setFormActive(true);
    setErrorMessage("");
    setSuccessMessage("");
    setIsOpen(true);
  };

  const handleOpenEdit = (m: any) => {
    setIsEditMode(true);
    setFormId(m.id);
    setFormName(m.name);
    setFormCategory(m.category || "");
    setFormBrand(m.brand || "");
    setFormModel(m.model || "");
    setFormBarcode(m.barcode || "");
    setFormSku(m.sku || "");
    setFormQty(Number(m.stock_quantity || 0));
    setFormMinLevel(Number(m.min_stock_level || 0));
    setFormBuyingPrice(Number(m.buying_price || 0));
    setFormSellingPrice(Number(m.selling_price || 0));
    setFormSupplier(m.supplier || "");
    setFormLocation(m.location || "");
    setFormDesc(m.description || "");
    setFormActive(m.is_active);
    setErrorMessage("");
    setSuccessMessage("");
    setIsOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const res = await saveMaterial({
      id: formId || undefined,
      name: formName,
      category: formCategory,
      brand: formBrand,
      model: formModel,
      barcode: formBarcode,
      sku: formSku,
      stock_quantity: formQty,
      min_stock_level: formMinLevel,
      buying_price: formBuyingPrice,
      selling_price: formSellingPrice,
      supplier: formSupplier,
      location: formLocation,
      description: formDesc,
      is_active: formActive,
    });

    if (res.success) {
      setSuccessMessage(isEditMode ? "Malzeme güncellendi." : "Yeni malzeme eklendi.");
      setIsOpen(false);
      router.refresh();
    } else {
      setErrorMessage(res.error || "Malzeme kaydedilemedi.");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu stok kartını silmek istediğinizden emin misiniz?")) return;
    setLoading(true);
    const res = await deleteMaterial(id);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || "Silme işlemi başarısız.");
    }
    setLoading(false);
  };

  const handleProductSync = async () => {
    setIsSyncing(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await fetch("/api/oksid-cek", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok || result.error) throw new Error(result.error || "Ürünler alınamadı.");
      setSuccessMessage(`${result.stogaAktarilan || 0} ürün stok ve malzeme listesine aktarıldı.`);
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Ürün aktarımı başarısız oldu.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-100">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase">Toplam Çeşit</p>
            <p className="text-2xl font-black text-slate-800 mt-0.5">{materials.length} Ürün</p>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
            <AlertTriangle className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase">Kritik Stok Uyarısı</p>
            <p className="text-2xl font-black text-rose-600 mt-0.5">{lowStockCount} Ürün</p>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase">Aktif Stok Kartları</p>
            <p className="text-2xl font-black text-slate-800 mt-0.5">{materials.filter(m => m.is_active).length} Ürün</p>
          </div>
        </div>
      </div>

      {/* Toolbar / Search Filters */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Malzeme adı, barkod, marka arayın..."
            className="h-11 w-full pl-10 pr-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
          />
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto items-center">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-11 px-3 rounded-xl border-2 border-slate-200 bg-white text-xs font-semibold outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <button
            onClick={() => setLowStockOnly(!lowStockOnly)}
            className={`h-11 px-4 rounded-xl text-xs font-black border-2 transition-all flex items-center gap-1.5 ${
              lowStockOnly 
                ? "bg-rose-50 border-rose-200 text-rose-600 shadow-sm" 
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <TrendingDown className="h-4 w-4" /> Kritik Stok
          </button>

          <button
            onClick={handleProductSync}
            disabled={isSyncing}
            className="h-11 px-4 rounded-xl border-2 border-cyan-200 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-black flex items-center gap-1.5 transition-colors disabled:opacity-60 shrink-0 ml-auto sm:ml-0"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Ürünler Çekiliyor..." : "Ürünleri XML'den Çek"}
          </button>

          <button
            onClick={handleOpenAdd}
            className="h-11 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-black flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" /> Yeni Stok Kartı
          </button>
        </div>
      </div>

      {!isOpen && (errorMessage || successMessage) && (
        <div className={`flex items-center gap-3 rounded-xl border p-4 text-sm font-semibold ${errorMessage ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>
          {errorMessage ? <AlertTriangle className="h-5 w-5 shrink-0" /> : <CheckCircle className="h-5 w-5 shrink-0" />}
          <span>{errorMessage || successMessage}</span>
        </div>
      )}

      {/* Grid / Table list */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-lg font-black text-slate-700">Malzeme Bulunamadı</h3>
          <p className="mt-2 text-sm font-semibold text-slate-400">
            Arama ve filtre kriterlerinize uygun stok kaydı bulunmuyor.
          </p>
        </div>
      ) : (
        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-black text-xs uppercase">
                  <th className="p-4">Ürün Adı</th>
                  <th className="p-4">Kategori & Marka</th>
                  <th className="p-4">Barkod / SKU</th>
                  <th className="p-4">Mevcut Stok</th>
                  <th className="p-4">Birim Alış</th>
                  <th className="p-4">Birim Satış</th>
                  <th className="p-4">Konum</th>
                  <th className="p-4 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((m) => {
                  const isLow = Number(m.stock_quantity) <= Number(m.min_stock_level);
                  return (
                    <tr key={m.id} className={`hover:bg-slate-50/55 ${!m.is_active ? "opacity-60 bg-slate-50/40" : ""}`}>
                      <td className="p-4">
                        <span className="font-extrabold text-slate-800 block">{m.name}</span>
                        {m.description && <span className="block text-[10px] text-slate-400 truncate max-w-[180px] mt-0.5">{m.description}</span>}
                      </td>
                      <td className="p-4">
                        <span className="block font-bold text-slate-700 text-xs">{m.category || "Kategorisiz"}</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">{m.brand} {m.model}</span>
                      </td>
                      <td className="p-4 text-xs font-semibold text-slate-500">
                        {m.barcode && <p className="flex items-center gap-1"><Barcode className="h-3.5 w-3.5 text-slate-400" /> {m.barcode}</p>}
                        {m.sku && <p className="text-[10px] text-slate-400 mt-0.5">SKU: {m.sku}</p>}
                      </td>
                      <td className="p-4">
                        <span className={`text-base font-black ${isLow ? "text-rose-600" : "text-slate-800"}`}>
                          {Number(m.stock_quantity)} Adet
                        </span>
                        {isLow && (
                          <span className="block text-[9px] font-black uppercase text-rose-700 bg-rose-50 border border-rose-200 px-1 py-0.5 rounded mt-1 w-max">
                            Stok Düşük (Min: {Number(m.min_stock_level)})
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-slate-500 font-bold">
                        {Number(m.buying_price || 0).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                      </td>
                      <td className="p-4 text-slate-800 font-black">
                        {Number(m.selling_price || 0).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                      </td>
                      <td className="p-4 text-xs text-slate-500 font-bold">
                        {m.location ? (
                          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-slate-400" /> {m.location}</span>
                        ) : "-"}
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex gap-1">
                          <button
                            onClick={() => handleOpenEdit(m)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="Düzenle"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(m.id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Popup for Add / Edit Material */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white border-2 border-slate-300 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h3 className="text-xl font-black text-slate-800">
                {isEditMode ? "Stok Kartını Düzenle" : "Yeni Stok Kartı Oluştur"}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="h-10 w-10 flex items-center justify-center rounded-xl border-2 border-slate-200 hover:bg-slate-50"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 text-sm font-semibold mb-4">
                <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-left">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase">Malzeme Adı *</label>
                  <input
                    required
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Örn: 2MP Dış Ortam CCTV Kamera"
                    className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase">Kategori</label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="Kamera, Kablo, Adaptör vb."
                    className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase">Marka</label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="Hikvision, Dahua vb."
                    className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase">Model</label>
                  <input
                    type="text"
                    value={formModel}
                    onChange={(e) => setFormModel(e.target.value)}
                    placeholder="DS-2CE16D0T-IRF"
                    className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase">Barkod Numarası</label>
                  <input
                    type="text"
                    value={formBarcode}
                    onChange={(e) => setFormBarcode(e.target.value)}
                    placeholder="Barkod kodu"
                    className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase">Stok Kodu (SKU)</label>
                  <input
                    type="text"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    placeholder="SKU"
                    className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase">Mevcut Stok *</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={formQty}
                    onChange={(e) => setFormQty(Number(e.target.value))}
                    className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase">Kritik Limit *</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={formMinLevel}
                    onChange={(e) => setFormMinLevel(Number(e.target.value))}
                    className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase">Alış Fiyatı *</label>
                  <input
                    required
                    type="number"
                    value={formBuyingPrice}
                    onChange={(e) => setFormBuyingPrice(Number(e.target.value))}
                    className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase">Satış Fiyatı *</label>
                  <input
                    required
                    type="number"
                    value={formSellingPrice}
                    onChange={(e) => setFormSellingPrice(Number(e.target.value))}
                    className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase">Tedarikçi Firma</label>
                  <input
                    type="text"
                    value={formSupplier}
                    onChange={(e) => setFormSupplier(e.target.value)}
                    placeholder="Toptancı veya tedarikçi..."
                    className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase">Depo / Raf Konumu</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="A-Rafı, C-Kutusu vb."
                    className="h-11 w-full px-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase">Açıklama</label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Ürün özellikleri veya ek stok notları..."
                  className="w-full rounded-xl border-2 border-slate-200 bg-white p-3 text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="form-active"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  className="h-4 w-4 text-cyan-600 border-2 border-slate-300 rounded focus:ring-cyan-500"
                />
                <label htmlFor="form-active" className="text-xs font-black text-slate-700 uppercase cursor-pointer">
                  Bu stok kartı aktif
                </label>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="h-11 px-5 rounded-xl border-2 border-slate-200 bg-white text-sm font-black text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 px-6 rounded-xl bg-cyan-600 border-2 border-cyan-700 text-white text-sm font-black hover:bg-cyan-700 transition-colors"
                >
                  {loading ? "Kaydediliyor..." : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
