import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Cpu
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/templates/PageHero";
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
  return buildMetadata({
    title: `${post.title} | PrimeSec Teknoloji`,
    description: post.description,
    path: `/blog/${post.slug}`,
    image: post.image
  });
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

      {/* ── Unified Page Hero ── */}
      <PageHero
        title={post.title}
        description={post.description}
        crumbs={[
          { label: "Blog", href: "/blog" },
          { label: post.title, href: `/blog/${post.slug}` }
        ]}
      />

      {/* ── Main Blog Section ── */}
      <article className="bg-white pb-20 pt-10 border-t border-border">
        <Container className="max-w-[1120px]">

          {/* Post Meta Data Bar */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mb-8 text-sm text-ink-muted">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-white text-primary-700 text-xs font-black uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" /> {post.category}
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <Clock className="h-4 w-4 text-primary-600" /> {post.readTime} okuma
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <Calendar className="h-4 w-4 text-primary-600" /> Yayın: {new Date(post.date).toLocaleDateString("tr-TR")}
            </span>
          </div>

          {/* Premium Image Container */}
          <div className="relative group">
            <div className="absolute inset-0 bg-white rounded-[40px] blur-2xl -z-10" />
            <div className="relative h-[360px] md:h-[500px] overflow-hidden rounded-[40px] border border-border bg-white p-6 md:p-10 flex items-center justify-center">
              <Image
                src={post.image}
                alt={post.title}
                fill
                priority
                className="object-contain p-10 md:p-16 group-hover:scale-102 transition-transform duration-500"
                unoptimized
              />
            </div>
          </div>

          {/* Content Columns */}
          <div className="mt-16 grid gap-12 xl:grid-cols-[280px_1fr]">

            {/* Sidebar Table of Contents */}
            <aside className="h-fit rounded-[24px] border border-border bg-white p-6 xl:sticky xl:top-32">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-primary-600" />
                <h2 className="font-black text-ink text-base uppercase tracking-wider">İçindekiler</h2>
              </div>
              <ol className="space-y-3 text-sm font-bold text-ink-muted">
                <li>
                  <a href="#dogru-secim" className="hover:text-primary-600 transition-colors flex items-center gap-1">
                    <ArrowRight className="h-3 w-3 shrink-0" /> Doğru seçim
                  </a>
                </li>
                <li>
                  <a href="#kurulum" className="hover:text-primary-600 transition-colors flex items-center gap-1">
                    <ArrowRight className="h-3 w-3 shrink-0" /> Kurulum planı
                  </a>
                </li>
                <li>
                  <a href="#sss" className="hover:text-primary-600 transition-colors flex items-center gap-1">
                    <ArrowRight className="h-3 w-3 shrink-0" /> Sık Sorulan Sorular
                  </a>
                </li>
              </ol>
            </aside>

            {/* Main Text Content */}
            <div className="prose prose-lg max-w-none prose-p:text-ink-muted prose-p:leading-8 prose-headings:text-ink prose-headings:font-black prose-a:text-primary-600">

              <h2 id="dogru-secim" className="scroll-mt-28">Doğru güvenlik sistemi nasıl seçilir?</h2>
              {post.body.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}

              <h2 id="kurulum" className="scroll-mt-28">Kurulum ve destek neden önemlidir?</h2>
              <p>
                Kaliteli cihazlar ancak doğru konumlandırma, temiz kablolama, stabil network ve anlaşılır kullanım eğitimiyle gerçek değer üretir. PrimeSec olarak biz, yalnızca ürün satmıyor; baştan sona çalışan bir mühendislik hizmeti teslim ediyoruz.
              </p>

              {/* FAQ Section */}
              <h2 id="sss" className="scroll-mt-28 flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-primary-600 shrink-0" /> Sıkça Sorulan Sorular
              </h2>
              <div className="space-y-4 not-prose mt-6">
                {post.faqs.map((faq) => (
                  <div key={faq.question} className="rounded-2xl border border-border bg-[#FFFFFF] p-6">
                    <h3 className="font-extrabold text-ink text-base md:text-lg leading-snug">{faq.question}</h3>
                    <p className="mt-3 text-sm md:text-base leading-relaxed text-ink-muted">{faq.answer}</p>
                  </div>
                ))}
              </div>

              {/* Recommended Products Block */}
              <h2 className="mt-16 flex items-center gap-2">
                <Cpu className="h-6 w-6 text-primary-600 shrink-0" /> İlgili Güvenlik Çözümleri
              </h2>
              <div className="grid gap-4 sm:grid-cols-3 not-prose mt-6">
                {products.slice(0, 3).map((product) => (
                  <Link
                    key={product.slug}
                    href={`/urunler/${product.slug}`}
                    className="flex flex-col justify-between p-5 rounded-2xl border border-border bg-[#FFFFFF] hover:border-primary-300 transition-all text-ink group"
                  >
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-primary-600 border border-border bg-white px-2 py-0.5 rounded">
                        {product.category}
                      </span>
                      <h4 className="font-extrabold text-ink text-base mt-2 group-hover:text-primary-600 transition-colors leading-snug">
                        {product.name}
                      </h4>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-black text-primary-600">
                      Detayı İncele <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                ))}
              </div>

              {/* CTA Button */}
              <div className="mt-12 not-prose pt-8 border-t border-slate-100">
                <ButtonLink
                  href="/kendi-sistemini-tasarla"
                  size="xl"
                  className="primesec-navy-action text-white font-extrabold rounded-2xl px-8"
                >
                  Kendi Sistemini Tasarla
                </ButtonLink>
              </div>

            </div>
          </div>
        </Container>
      </article>
    </>
  );
}
