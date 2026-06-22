import { ResourceEditPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function EditReferencePage({ params }: { params: Promise<{ id: string }> }) {
  return <ResourceEditPage resource={adminResources.references} params={params} />;
}
