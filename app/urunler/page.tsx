import { PageHero } from "@/components/templates/PageHero";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Container } from "@/components/ui/Container";
import { buildMetadata } from "@/lib/seo";
import { getProducts, getOksidProducts } from "@/lib/db";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Tüm Ürünler ve Güvenlik Sistemleri | PrimeSec Teknoloji",
  description:
    "Alarm, kamera, akıllı ev, yangın, PDKS, kapı geçiş, araç takip ve network ürünlerini filtreleyerek inceleyin. Güvenlik ürünleri ve hard disk çözümleri.",
  path: "/urunler",
});

export default async function ProductsPage() {
  // Her iki kaynaktan da ürünleri çek ve birleştir
  const [dbProducts, oksidProducts] = await Promise.all([
    getProducts(),
    getOksidProducts(),
  ]);

  // Oksid ürünlerini mevcut ProductGrid'in beklediği shape'e dönüştür
  const normalizedOksid = oksidProducts.map((p) => ({
    ...p,
    // ProductGrid'in beklediği eksik alanları tamamla
    longDescription: "",
    showFeatures: false,
    showSpecs: false,
    showBenefits: false,
    benefits: [],
    benefitsTitle: undefined,
    benefitsDescription: undefined,
    specsTitle: undefined,
    specsDescription: undefined,
    // SEO
    robotsIndex: "index" as const,
    robotsFollow: "follow" as const,
    canonicalUrl: undefined,
    ogTitle: undefined,
    ogDescription: undefined,
    twitterTitle: undefined,
    twitterDescription: undefined,
    twitterImage: undefined,
    schemaType: "Product",
    jsonLd: {},
    sitemapInclude: true,
    redirectTo: undefined,
    relatedProductIds: [],
  }));

  const allProducts = [...dbProducts, ...normalizedOksid].filter(
    (p) => 
      p.category !== "Sarf Malzeme ve Aksesuarlar" && 
      (p as any).categoryAlt !== "Sarf Malzeme ve Aksesuarlar"
  );
  const categories = Array.from(new Set(allProducts.map((p) => p.category)));
  const brands = Array.from(new Set(allProducts.map((p) => p.brand)));

  // Alt kategorileri Oksid ürünlerinden çıkar
  const subCategories = Array.from(
    new Set(
      oksidProducts
        .map((p) => p.categoryAlt)
        .filter(Boolean) as string[]
    )
  ).sort((a, b) => a.localeCompare(b, "tr"));

  return (
    <>
      <PageHero
        title="Tüm Ürünler"
        description="PrimeSec Teknoloji ürün kataloğunda alarm, kamera, akıllı ev, yangın, PDKS, kapı geçiş, araç takip, güvenlik ve depolama çözümlerini filtreleyerek inceleyin."
        crumbs={[{ label: "Ürünler", href: "/urunler" }]}
      />
      <section className="bg-surface py-12">
        <Container>
          <ProductGrid
            initialProducts={allProducts as any}
            initialCategories={categories}
            initialBrands={brands}
            initialSubCategories={subCategories}
          />
        </Container>
      </section>
    </>
  );
}
