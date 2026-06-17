import { getSystemBuilderData, getProducts, getOksidProducts } from "@/lib/db";
import { SystemBuilderEditor } from "@/components/admin/SystemBuilderEditor";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";

export const revalidate = 0; // Disable cache for admin

export default async function SystemBuilderAdminPage() {
  const [data, localProducts, oksidProducts] = await Promise.all([
    getSystemBuilderData(),
    getProducts(),
    getOksidProducts()
  ]);

  const allProducts = [
    ...localProducts.map(p => ({
      id: p.slug,
      title: p.name || p.title || "",
      category: p.category || "Diğer",
      image: p.image || p.image_url || "/images/alarm-sistemi.svg",
      type: "product"
    })),
    ...oksidProducts.map((p: any) => ({
      id: p.slug,
      title: p.urun_adi || p.name || "",
      category: p.kategori_alt || p.kategori_ana || p.category || "Diğer",
      image: (p.resimler && p.resimler.length > 0 ? p.resimler[0] : null) || p.image || "/images/alarm-sistemi.svg",
      type: "oksid"
    }))
  ];

  return (
    <ProtectedAdminPage>
      <div className="p-4 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-800">Kendi Sistemini Tasarla Yönetimi</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">Sihirbazın 4. adımındaki başlıkları ve ürünleri düzenleyin.</p>
        </div>
        
        <SystemBuilderEditor initialGroups={data} availableProducts={allProducts} />
      </div>
    </ProtectedAdminPage>
  );
}
