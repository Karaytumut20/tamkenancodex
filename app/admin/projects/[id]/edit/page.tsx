import { ResourceEditPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  return <ResourceEditPage resource={adminResources.projects} params={params} />;
}
