"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { useMemo, useRef, useState, type PointerEvent } from "react";
import { cn } from "@/lib/cn";
import { products } from "@/data/products";

const tabs = ["Tümü", "Alarm Sistemleri", "Kamera Sistemleri", "Akıllı Ev Sistemleri", "Network Çözümleri"];

export function ServiceShowcase() {
  const [tab, setTab] = useState("Tümü");
  const [isDragging, setIsDragging] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });

  const filtered = useMemo(() => (tab === "Tümü" ? products : products.filter((p) => p.category === tab)), [tab]);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    const node = scrollerRef.current;
    if (!node) return;
    drag.current = { active: true, startX: event.clientX, scrollLeft: node.scrollLeft, moved: false };
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
  }

  function scroll(direction: "left" | "right") {
    const node = scrollerRef.current;
    if (!node) return;
    const card = node.querySelector("a");
    const cardWidth = card ? card.getBoundingClientRect().width : 280;
    const gap = 20; // gap-5 is 20px
    const amount = cardWidth + gap;
    node.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  }

  return (
    <section className="bg-surface relative overflow-hidden py-14">
      {/* Background Decorations */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 right-1/4 w-[600px] h-[300px] bg-[radial-gradient(circle_at_center,_rgba(0,107,255,0.08)_0%,_transparent_70%)] blur-[95px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[250px] bg-[radial-gradient(circle_at_center,_rgba(24,191,255,0.08)_0%,_transparent_70%)] blur-[95px]" />
      </div>

      <div className="container-primesec relative z-10">
        <div className="mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-primary-600">Ürünlerimiz</p>
            <h2 className="mt-3 text-[clamp(30px,3.2vw,48px)] font-extrabold leading-none tracking-[-0.045em] text-ink">Geniş güvenlik ürün yelpazemiz</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-muted">Ev ve iş yeriniz için akıllı alarm sistemlerinden yüksek çözünürlüklü kameralara kadar aradığınız tüm ürünler.</p>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <button aria-label="Önceki ürünler" onClick={() => scroll("left")} className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-600 bg-white text-primary-600 primesec-navy-action-hover md:hover:text-white transition-all shadow-sm md:hover:shadow-lg">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button aria-label="Sonraki ürünler" onClick={() => scroll("right")} className="flex h-10 w-10 items-center justify-center rounded-full primesec-navy-action text-white md:hover:shadow-lg transition-all shadow-sm">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap">
            {tabs.map((item) => (
              <button
                key={item}
                onClick={() => setTab(item)}
                className={cn("h-9 rounded-full px-4 text-xs font-extrabold whitespace-nowrap transition-all duration-200", tab === item ? "primesec-navy-action text-white shadow-md md:hover:shadow-lg" : "bg-white text-ink-muted md:hover:bg-primary-50 md:hover:text-primary-600 border border-transparent md:hover:border-primary-600")}
              >
                {item}
              </button>
            ))}
            <Link href="/urunler" className="inline-flex h-9 items-center justify-center gap-1 rounded-full bg-white px-4 text-xs font-extrabold text-primary-600 md:hover:bg-white md:hover:text-primary-600 transition-colors md:ml-auto md:bg-transparent">
              Tüm Ürünleri Gör <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div
          ref={scrollerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          className={cn("flex cursor-grab gap-5 overflow-x-auto pb-4 md:active:cursor-grabbing [&::-webkit-scrollbar]:hidden", isDragging ? "snap-none" : "snap-x snap-mandatory")}
        >
          {filtered.map((product) => (
            <Link
              key={product.slug}
              href={`/urunler/${product.slug}`}
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              onClick={(event) => {
                if (drag.current.moved) event.preventDefault();
              }}
              className="group flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-[24px] border border-white bg-white p-4 transition-all"
            >
              <div className="relative h-44 w-full overflow-hidden rounded-[20px] bg-surface flex items-center justify-center">
                <Image src={product.image} alt={product.name} fill className="object-contain p-6" unoptimized />
              </div>
              <div className="flex flex-1 flex-col justify-between pt-4">
                <div>
                  <p className="text-xs font-bold text-ink-muted">{product.brand} · {product.category}</p>
                  <h3 className="mt-2 line-clamp-2 min-h-[44px] text-[15px] font-extrabold leading-tight text-ink md:group-hover:text-primary-600 transition-colors">{product.name}</h3>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-xs font-extrabold text-primary-600 md:group-hover:text-primary-500 transition-colors">İncele</span>
                  <span className="mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-primary-600">
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
