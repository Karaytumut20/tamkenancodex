"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { products as staticProducts, type Product } from "@/data/products";

import { cn } from "@/lib/cn";

interface ProductCarouselProps {
  initialProducts?: Product[];
}

export function ProductCarousel({ initialProducts }: ProductCarouselProps) {
  const [paused, setPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });

  const productsList = initialProducts || staticProducts;

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      const node = scrollerRef.current;
      if (!node) return;
      const card = node.querySelector("a");
      const cardWidth = card ? card.getBoundingClientRect().width : 280;
      const gap = 16; // gap-4 is 16px
      node.scrollBy({ left: cardWidth + gap, behavior: "smooth" });
    }, 4200);
    return () => window.clearInterval(timer);
  }, [paused]);

  function handlePrev() {
    const node = scrollerRef.current;
    if (!node) return;
    const card = node.querySelector("a");
    const cardWidth = card ? card.getBoundingClientRect().width : 280;
    const gap = 16; // gap-4 is 16px
    node.scrollBy({ left: -(cardWidth + gap), behavior: "smooth" });
  }

  function handleNext() {
    const node = scrollerRef.current;
    if (!node) return;
    const card = node.querySelector("a");
    const cardWidth = card ? card.getBoundingClientRect().width : 280;
    const gap = 16; // gap-4 is 16px
    node.scrollBy({ left: cardWidth + gap, behavior: "smooth" });
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    const node = scrollerRef.current;
    if (!node) return;
    drag.current = { active: true, startX: event.clientX, scrollLeft: node.scrollLeft, moved: false };
    setPaused(true);
    setIsDragging(true);
    node.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const node = scrollerRef.current;
    if (!node || !drag.current.active) return;
    const delta = event.clientX - drag.current.startX;
    if (Math.abs(delta) > 6) drag.current.moved = true;
    node.scrollLeft = drag.current.scrollLeft - delta;
  }

  function finishDrag(event: PointerEvent<HTMLDivElement>) {
    const node = scrollerRef.current;
    if (!node || !drag.current.active) return;
    drag.current.active = false;
    setIsDragging(false);
    node.releasePointerCapture(event.pointerId);
    window.setTimeout(() => setPaused(false), 800);
  }

  return (
    <section className="bg-white pt-16 pb-24 md:pt-24 md:pb-36" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="container-primesec">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-cyan-500">Ürünler</p>
            <h2 className="mt-3 text-[clamp(30px,3.2vw,48px)] font-extrabold leading-none tracking-[-0.045em] text-ink">Öne çıkan güvenlik ürünleri</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="flex h-12 w-12 items-center justify-center rounded-full primesec-navy-action text-white md:hover:bg-cyan-500 md:hover:bg-none transition-all duration-200 shadow-sm"
              aria-label="Önceki ürünler"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="flex h-12 w-12 items-center justify-center rounded-full primesec-navy-action text-white md:hover:bg-cyan-500 md:hover:bg-none transition-all duration-200 shadow-sm"
              aria-label="Sonraki ürünler"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          className={cn("flex cursor-grab gap-4 overflow-x-auto md:active:cursor-grabbing [&::-webkit-scrollbar]:hidden", isDragging ? "snap-none" : "snap-x snap-mandatory")}
        >
          {productsList.map((product, index) => (
            <Link
              key={product.slug}
              href={`/urunler/${product.slug}`}
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              onClick={(event) => {
                if (drag.current.moved) event.preventDefault();
              }}
              className="group flex w-[78%] shrink-0 snap-start flex-col overflow-hidden rounded-[24px] bg-white border border-border md:hover:border-cyan-500 transition-colors duration-200 p-4  md:w-[36%] xl:w-[23.5%]"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-extrabold text-ink">{product.brand}</p>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary-600 md:group-hover:bg-cyan-500 md:group-hover:text-white transition-all duration-300">
                  <ChevronRight className="h-4 w-4" />
                </span>
              </div>
              <div className="relative mt-4 h-48 w-full rounded-[20px] bg-white flex items-center justify-center">
                <Image src={product.image} alt={`${product.name} ürün görseli`} fill className="object-contain p-6" unoptimized />
              </div>
              <div className="flex flex-1 flex-col justify-between pt-4">
                <div>
                  <p className="text-xs font-bold text-ink-muted">{product.category}</p>
                  <h3 className="mt-2 line-clamp-2 min-h-[44px] text-lg font-extrabold leading-5 tracking-[-0.02em] text-ink md:group-hover:text-cyan-500 transition-colors">{product.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link href="/urunler" className="inline-flex items-center gap-2 rounded-full primesec-navy-action px-8 py-4 text-sm font-extrabold text-white md:hover:scale-[1.02] md:active:scale-[0.98] transition-all duration-200 shadow-md md:hover:shadow-lg md:hover:shadow-cyan-500/20 md:hover:bg-cyan-500 md:hover:bg-none">
            Tüm Ürünler <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
