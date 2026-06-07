import { ResourceNewPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function NewPagePage() {
  return <ResourceNewPage resource={adminResources.pages} />;
}
