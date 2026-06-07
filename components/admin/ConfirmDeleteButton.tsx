"use client";

import { Trash2 } from "lucide-react";

export function ConfirmDeleteButton() {
  return (
    <button
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
      aria-label="Delete"
      onClick={(event) => {
        if (!window.confirm("Bu kaydı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
          event.preventDefault();
        }
      }}
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
