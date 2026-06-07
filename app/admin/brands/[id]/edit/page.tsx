import { ResourceEditPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  return <ResourceEditPage resource={adminResources.brands} params={params} />;
}
