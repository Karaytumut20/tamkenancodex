"use client";

import { usePathname } from "next/navigation";

export function AdminLayoutStyles() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (!isAdmin) return null;

  return (
    <style dangerouslySetInnerHTML={{ __html: `
      header, footer, .floating-contact-container {
        display: none !important;
      }
      body {
        padding-top: 0 !important;
        background-color: #f8fafc !important;
      }
    ` }} />
  );
}
