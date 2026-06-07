import { ResourceNewPage } from "@/components/admin/ResourcePage";
import { adminResources } from "@/lib/admin/resources";

export default function NewTestimonialPage() {
  return <ResourceNewPage resource={adminResources.testimonials} />;
}
