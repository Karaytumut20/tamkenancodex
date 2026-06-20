"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import Link from "next/link";
import { StockModal } from "../modals/StockModal";

export function DashboardStocksList({
  lowStockAlerts
}: {
  lowStockAlerts: any[];
}) {
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (mat: any) => {
    setSelectedStock(mat);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    window.location.reload();
  };

  return (
    <section className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm md:col-span-2 lg:col-span-1">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
          <Package className="h-5 w-5 text-amber-500" /> Düşük Stok Uyarıları
        </h3>
        <Link href="/admin/stocks" className="text-xs font-black text-amber-600 hover:text-amber-700">Depo →</Link>
      </div>

      {lowStockAlerts.length === 0 ? (
        <div className="py-8 text-center text-sm font-semibold text-slate-400">
          Kritik seviyenin altında malzeme bulunmuyor.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {lowStockAlerts.map((mat) => (
            <div 
              key={mat.id} 
              onClick={() => openModal(mat)}
              className="py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 transition-colors px-2 rounded-lg -mx-2"
            >
              <div>
                <p className="font-extrabold text-sm text-slate-800">{mat.name}</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Marka: {mat.brand || "Belirtilmemiş"}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-red-600">{Number(mat.stock_quantity)} adet</p>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Min: {Number(mat.min_stock_level)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <StockModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          material={selectedStock}
          onSuccess={handleSuccess}
        />
      )}
    </section>
  );
}
