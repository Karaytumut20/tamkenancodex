import { ResourceEditPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function EditMediaPage({ params }: { params: Promise<{ id: string }> }) {
  return <ResourceEditPage resource={adminResources.media} params={params} />;
}
