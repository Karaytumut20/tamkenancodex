import type { Metadata } from "next";

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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
