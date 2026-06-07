import { ResourceEditPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function EditMenuItemPage({ params }: { params: Promise<{ id: string }> }) {
  return <ResourceEditPage resource={adminResources.menuItems} params={params} />;
}
