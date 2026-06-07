import { ResourceNewPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function NewFaqPage() {
  return <ResourceNewPage resource={adminResources.faqs} />;
}
