import { ResourceEditPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  return <ResourceEditPage resource={adminResources.testimonials} params={params} />;
}
