import { ResourceNewPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function NewProductPage() {
  return <ResourceNewPage resource={adminResources.products} />;
}
