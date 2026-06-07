import { ResourceNewPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function NewSeoSettingPage() {
  return <ResourceNewPage resource={adminResources.seoSettings} />;
}
