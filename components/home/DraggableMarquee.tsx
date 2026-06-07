"use client";

import React, { useRef, useState, useEffect } from "react";

export function DraggableMarquee({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    let isHovered = false;
    let lastTime = performance.now();

    const el = scrollRef.current;
    if (!el) return;

    const handleMouseEnter = () => { isHovered = true; };
    const handleMouseLeave = () => { 
      isHovered = false; 
      setIsDragging(false); 
    };

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);

    let currentScroll = el.scrollLeft;

    const play = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (!isDragging && !isHovered && el) {
        const speed = 25; // pixels per second
        currentScroll += speed * (delta / 1000);
        if (currentScroll >= el.scrollWidth / 2) {
          currentScroll = 0;
        }
        el.scrollLeft = currentScroll;
      } else if (el) {
        currentScroll = el.scrollLeft;
      }
      animationFrameId = requestAnimationFrame(play);
    };

    animationFrameId = requestAnimationFrame(play);

    return () => {
      cancelAnimationFrame(animationFrameId);
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Sürükleme hızı
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleMouseUp}
        onTouchMove={handleTouchMove}
        className="hide-scrollbar flex w-full overflow-x-auto overflow-y-hidden cursor-grab active:cursor-grabbing select-none"
      >
        <div className="flex w-max items-center gap-10 sm:gap-14 md:gap-20 px-8 py-4">
          {children}
        </div>
      </div>
    </>
  );
}
