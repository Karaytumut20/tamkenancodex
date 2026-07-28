"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { CustomerModal } from "@/components/admin/modals/CustomerModal";

export function QuickCustomerButton({
  label = "Yeni Müşteri Ekle",
  compact = false,
}: {
  label?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={compact
          ? "mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-cyan-600 px-5 text-sm font-black text-white hover:bg-cyan-700"
          : "inline-flex h-12 items-center gap-2 rounded-xl border-2 border-cyan-700 bg-cyan-600 px-6 text-base font-black text-white transition-colors hover:bg-cyan-700"
        }
      >
        <Plus className="h-5 w-5" />
        {label}
      </button>

      <CustomerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        customer={null}
        onSuccess={() => router.refresh()}
      />
    </>
  );
}
