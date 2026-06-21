"use client";

import { Trash2 } from "lucide-react";

export function ConfirmDeleteButton({ showLabel = false }: { showLabel?: boolean }) {
  return (
    <button
      type="submit"
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border-2 border-red-200 bg-red-50 text-sm font-black text-red-600 hover:border-red-300 hover:bg-red-100 ${showLabel ? "px-4" : "w-10"}`}
      aria-label="Kaydı sil"
      onClick={(event) => {
        if (!window.confirm("Bu kaydı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve kayıt Supabase'den de silinir.")) {
          event.preventDefault();
        }
      }}
    >
      <Trash2 className="h-4 w-4" />
      {showLabel ? "Sil" : null}
    </button>
  );
}
