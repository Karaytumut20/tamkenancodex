"use client";
 
import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
 
export function ProductImageGallery({
  mainImage,
  gallery = [],
}: {
  mainImage: string;
  gallery?: string[];
}) {
  const allImages = Array.from(new Set([mainImage, ...gallery])).filter(Boolean);
  const [activeImage, setActiveImage] = useState(mainImage);
  const [isOpen, setIsOpen] = useState(false);
  const activeIndex = allImages.indexOf(activeImage);
 
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIdx = (activeIndex - 1 + allImages.length) % allImages.length;
    setActiveImage(allImages[prevIdx]);
  };
 
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = (activeIndex + 1) % allImages.length;
    setActiveImage(allImages[nextIdx]);
  };
 
  return (
    <div className="flex flex-col-reverse md:flex-row gap-6 items-stretch w-full max-w-5xl mx-auto">
      {/* Thumbnails list on Left side (desktop) / Bottom (mobile) */}
      {allImages.length > 1 && (
        <div className="flex flex-row md:flex-col gap-3 shrink-0 py-2 px-1 overflow-x-auto md:overflow-y-auto max-w-full md:max-h-[480px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden justify-center md:justify-start">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImage(img)}
              onMouseEnter={() => setActiveImage(img)}
              className={`relative w-16 h-16 rounded-2xl overflow-hidden p-1 transition-all duration-300 ${
                activeImage === img
                  ? "bg-white border-2 border-cyan-500 shadow-lg shadow-cyan-500/10 scale-105"
                  : "bg-white/60 backdrop-blur-sm border border-slate-200/50 hover:border-cyan-300 hover:bg-white hover:scale-102"
              }`}
            >
              <Image
                src={img}
                alt=""
                fill
                sizes="64px"
                className="object-contain p-1.5 rounded-xl"
              />
            </button>
          ))}
        </div>
      )}
 
      {/* Active Main Image Display */}
      <div 
        onClick={() => setIsOpen(true)}
        className="flex-1 relative w-full aspect-[4/3] flex items-center justify-center overflow-hidden min-h-[220px] sm:min-h-[350px] md:min-h-[480px] group transition-all duration-500 cursor-zoom-in rounded-2xl border border-slate-100"
      >
 
        {/* Hover overlay hint */}
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-slate-900/10 backdrop-blur-sm text-slate-800 p-2 rounded-xl">
          <Maximize2 className="h-4 w-4" />
        </div>
 
        {allImages.length > 1 && (
          <>
            {/* Left Nav Arrow Button */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-xl border border-slate-100 hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Önceki resim"
            >
              <ChevronLeft className="h-6 w-6 text-slate-700" />
            </button>
 
            {/* Right Nav Arrow Button */}
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-xl border border-slate-100 hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Sonraki resim"
            >
              <ChevronRight className="h-6 w-6 text-slate-700" />
            </button>
          </>
        )}
 
        {/* Product Active Image */}
        <div className="relative w-full h-full transition-all duration-500 hover:scale-[1.03] select-none">
          <Image
            src={activeImage}
            alt=""
            fill
            sizes="(min-width: 768px) 80vw, 100vw"
            className="object-contain filter saturate-100"
          />
        </div>
      </div>

      {/* Lightbox / Zoom Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-200 cursor-zoom-out"
          onClick={() => setIsOpen(false)}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            className="absolute top-4 right-4 z-[160] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all active:scale-90"
            aria-label="Kapat"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative w-full h-full max-w-5xl max-h-[85vh] select-none flex items-center justify-center">
            <img
              src={activeImage}
              alt=""
              className="max-h-full max-w-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
            />
          </div>
        </div>
      )}
    </div>
  );
}
