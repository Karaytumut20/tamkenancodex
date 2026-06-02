import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  ShieldCheck,
  Zap,
  Cpu,
  Eye,
  Shield,
  Activity,
  Layers,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { PageHero } from "@/components/templates/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProductCard } from "@/components/products/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { products, type Product } from "@/data/products";
import { siteConfig } from "@/data/site";
import { productWhatsappUrl } from "@/lib/whatsapp";
import { buildMetadata } from "@/lib/seo";

// Same helper as ServiceTemplate for consistent icon/color theming
const getCategoryVisuals = (category: string) => {
  switch (category) {
    case "Alarm Sistemleri":
      return { icon: Shield, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" };
    case "Kamera Sistemleri":
      return { icon: Eye, color: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/20" };
    case "Akıllı Ev Sistemleri":
      return { icon: Zap, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" };
    default:
      return { icon: Cpu, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" };
  }
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) return {};
  return buildMetadata({
    title: `${product.name} | PrimeSec Teknoloji`,
    description: product.description,
    path: `/urunler/${product.slug}`,
    image: product.image,
  });
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();

  const related = products
    .filter((item) => item.category === product.category && item.slug !== product.slug)
    .slice(0, 4);
  const copy = buildProductCopy(product);
  const visuals = getCategoryVisuals(product.category);
  const IconComponent = visuals.icon;

  // Build process steps from product data
  const process = ["Ücretsiz Keşif", "Ürün & Konum Analizi", "Profesyonel Kurulum", "Test & Teslim"];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          sku: product.code,
          brand: product.brand,
          description: product.description,
          image: `${siteConfig.siteUrl}${product.image}`,
          url: `${siteConfig.siteUrl}/urunler/${product.slug}`,
        }}
      />

      {/* ── Page Hero ── */}
      <PageHero
        title={product.name}
        description={product.description}
        crumbs={[
          { label: "Ürünler", href: "/urunler" },
          { label: product.name, href: `/urunler/${product.slug}` },
        ]}
      />

      {/* ── 1. Introduction Showcase Section ── */}
      <section className="bg-white py-16 md:py-20 border-t border-border">
        <Container className="grid gap-12 xl:grid-cols-12 xl:items-center">
          {/* Left: Detail copy */}
          <article className="xl:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-white text-primary-700 text-xs font-extrabold tracking-wide uppercase">
              <Sparkles className="h-3.5 w-3.5" /> Detaylı Ürün Rehberi
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink leading-tight">
              {product.name} ne işe yarar?
            </h2>

            <div className="space-y-5 text-[17px] leading-8 text-ink-muted">
              {copy.overview.map((paragraph, index) => (
                <p key={index} className={index === 0 ? "text-lg font-medium text-ink/90 leading-relaxed" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-white px-4 py-1.5 text-xs font-bold text-ink"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </article>

          {/* Right: Premium Glassmorphic Graphic Panel — identical to ServiceTemplate */}
          <div className="xl:col-span-5 relative group">
            <div className="absolute inset-0 bg-white rounded-[32px] blur-2xl -z-10 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative overflow-hidden rounded-[32px] border border-border bg-[#FFFFFF] p-8 flex flex-col items-center justify-center min-h-[380px]">
              <div className="relative z-10 w-full flex flex-col items-center text-center">
                {/* Tech Badge */}
                <div className={`p-4 rounded-2xl ${visuals.bg} ${visuals.border} border mb-6`}>
                  <IconComponent className={`h-12 w-12 ${visuals.color}`} />
                </div>

                <span className="text-xs font-extrabold uppercase tracking-widest text-primary-600 mb-2">
                  {product.category} · {product.code}
                </span>
                <h3 className="text-2xl font-black text-ink">{product.name}</h3>

                <p className="mt-4 text-sm text-ink-muted max-w-[280px]">
                  Uzman keşif ekibimiz ve kurumsal kalite standartlarımızla alanınızı 7/24 güvence altına alıyoruz.
                </p>

                {/* Product Image */}
                <div className="mt-8 relative w-24 h-24 flex items-center justify-center">
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    className="object-contain filter saturate-100 group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                </div>

                {/* CTA inside panel */}
                <div className="mt-8 w-full">
                  <ButtonLink
                    href={productWhatsappUrl(product)}
                    className="w-full justify-center primesec-navy-action text-white font-extrabold"
                  >
                    <svg className="h-4 w-4 fill-current mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp'tan Teklif Al
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 2. Features / Benefits Deck (Dark and High Contrast) — same as ServiceTemplate ── */}
      <section className="hero-bg py-16 md:py-24 relative overflow-hidden text-white border-t border-b border-white/5">
        {/* Radial Glow */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[50vh] bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.15),transparent_70%)] blur-[100px]" />
        </div>

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">NEDEN BU ÜRÜN?</span>
            <h2 className="mt-4 text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Kazanacağınız Benzersiz Avantajlar
            </h2>
            <p className="mt-4 text-white/70 text-base md:text-lg">
              Sadece bir güvenlik ürünü satın almıyorsunuz; hayatınızı kolaylaştıran, kesintisiz çalışan bir koruma kalkanı elde ediyorsunuz.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {product.features.map((feature, index) => {
              const icons = [ShieldCheck, Zap, Layers, Activity];
              const Icon = icons[index % icons.length];
              return (
                <div
                  key={feature}
                  className="rounded-3xl border border-border bg-white p-6 hover:border-primary-300 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="h-12 w-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-ink tracking-tight">{feature}</h3>
                    <p className="mt-3 text-sm leading-6 text-ink-muted">
                      PrimeSec Teknoloji bu avantajı doğru konumlandırma, kaliteli montaj ve üstün servis süreciyle sürekli kılar.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Detaylar <ArrowUpRight className="h-3 w-3" />
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── 3. Use Cases Grid — same structure as ServiceTemplate ── */}
      <section className="bg-surface py-16 md:py-20 border-b border-border">
        <Container className="grid gap-12 xl:grid-cols-12 xl:items-center">
          <div className="xl:col-span-5 space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary-600">KULLANIM ALANLARI</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink leading-tight">
              Bu Ürün Kimler İçin Doğru Seçim?
            </h2>
            <p className="text-lg leading-8 text-ink-muted">
              Her alanın giriş noktası, risk seviyesi ve günlük kullanım ritmi farklıdır. Standart paket mantığını bir kenara bırakıyor, mekana göre çözüm üretiyoruz.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:col-span-7">
            {product.usage.map((item, index) => (
              <div
                key={item}
                className="flex items-start gap-4 rounded-2xl border border-border bg-[#FFFFFF] p-5 hover:border-cyan-500 transition-all duration-300"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-white text-primary-600 font-extrabold text-lg">
                  0{index + 1}
                </div>
                <div>
                  <h4 className="font-extrabold text-ink text-base">{item} kullanımı</h4>
                  <p className="mt-1 text-xs text-ink-muted leading-relaxed">
                    PrimeSec ekibi tarafından bu alandaki tüm kör noktalar ve sızma riski olan yerler analiz edilir.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 4. Deep Dive Informative Blocks — same as ServiceTemplate ── */}
      <section className="bg-white py-16 md:py-20 border-b border-border">
        <Container className="grid gap-8 lg:grid-cols-3">
          {copy.deepDive.map((block) => (
            <article
              key={block.title}
              className="rounded-[32px] border border-border bg-[#FFFFFF] p-8 hover:border-cyan-500 transition-all duration-300 group"
            >
              <div className="h-2.5 w-12 primesec-navy-action rounded-full mb-6 group-hover:w-20 transition-all duration-300" />
              <h3 className="text-2xl font-extrabold tracking-tight text-ink">{block.title}</h3>
              <p className="mt-4 text-base leading-7 text-ink-muted">{block.text}</p>
            </article>
          ))}
        </Container>
      </section>

      {/* ── 5. Dynamic Roadmap / Stepper — same as ServiceTemplate ── */}
      <section className="bg-surface py-16 md:py-24 border-b border-border">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary-600">SÜREÇ AKIŞI</span>
            <h2 className="mt-4 text-3xl md:text-5xl font-black tracking-tight text-ink">
              Adım Adım Kurulum Sürecimiz
            </h2>
            <p className="mt-4 text-ink-muted text-base md:text-lg">
              Sisteminizi başından sonuna kadar şeffaf, kontrol edilebilir ve kusursuz şekilde teslim ediyoruz.
            </p>
          </div>

          <div className="relative grid gap-8 md:grid-cols-4">
            {/* Connecting line — starts at center of circle 1, ends at center of circle 4 */}
            <div className="absolute top-[24px] left-[12.5%] right-[12.5%] h-[2px] bg-border hidden md:block" />

            {process.map((step, index) => (
              <div key={step} className="relative z-10 flex flex-col items-center text-center group">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl primesec-navy-action text-white font-black group-hover:scale-110 transition-transform duration-300">
                  {index + 1}
                </div>
                <h3 className="mt-6 text-xl font-extrabold text-ink">{step}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-muted">
                  PrimeSec bu aşamayı net kalite kriterleriyle yönetir ve teslimat raporunu sizinle paylaşır.
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 6. Related Products — same as ServiceTemplate ── */}
      <section className="bg-white py-16 md:py-20 border-b border-border">
        <Container>
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-primary-600">TAMAMLAYICI ÜRÜNLER</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-ink">İlgili Ürünler</h2>
            </div>
            <Link
              href="/urunler"
              className="inline-flex items-center gap-1 text-sm font-extrabold text-primary-600 hover:text-primary-500 transition-colors"
            >
              Tüm ürünleri gör <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(related.length ? related : products.filter((p) => p.slug !== product.slug).slice(0, 4)).map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </Container>
      </section>

      {/* ── 7. FAQ & Help Section — same as ServiceTemplate ── */}
      <section className="bg-surface py-16 md:py-20 border-b border-border">
        <Container className="grid gap-12 xl:grid-cols-12">
          {/* Left Column Info */}
          <div className="xl:col-span-5 space-y-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary-600 border border-primary-100">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink leading-tight">
              Merak Edilen Sıkça Sorulan Sorular
            </h2>
            <p className="text-lg leading-8 text-ink-muted">
              Bu ürünle ilgili aklınıza takılabilecek genel soruların yanıtlarını hazırladık. Daha fazlası için her zaman desteğe hazırız.
            </p>
          </div>

          {/* Right Column Accordion Layout */}
          <div className="xl:col-span-7 space-y-4">
            {product.faqs.map((faq) => (
              <div key={faq.question} className="rounded-3xl border border-border bg-[#FFFFFF] p-6 md:p-8 hover:border-cyan-500 transition-colors duration-200">
                <h3 className="text-lg md:text-xl font-bold text-ink leading-snug">{faq.question}</h3>
                <p className="mt-3 text-sm md:text-base leading-7 text-ink-muted">{faq.answer}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 8. CTA Card — identical to ServiceTemplate ── */}
      <section className="bg-white py-16 md:py-20">
        <Container>
          <div className="rounded-[40px] primesec-navy-surface p-8 md:p-16 text-white relative overflow-hidden">
            {/* Grid graphic */}
            <div className="absolute inset-0 pointer-events-none" />

            <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-primary-600 text-xs font-semibold uppercase tracking-wider mb-6">
                  <ClipboardCheck className="h-4 w-4" /> Ücretsiz Danışmanlık
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none text-white">
                  Size Özel Güvenlik Planı Çıkaralım
                </h2>
                <p className="mt-4 max-w-2xl text-white/80 text-base md:text-lg">
                  {product.name} ürünü için en uygun kurulum planını, doğru konumlandırmayı ve satış sonrası destek kapsamını uzman kadromuzla belirleyin.
                </p>
              </div>
              <div>
                <Link
                  href="/kendi-sistemini-tasarla"
                  className="inline-flex items-center justify-center rounded-2xl font-extrabold h-[58px] px-8 text-lg bg-white text-primary-600 transition-all duration-200 hover:bg-cyan-100 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] shrink-0"
                >
                  Kendi Sistemini Tasarla
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function buildProductCopy(product: Product) {
  const usage = product.usage.join(", ");
  const firstFeature = product.features[0] ?? "güvenilir çalışma";
  const secondFeature = product.features[1] ?? "kolay kullanım";

  return {
    overview: [
      `${product.name}, ${product.category.toLowerCase()} ihtiyacı olan kullanıcılar için güvenlik sürecinin önemli parçalarından biridir. ${product.description} Bu ürünün asıl amacı, günlük kullanımda fark edilmeyen riskleri ölçülebilir ve yönetilebilir hale getirmektir.`,
      `Bir güvenlik ürününden beklenen şey yalnızca çalışması değildir; doğru yerde, doğru senaryoda ve doğru entegrasyonla çalışmasıdır. ${product.name} kurulurken alanın giriş noktaları, kullanım yoğunluğu, internet veya network altyapısı, kayıt ihtiyacı ve mobil bildirim beklentisi birlikte değerlendirilir.`,
      `PrimeSec Teknoloji bu ürünü önerirken ev ve iş yeri ayrımını, kullanıcı alışkanlıklarını, bakım kolaylığını ve ileride sisteme eklenebilecek diğer cihazları hesaba katar. Böylece bugün alınan ürün, ileride büyüyebilecek güvenlik mimarisinin bir parçası olarak konumlanır.`,
    ],
    deepDive: [
      {
        title: "Ürün kapsamı nasıl belirlenir?",
        text: `Kapsam belirlenirken öncelikle korunacak alan, risk seviyesi ve günlük kullanım ritmi incelenir. ${product.name} için ${firstFeature.toLowerCase()} ve ${secondFeature.toLowerCase()} gibi avantajların gerçekten çalışması, keşif sırasında toplanan verilerin doğru yorumlanmasına bağlıdır. PrimeSec ekibi bu aşamada cihaz sayısını, bağlantı şeklini ve servis ihtiyaçlarını netleştirir.`,
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
