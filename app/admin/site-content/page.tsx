import { ResourceListPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function SiteContentPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  return <ResourceListPage resource={adminResources.siteContent} searchParams={searchParams} />;
}
