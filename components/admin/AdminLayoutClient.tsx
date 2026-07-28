"use client";

import { usePathname } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import type { AdminProfile } from "@/lib/admin/auth";

export function AdminLayoutClient({
  children,
  profile,
  usdTryRate,
}: {
  children: React.ReactNode;
  profile: AdminProfile | null;
  usdTryRate: {
    rate: number;
    date: string;
    source: "TCMB";
  } | null;
}) {
  const pathname = usePathname();

  if (pathname === "/admin/login" || !profile) return children;
  return <AdminShell profile={profile} usdTryRate={usdTryRate}>{children}</AdminShell>;
}
