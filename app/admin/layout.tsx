import type { Metadata } from "next";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";
import { getCurrentAdmin } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  manifest: "/images/admin.webmanifest",
  title: {
    default: "PrimeSec Yönetim Paneli",
    template: "%s | PrimeSec Admin",
  },
  appleWebApp: {
    capable: true,
    title: "PrimeSec Admin",
    statusBarStyle: "black-translucent",
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  return <AdminLayoutClient profile={admin?.profile ?? null}>{children}</AdminLayoutClient>;
}
