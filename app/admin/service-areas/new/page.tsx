import { ResourceNewPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function NewServiceAreaPage() {
  return <ResourceNewPage resource={adminResources.serviceAreas} />;
}
