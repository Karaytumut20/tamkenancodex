import { ResourceEditPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function EditSystemBuilderServicePage({ params }: { params: Promise<{ id: string }> }) {
  return <ResourceEditPage resource={adminResources.services} params={params} />;
}
