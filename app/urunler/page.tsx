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

import { Suspense } from "react";

export default async function ProductsPage() {
  // Her iki kaynaktan da ürünleri çek ve birleştir
  let dbProducts: any[] = [];
  let oksidProducts: any[] = [];
  try {
    [dbProducts, oksidProducts] = await Promise.all([
      getProducts(),
      getOksidProducts(),
    ]);
  } catch (err) {
    console.error("[ProductsPage] fetch error:", err);
  }

  const allProducts = [...dbProducts, ...oksidProducts].filter(
    (p) => 
      p.category !== "Sarf Malzeme ve Aksesuarlar" && 
      (p as any).categoryAlt !== "Sarf Malzeme ve Aksesuarlar"
  );

  // Only send fields used by the client-side grid. Product detail fields and
  // image galleries can add megabytes to the RSC payload for large catalogs.
  const gridProducts = allProducts.map((product: any) => ({
    slug: product.slug,
    name: product.name || product.title || "",
    code: product.code || "",
    category: product.category || "",
    categoryAlt: product.categoryAlt || "",
    brand: product.brand || "",
    usage: Array.isArray(product.usage) ? product.usage : [],
    description: product.description || "",
    image: product.image || "/images/alarm-sistemi.svg",
    tags: Array.isArray(product.tags) ? product.tags.slice(0, 8) : [],
    features: Array.isArray(product.features)
      ? product.features.slice(0, 8).map((feature: any) =>
          typeof feature === "string"
            ? feature
            : `${feature.title || ""} ${feature.description || ""}`.trim(),
        )
      : [],
  }));

  const categories = Array.from(new Set(gridProducts.map((p) => p.category)));
  const brands = Array.from(new Set(gridProducts.map((p) => p.brand)));

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
          <Suspense fallback={<div className="text-center py-12 text-ink-muted">Ürünler Yükleniyor...</div>}>
            <ProductGrid
              initialProducts={gridProducts as any}
              initialCategories={categories}
              initialBrands={brands}
              initialSubCategories={subCategories}
            />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
