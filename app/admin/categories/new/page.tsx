import { ResourceNewPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function NewCategoryPage() {
  return <ResourceNewPage resource={adminResources.categories} />;
}
