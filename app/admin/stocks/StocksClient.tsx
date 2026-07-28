"use client";

import React, { useState, useMemo } from "react";
import { 
  Package, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  TrendingDown,
  CheckCircle
} from "lucide-react";
import { deleteMaterial, deleteAllMaterials } from "./actions";
import { useRouter } from "next/navigation";
import { isCriticalStock } from "@/lib/admin/stock";
import { StockModal } from "@/components/admin/modals/StockModal";
import {
  formatElapsedSince,
  formatMaterialDate,
  getWarrantyStatus,
} from "@/lib/admin/material-warranty";

type Props = {
  materials: any[];
};

export function StocksClient({ materials }: Props) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  // Modal and Form States
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Filter materials
  const filtered = useMemo(() => materials.filter((m) => {
    const query = q.toLowerCase();
    const nameMatch = m.name.toLowerCase().includes(query);
    
    const isLow = isCriticalStock(m.stock_quantity);
    const lowMatch = !lowStockOnly || isLow;

    return nameMatch && lowMatch;
  }), [materials, q, lowStockOnly]);

  const lowStockCount = useMemo(() => materials.filter(
    (m) => isCriticalStock(m.stock_quantity)
  ).length, [materials]);

  const handleOpenAdd = () => {
    setSelectedMaterial(null);
    setErrorMessage("");
    setSuccessMessage("");
    setIsOpen(true);
  };

  const handleOpenEdit = (m: any) => {
    setSelectedMaterial(m);
    setErrorMessage("");
    setSuccessMessage("");
    setIsOpen(true);
  };

  const handleMaterialSaved = () => {
    setSuccessMessage(selectedMaterial ? "Malzeme güncellendi." : "Yeni malzeme eklendi.");
    router.refresh();
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

  const handleClearAll = async () => {
    if (!confirm("TÜM stok kayıtlarını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve tüm malzemeleri kaldırır.")) return;
    if (!confirm("Son onay: Tüm stok kartları silinecek. Emin misiniz?")) return;
    setLoading(true);
    const res = await deleteAllMaterials();
    if (res.success) {
      setSuccessMessage("Tüm stok kayıtları başarıyla temizlendi.");
      router.refresh();
    } else {
      setErrorMessage(res.error || "Stoklar temizlenemedi.");
    }
    setLoading(false);
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
            <p className="text-xs font-black text-slate-400 uppercase">Kritik Stok (3'ten az)</p>
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
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="space-y-1 w-full sm:max-w-md">
            <label className="text-xs font-black text-slate-500 uppercase">Stok Filtrele / Ara</label>
            <div className="relative">
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Malzeme adı ile filtreleyin..."
                className="h-11 w-full pl-10 pr-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold outline-none focus:border-cyan-500 transition-colors"
              />
              <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto items-center shrink-0">
            <button
              onClick={() => setLowStockOnly(!lowStockOnly)}
              className={`h-11 px-4 rounded-xl text-xs font-black border-2 transition-all flex items-center gap-1.5 ${
                lowStockOnly 
                  ? "bg-rose-50 border-rose-200 text-rose-600 shadow-sm" 
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <TrendingDown className="h-4 w-4" /> Kritik Stok (&lt; 3)
            </button>

            <button
              onClick={handleOpenAdd}
              className="h-11 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-black flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Plus className="h-4 w-4" /> Yeni Stok Ekle
            </button>

            <button
              onClick={handleClearAll}
              disabled={loading || materials.length === 0}
              className="h-11 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border-2 border-red-200 text-xs font-black flex items-center gap-1.5 transition-colors shrink-0 disabled:opacity-50"
              title="Tüm stok kartlarını sil"
            >
              <Trash2 className="h-4 w-4" /> Tümünü Temizle
            </button>
          </div>
        </div>
        {q && (
          <p className="text-xs font-semibold text-slate-400">
            <span className="font-black text-cyan-600">{filtered.length}</span> / {materials.length} ürün gösteriliyor
          </p>
        )}
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
            Arama kriterlerinize uygun stok kaydı bulunmuyor.
          </p>
        </div>
      ) : (
        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-black text-xs uppercase">
                  <th className="p-4">Ürün Adı</th>
                  <th className="p-4">Satın Alma</th>
                  <th className="p-4">Garanti</th>
                  <th className="p-4">Mevcut Stok</th>
                  <th className="p-4 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((m) => {
                  const isLow = isCriticalStock(m.stock_quantity);
                  const warrantyStatus = getWarrantyStatus({
                    warrantyMonths: m.warranty_months,
                    warrantyStartDate: m.purchase_date,
                  });
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/55">
                      <td className="p-4">
                        <span className="font-extrabold text-slate-800 block">{m.name}</span>
                        <span className="mt-1 block text-xs text-slate-400">
                          {[m.brand, m.model].filter(Boolean).join(" · ") || "Marka/model belirtilmedi"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="block font-bold text-slate-700">{m.supplier || "Tedarikçi belirtilmedi"}</span>
                        <span className="mt-1 block text-xs text-slate-500">
                          {m.purchase_date
                            ? `Alış: ${formatMaterialDate(m.purchase_date)} · ${formatElapsedSince(m.purchase_date)}`
                            : "Alış tarihi belirtilmedi"}
                        </span>
                        <span className="block text-xs text-slate-500">
                          {Number(m.buying_price || 0).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                          {m.purchase_invoice_number ? ` · ${m.purchase_invoice_number}` : ""}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-black ${
                          warrantyStatus.key === "active"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : warrantyStatus.key === "expired"
                              ? "border-red-200 bg-red-50 text-red-700"
                              : "border-slate-200 bg-slate-50 text-slate-600"
                        }`}>
                          {warrantyStatus.label}
                        </span>
                        {warrantyStatus.detail && (
                          <span className="mt-1 block text-[10px] font-semibold text-slate-500">{warrantyStatus.detail}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`text-base font-black ${isLow ? "text-rose-600" : "text-slate-800"}`}>
                          {Number(m.stock_quantity)} Adet
                        </span>
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

      <StockModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        material={selectedMaterial}
        onSuccess={handleMaterialSaved}
      />
    </div>
  );
}
