import { ResourceEditPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  return <ResourceEditPage resource={adminResources.blog} params={params} />;
}
