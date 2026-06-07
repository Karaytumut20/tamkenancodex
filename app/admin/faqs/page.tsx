import { ResourceListPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function FaqsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  return <ResourceListPage resource={adminResources.faqs} searchParams={searchParams} />;
}
