import { ResourceNewPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function NewSystemBuilderServicePage() {
  return <ResourceNewPage resource={adminResources.services} />;
}
