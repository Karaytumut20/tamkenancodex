import { BlogGrid } from "@/components/blog/BlogGrid";
import { PageHero } from "@/components/templates/PageHero";
import { Container } from "@/components/ui/Container";
import { blogCategories, blogPosts } from "@/data/blog";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Güvenlik Sistemleri Blog | PrimeSec Teknoloji",
  description: "Alarm, kamera, akıllı ev, yangın güvenliği, PDKS ve yerel güvenlik rehberleri için PrimeSec blog yazıları.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <>
      <PageHero title="Güvenlik Sistemleri Blog" description="Alarm, kamera, akıllı ev, yangın güvenliği ve yerel güvenlik rehberleriyle doğru sistemi seçmenizi kolaylaştırıyoruz." crumbs={[{ label: "Blog", href: "/blog" }]} />
      <section className="bg-surface py-12">
        <Container>
          <BlogGrid posts={blogPosts} categories={blogCategories} />
        </Container>
      </section>
    </>
  );
}
