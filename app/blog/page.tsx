import Image from "next/image";
import Link from "next/link";
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
  const featured = blogPosts[0];

  return (
    <>
      <PageHero title="Güvenlik Sistemleri Blog" description="Alarm, kamera, akıllı ev, yangın güvenliği ve yerel güvenlik rehberleriyle doğru sistemi seçmenizi kolaylaştırıyoruz." crumbs={[{ label: "Blog", href: "/blog" }]} />
      <section className="bg-surface py-12">
        <Container>
          <div className="mb-7 flex flex-wrap gap-2">
            {blogCategories.map((category) => <span key={category} className="rounded-lg border border-border bg-white px-3 py-2 text-sm font-extrabold text-ink">{category}</span>)}
          </div>
          <Link href={`/blog/${featured.slug}`} className="grid overflow-hidden rounded-[24px] border border-white/10 bg-[#030D21] md:grid-cols-2 group text-white relative">
            <div className="absolute inset-0 z-0 pointer-events-none">
               <div className="absolute top-0 left-0 w-[200px] h-[200px] bg-[radial-gradient(circle_at_center,rgba(0,107,255,0.1),transparent_70%)] blur-[40px]" />
            </div>
            <div className="relative z-10 min-h-[300px] bg-white flex items-center justify-center">
              <Image src={featured.image} alt={featured.title} fill className="object-contain p-10" unoptimized />
            </div>
            <div className="relative z-10 p-8 flex flex-col justify-center">
              <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-cyan-400">Öne Çıkan Yazı</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.035em] text-white group-hover:text-cyan-400 transition-colors">{featured.title}</h2>
              <p className="mt-4 leading-7 text-white/70">{featured.description}</p>
              <p className="mt-6 text-sm font-bold text-cyan-400">{featured.readTime} okuma</p>
            </div>
          </Link>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {blogPosts.slice(1).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all">
                <div className="relative h-48 w-full bg-surface flex items-center justify-center border-b border-border">
                  <Image src={post.image} alt={post.title} fill className="object-contain p-6" unoptimized />
                </div>
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <p className="text-xs font-bold text-ink-muted">{post.category} · {post.readTime}</p>
                    <h2 className="mt-2 text-lg font-extrabold leading-6 text-ink group-hover:text-primary-600 transition-colors">{post.title}</h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-muted">{post.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
