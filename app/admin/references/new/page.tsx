import { ResourceNewPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function NewReferencePage() {
  return <ResourceNewPage resource={adminResources.references} />;
}
