import { ResourceEditPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function EditXmlProductPage({ params }: { params: Promise<{ id: string }> }) {
  return <ResourceEditPage resource={adminResources.oksidProducts} params={params} />;
}
