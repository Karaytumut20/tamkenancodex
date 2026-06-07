import { ResourceNewPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function NewSettingPage() {
  return <ResourceNewPage resource={adminResources.siteSettings} />;
}
