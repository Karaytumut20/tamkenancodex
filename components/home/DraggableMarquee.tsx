"use client";

import React, { useRef, useState, useEffect } from "react";

export function DraggableMarquee({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const lastX = useRef(0);
  const resumeTimeRef = useRef(0);

  const startDrag = (pageX: number) => {
    setIsDragging(true);
    isDraggingRef.current = true;
    lastX.current = pageX;
  };

  const endDrag = () => {
    if (isDraggingRef.current) {
      setIsDragging(false);
      isDraggingRef.current = false;
      resumeTimeRef.current = performance.now() + 2000; // Pause auto-scroll for 2 seconds
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    const container = containerRef.current;
    if (!el || !container) return;

    let animationFrameId: number;
    let isHovered = false;
    let lastTime = performance.now();

    const handleMouseEnter = () => {
      isHovered = true;
    };
    const handleMouseLeave = () => {
      isHovered = false;
      endDrag();
    };

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);

    // Centered Infinite Wrapping Logic
    const handleScroll = () => {
      const setWidth = container.scrollWidth / 3;
      if (setWidth <= 0) return;

      // Wrap-around boundaries
      if (el.scrollLeft < 10) {
        el.scrollLeft += setWidth;
      } else if (el.scrollLeft > el.scrollWidth - el.clientWidth - 10) {
        el.scrollLeft -= setWidth;
      }
    };

    el.addEventListener("scroll", handleScroll);

    let currentScroll = el.scrollLeft;
    let lastSetScroll = Math.round(currentScroll);
    let initialized = false;

    const play = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      const setWidth = container.scrollWidth / 3;
      if (!initialized && setWidth > 0) {
        el.scrollLeft = setWidth;
        currentScroll = setWidth;
        lastSetScroll = Math.round(setWidth);
        initialized = true;
      }

      const isPausedAfterDrag = time < resumeTimeRef.current;
      const actualScroll = el.scrollLeft;

      // Check if actual scrollLeft diverged due to wrapping or dragging
      if (Math.abs(actualScroll - lastSetScroll) > 2) {
        currentScroll = actualScroll;
      }

      if (!isDraggingRef.current && !isHovered && !isPausedAfterDrag) {
        const speed = 40; // Pixels per second auto-scroll speed
        currentScroll += speed * (delta / 1000);
        lastSetScroll = Math.round(currentScroll);
        el.scrollLeft = lastSetScroll;
      } else {
        currentScroll = actualScroll;
        lastSetScroll = actualScroll;
      }
      animationFrameId = requestAnimationFrame(play);
    };

    animationFrameId = requestAnimationFrame(play);

    return () => {
      cancelAnimationFrame(animationFrameId);
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    startDrag(e.pageX);
  };

  const handleMouseUp = () => {
    endDrag();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX;
    const dx = x - lastX.current;
    lastX.current = x;
    scrollRef.current.scrollLeft -= dx * 1.2;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    startDrag(e.touches[0].pageX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !scrollRef.current) return;
    const x = e.touches[0].pageX;
    const dx = x - lastX.current;
    lastX.current = x;
    scrollRef.current.scrollLeft -= dx * 1.2;
  };

  const childrenArray = React.Children.toArray(children);

  return (
    <div
      ref={scrollRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleMouseUp}
      onTouchMove={handleTouchMove}
      className={`flex w-full overflow-x-auto overflow-y-hidden select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      <div ref={containerRef} className="flex w-max items-center gap-10 sm:gap-14 md:gap-20 px-8 py-4">
        {childrenArray}
        {childrenArray.map((child, idx) =>
          React.isValidElement(child)
            ? React.cloneElement(child, { key: `copy1-${idx}` })
            : child
        )}
        {childrenArray.map((child, idx) =>
          React.isValidElement(child)
            ? React.cloneElement(child, { key: `copy2-${idx}` })
            : child
        )}
      </div>
    </div>
  );
}
