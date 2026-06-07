import { ResourceEditPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  return <ResourceEditPage resource={adminResources.products} params={params} />;
}
