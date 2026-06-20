import Link from "next/link";
import { Plus, RefreshCw } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ProtectedAdminPage } from "@/components/admin/ProtectedAdminPage";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProductList } from "@/components/admin/ProductList";

export default async function ProductsPage() {
  const supabase = await createSupabaseServerClient();

  // Normal ürünler
  const { data: products } = await supabase
    .from("products")
    .select("id, title, is_active, updated_at")
    .order("updated_at", { ascending: false });

  // Oksid ürünleri (varsa)
  let oksidCount = 0;
  const oksidKategoriler: Record<string, number> = {};
  let oksidList: any[] = [];
  try {
    const { data: oksidData } = await supabase
      .from("oksid_urunler")
      .select("id, urun_adi, kategori_ana, kategori_alt, stok_adet, is_active, updated_at")
      .eq("is_active", true);

    if (oksidData) {
      oksidCount = oksidData.length;
      oksidList = oksidData;
      for (const row of oksidData as any[]) {
        const key = row.kategori_alt || row.kategori_ana || "Diğer";
        oksidKategoriler[key] = (oksidKategoriler[key] || 0) + 1;
      }
    }
  } catch (_) {
    // Tablo henüz oluşturulmamış olabilir, sessizce geç
  }

  const allRows = [
    ...(products || []).map(p => ({
      id: p.id,
      title: p.title,
      is_active: p.is_active,
      updated_at: p.updated_at,
      type: "product" as const
    })),
    ...oksidList.map(p => ({
      id: p.id,
      title: p.urun_adi,
      is_active: p.is_active,
      updated_at: p.updated_at,
      type: "oksid" as const
    }))
  ].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  return (
    <ProtectedAdminPage>
      <AdminPageHeader
        title="📦 Ürünler"
        description="Ürünlerinizi buradan ekleyin, düzenleyin veya silin."
        action={
          <div className="flex items-center gap-3">
            <Link
              href="/admin/oksid-sync"
              className="inline-flex h-12 items-center gap-2 rounded-xl border-2 border-cyan-200 bg-cyan-50 px-5 text-sm font-black text-cyan-700 hover:bg-cyan-100 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Oksid Sync
            </Link>
            <Link
              href="/admin/products/new"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-cyan-600 border-2 border-cyan-700 px-6 text-base font-black text-white hover:bg-cyan-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Yeni Ürün Ekle
            </Link>
          </div>
        }
      />

      {/* Oksid Ürün Özeti */}
      {oksidCount > 0 && (
        <div className="mb-6 rounded-2xl border-2 border-cyan-100 bg-cyan-50 p-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-black text-cyan-600 uppercase tracking-wider">
                Oksid XML Entegrasyonu
              </p>
              <p className="mt-1 text-2xl font-black text-slate-800">
                {oksidCount.toLocaleString("tr-TR")}{" "}
                <span className="text-base font-bold text-slate-500">ürün aktif</span>
              </p>
            </div>
            <Link
              href="/admin/oksid-sync"
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-cyan-600 text-white text-sm font-black hover:bg-cyan-700 transition-colors shrink-0"
            >
              <RefreshCw className="h-4 w-4" />
              Yeniden Çek
            </Link>
          </div>

          {/* Kategori dağılımı */}
          {Object.keys(oksidKategoriler).length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(oksidKategoriler)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([kat, sayi]) => (
                  <span
                    key={kat}
                    className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200 bg-white px-3 py-1 text-xs font-extrabold text-slate-600"
                  >
                    {kat}
                    <span className="rounded-full bg-cyan-100 text-cyan-700 px-1.5 py-0.5">
                      {sayi}
                    </span>
                  </span>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Tüm Ürünler Listesi (Manuel + Oksid) */}
      <div className="mb-4">
        <p className="text-sm font-black text-slate-500 uppercase tracking-wider">
          Tüm Ürünler ({allRows.length})
        </p>
      </div>

      <ProductList initialProducts={allRows} />
    </ProtectedAdminPage>
  );
}
