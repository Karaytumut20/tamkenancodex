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
      
      {/* ── FRAMER STYLE BLOG HERO ── */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden bg-[#030D21] text-center px-4 pt-32 pb-20 font-sans">
        <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-end overflow-hidden">
           <div className="absolute top-[20%] w-[100vw] h-[60vh] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0044FF]/20 via-[#0066FF]/5 to-transparent blur-[80px]" />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-[6px] rounded-full border border-white/10 bg-[#081C44]/50 backdrop-blur-md">
               <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: post.title, href: `/blog/${post.slug}` }]} dark />
            </div>
          </div>
          
          <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-cyan-400">{post.category} · {post.readTime}</p>
          <h1 className="mt-6 text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.04em] text-white">
            {post.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#A1A1AA]">
            {post.description}
          </p>
          <p className="mt-8 text-sm font-medium text-white/50">
            Yayın: {new Date(post.date).toLocaleDateString("tr-TR")} · Güncelleme: {new Date(post.updatedAt).toLocaleDateString("tr-TR")}
          </p>
        </div>
      </section>

      <article className="bg-surface pb-20 pt-14">
        <Container className="max-w-[1120px]">
          <div className="relative mt-8 h-[360px] md:h-[480px] overflow-hidden rounded-[32px] border border-border bg-white shadow-sm">
            <Image src={post.image} alt={post.title} fill priority className="object-contain p-10 md:p-16 drop-shadow-[0_0_30px_rgba(0,150,255,0.05)]" unoptimized />
          </div>
          
          <div className="mt-16 grid gap-12 xl:grid-cols-[280px_1fr]">
            <aside className="h-fit rounded-[24px] border border-border bg-white p-6 xl:sticky xl:top-32 shadow-[0_18px_50px_rgba(15,23,42,0.04)]">
              <h2 className="font-extrabold text-ink text-lg">İçindekiler</h2>
              <ol className="mt-5 space-y-3 text-sm font-medium text-ink-muted">
                <li><a href="#dogru-secim" className="hover:text-primary-600 transition-colors">Doğru seçim</a></li>
                <li><a href="#kurulum" className="hover:text-primary-600 transition-colors">Kurulum planı</a></li>
                <li><a href="#sss" className="hover:text-primary-600 transition-colors">SSS</a></li>
              </ol>
            </aside>
            
            <div className="prose prose-lg max-w-none prose-p:text-ink-muted prose-headings:text-ink prose-a:text-primary-600">
              <h2 id="dogru-secim">Doğru güvenlik sistemi nasıl seçilir?</h2>
              {post.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              
              <h2 id="kurulum">Kurulum ve destek neden önemlidir?</h2>
              <p>Kaliteli cihazlar ancak doğru konumlandırma, temiz kablolama, stabil network ve anlaşılır kullanım eğitimiyle gerçek değer üretir.</p>
              
              <h2 id="sss">Sık sorulan sorular</h2>
              <div className="space-y-4 not-prose mt-6">
                {post.faqs.map((faq) => (
                  <div key={faq.question} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                    <h3 className="font-bold text-ink">{faq.question}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">{faq.answer}</p>
                  </div>
                ))}
              </div>
              
              <h2 className="mt-12">İlgili ürünler</h2>
              <ul className="grid gap-3 not-prose mt-6">
                {products.slice(0, 3).map((product) => (
                   <li key={product.slug}>
                     <Link href={`/urunler/${product.slug}`} className="flex items-center p-4 rounded-xl border border-border bg-white hover:border-primary-200 hover:bg-surface transition-all text-ink font-semibold">
                       {product.name}
                     </Link>
                   </li>
                ))}
              </ul>
              
              <div className="mt-12 not-prose">
                 <ButtonLink href="/kendi-sistemini-tasarla" className="bg-primary-600 text-white font-extrabold shadow-[0_4px_14px_0_rgba(0,118,255,0.39)] hover:bg-primary-500 transition-colors">Kendi Sistemini Tasarla</ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </article>
    </>
  );
}
