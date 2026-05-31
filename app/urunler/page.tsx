import { PageHero } from "@/components/templates/PageHero";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Container } from "@/components/ui/Container";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Tüm Ürünler ve Güvenlik Sistemleri | PrimeSec Teknoloji",
  description: "Alarm, kamera, akıllı ev, yangın, PDKS, kapı geçiş, araç takip ve network ürünlerini filtreleyerek inceleyin.",
  path: "/urunler",
});

export default function ProductsPage() {
  return (
    <>
      <PageHero
        title="Tüm Ürünler"
        description="PrimeSec Teknoloji ürün kataloğunda alarm, kamera, akıllı ev, yangın, PDKS, kapı geçiş, araç takip ve network çözümlerini filtreleyerek inceleyin."
        crumbs={[{ label: "Ürünler", href: "/urunler" }]}
      />
      <section className="bg-surface py-12">
        <Container>
          <ProductGrid />
        </Container>
      </section>
    </>
  );
}
