import { ResourceNewPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function NewSiteContentPage() {
  return <ResourceNewPage resource={adminResources.siteContent} />;
}
