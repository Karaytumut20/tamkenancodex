"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    const canRegister =
      "serviceWorker" in navigator &&
      (window.location.protocol === "https:" || window.location.hostname === "localhost");

    if (!canRegister) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
    };

    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });

    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
