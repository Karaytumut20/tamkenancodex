import { ResourceEditPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function EditServiceAreaPage({ params }: { params: Promise<{ id: string }> }) {
  return <ResourceEditPage resource={adminResources.serviceAreas} params={params} />;
}
