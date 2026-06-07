import { ResourceListPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function CategoriesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  return <ResourceListPage resource={adminResources.categories} searchParams={searchParams} />;
}
