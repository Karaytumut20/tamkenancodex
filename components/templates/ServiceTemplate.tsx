import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardCheck, ShieldCheck } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/templates/PageHero";
import { ProductCard } from "@/components/products/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/data/site";
import { getServiceProducts, type ServicePage } from "@/data/services";
import { blogPosts } from "@/data/blog";

export function ServiceTemplate({ page, kind = "service" }: { page: ServicePage; kind?: "service" | "location" | "corporate" }) {
  const products = getServiceProducts(page.category);
  const href = `/${page.slug}`;
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": kind === "location" ? "LocalBusiness" : "Service",
      name: page.title,
      description: page.description,
      provider: { "@type": "Organization", name: siteConfig.name, url: siteConfig.siteUrl },
      areaServed: kind === "location" ? page.title.split(" ")[0] : "Türkiye",
      url: `${siteConfig.siteUrl}${href}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ];

  return (
    <>
      <JsonLd data={schema} />
      <PageHero title={page.title} description={page.description} image={page.heroImage} crumbs={[{ label: page.title, href }]} />
      <section className="bg-[#F7FAFF] py-14">
        <Container className="grid gap-10 xl:grid-cols-12">
          <article className="xl:col-span-7">
            <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-primary-600">Detaylı Hizmet Rehberi</p>
            <h2 className="section-title mt-3">{page.title} nasıl planlanmalı?</h2>
            <div className="mt-6 space-y-5 text-[17px] leading-8 text-ink-muted">
              {buildServiceCopy(page, kind).overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </article>
          <aside className="h-fit rounded-[24px] border border-border bg-surface p-6 xl:sticky xl:top-28 xl:col-span-5">
            <h2 className="text-2xl font-extrabold text-ink">Bu sayfada ne bulacaksınız?</h2>
            <div className="mt-5 space-y-3">
              {["Hizmet kapsamı", "Uygun kullanım alanları", "Önerilen ürünler", "Kurulum süreci", "Sık sorulan sorular"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-border bg-white p-4">
                  <CheckCircle2 className="h-5 w-5 text-primary-600" />
                  <span className="font-extrabold text-ink">{item}</span>
                </div>
              ))}
            </div>
          </aside>
        </Container>
      </section>
      <section className="bg-[#F7FAFF] py-14">
        <Container className="grid gap-8 lg:grid-cols-3">
          {page.benefits.map((benefit) => (
            <div key={benefit} className="rounded-2xl border border-border bg-white p-6 shadow-card">
              <CheckCircle2 className="h-8 w-8 text-primary-600" />
              <h2 className="mt-4 text-xl font-extrabold text-ink">{benefit}</h2>
              <p className="mt-3 text-sm leading-6 text-ink-muted">PrimeSec Teknoloji, bu avantajı keşif, doğru ürün seçimi ve profesyonel kurulum süreciyle kalıcı hale getirir.</p>
            </div>
          ))}
        </Container>
      </section>
      <section className="bg-[#F7FAFF] py-14">
        <Container className="grid gap-9 xl:grid-cols-12">
          <div className="xl:col-span-5">
            <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-primary-600">Kullanım Alanları</p>
            <h2 className="section-title mt-3">İhtiyaca göre planlanan güvenlik mimarisi</h2>
            <p className="mt-4 leading-7 text-ink-muted">Her alanın giriş noktası, risk seviyesi ve günlük kullanım ritmi farklıdır. Bu yüzden PrimeSec, standart paket mantığını keşif verisiyle özelleştirir.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:col-span-7">
            {page.useCases.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl border border-border bg-white p-5">
                <ShieldCheck className="h-5 w-5 text-primary-600" />
                <span className="font-extrabold text-ink">{item}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <section className="bg-[#F7FAFF] py-14">
        <Container className="grid gap-8 xl:grid-cols-3">
          {buildServiceCopy(page, kind).deepDive.map((block) => (
            <article key={block.title} className="rounded-[24px] border border-border bg-white p-6 shadow-card">
              <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-ink">{block.title}</h2>
              <p className="mt-4 text-sm leading-7 text-ink-muted">{block.text}</p>
            </article>
          ))}
        </Container>
      </section>
      <section className="bg-[#F7FAFF] py-14">
        <Container>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-primary-600">Önerilen Ürünler</p>
              <h2 className="section-title mt-3">Bu hizmet için öne çıkan çözümler</h2>
            </div>
            <Link href="/urunler" className="hidden items-center gap-1 text-sm font-extrabold text-primary-600 md:flex">Tüm ürünler <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(products.length ? products : getServiceProducts("Alarm Sistemleri")).map((product) => <ProductCard key={product.slug} product={product} />)}
          </div>
        </Container>
      </section>
      <section className="bg-[#F7FAFF] py-14">
        <Container className="grid gap-9 xl:grid-cols-2">
          <div>
            <h2 className="section-title">Süreç nasıl ilerler?</h2>
            <div className="mt-7 space-y-4">
              {page.process.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-2xl border border-border bg-white p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-sm font-extrabold text-white">{index + 1}</span>
                  <div>
                    <h3 className="font-extrabold text-ink">{step}</h3>
                    <p className="mt-1 text-sm leading-6 text-ink-muted">Aşamayı net teslim kriterleriyle tamamlar, sonraki adımı sizinle paylaşırız.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="section-title">Sık sorulan sorular</h2>
            <div className="mt-7 space-y-4">
              {page.faqs.map((faq) => (
                <div key={faq.question} className="rounded-2xl border border-border bg-white p-5">
                  <h3 className="font-extrabold text-ink">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
      <section className="bg-[#F7FAFF] py-14">
        <Container className="rounded-[24px] bg-gradient-to-br from-navy-1000 to-navy-900 p-8 text-white md:p-10">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <ClipboardCheck className="h-10 w-10 text-primary-300" />
              <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.035em]">Size özel güvenlik planını çıkaralım</h2>
              <p className="mt-3 max-w-2xl text-ink-lightMuted">Seçtiğiniz hizmet için ürün, kurulum ve destek kapsamını birlikte netleştirelim.</p>
            </div>
            <ButtonLink href="/kendi-sistemini-tasarla" size="lg">Kendi Sistemini Tasarla</ButtonLink>
          </div>
        </Container>
      </section>
      <section className="bg-[#F7FAFF] pb-14">
        <Container>
          <h2 className="mb-5 text-2xl font-extrabold text-ink">İlgili rehberler</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {blogPosts.slice(0, 3).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-2xl border border-border bg-white p-5 font-extrabold text-ink shadow-card  hover:text-primary-600">
                {post.title}
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

function buildServiceCopy(page: ServicePage, kind: "service" | "location" | "corporate") {
  const areaText = kind === "location" ? `${page.title.split(" ")[0]} bölgesinde` : "ev, iş yeri ve kurumsal alanlarda";
  const useCases = page.useCases.join(", ");
  const benefits = page.benefits.join(", ").toLowerCase();

  return {
    overview: [
      `${page.title}, yalnızca birkaç cihazın kurulmasından ibaret değildir. Doğru sonuç için alanın fiziksel yapısı, giriş çıkış noktaları, kullanıcı alışkanlıkları, internet veya network altyapısı ve bakım beklentisi birlikte değerlendirilmelidir. PrimeSec Teknoloji bu süreci keşif, projelendirme, kurulum ve satış sonrası destek başlıklarıyla ele alır.`,
      `${areaText} ${page.title.toLowerCase()} ihtiyacı olan kullanıcılar çoğu zaman hızlı kurulum ister; ancak hızlı kurulumun yanında doğru ürün seçimi ve doğru konumlandırma da kritik önemdedir. Yanlış seçilen kamera açısı, eksik sensör planı, zayıf network altyapısı veya kullanıcının anlamadığı karmaşık sistemler uzun vadede güvenlik açığı oluşturabilir.`,
      `Bu hizmet kapsamında ${useCases} gibi kullanım senaryoları için ayrı ayrı değerlendirme yapılır. Amaç, ihtiyacın üzerinde gereksiz maliyet oluşturmak değil; riskleri kapatan, kolay kullanılan ve ileride büyütülebilen bir güvenlik sistemi kurmaktır.`,
    ],
    deepDive: [
      {
        title: "Hizmet kapsamı nasıl belirlenir?",
        text: `Kapsam belirlenirken öncelikle korunacak alan, risk seviyesi ve günlük kullanım ritmi incelenir. ${page.title} için ${benefits} gibi avantajların gerçekten çalışması, keşif sırasında toplanan verilerin doğru yorumlanmasına bağlıdır. PrimeSec ekibi bu aşamada cihaz sayısını, bağlantı şeklini, kullanıcı yetkilerini ve servis ihtiyaçlarını netleştirir.`,
      },
      {
        title: "Kurulum sonrası kullanım deneyimi",
        text: `İyi bir güvenlik sistemi yalnızca kurulduğu gün değil, her gün kolay kullanılmalıdır. Bu nedenle mobil uygulama ayarları, bildirim tercihleri, kayıt erişimi, kullanıcı rolleri ve temel bakım noktaları teslim sırasında anlatılır. Böylece sistem teknik olarak güçlü olduğu kadar kullanıcı açısından da anlaşılır kalır.`,
      },
      {
        title: "Neden PrimeSec yaklaşımı?",
        text: `PrimeSec Teknoloji ürünleri tek tek satmak yerine, birbirini tamamlayan bir çözüm mimarisi kurmaya odaklanır. Alarm, kamera, akıllı ev, yangın ihbar, PDKS, kapı geçiş ve network çözümleri gerektiğinde aynı plan içinde değerlendirilir. Bu yaklaşım hem maliyet kontrolü sağlar hem de sistemin ileride genişletilmesini kolaylaştırır.`,
      },
    ],
  };
}
