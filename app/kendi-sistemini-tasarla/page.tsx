import { SystemBuilder } from "@/components/system-builder/SystemBuilder";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Kendi Sistemini Tasarla | PrimeSec Teknoloji",
  description: "Ev veya iş yeriniz için alarm, kamera ve akıllı güvenlik ürünlerini seçerek size özel PrimeSec teklifini hazırlayın.",
  path: "/kendi-sistemini-tasarla",
});

export default function SystemBuilderPage() {
  return <SystemBuilder />;
}
