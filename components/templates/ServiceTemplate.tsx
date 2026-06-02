import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  ShieldCheck,
  Zap,
  Cpu,
  Eye,
  Settings,
  Shield,
  Activity,
  Layers,
  ArrowUpRight,
  HelpCircle,
  Sparkles
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/templates/PageHero";
import { ProductCard } from "@/components/products/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/data/site";
import { getServiceProducts, type ServicePage } from "@/data/services";
import { blogPosts } from "@/data/blog";

// Helper function to map a service category to a decorative accent color/icon
const getServiceVisuals = (category: string) => {
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

export function ServiceTemplate({ page, kind = "service" }: { page: ServicePage; kind?: "service" | "location" | "corporate" }) {
  const products = getServiceProducts(page.category);
  const href = `/${page.slug}`;
  const visuals = getServiceVisuals(page.category);
  const IconComponent = visuals.icon;

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

  const copy = buildServiceCopy(page, kind);

  return (
    <>
      <JsonLd data={schema} />
      
      {/* ── Page Hero ── */}
      <PageHero title={page.title} description={page.description} crumbs={[{ label: page.title, href }]} />

      {/* ── 1. Introduction Showcase Section ── */}
      <section className="bg-white py-16 md:py-20 border-t border-border">
        <Container className="grid gap-12 xl:grid-cols-12 xl:items-center">
          {/* Left: Detail copy */}
          <article className="xl:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-white text-primary-700 text-xs font-extrabold tracking-wide uppercase">
              <Sparkles className="h-3.5 w-3.5" /> Detaylı Hizmet Rehberi
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink leading-tight">
              {page.title} nasıl planlanmalı?
            </h2>
            
            <div className="space-y-5 text-[17px] leading-8 text-ink-muted">
              {copy.overview.map((paragraph, index) => (
                <p key={index} className={index === 0 ? "text-lg font-medium text-ink/90 leading-relaxed" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>
          </article>

          {/* Right: Premium Glassmorphic Graphic Panel */}
          <div className="xl:col-span-5 relative group">
            <div className="absolute inset-0 bg-white rounded-[32px] blur-2xl -z-10 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative overflow-hidden rounded-[32px] border border-border bg-[#FFFFFF] p-8 flex flex-col items-center justify-center min-h-[380px]">
              <div className="relative z-10 w-full flex flex-col items-center text-center">
                {/* Tech Badge */}
                <div className={`p-4 rounded-2xl ${visuals.bg} ${visuals.border} border mb-6`}>
                  <IconComponent className={`h-12 w-12 ${visuals.color}`} />
                </div>

                <span className="text-xs font-extrabold uppercase tracking-widest text-primary-600 mb-2">PRIME-SEC ALTYAPISI</span>
                <h3 className="text-2xl font-black text-ink">{page.title}</h3>
                
                <p className="mt-4 text-sm text-ink-muted max-w-[280px]">
                  Uzman keşif ekibimiz ve kurumsal kalite standartlarımızla alanınızı 7/24 güvence altına alıyoruz.
                </p>

                {/* Simulated Device Image or Graphic */}
                <div className="mt-8 relative w-24 h-24 flex items-center justify-center">
                  <Image
                    src={page.heroImage}
                    alt=""
                    fill
                    className="object-contain filter saturate-100 group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 2. Benefits Deck (Dark and High Contrast) ── */}
      <section className="hero-bg py-16 md:py-24 relative overflow-hidden text-white border-t border-b border-white/5">
        {/* Radial Glow */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[50vh] bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.15),transparent_70%)] blur-[100px]" />
        </div>

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">NEDEN PRIME-SEC?</span>
            <h2 className="mt-4 text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Kazanacağınız Benzersiz Avantajlar
            </h2>
            <p className="mt-4 text-white/70 text-base md:text-lg">
              Sadece bir güvenlik sistemi satın almıyorsunuz; hayatınızı kolaylaştıran, kesintisiz çalışan bir konfor ve koruma kalkanı elde ediyorsunuz.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {page.benefits.map((benefit, index) => {
              const icons = [ShieldCheck, Zap, Layers, Activity];
              const Icon = icons[index % icons.length];
              return (
                <div
                  key={benefit}
                  className="rounded-3xl border border-border bg-[#FFFFFF] p-6 hover:border-cyan-400 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="h-12 w-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-ink tracking-tight">{benefit}</h3>
                    <p className="mt-3 text-sm leading-6 text-ink-muted">
                      PrimeSec Teknoloji bu avantajı doğru konumlandırma, kaliteli kablolama ve üstün servis süreciyle sürekli kılar.
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

      {/* ── 3. Structured Use Cases Grid ── */}
      <section className="bg-surface py-16 md:py-20 border-b border-border">
        <Container className="grid gap-12 xl:grid-cols-12 xl:items-center">
          <div className="xl:col-span-5 space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary-600">KULLANIM ALANLARI</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink leading-tight">
              İhtiyaca Göre Planlanan Güvenlik Mimarisi
            </h2>
            <p className="text-lg leading-8 text-ink-muted">
              Her alanın giriş noktası, risk seviyesi ve günlük kullanım ritmi farklıdır. Standart paket mantığını bir kenara bırakıyor, mekana göre çözüm üretiyoruz.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:col-span-7">
            {page.useCases.map((item, index) => (
              <div
                key={item}
                className="flex items-start gap-4 rounded-2xl border border-border bg-[#FFFFFF] p-5 hover:border-cyan-500 transition-all duration-300"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-white text-primary-600 font-extrabold text-lg">
                  0{index + 1}
                </div>
                <div>
                  <h4 className="font-extrabold text-ink text-base">{item}</h4>
                  <p className="mt-1 text-xs text-ink-muted leading-relaxed">
                    PrimeSec ekibi tarafından bu alandaki tüm kör noktalar ve sızma riski olan yerler analiz edilir.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 4. Deep Dive Informative Blocks ── */}
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

      {/* ── 5. Dynamic Roadmap / Stepper ── */}
      <section className="bg-surface py-16 md:py-24 border-b border-border">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary-600">SÜREÇ AKIŞI</span>
            <h2 className="mt-4 text-3xl md:text-5xl font-black tracking-tight text-ink">
              Adım Adım Proje Sürecimiz
            </h2>
            <p className="mt-4 text-ink-muted text-base md:text-lg">
              Sisteminizi başından sonuna kadar şeffaf, kontrol edilebilir ve kusursuz şekilde teslim ediyoruz.
            </p>
          </div>

          <div className="relative grid gap-8 md:grid-cols-4">
            {/* Connecting line — starts at center of circle 1, ends at center of circle 4 */}
            <div className="absolute top-[24px] left-[12.5%] right-[12.5%] h-[2px] bg-border hidden md:block" />

            {page.process.map((step, index) => (
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

      {/* ── 6. Recommended Products Carousel / Section ── */}
      <section className="bg-white py-16 md:py-20 border-b border-border">
        <Container>
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-primary-600">ÜRÜN KATALOĞU</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-ink">Bu Hizmet İçin Öne Çıkan Ürünlerimiz</h2>
            </div>
            <Link
              href="/urunler"
              className="inline-flex items-center gap-1 text-sm font-extrabold text-primary-600 hover:text-cyan-500 transition-colors"
            >
              Tüm ürünleri gör <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(products.length ? products : getServiceProducts("Alarm Sistemleri")).map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </Container>
      </section>

      {/* ── 7. FAQ & Help Section ── */}
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
              Hizmetlerimizle ilgili aklınıza takılabilecek genel soruların yanıtlarını hazırladık. Daha fazlası için her zaman desteğe hazırız.
            </p>
          </div>

          {/* Right Column Accordion Layout */}
          <div className="xl:col-span-7 space-y-4">
            {page.faqs.map((faq) => (
              <div key={faq.question} className="rounded-3xl border border-border bg-[#FFFFFF] p-6 md:p-8 hover:border-cyan-500 transition-colors duration-200">
                <h3 className="text-lg md:text-xl font-bold text-ink leading-snug">{faq.question}</h3>
                <p className="mt-3 text-sm md:text-base leading-7 text-ink-muted">{faq.answer}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 8. Call to Action (CTA) Card ── */}
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
                  Seçtiğiniz hizmet için en uygun ürünleri, doğru konumlandırma planını ve satış sonrası destek kapsamını uzman kadromuzla belirleyin.
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
