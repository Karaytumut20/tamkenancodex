import { ResourceEditPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  return <ResourceEditPage resource={adminResources.categories} params={params} />;
}
