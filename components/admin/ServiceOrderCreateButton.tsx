"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Plus, X } from "lucide-react";
import { NewOrderClient } from "@/app/admin/service-orders/new/NewOrderClient";

export function ServiceOrderCreateButton({
  customers,
  materials,
  usdTryRate,
}: {
  customers: any[];
  materials: Array<{ id: string; name: string; stock_quantity: number; selling_price: number }>;
  usdTryRate: number | null;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleCreated = () => {
    setIsOpen(false);
    setSuccessMessage("İş emri oluşturuldu.");
    router.refresh();
    window.setTimeout(() => setSuccessMessage(""), 4000);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-12 items-center gap-2 rounded-xl border-2 border-cyan-700 bg-cyan-600 px-6 text-base font-black text-white transition-colors hover:bg-cyan-700"
      >
        <Plus className="h-5 w-5" /> Yeni İş Emri Oluştur
      </button>

      {successMessage && (
        <div role="status" className="fixed right-4 top-20 z-[80] flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800 shadow-xl">
          <CheckCircle2 className="h-5 w-5" />
          {successMessage}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6">
          <section role="dialog" aria-modal="true" aria-labelledby="new-order-modal-title" className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-slate-50 shadow-2xl">
            <div className="sticky top-0 z-20 flex items-center justify-between border-b-2 border-slate-200 bg-white px-5 py-4">
              <div>
                <h2 id="new-order-modal-title" className="text-xl font-black text-slate-900">Yeni İş Emri Oluştur</h2>
                <p className="text-sm font-semibold text-slate-500">Müşteri, malzeme, ödeme ve takvim bilgilerini burada tamamlayın.</p>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="İş emri penceresini kapat" className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-200 text-slate-500 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <NewOrderClient
                customers={customers}
                materials={materials}
                usdTryRate={usdTryRate}
                onCreated={handleCreated}
              />
            </div>
          </section>
        </div>
      )}
    </>
  );
}
