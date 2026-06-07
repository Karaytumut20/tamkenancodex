import { ResourceNewPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function NewBrandPage() {
  return <ResourceNewPage resource={adminResources.brands} />;
}
