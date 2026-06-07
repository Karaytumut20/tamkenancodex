import { ResourceNewPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function NewMediaPage() {
  return <ResourceNewPage resource={adminResources.media} />;
}
