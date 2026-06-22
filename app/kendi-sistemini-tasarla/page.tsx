import { SystemBuilder } from "@/components/system-builder/SystemBuilder";
import { buildMetadata } from "@/lib/seo";
import { getSystemBuilderServices } from "@/lib/db";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Kendi Sistemini Tasarla | PrimeSec Teknoloji",
  description: "Ev veya iş yeriniz için ihtiyaçlarınızı belirleyerek size özel PrimeSec güvenlik sistemi talebi oluşturun.",
  path: "/kendi-sistemini-tasarla",
});

export default async function SystemBuilderPage() {
  const services = await getSystemBuilderServices();

  return <SystemBuilder services={services} />;
}
