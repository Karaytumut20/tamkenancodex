import { ResourceEditPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function EditSettingPage({ params }: { params: Promise<{ id: string }> }) {
  return <ResourceEditPage resource={adminResources.siteSettings} params={params} />;
}
