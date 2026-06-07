import { ResourceNewPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function NewServicePage() {
  return <ResourceNewPage resource={adminResources.services} />;
}
