import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
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
  ChevronDown,
} from "lucide-react";
import { PageHero } from "@/components/templates/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProductCard } from "@/components/products/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { type Product } from "@/data/products";
import { siteConfig } from "@/data/site";
import { productWhatsappUrl } from "@/lib/whatsapp";
import { buildMetadata } from "@/lib/seo";
import { getProductBySlug, getProducts } from "@/lib/db";
import { ProductImageGallery } from "@/components/products/ProductImageGallery";
import { breadcrumbSchema, faqSchema } from "@/data/schemas";

const getCategoryVisuals = (category: string) => {
  switch (category) {
    case "Alarm Sistemleri":
      return {
        icon: Shield,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
      };
    case "Kamera Sistemleri":
      return {
        icon: Eye,
        color: "text-cyan-400",
        bg: "bg-cyan-400/10",
        border: "border-cyan-400/20",
      };
    case "Akıllı Ev Sistemleri":
      return {
        icon: Zap,
        color: "text-emerald-400",
        bg: "bg-emerald-400/10",
        border: "border-emerald-400/20",
      };
    default:
      return {
        icon: Cpu,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
      };
  }
};

export const revalidate = 3600;

export async function generateStaticParams() {
  const dbProducts = await getProducts();
  return dbProducts.map((product: any) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return buildMetadata({
    title: product.metaTitle || `${product.name} | PrimeSec Teknoloji`,
    description: product.metaDescription || product.description,
    path: `/urunler/${product.slug}`,
    image: product.image,
    robotsIndex: product.robotsIndex,
    robotsFollow: product.robotsFollow,
    canonicalUrl: product.canonicalUrl,
    ogTitle: product.ogTitle,
    ogDescription: product.ogDescription,
    twitterTitle: product.twitterTitle,
    twitterDescription: product.twitterDescription,
    twitterImage: product.twitterImage,
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  // Redirect Guard
  if (product.redirectTo) {
    redirect(product.redirectTo);
  }

  const allProducts = await getProducts();

  // Real DB-driven Related Products logic
  let related = [];
  if (product.relatedProductIds && product.relatedProductIds.length > 0) {
    related = allProducts.filter((p: any) =>
      product.relatedProductIds.includes(p.id || p.slug),
    );
  }
  // Fallback to same category if admin hasn't set specific relations
  if (related.length === 0) {
    related = allProducts
      .filter(
        (item: any) =>
          item.category === product.category && item.slug !== product.slug,
      )
      .slice(0, 4);
  }

  const copy = buildProductCopy(product);
  const visuals = getCategoryVisuals(product.category);
  const IconComponent = visuals.icon;

  const process = [
    "Ücretsiz Keşif",
    "Ürün & Konum Analizi",
    "Profesyonel Kurulum",
    "Test & Teslim",
  ];

  // Merge Admin Defined JSON-LD with standard Product schema
  const schemaType = product.schemaType || "Product";
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: product.name,
    sku: product.code,
    brand: product.brand,
    description: product.description,
    image: `${siteConfig.siteUrl}${product.image}`,
    url: `${siteConfig.siteUrl}/urunler/${product.slug}`,
    ...(product.jsonLd || {}),
  };

  return (
    <div className="overflow-x-hidden">
      <JsonLd
        data={[
          baseSchema,
          breadcrumbSchema([
            { name: "Ana Sayfa", url: "/" },
            { name: "Ürünler", url: "/urunler" },
            { name: product.name, url: `/urunler/${product.slug}` },
          ]),
          faqSchema(product.faqs),
        ]}
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
      <section className="bg-white py-12 md:py-24 relative overflow-hidden">
        {/* Modern blur blobs in background */}
        <div className="absolute top-1/4 left-0 w-64 md:w-96 h-64 md:h-96 bg-cyan-100 rounded-full blur-[120px] opacity-40 -z-10 pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-64 md:w-96 h-64 md:h-96 bg-blue-100 rounded-full blur-[120px] opacity-40 -z-10 pointer-events-none" />

        <Container className="grid gap-10 lg:gap-12 lg:grid-cols-2 xl:items-center">
          {/* Left: Detail copy */}
          <article className="space-y-6 md:space-y-8 w-full min-w-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-600 text-[10px] sm:text-xs font-black tracking-widest uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              Detaylı Ürün Rehberi
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-ink leading-tight break-words">
              {product.name} <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                ne işe yarar?
              </span>
            </h1>

            <div className="space-y-4 md:space-y-6 text-base sm:text-lg leading-7 sm:leading-8 text-ink-muted">
              {copy.overview.map((paragraph: string, index: number) => (
                <p
                  key={index}
                  className={`break-words ${index === 0 ? "text-lg sm:text-xl font-medium text-ink/90 leading-relaxed border-l-4 border-cyan-500 pl-4" : ""}`}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-2 md:pt-4">
              {product.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/80 px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-bold text-slate-600 transition-colors select-none"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="pt-4 md:pt-6">
              <ButtonLink
                href={productWhatsappUrl(product)}
                variant="whatsapp"
                className="inline-flex h-14 sm:h-15 items-center justify-center px-6 sm:px-10 text-sm sm:text-base font-extrabold text-white shadow-xl shadow-[#25D366]/20 hover:scale-[1.03] active:scale-[0.97] transition-all rounded-2xl bg-[#25D366] hover:bg-[#20ba59] w-full sm:w-auto"
              >
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6 fill-current mr-2 sm:mr-3"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp'tan Teklif Al
              </ButtonLink>
            </div>
          </article>

          {/* Right: Gallery Showcase Column */}
          <div className="flex items-center justify-center w-full min-w-0">
            <ProductImageGallery
              mainImage={product.image}
              gallery={product.gallery}
            />
          </div>
        </Container>
      </section>

      {/* ── 2. Features / Benefits Deck ── */}
      {product.showFeatures !== false && (
        <section className="hero-bg py-16 md:py-24 relative overflow-hidden text-white border-t border-b border-white/5">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[70vw] h-[50vh] bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.15),transparent_70%)] blur-[80px] md:blur-[100px]" />
          </div>

          <Container className="relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16">
              <span className="text-[10px] md:text-xs font-extrabold uppercase tracking-widest text-cyan-400">
                NEDEN BU ÜRÜN?
              </span>
              <h2 className="mt-2 md:mt-4 text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
                Kazanacağınız Benzersiz Avantajlar
              </h2>
              <p className="mt-3 md:mt-4 text-white/70 text-sm md:text-lg px-2">
                Sadece bir güvenlik ürünü satın almıyorsunuz; hayatınızı
                kolaylaştıran, kesintisiz çalışan bir koruma kalkanı elde
                ediyorsunuz.
              </p>
            </div>

            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {product.features.map((feature: any, index: number) => {
                const icons = [ShieldCheck, Zap, Layers, Activity];
                const Icon = icons[index % icons.length];
                return (
                  <div
                    key={feature.title}
                    className="rounded-3xl border border-border bg-white p-5 sm:p-6 hover:border-primary-300 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-ink tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-6 text-ink-muted">
                        {feature.description ||
                          "PrimeSec Teknoloji bu avantajı doğru konumlandırma, kaliteli montaj ve üstün servis süreciyle sürekli kılar."}
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-6 flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Detaylar <ArrowUpRight className="h-3 w-3" />
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* ── 2.5 New Section: Left Image, Right Text ── */}
      {product.showSpecs !== false && (
        <section className="bg-slate-50/50 py-12 md:py-24 border-t border-b border-slate-100/80 overflow-hidden relative">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-50/30 rounded-full blur-[100px] pointer-events-none" />
          <Container className="grid gap-10 lg:gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left: Image / Visual Block */}
            <div className="relative w-full aspect-[4/3] md:aspect-square rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200/60 bg-white shadow-xl shadow-slate-100/50 group hover:shadow-2xl hover:shadow-cyan-100/30 hover:border-cyan-500/20 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
              <Image
                src={product.image}
                alt={`${product.name} Teknik Görünüm`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Right: Technical Specs & Description */}
            <article className="space-y-4 md:space-y-6 w-full min-w-0">
              <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-600 text-[10px] sm:text-xs font-black tracking-widest uppercase">
                <Cpu className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                Teknik Özellikler
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-ink leading-tight break-words">
                {product.specsTitle || "Sınıfının En İyi Donanım Standartları"}
              </h2>

              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-ink-muted break-words">
                {product.specsDescription ||
                  `${product.name} modeli, en zorlu kullanım koşullarında bile kesintisiz performans göstermek üzere tasarlanmıştır. İşte öne çıkan teknik konfigürasyonlar:`}
              </p>

              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 pt-2 md:pt-4">
                {(product.specs && product.specs.length > 0
                  ? product.specs
                  : [
                      {
                        title: "Kategori",
                        description: product.category,
                        active: true,
                      },
                      {
                        title: "Marka",
                        description: product.brand,
                        active: true,
                      },
                      {
                        title: "Ürün Kodu",
                        description: product.code || "PS-GEN-001",
                        active: true,
                      },
                      {
                        title: "Garanti",
                        description: "2 Yıl Kurumsal",
                        active: true,
                      },
                    ]
                )
                  .filter((item: any) => item.active !== false)
                  .map((item: any, index: number) => {
                    let SpecIcon = Cpu;
                    const lowerTitle = item.title.toLowerCase();
                    if (
                      lowerTitle.includes("bağlantı") ||
                      lowerTitle.includes("wi-fi") ||
                      lowerTitle.includes("network") ||
                      lowerTitle.includes("kod")
                    ) {
                      SpecIcon = Zap;
                    } else if (
                      lowerTitle.includes("garanti") ||
                      lowerTitle.includes("güvenlik") ||
                      lowerTitle.includes("koruma")
                    ) {
                      SpecIcon = ShieldCheck;
                    } else if (
                      lowerTitle.includes("çözünürlük") ||
                      lowerTitle.includes("kamera") ||
                      lowerTitle.includes("görüntü") ||
                      lowerTitle.includes("kategori")
                    ) {
                      SpecIcon = Eye;
                    } else if (
                      lowerTitle.includes("kullanım") ||
                      lowerTitle.includes("alan")
                    ) {
                      SpecIcon = Layers;
                    } else if (
                      lowerTitle.includes("marka") ||
                      lowerTitle.includes("üretici")
                    ) {
                      SpecIcon = Sparkles;
                    }

                    return (
                      <div
                        key={index}
                        className="p-4 sm:p-5 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-cyan-500/20 transition-all duration-300 group/item"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                          <div className="p-1.5 sm:p-2 rounded-xl bg-slate-50 text-slate-400 group-hover/item:bg-cyan-500/10 group-hover/item:text-cyan-500 transition-colors duration-300">
                            <SpecIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </div>
                          <div className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase break-words">
                            {item.title}
                          </div>
                        </div>
                        <div className="text-sm sm:text-base font-extrabold text-ink leading-snug break-words pl-1">
                          {item.description}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </article>
          </Container>
        </section>
      )}

      {/* ── 4.5 New Section: Right Image, Left Text ── */}
      {product.showBenefits !== false && (
        <section className="bg-white py-12 md:py-24 border-b border-slate-100/80 overflow-hidden relative">
          <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-blue-50/30 rounded-full blur-[100px] pointer-events-none" />
          <Container className="grid gap-10 lg:gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left: Text */}
            <article className="space-y-4 md:space-y-6 w-full min-w-0 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-600 text-[10px] sm:text-xs font-black tracking-widest uppercase">
                <Sparkles className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                Kusursuz Uyum
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-ink leading-tight break-words">
                {product.benefitsTitle || "Akıllı Entegrasyon ve Mobil Yönetim"}
              </h2>

              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-ink-muted break-words">
                {product.benefitsDescription ||
                  "Güvenlik sisteminizle her an bağlantıda kalın. PrimeSec tarafından kurulan tüm sistemler, tek bir mobil uygulama üzerinden anlık bildirimler, uzaktan izleme ve tam kontrol sunarak akıllı ekosisteminize kusursuz uyum sağlar."}
              </p>
            </article>

            {/* Right: Image / Visual Block */}
            <div className="relative w-full aspect-[4/3] md:aspect-square rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200/60 bg-white shadow-xl shadow-slate-100/50 group hover:shadow-2xl hover:shadow-cyan-100/30 hover:border-cyan-500/20 transition-all duration-500 order-1 lg:order-2">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
              <Image
                src={
                  product.gallery && product.gallery[0]
                    ? product.gallery[0]
                    : product.image
                }
                alt={`${product.name} Kullanım Detayı`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Container>
        </section>
      )}

      {/* ── 5. Dynamic Roadmap / Stepper ── */}
      <section className="bg-surface py-16 md:py-24 border-b border-border">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16 px-2">
            <span className="text-[10px] md:text-xs font-extrabold uppercase tracking-widest text-primary-600">
              SÜREÇ AKIŞI
            </span>
            <h2 className="mt-3 md:mt-4 text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-ink">
              Adım Adım Kurulum Sürecimiz
            </h2>
            <p className="mt-3 md:mt-4 text-ink-muted text-sm sm:text-base md:text-lg">
              Sisteminizi başından sonuna kadar şeffaf, kontrol edilebilir ve
              kusursuz şekilde teslim ediyoruz.
            </p>
          </div>

          <div className="relative grid gap-8 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            <div className="absolute top-[24px] left-[12.5%] right-[12.5%] h-[2px] bg-border hidden md:block" />

            {process.map((step, index) => (
              <div
                key={step}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl primesec-navy-action text-white font-black group-hover:scale-110 transition-transform duration-300">
                  {index + 1}
                </div>
                <h3 className="mt-4 sm:mt-6 text-lg sm:text-xl font-extrabold text-ink">
                  {step}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-6 text-ink-muted px-2">
                  PrimeSec bu aşamayı net kalite kriterleriyle yönetir ve
                  teslimat raporunu sizinle paylaşır.
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 6. Related Products ── */}
      <section className="bg-white py-12 md:py-20 border-b border-border">
        <Container>
          <div className="mb-8 md:mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="text-[10px] md:text-xs font-extrabold uppercase tracking-widest text-primary-600">
                TAMAMLAYICI ÜRÜNLER
              </span>
              <h2 className="mt-1 md:mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink">
                İlgili Ürünler
              </h2>
            </div>
            <Link
              href="/urunler"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-extrabold text-primary-600 hover:text-primary-500 transition-colors w-max"
            >
              Tüm ürünleri gör <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item: any) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </Container>
      </section>

      {/* ── 7. FAQ & Help Section ── */}
      <section className="bg-surface py-12 md:py-20 border-b border-border">
        <Container className="grid gap-8 lg:gap-12 xl:grid-cols-12">
          {/* Left Column Info */}
          <div className="xl:col-span-5 space-y-4 md:space-y-6">
            <div className="inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-white text-primary-600 border border-primary-100">
              <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-ink leading-tight">
              Merak Edilen Sıkça Sorulan Sorular
            </h2>
            <p className="text-sm sm:text-base md:text-lg leading-7 sm:leading-8 text-ink-muted">
              Bu ürünle ilgili aklınıza takılabilecek genel soruların
              yanıtlarını hazırladık. Daha fazlası için her zaman desteğe
              hazırız.
            </p>
          </div>

          {/* Right Column Accordion Layout */}
          <div className="xl:col-span-7 space-y-3 sm:space-y-4">
            {product.faqs.map((faq: any, index: number) => (
              <details
                key={`${faq.question}-${index}`}
                className="group rounded-2xl border border-border bg-[#FFFFFF] cursor-pointer transition-all duration-300 open:border-cyan-500 open:shadow-md open:shadow-slate-50"
              >
                <summary className="flex items-center justify-between list-none outline-none p-4 md:p-5">
                  <h3 className="text-sm sm:text-base font-bold text-ink leading-snug group-hover:text-cyan-600 transition-colors select-none pr-4">
                    {faq.question}
                  </h3>
                  <span className="shrink-0 transition-transform duration-300 group-open:rotate-180 text-slate-400 group-hover:text-cyan-500">
                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
                  </span>
                </summary>
                <div className="text-xs sm:text-sm leading-relaxed text-ink-muted border-t border-slate-100/80 px-4 md:px-5 pb-4 md:pb-5 pt-3 transition-all duration-300">
                  <p>{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 8. CTA Card ── */}
      <section className="bg-white py-12 md:py-20">
        <Container>
          <div className="rounded-[32px] md:rounded-[40px] primesec-navy-surface p-6 sm:p-10 md:p-16 text-white relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" />

            <div className="relative z-10 grid gap-6 md:gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-white text-primary-600 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-4 sm:mb-6">
                  <ClipboardCheck className="h-3 w-3 sm:h-4 sm:w-4" /> Ücretsiz
                  Danışmanlık
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight leading-tight md:leading-none text-white">
                  Size Özel Güvenlik Planı Çıkaralım
                </h2>
                <p className="mt-3 md:mt-4 max-w-2xl text-white/80 text-sm sm:text-base md:text-lg">
                  {product.name} ürünü için en uygun kurulum planını, doğru
                  konumlandırmayı ve satış sonrası destek kapsamını uzman
                  kadromuzla belirleyin.
                </p>
              </div>
              <div className="mt-4 lg:mt-0">
                <Link
                  href="/kendi-sistemini-tasarla"
                  className="flex w-full sm:w-auto sm:inline-flex items-center justify-center rounded-2xl font-extrabold h-12 sm:h-[58px] px-6 sm:px-8 text-sm sm:text-lg bg-white text-primary-600 transition-all duration-200 hover:bg-cyan-100 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] shrink-0"
                >
                  Kendi Sistemini Tasarla
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

function buildProductCopy(product: Product | any) {
  const defaultOverview = [
    `${product.name}, ${product.category.toLowerCase()} ihtiyacı olan kullanıcılar için güvenlik sürecinin önemli parçalarından biridir. ${product.description} Bu ürünün asıl amacı, günlük kullanımda fark edilmeyen riskleri ölçülebilir ve yönetilebilir hale getirmektir.`,
    `Bir güvenlik ürününden beklenen şey yalnızca çalışması değildir; doğru yerde, doğru senaryoda ve doğru entegrasyonla çalışmasıdır. ${product.name} kurulurken alanın giriş noktaları, kullanım yoğunluğu, internet veya network altyapısı, kayıt ihtiyacı ve mobil bildirim beklentisi birlikte değerlendirilir.`,
    `PrimeSec Teknoloji bu ürünü önerirken ev ve iş yeri ayrımını, kullanıcı alışkanlıklarını, bakım kolaylığını ve ileride sisteme eklenebilecek diğer cihazları hesaba katar. Böylece bugün alınan ürün, ileride büyüyebilecek güvenlik mimarisinin bir parçası olarak konumlanır.`,
  ];

  const overview = product.longDescription
    ? product.longDescription
        .split("\n\n")
        .map((p: string) => p.trim())
        .filter(Boolean)
    : defaultOverview;

  return {
    overview,
  };
}
