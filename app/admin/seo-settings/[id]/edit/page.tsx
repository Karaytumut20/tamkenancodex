import { ResourceEditPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function EditSeoSettingPage({ params }: { params: Promise<{ id: string }> }) {
  return <ResourceEditPage resource={adminResources.seoSettings} params={params} />;
}
