import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, MessageCircle, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProductCard } from "@/components/products/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { products, type Product } from "@/data/products";
import { siteConfig } from "@/data/site";
import { productWhatsappUrl } from "@/lib/whatsapp";
import { buildMetadata } from "@/lib/seo";

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
  const related = products.filter((item) => item.category === product.category && item.slug !== product.slug).slice(0, 4);
  const copy = buildProductCopy(product);

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
      {/* ── FRAMER STYLE SPLIT HERO FOR PRODUCT ── */}
      <section className="relative min-h-[70vh] flex flex-col justify-center overflow-hidden bg-[#030D21] px-4 py-20 font-sans">
        <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-end overflow-hidden">
           <div className="absolute bottom-[-30%] left-[-20%] w-[80vw] h-[80vh] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#0044FF]/30 via-[#0066FF]/10 to-transparent blur-[80px]" />
           <div className="absolute top-[10%] right-[-10%] w-[50vw] h-[60vh] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00C2FF]/15 to-transparent blur-[90px]" />
        </div>
        
        <Container className="relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-[6px] rounded-full border border-white/10 bg-[#081C44]/50 backdrop-blur-md">
              <Breadcrumbs items={[{ label: "Ürünler", href: "/urunler" }, { label: product.name, href: `/urunler/${product.slug}` }]} dark />
            </div>
          </div>
          
          <div className="grid gap-12 xl:grid-cols-12 xl:items-center">
            <div className="xl:col-span-6 order-2 xl:order-1">
              <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-cyan-400">{product.category} / {product.code}</p>
              <h1 className="mt-4 text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.04em] text-white">{product.name}</h1>
              <p className="mt-6 text-lg leading-8 text-[#A1A1AA]">{product.description}</p>
              <div className="mt-8 flex flex-wrap gap-2">
                {product.tags.map((tag) => <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white">{tag}</span>)}
              </div>
              <div className="mt-10">
                <ButtonLink href={productWhatsappUrl(product)} size="lg" className="bg-white text-[#030D21] font-semibold shadow-[0_0_40px_rgba(0,150,255,0.3)]">
                  <MessageCircle className="h-5 w-5 mr-2" /> WhatsApp'tan Teklif Al
                </ButtonLink>
              </div>
            </div>
            
            <div className="xl:col-span-6 order-1 xl:order-2">
              <div className="relative h-[400px] xl:h-[500px] rounded-[32px] border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm p-10 flex items-center justify-center">
                <Image src={product.image} alt={`${product.name} ürün görseli`} fill priority className="object-contain p-12 drop-shadow-[0_0_40px_rgba(0,100,255,0.2)]" unoptimized />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-surface py-14 border-t border-border">
        <Container className="grid gap-10 xl:grid-cols-12">
          <article className="xl:col-span-7">
            <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-primary-600">Ürün Rehberi</p>
            <h2 className="section-title mt-3 text-ink">{product.name} ne işe yarar?</h2>
            <div className="mt-6 space-y-5 text-[17px] leading-8 text-ink-muted">
              {copy.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </article>
          <aside className="h-fit rounded-[24px] border border-border bg-white p-6 xl:sticky xl:top-28 xl:col-span-5 shadow-[0_18px_50px_rgba(15,23,42,0.04)]">
            <h2 className="text-2xl font-extrabold text-ink">Kısa değerlendirme</h2>
            <p className="mt-3 text-sm leading-6 text-ink-muted">{copy.summary}</p>
            <div className="mt-5 grid gap-3">
              {product.usage.map((usage) => (
                <div key={usage} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
                  <ShieldCheck className="h-5 w-5 text-primary-600" />
                  <span className="font-extrabold text-ink">{usage} kullanımı için uygun</span>
                </div>
              ))}
            </div>
          </aside>
        </Container>
      </section>

      <section className="bg-white py-14">
        <Container className="grid gap-8 xl:grid-cols-12">
          <div className="xl:col-span-7">
            <h2 className="section-title text-ink">Avantajlar ve kullanım alanları</h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-ink-muted">{copy.advantageIntro}</p>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {product.features.map((feature) => (
                <div key={feature} className="flex gap-3 rounded-xl border border-border bg-surface p-5">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-600" />
                  <span className="font-bold text-ink">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <aside className="rounded-2xl border border-border bg-surface p-6 xl:col-span-5">
            <h2 className="text-2xl font-extrabold text-ink">Teknik özellikler</h2>
            <div className="mt-5 divide-y divide-border rounded-xl border border-border bg-white">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="grid grid-cols-2 gap-3 p-4 text-sm">
                  <span className="font-bold text-ink-muted">{key}</span>
                  <span className="font-extrabold text-ink">{value}</span>
                </div>
              ))}
            </div>
          </aside>
        </Container>
      </section>

      <section className="bg-surface py-14">
        <Container className="grid gap-10 xl:grid-cols-2">
          <LongTextBlock title="Kurulumda nelere dikkat edilir?" paragraphs={copy.installation} />
          <LongTextBlock title="Kimler için doğru seçim?" paragraphs={copy.audience} />
        </Container>
      </section>

      <section className="bg-white py-14">
        <Container className="grid gap-10 xl:grid-cols-2">
          <LongTextBlock title="PrimeSec bu ürünü nasıl projelendirir?" paragraphs={copy.primesec} />
          <div>
            <h2 className="section-title text-ink">Sık sorulan sorular</h2>
            <div className="mt-6 space-y-4">
              {product.faqs.map((faq) => (
                <div key={faq.question} className="rounded-2xl border border-border bg-surface p-5">
                  <h3 className="font-extrabold text-ink">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-surface py-14">
        <Container>
          <h2 className="section-title text-ink">İlgili ürünler</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-ink-muted">
            Bu ürün genellikle aynı güvenlik senaryosunda kullanılan tamamlayıcı çözümlerle birlikte planlanır. PrimeSec ekibi keşif sırasında ürünleri tek tek değil, birlikte nasıl çalışacaklarına göre değerlendirir.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {related.map((item) => <ProductCard key={item.slug} product={item} />)}
          </div>
        </Container>
      </section>
    </>
  );
}

function LongTextBlock({ title, paragraphs }: { title: string; paragraphs: string[] }) {
  return (
    <article className="rounded-[24px] border border-border bg-surface p-6 md:p-8">
      <h2 className="text-3xl font-extrabold tracking-[-0.035em] text-ink">{title}</h2>
      <div className="mt-5 space-y-5 text-base leading-8 text-ink-muted">
        {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
    </article>
  );
}

function buildProductCopy(product: Product) {
  const usage = product.usage.join(", ");
  const firstFeature = product.features[0] ?? "güvenilir çalışma";
  const secondFeature = product.features[1] ?? "kolay kullanım";

  return {
    summary: `${product.name}, ${usage} gibi kullanım alanlarında ${firstFeature.toLowerCase()} ve ${secondFeature.toLowerCase()} beklentilerini karşılamak için önerilir. Doğru sonuç için ürünün tek başına değil, bulunduğu alanın risk yapısıyla birlikte değerlendirilmesi gerekir.`,
    advantageIntro: `${product.category} kategorisindeki bu çözüm, yalnızca cihaz olarak değil, alarm, kamera, network, kayıt ve bildirim akışlarıyla birlikte düşünüldüğünde gerçek değer üretir. Aşağıdaki avantajlar PrimeSec kurulum yaklaşımında özellikle dikkate alınır.`,
    overview: [
      `${product.name}, ${product.category.toLowerCase()} ihtiyacı olan kullanıcılar için güvenlik sürecinin önemli parçalarından biridir. ${product.description} Bu ürünün asıl amacı, günlük kullanımda fark edilmeyen riskleri ölçülebilir ve yönetilebilir hale getirmektir.`,
      `Bir güvenlik ürününden beklenen şey yalnızca çalışması değildir; doğru yerde, doğru senaryoda ve doğru entegrasyonla çalışmasıdır. ${product.name} kurulurken alanın giriş noktaları, kullanım yoğunluğu, internet veya network altyapısı, kayıt ihtiyacı ve mobil bildirim beklentisi birlikte değerlendirilir.`,
      `PrimeSec Teknoloji bu ürünü önerirken ev ve iş yeri ayrımını, kullanıcı alışkanlıklarını, bakım kolaylığını ve ileride sisteme eklenebilecek diğer cihazları hesaba katar. Böylece bugün alınan ürün, ileride büyüyebilecek güvenlik mimarisinin bir parçası olarak konumlanır.`,
    ],
    installation: [
      `Kurulum sürecinde ilk adım, ürünün kullanılacağı alanı doğru okumaktır. ${usage} gibi alanlarda kör nokta, sinyal kalitesi, kablo güzergahı, enerji noktası ve kullanıcı erişimi gibi detaylar performansı doğrudan etkiler.`,
      `${product.name} için yanlış konumlandırma, ürün ne kadar kaliteli olursa olsun verimi düşürebilir. Bu nedenle PrimeSec ekibi cihaz yerleşimini yalnızca estetik açıdan değil; algılama, kayıt, bildirim, erişim ve servis kolaylığı açısından da planlar.`,
      `Teslim öncesinde cihaz bağlantıları, uygulama ayarları, bildirim senaryoları ve kullanıcı yetkileri kontrol edilir. Kullanıcıya temel kullanım eğitimi verilir ve ihtiyaç halinde bakım planı oluşturulur.`,
    ],
    audience: [
      `Bu ürün, güvenlik sistemini profesyonel ve sürdürülebilir şekilde kurmak isteyen kullanıcılar için uygundur. ${usage} alanlarında yaşayan veya çalışan kişiler, özellikle uzaktan takip, hızlı bildirim ve düzenli teknik destek beklentisine sahipse bu üründen yüksek fayda görür.`,
      `Küçük işletmeler için operasyonu aksatmadan güvenlik sağlamak, ev kullanıcıları için ise sevdiklerini ve varlıklarını daha rahat takip etmek önemlidir. ${product.name}, bu iki ihtiyacı da seçilen paket ve entegrasyon yapısına göre destekleyebilir.`,
      `Eğer mevcut sisteminiz eskiyse, sık arıza veriyorsa veya mobil kullanım beklentinizi karşılamıyorsa bu ürün yeni nesil bir güvenlik planına geçiş için iyi bir başlangıç olabilir.`,
    ],
    primesec: [
      `PrimeSec Teknoloji, ${product.name} teklifini hazırlarken ürün kodu, marka, garanti, kurulum koşulları ve kullanılacak tamamlayıcı ekipmanları netleştirir. Amaç, yalnızca ürün satmak değil, çalışır ve sürdürülebilir bir sistem teslim etmektir.`,
      `Keşif sırasında alanın fiziksel yapısı, risk seviyesi ve kullanıcı beklentileri not edilir. Ardından ${product.category.toLowerCase()} kapsamında doğru cihaz sayısı, konumlandırma, network ihtiyacı ve bakım gereksinimi belirlenir.`,
      `Kurulumdan sonra sistem test edilir, kullanıcıya uygulama ve temel senaryo eğitimi verilir. Satış sonrası destek sayesinde ürünün performansı yalnızca ilk gün değil, kullanım ömrü boyunca korunmaya çalışılır.`,
    ],
  };
}
