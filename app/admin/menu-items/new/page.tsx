import { ResourceNewPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function NewMenuItemPage() {
  return <ResourceNewPage resource={adminResources.menuItems} />;
}
