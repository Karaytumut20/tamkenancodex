import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { blogPosts } from "@/data/blog";
import { siteConfig } from "@/data/site";
import { products } from "@/data/products";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) return {};
  return buildMetadata({ title: `${post.title} | PrimeSec Teknoloji`, description: post.description, path: `/blog/${post.slug}`, image: post.image });
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.updatedAt,
          image: `${siteConfig.siteUrl}${post.image}`,
          author: { "@type": "Organization", name: siteConfig.name },
        }}
      />
      <article className="bg-[#F7FAFF] py-10">
        <Container className="max-w-[1120px]">
          <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: post.title, href: `/blog/${post.slug}` }]} />
          <header className="mt-8">
            <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-primary-600">{post.category} · {post.readTime}</p>
            <h1 className="mt-4 text-[clamp(36px,5vw,64px)] font-extrabold leading-tight tracking-[-0.045em] text-ink">{post.title}</h1>
            <p className="mt-5 max-w-4xl text-lg leading-8 text-ink-muted">{post.description}</p>
            <p className="mt-4 text-sm font-bold text-ink-muted">Yayın: {new Date(post.date).toLocaleDateString("tr-TR")} · Güncelleme: {new Date(post.updatedAt).toLocaleDateString("tr-TR")}</p>
          </header>
          <div className="relative mt-8 h-[360px] overflow-hidden rounded-[24px] bg-surface">
            <Image src={post.image} alt={post.title} fill priority className="object-contain p-10" unoptimized />
          </div>
          <div className="mt-10 grid gap-8 xl:grid-cols-[260px_1fr]">
            <aside className="h-fit rounded-2xl border border-border bg-surface p-5 xl:sticky xl:top-32">
              <h2 className="font-extrabold text-ink">İçindekiler</h2>
              <ol className="mt-4 space-y-2 text-sm font-semibold text-ink-muted">
                <li><a href="#dogru-secim">Doğru seçim</a></li>
                <li><a href="#kurulum">Kurulum planı</a></li>
                <li><a href="#sss">SSS</a></li>
              </ol>
            </aside>
            <div className="prose prose-lg max-w-none">
              <h2 id="dogru-secim">Doğru güvenlik sistemi nasıl seçilir?</h2>
              {post.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <h2 id="kurulum">Kurulum ve destek neden önemlidir?</h2>
              <p>Kaliteli cihazlar ancak doğru konumlandırma, temiz kablolama, stabil network ve anlaşılır kullanım eğitimiyle gerçek değer üretir.</p>
              <h2 id="sss">Sık sorulan sorular</h2>
              {post.faqs.map((faq) => (
                <div key={faq.question} className="rounded-2xl border border-border bg-white p-5">
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
              <h2>İlgili ürünler</h2>
              <ul>
                {products.slice(0, 3).map((product) => <li key={product.slug}><Link href={`/urunler/${product.slug}`}>{product.name}</Link></li>)}
              </ul>
              <ButtonLink href="/kendi-sistemini-tasarla">Kendi Sistemini Tasarla</ButtonLink>
            </div>
          </div>
        </Container>
      </article>
    </>
  );
}
