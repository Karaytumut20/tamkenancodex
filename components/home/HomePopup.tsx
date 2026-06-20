"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, BellRing } from "lucide-react";

type Props = {
  active?: boolean;
  title?: string;
  content?: string;
  imageUrl?: string;
  buttonLabel?: string;
  buttonUrl?: string;
  cooldownMinutes?: number;
};

export function HomePopup({
  active = false,
  title = "",
  content = "",
  imageUrl = "",
  buttonLabel = "",
  buttonUrl = "",
  cooldownMinutes = 10,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!active || !title) return;

    const storageKey = "primesec_popup_last_closed";
    const lastClosed = localStorage.getItem(storageKey);

    if (lastClosed) {
      const timePassed = Date.now() - Number(lastClosed);
      const cooldownMs = cooldownMinutes * 60 * 1000;
      if (timePassed < cooldownMs) {
        // Cooldown has not expired yet
        return;
      }
    }

    // Do not interrupt the initial reading flow or the page's LCP render.
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, [active, title, cooldownMinutes]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("primesec_popup_last_closed", String(Date.now()));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm transition-all duration-300 animate-fade-in">
      {/* Container */}
      <div 
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-slate-900 text-white shadow-2xl transition-all scale-100 duration-300 animate-scale-up"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          aria-label="Kapat"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Image (if provided) */}
        {imageUrl && (
          <div className="relative w-full h-48 sm:h-56 bg-slate-950 overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 512px"
            />
            {/* Visual gradient overlay on top of image */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          </div>
        )}

        {/* Content Box */}
        <div className="p-6 sm:p-8">
          {/* Header/Badge if no image */}
          {!imageUrl && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400">
              <BellRing className="h-3.5 w-3.5" /> FIRSAT KAMPANYASI
            </div>
          )}

          <h3 className="text-xl font-black tracking-tight sm:text-2xl text-white">
            {title}
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-[#b8c7dd] sm:text-base">
            {content}
          </p>

          {/* Call to action button */}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              onClick={handleClose}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-bold text-slate-300 hover:bg-white/10 transition-colors"
            >
              Kapat
            </button>
            {buttonLabel && buttonUrl && (
              <Link
                href={buttonUrl}
                onClick={handleClose}
                className="inline-flex h-11 items-center justify-center rounded-xl primesec-navy-action px-6 text-sm font-extrabold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-cyan-950/50"
              >
                {buttonLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
