"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

export function InlineCreateModal({
  title,
  description,
  buttonLabel = "Yeni Ekle",
  children,
  buttonClassName,
}: {
  title: string;
  description?: string;
  buttonLabel?: string;
  children: React.ReactNode;
  buttonClassName?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={buttonClassName || "inline-flex h-10 items-center gap-2 rounded-lg primesec-navy-action px-4 text-sm font-bold text-white"}
      >
        <Plus className="h-4 w-4" />
        {buttonLabel}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="inline-create-title"
            className="max-h-[94vh] w-full max-w-6xl overflow-y-auto rounded-3xl border-2 border-slate-200 bg-slate-50 shadow-2xl"
          >
            <div className="sticky top-0 z-20 flex items-start justify-between border-b-2 border-slate-200 bg-white px-5 py-4 sm:px-7">
              <div>
                <h2 id="inline-create-title" className="text-xl font-black text-slate-900 sm:text-2xl">{title}</h2>
                {description && <p className="mt-1 text-sm font-semibold text-slate-500">{description}</p>}
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={`${title} penceresini kapat`}
                className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-slate-200 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 sm:p-7">{children}</div>
          </section>
        </div>
      )}
    </>
  );
}
