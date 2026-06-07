import { ResourceEditPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  return <ResourceEditPage resource={adminResources.faqs} params={params} />;
}
