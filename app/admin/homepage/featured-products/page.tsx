import { getHomepageFeaturedProducts, getProducts, getOksidProducts } from "@/lib/db";
import { FeaturedProductsEditor } from "@/components/admin/FeaturedProductsEditor";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";

export const revalidate = 0;

export default async function FeaturedProductsAdminPage() {
  const [featuredData, localProducts, oksidProducts] = await Promise.all([
    getHomepageFeaturedProducts(),
    getProducts(),
    getOksidProducts()
  ]);

  const allProducts = [
    ...localProducts.map(p => ({
      id: p.slug,
      title: p.name || p.title || "",
      category: p.category || "Diğer",
      image: p.image || p.image_url || "/images/alarm-sistemi.svg",
      type: "local" as const
    })),
    ...oksidProducts.map((p: any) => ({
      id: p.slug,
      title: p.urun_adi || p.name || "",
      category: p.kategori_alt || p.kategori_ana || p.category || "Diğer",
      image: (p.resimler && p.resimler.length > 0 ? p.resimler[0] : null) || p.image || "/images/alarm-sistemi.svg",
      type: "oksid" as const
    }))
  ];

  return (
    <ProtectedAdminPage>
      <div className="p-4 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-800">Öne Çıkan Ürünler Yönetimi</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">Ana sayfadaki karuselde gösterilecek ürünleri belirleyin.</p>
        </div>
        
        <FeaturedProductsEditor initialFeatured={featuredData} availableProducts={allProducts} />
      </div>
    </ProtectedAdminPage>
  );
}
