import { ResourceNewPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function NewBlogPostPage() {
  return <ResourceNewPage resource={adminResources.blog} />;
}
