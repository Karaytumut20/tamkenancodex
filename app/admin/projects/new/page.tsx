import { ResourceNewPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function NewProjectPage() {
  return <ResourceNewPage resource={adminResources.projects} />;
}
