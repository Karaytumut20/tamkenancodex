import { ResourceNewPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function NewBuilderOptionPage() {
  return <ResourceNewPage resource={adminResources.builderOptions} />;
}
