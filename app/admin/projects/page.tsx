import { ResourceListPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function ProjectsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  return <ResourceListPage resource={adminResources.projects} searchParams={searchParams} />;
}
