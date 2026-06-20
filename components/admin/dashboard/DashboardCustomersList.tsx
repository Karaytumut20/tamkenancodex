"use client";

import { useState } from "react";
import { UserPlus, DollarSign } from "lucide-react";
import Link from "next/link";
import { CustomerModal } from "../modals/CustomerModal";

type DashboardCustomersListProps = {
  recentCustomers: any[];
  unpaidCustomers: any[];
};

export function DashboardCustomersList({
  recentCustomers,
  unpaidCustomers
}: DashboardCustomersListProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (customer: any) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    window.location.reload();
  };

  return (
    <>
      {/* Son Eklenen Müşteriler */}
      <section className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-emerald-600" /> Son Eklenen Müşteriler
          </h3>
          <Link href="/admin/customers" className="text-xs font-black text-cyan-600 hover:text-cyan-700">Tümü →</Link>
        </div>

        {recentCustomers.length === 0 ? (
          <div className="py-8 text-center text-sm font-semibold text-slate-400">
            Kayıtlı müşteri bulunmamaktadır.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentCustomers.map((c) => (
              <div 
                key={c.id} 
                onClick={() => openModal(c)}
                className="py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 transition-colors px-2 rounded-lg -mx-2"
              >
                <div>
                  <p className="font-extrabold text-sm text-slate-800 hover:text-cyan-600 transition-colors block">
                    {c.name}
                  </p>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">{c.phone} &bull; {c.type}</p>
                </div>
                <span className="text-[10px] font-bold text-slate-400">{c.created_at.split('T')[0]}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Tahsilat Bekleyen Müşteriler */}
      <section className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-rose-500" /> Tahsilat Bekleyen Müşteriler
          </h3>
          <Link href="/admin/reports?tab=borclu_musteriler" className="text-xs font-black text-cyan-600 hover:text-cyan-700">Borç Raporu →</Link>
        </div>

        {unpaidCustomers.length === 0 ? (
          <div className="py-8 text-center text-sm font-semibold text-slate-400">
            Borcu bulunan müşteri bulunmamaktadır.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {unpaidCustomers.map((c, i) => (
              <div 
                key={i} 
                onClick={() => openModal(c)}
                className="py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 transition-colors px-2 rounded-lg -mx-2"
              >
                <div>
                  <p className="font-extrabold text-sm text-slate-800">{c.name}</p>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">{c.phone}</p>
                </div>
                <span className="text-sm font-black text-rose-600">
                  {c.remaining.toLocaleString("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 0 })}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {isModalOpen && (
        <CustomerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          customer={selectedCustomer}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
