"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Edit, Trash2, Loader2, Database, Search, Filter, AlertTriangle, X } from "lucide-react";
import { deleteProduct } from "@/app/admin/products/actions";

type ProductRow = {
  id: string;
  title: string;
  is_active: boolean;
  updated_at: string;
  type: "product" | "oksid";
};

export function ProductList({ initialProducts }: { initialProducts: ProductRow[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [activeTab, setActiveTab] = useState<"product" | "oksid">("product");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  
  // Delete Modal State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<ProductRow | null>(null);

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    
    setDeletingId(productToDelete.id);
    try {
      await deleteProduct(productToDelete.id, productToDelete.type);
      setProducts(products.filter(p => p.id !== productToDelete.id));
      setProductToDelete(null);
    } catch (err) {
      alert("Silme işlemi başarısız oldu.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // 1. Tab filter
      if (p.type !== activeTab) return false;
      
      // 2. Search filter
      if (searchQuery.trim() !== "" && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // 3. Status filter
      if (statusFilter === "active" && !p.is_active) return false;
      if (statusFilter === "inactive" && p.is_active) return false;
      
      return true;
    });
  }, [products, activeTab, searchQuery, statusFilter]);

  const manualCount = products.filter(p => p.type === "product").length;
  const xmlCount = products.filter(p => p.type === "oksid").length;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => { setActiveTab("product"); setSearchQuery(""); }}
          className={`px-6 py-4 text-sm font-black border-b-2 transition-colors ${
            activeTab === "product"
              ? "border-cyan-600 text-cyan-700 bg-cyan-50/50"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
          }`}
        >
          Manuel Eklenenler ({manualCount})
        </button>
        <button
          onClick={() => { setActiveTab("oksid"); setSearchQuery(""); }}
          className={`px-6 py-4 text-sm font-black border-b-2 transition-colors ${
            activeTab === "oksid"
              ? "border-cyan-600 text-cyan-700 bg-cyan-50/50"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
          }`}
        >
          XML Ürünleri ({xmlCount})
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Ürün adı ile ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
        </div>
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 appearance-none"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="active">Sadece Aktifler</option>
            <option value="inactive">Sadece Pasifler</option>
          </select>
        </div>
      </div>

      {/* List */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <p className="text-lg font-black text-slate-500">Bu kriterlere uygun ürün bulunamadı.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProducts.map((product) => {
            const date = product.updated_at
              ? new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(product.updated_at))
              : "";

            return (
              <div
                key={product.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border-2 border-slate-200 bg-white p-4 hover:border-cyan-300 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {product.type === "oksid" && (
                      <Database className="h-4 w-4 text-cyan-600 shrink-0" />
                    )}
                    <p className="text-base font-black text-slate-800 truncate" title={product.title}>
                      {product.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-full ${
                        product.is_active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {product.is_active ? "Aktif" : "Pasif"}
                    </span>
                    {date && (
                      <span className="text-xs text-slate-400 font-medium">
                        {date}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  {product.type === "product" && (
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="inline-flex h-10 items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 text-sm font-black text-slate-700 hover:bg-slate-50 hover:border-cyan-300 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="hidden sm:inline">Düzenle</span>
                    </Link>
                  )}
                  
                  <button
                    onClick={() => setProductToDelete(product)}
                    className="inline-flex h-10 w-10 sm:w-auto items-center justify-center gap-2 rounded-xl border-2 border-red-100 bg-red-50 sm:px-4 text-sm font-black text-red-600 hover:bg-red-100 hover:border-red-200 transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Sil</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">Emin misiniz?</h3>
                  <p className="text-sm font-semibold text-slate-500 mt-1">Bu işlem geri alınamaz.</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                <strong className="text-slate-800">{productToDelete.title}</strong> isimli ürünü tamamen silmek üzeresiniz. 
                {productToDelete.type === "oksid" && " (XML ürünleri bir sonraki Oksid Sync işleminde tekrar eklenebilir.)"}
              </p>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-3 justify-end">
              <button
                onClick={() => setProductToDelete(null)}
                disabled={deletingId !== null}
                className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Vazgeç
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deletingId !== null}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deletingId ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
