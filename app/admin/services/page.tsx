import { ResourceListPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function ServicesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  return <ResourceListPage resource={adminResources.services} searchParams={searchParams} />;
}
